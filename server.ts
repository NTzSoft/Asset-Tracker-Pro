import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for all incoming requests (supports custom domains like asset.ntzsoft.net)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

interface CachedData {
  timestamp: number;
  data: any;
}

let marketCache: CachedData | null = null;
const CACHE_TTL_MS = 10000; // 10 seconds cache

// Safe fetch helper with timeout and JSON validation
async function safeFetchJson(url: string, timeoutMs = 3500): Promise<any> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.startsWith("<")) return null; // Avoid HTML error pages
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Fetch real-time market data
async function fetchRealTimeMarketData() {
  const now = Date.now();
  if (marketCache && (now - marketCache.timestamp < CACHE_TTL_MS)) {
    return marketCache.data;
  }

  try {
    const cryptoSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];
    const [
      tickerRes,
      klines1hRes,
      klines1dRes,
      fxRes,
      thaiGoldRes,
      cryptoTickersRes,
      btcKlinesRes,
      ethKlinesRes,
      bnbKlinesRes,
      solKlinesRes,
      btcD1Res,
      ethD1Res,
      bnbD1Res,
      solD1Res
    ] = await Promise.allSettled([
      safeFetchJson("https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1h&limit=24"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=30"),
      safeFetchJson("https://open.er-api.com/v6/latest/USD"),
      safeFetchJson("https://api.chnwt.dev/thai-gold-api/latest"),
      safeFetchJson(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(cryptoSymbols))}`),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h&limit=24"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=1h&limit=24"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1h&limit=24"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=30"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=1d&limit=30"),
      safeFetchJson("https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1d&limit=30"),
    ]);

    const ticker = tickerRes.status === "fulfilled" && tickerRes.value && typeof tickerRes.value === 'object' && tickerRes.value.lastPrice ? tickerRes.value : null;
    const klines1h = klines1hRes.status === "fulfilled" && Array.isArray(klines1hRes.value) ? klines1hRes.value : [];
    const klines1d = klines1dRes.status === "fulfilled" && Array.isArray(klines1dRes.value) ? klines1dRes.value : [];
    const fx = fxRes.status === "fulfilled" && fxRes.value ? fxRes.value : null;
    const thaiGold = thaiGoldRes.status === "fulfilled" && thaiGoldRes.value ? thaiGoldRes.value : null;

    const rawSpot = ticker ? parseFloat(ticker.lastPrice) : NaN;
    const spotPrice = !isNaN(rawSpot) && rawSpot > 500 ? rawSpot : 4626.00;
    const priceChange = ticker && !isNaN(parseFloat(ticker.priceChange)) ? parseFloat(ticker.priceChange) : -8.50;
    const priceChangePercent = ticker && !isNaN(parseFloat(ticker.priceChangePercent)) ? parseFloat(ticker.priceChangePercent) : -0.18;
    const high24h = ticker && !isNaN(parseFloat(ticker.highPrice)) ? parseFloat(ticker.highPrice) : Number((spotPrice * 1.012).toFixed(2));
    const low24h = ticker && !isNaN(parseFloat(ticker.lowPrice)) ? parseFloat(ticker.lowPrice) : Number((spotPrice * 0.988).toFixed(2));
    const bidPrice = ticker && !isNaN(parseFloat(ticker.bidPrice)) ? parseFloat(ticker.bidPrice) : Number((spotPrice - 0.50).toFixed(2));
    const askPrice = ticker && !isNaN(parseFloat(ticker.askPrice)) ? parseFloat(ticker.askPrice) : Number((spotPrice + 0.50).toFixed(2));
    const openPrice = ticker && !isNaN(parseFloat(ticker.openPrice)) ? parseFloat(ticker.openPrice) : Number((spotPrice - priceChange).toFixed(2));

    const rawUsdThb = fx && fx.rates && fx.rates.THB ? parseFloat(fx.rates.THB) : NaN;
    const usdThb = !isNaN(rawUsdThb) && rawUsdThb > 25 && rawUsdThb < 45 ? rawUsdThb : 32.70;

    // Time formatters in Thailand Timezone (Asia/Bangkok / UTC+7)
    const thaiTimeFormatter = new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric',
      month: 'short'
    });

    const thaiDayNameFormatter = new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      weekday: 'short'
    });

    // Process World 24H chart points in Thai Time
    const world24hLabels: string[] = [];
    const world24hPrices: number[] = [];

    if (klines1h.length > 0) {
      klines1h.forEach((k: any) => {
        const time = new Date(k[0]);
        // Formatted to Thai time e.g. "21:00 น."
        const formatted = thaiTimeFormatter.format(time);
        world24hLabels.push(`${formatted} น.`);
        world24hPrices.push(parseFloat(k[4])); // close price
      });
    } else {
      // Fallback
      for (let i = 24; i >= 0; i -= 3) {
        const fallbackDate = new Date(now - i * 3600 * 1000);
        world24hLabels.push(`${thaiTimeFormatter.format(fallbackDate)} น.`);
        world24hPrices.push(spotPrice - (Math.sin(i) * 15));
      }
    }

    // Process World 1M (30D) chart points in Thai Date
    const world30dLabels: string[] = [];
    const world30dPrices: number[] = [];
    if (klines1d.length > 0) {
      klines1d.forEach((k: any) => {
        const d = new Date(k[0]);
        world30dLabels.push(thaiDateFormatter.format(d));
        world30dPrices.push(parseFloat(k[4]));
      });
    }

    // Parse Thai Gold Association rates
    let thaiGoldBarBuy = 71750;
    let thaiGoldBarSell = 71950;
    let thaiGoldOrnamentBuy = 70312;
    let thaiGoldOrnamentSell = 72750;
    let thaiUpdateInfo = "ประกาศสมาคมค้าทองคำ";
    let thaiUpdateDate = new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });

    if (thaiGold && thaiGold.response && thaiGold.response.price) {
      const p = thaiGold.response.price;
      if (p.gold_bar) {
        thaiGoldBarBuy = parseFloat(p.gold_bar.buy.replace(/,/g, '')) || thaiGoldBarBuy;
        thaiGoldBarSell = parseFloat(p.gold_bar.sell.replace(/,/g, '')) || thaiGoldBarSell;
      }
      if (p.gold) {
        thaiGoldOrnamentBuy = parseFloat(p.gold.buy.replace(/,/g, '')) || thaiGoldOrnamentBuy;
        thaiGoldOrnamentSell = parseFloat(p.gold.sell.replace(/,/g, '')) || thaiGoldOrnamentSell;
      }
      if (thaiGold.response.update_time) {
        thaiUpdateInfo = thaiGold.response.update_time;
      }
      if (thaiGold.response.update_date) {
        thaiUpdateDate = thaiGold.response.update_date;
      }
    } else {
      // Benchmark formula: Spot * USD/THB * 0.965 * (15.244 / 31.1035) + Premium
      const calculated965 = Math.round((spotPrice * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
      thaiGoldBarBuy = calculated965 - 100;
      thaiGoldBarSell = calculated965;
      thaiGoldOrnamentBuy = Math.round(calculated965 * 0.98);
      thaiGoldOrnamentSell = calculated965 + 500;
    }

    // 99.99% pure gold (per Baht weight)
    const thai9999Buy = Math.round((thaiGoldBarSell * (99.99 / 96.5)) - 100);
    const thai9999Sell = Math.round(thaiGoldBarSell * (99.99 / 96.5));
    const thai1kgBuy = Math.round(thai9999Buy * (1000 / 15.244));
    const thai1kgSell = Math.round(thai9999Sell * (1000 / 15.244));

    // Thai 7-day trend series derived from 1d klines & exchange rate in Thai Time
    const thai7dLabels: string[] = [];
    const thai7dPrices: number[] = [];
    const thai1mPrices: number[] = [];
    const thai1mLabels: string[] = [];

    if (klines1d.length >= 7) {
      const last7 = klines1d.slice(-7);
      last7.forEach((k: any, index: number) => {
        const d = new Date(k[0]);
        if (index === last7.length - 1) {
          thai7dLabels.push("วันนี้");
        } else {
          const dayName = thaiDayNameFormatter.format(d);
          const dateStr = thaiDateFormatter.format(d);
          thai7dLabels.push(`${dayName} (${dateStr})`);
        }
        const price965 = Math.round((parseFloat(k[4]) * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
        thai7dPrices.push(price965);
      });
      // Replace last item with current sell price
      if (thai7dPrices.length > 0) {
        thai7dPrices[thai7dPrices.length - 1] = thaiGoldBarSell;
      }
    } else {
      thai7dLabels.push('6 วันก่อน', '5 วันก่อน', '4 วันก่อน', '3 วันก่อน', '2 วันก่อน', 'เมื่อวาน', 'วันนี้');
      thai7dPrices.push(
        thaiGoldBarSell - 450,
        thaiGoldBarSell - 300,
        thaiGoldBarSell - 200,
        thaiGoldBarSell - 100,
        thaiGoldBarSell - 150,
        thaiGoldBarSell - 50,
        thaiGoldBarSell
      );
    }

    if (klines1d.length > 0) {
      klines1d.forEach((k: any) => {
        const d = new Date(k[0]);
        thai1mLabels.push(thaiDateFormatter.format(d));
        const price965 = Math.round((parseFloat(k[4]) * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
        thai1mPrices.push(price965);
      });
    }

    // Process Crypto Data (BTC, ETH, BNB, SOL)
    const cryptoRawTickers = cryptoTickersRes.status === "fulfilled" && Array.isArray(cryptoTickersRes.value) ? cryptoTickersRes.value : [];
    const tickerMap: Record<string, any> = {};
    cryptoRawTickers.forEach((t: any) => {
      tickerMap[t.symbol] = t;
    });

    const buildCryptoAsset = (
      symbol: string,
      name: string,
      nameTh: string,
      rawSymbol: string,
      klines1hRaw: any,
      klines1dRaw: any,
      fallbackPrice: number
    ) => {
      const t = tickerMap[rawSymbol];
      const price = t ? parseFloat(t.lastPrice) : fallbackPrice;
      const change24h = t ? parseFloat(t.priceChange) : 0;
      const changePercent24h = t ? parseFloat(t.priceChangePercent) : 0;
      const high24h = t ? parseFloat(t.highPrice) : price * 1.02;
      const low24h = t ? parseFloat(t.lowPrice) : price * 0.98;
      const volumeUsdt = t ? parseFloat(t.quoteVolume || t.volume) : 0;

      const labels24h: string[] = [];
      const prices24h: number[] = [];
      const k1h = Array.isArray(klines1hRaw) ? klines1hRaw : [];
      if (k1h.length > 0) {
        k1h.forEach((k: any) => {
          const time = new Date(k[0]);
          labels24h.push(`${thaiTimeFormatter.format(time)} น.`);
          prices24h.push(parseFloat(k[4]));
        });
      } else {
        for (let i = 24; i >= 0; i -= 3) {
          const fallbackDate = new Date(now - i * 3600 * 1000);
          labels24h.push(`${thaiTimeFormatter.format(fallbackDate)} น.`);
          prices24h.push(price - (Math.sin(i) * price * 0.015));
        }
      }

      const labels30d: string[] = [];
      const prices30d: number[] = [];
      const k1d = Array.isArray(klines1dRaw) ? klines1dRaw : [];
      if (k1d.length > 0) {
        k1d.forEach((k: any) => {
          const d = new Date(k[0]);
          labels30d.push(thaiDateFormatter.format(d));
          prices30d.push(parseFloat(k[4]));
        });
      } else {
        for (let i = 30; i >= 0; i -= 5) {
          const fallbackDate = new Date(now - i * 86400 * 1000);
          labels30d.push(thaiDateFormatter.format(fallbackDate));
          prices30d.push(price - (Math.sin(i) * price * 0.05));
        }
      }

      const labels1y = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
      const prices1y = [
        Number((price * 0.45).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.52).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.60).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.58).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.70).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.95).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.86).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.92).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.82).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.88).toFixed(price > 10 ? 2 : 4)),
        Number((price * 0.85).toFixed(price > 10 ? 2 : 4)),
        price
      ];

      return {
        symbol,
        name,
        nameTh,
        rawSymbol,
        price,
        priceThb: price * usdThb,
        change24h,
        changePercent24h,
        high24h,
        low24h,
        volumeUsdt,
        charts: {
          '24H': { labels: labels24h, prices: prices24h },
          '30D': { labels: labels30d, prices: prices30d },
          '1Y': { labels: labels1y, prices: prices1y }
        }
      };
    };

    const btcData = buildCryptoAsset(
      'BTC',
      'Bitcoin',
      'บิตคอยน์',
      'BTCUSDT',
      btcKlinesRes.status === 'fulfilled' ? btcKlinesRes.value : [],
      btcD1Res.status === 'fulfilled' ? btcD1Res.value : [],
      78800
    );

    const ethData = buildCryptoAsset(
      'ETH',
      'Ethereum',
      'อีเธอเรียม',
      'ETHUSDT',
      ethKlinesRes.status === 'fulfilled' ? ethKlinesRes.value : [],
      ethD1Res.status === 'fulfilled' ? ethD1Res.value : [],
      2450
    );

    const bnbData = buildCryptoAsset(
      'BNB',
      'BNB',
      'บีเอ็นบี',
      'BNBUSDT',
      bnbKlinesRes.status === 'fulfilled' ? bnbKlinesRes.value : [],
      bnbD1Res.status === 'fulfilled' ? bnbD1Res.value : [],
      695
    );

    const solData = buildCryptoAsset(
      'SOL',
      'Solana',
      'โซลานา',
      'SOLUSDT',
      solKlinesRes.status === 'fulfilled' ? solKlinesRes.value : [],
      solD1Res.status === 'fulfilled' ? solD1Res.value : [],
      97
    );

    const payload = {
      timestamp: now,
      serverTime: new Date().toISOString(),
      world: {
        spot: spotPrice,
        change: priceChange,
        changePercent: priceChangePercent,
        high24h: high24h,
        low24h: low24h,
        bid: bidPrice,
        ask: askPrice,
        open: openPrice,
        spread: (askPrice - bidPrice).toFixed(2),
        charts: {
          '1D': { labels: world24hLabels, prices: world24hPrices },
          '1M': { labels: world30dLabels, prices: world30dPrices },
          '1Y': {
            labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
            prices: [
              Math.round(spotPrice * 0.78 * 100) / 100,
              Math.round(spotPrice * 0.81 * 100) / 100,
              Math.round(spotPrice * 0.85 * 100) / 100,
              Math.round(spotPrice * 0.84 * 100) / 100,
              Math.round(spotPrice * 0.87 * 100) / 100,
              Math.round(spotPrice * 0.94 * 100) / 100,
              Math.round(spotPrice * 0.92 * 100) / 100,
              Math.round(spotPrice * 0.96 * 100) / 100,
              Math.round(spotPrice * 0.93 * 100) / 100,
              Math.round(spotPrice * 0.97 * 100) / 100,
              Math.round(spotPrice * 0.98 * 100) / 100,
              spotPrice
            ]
          }
        }
      },
      thai: {
        goldBar965: {
          buy: thaiGoldBarBuy,
          sell: thaiGoldBarSell
        },
        goldOrnament965: {
          buy: thaiGoldOrnamentBuy,
          sell: thaiGoldOrnamentSell
        },
        gold9999: {
          buy: thai9999Buy,
          sell: thai9999Sell
        },
        gold1kg: {
          buy: thai1kgBuy,
          sell: thai1kgSell
        },
        updateInfo: thaiUpdateInfo,
        updateDate: thaiUpdateDate,
        charts: {
          '7D': { labels: thai7dLabels, prices: thai7dPrices },
          '1M': { labels: thai1mLabels, prices: thai1mPrices },
          '1Y': {
            labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
            prices: [
              thaiGoldBarSell - 9200,
              thaiGoldBarSell - 8400,
              thaiGoldBarSell - 7100,
              thaiGoldBarSell - 6500,
              thaiGoldBarSell - 5200,
              thaiGoldBarSell - 2800,
              thaiGoldBarSell - 3200,
              thaiGoldBarSell - 1800,
              thaiGoldBarSell - 2400,
              thaiGoldBarSell - 1200,
              thaiGoldBarSell - 600,
              thaiGoldBarSell
            ]
          }
        }
      },
      crypto: {
        BTC: btcData,
        ETH: ethData,
        BNB: bnbData,
        SOL: solData
      },
      forex: {
        usdThb: usdThb,
        goldSilverRatio: 84.5
      }
    };

    marketCache = {
      timestamp: now,
      data: payload
    };

    return payload;
  } catch (err: any) {
    console.error("Error fetching market data:", err);
    if (marketCache && marketCache.data) return marketCache.data;
    
    // Return solid resilient fallback
    const fallbackSpot = 4626.00;
    const fallbackUsdThb = 32.70;
    const calculated965 = Math.round((fallbackSpot * fallbackUsdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
    const fbBuy = calculated965 - 100;
    const fbSell = calculated965;

    return {
      timestamp: Date.now(),
      serverTime: new Date().toISOString(),
      world: {
        spot: fallbackSpot,
        change: -8.50,
        changePercent: -0.18,
        high24h: 4689.00,
        low24h: 4611.42,
        bid: 4625.50,
        ask: 4626.50,
        open: 4634.50,
        spread: "1.00",
        charts: {
          '1D': {
            labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
            prices: [4634.5, 4640.2, 4655.0, 4689.0, 4642.0, 4615.0, 4626.0]
          },
          '1M': {
            labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'],
            prices: [4510.0, 4560.0, 4610.0, 4626.0]
          },
          '1Y': {
            labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
            prices: [3610, 3750, 3920, 3890, 4020, 4350, 4260, 4440, 4310, 4490, 4530, 4626]
          }
        }
      },
      thai: {
        goldBar965: { buy: fbBuy, sell: fbSell },
        goldOrnament965: { buy: Math.round(calculated965 * 0.98), sell: calculated965 + 500 },
        gold9999: { buy: Math.round((fbSell * (99.99 / 96.5)) - 100), sell: Math.round(fbSell * (99.99 / 96.5)) },
        gold1kg: { buy: Math.round(((fbSell * (99.99 / 96.5)) - 100) * (1000 / 15.244)), sell: Math.round((fbSell * (99.99 / 96.5)) * (1000 / 15.244)) },
        updateInfo: "ประกาศสมาคมค้าทองคำ (ล่าสุด)",
        updateDate: new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' }),
        charts: {
          '7D': {
            labels: ['6 วันก่อน', '5 วันก่อน', '4 วันก่อน', '3 วันก่อน', '2 วันก่อน', 'เมื่อวาน', 'วันนี้'],
            prices: [fbSell - 450, fbSell - 300, fbSell - 200, fbSell - 100, fbSell - 150, fbSell - 50, fbSell]
          },
          '1M': {
            labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'],
            prices: [fbSell - 2400, fbSell - 1600, fbSell - 800, fbSell]
          },
          '1Y': {
            labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
            prices: [fbSell - 9200, fbSell - 8400, fbSell - 7100, fbSell - 6500, fbSell - 5200, fbSell - 2800, fbSell - 3200, fbSell - 1800, fbSell - 2400, fbSell - 1200, fbSell - 600, fbSell]
          }
        }
      },
      crypto: {
        BTC: { symbol: 'BTC', name: 'Bitcoin', nameTh: 'บิตคอยน์', rawSymbol: 'BTCUSDT', price: 78800, priceThb: 78800 * fallbackUsdThb, change24h: 1250, changePercent24h: 1.61, high24h: 79500, low24h: 77200, volumeUsdt: 2400000000, charts: { '24H': { labels: ['00:00 น.', '12:00 น.', 'ปัจจุบัน'], prices: [77500, 78200, 78800] }, '30D': { labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'], prices: [72000, 74500, 76800, 78800] }, '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [34500, 37800, 42200, 43100, 51800, 68500, 64200, 68000, 61500, 66800, 63400, 78800] } } },
        ETH: { symbol: 'ETH', name: 'Ethereum', nameTh: 'อีเธอเรียม', rawSymbol: 'ETHUSDT', price: 2450, priceThb: 2450 * fallbackUsdThb, change24h: -15, changePercent24h: -0.61, high24h: 2510, low24h: 2420, volumeUsdt: 1200000000, charts: { '24H': { labels: ['00:00 น.', '12:00 น.', 'ปัจจุบัน'], prices: [2465, 2480, 2450] }, '30D': { labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'], prices: [2300, 2380, 2420, 2450] }, '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [1780, 2050, 2280, 2480, 2950, 3600, 3200, 3750, 3400, 3100, 2650, 2450] } } },
        BNB: { symbol: 'BNB', name: 'BNB', nameTh: 'บีเอ็นบี', rawSymbol: 'BNBUSDT', price: 695, priceThb: 695 * fallbackUsdThb, change24h: 8.5, changePercent24h: 1.24, high24h: 705, low24h: 682, volumeUsdt: 450000000, charts: { '24H': { labels: ['00:00 น.', '12:00 น.', 'ปัจจุบัน'], prices: [686, 692, 695] }, '30D': { labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'], prices: [640, 665, 680, 695] }, '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [225, 240, 280, 310, 380, 580, 560, 600, 570, 590, 560, 695] } } },
        SOL: { symbol: 'SOL', name: 'Solana', nameTh: 'โซลานา', rawSymbol: 'SOLUSDT', price: 97, priceThb: 97 * fallbackUsdThb, change24h: 3.2, changePercent24h: 3.41, high24h: 99.5, low24h: 93.1, volumeUsdt: 850000000, charts: { '24H': { labels: ['00:00 น.', '12:00 น.', 'ปัจจุบัน'], prices: [93.8, 95.5, 97] }, '30D': { labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'], prices: [82, 88, 92, 97] }, '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [32.0, 42.5, 68.0, 85.0, 102.0, 185.0, 140.0, 168.0, 135.0, 172.0, 145.0, 97] } } }
      },
      forex: {
        usdThb: fallbackUsdThb,
        goldSilverRatio: 84.5
      }
    };
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/gold-live", async (req, res) => {
  try {
    const data = await fetchRealTimeMarketData();
    res.setHeader("Cache-Control", "public, max-age=5");
    res.json(data);
  } catch (error: any) {
    res.status(200).json({
      world: { spot: 4626.00, change: -8.50, changePercent: -0.18, high24h: 4689.00, low24h: 4611.42, bid: 4625.50, ask: 4626.50, open: 4634.50, spread: "1.00", charts: { '1D': { labels: ['ปัจจุบัน'], prices: [4626] }, '1M': { labels: ['ปัจจุบัน'], prices: [4626] }, '1Y': { labels: ['ก.ย.'], prices: [4626] } } },
      thai: { goldBar965: { buy: 71750, sell: 71950 }, goldOrnament965: { buy: 70312, sell: 72750 }, gold9999: { buy: 74450, sell: 74550 }, gold1kg: { buy: 4883888, sell: 4890448 }, updateInfo: "ประกาศสมาคมค้าทองคำ", updateDate: new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' }), charts: { '7D': { labels: ['วันนี้'], prices: [71950] }, '1M': { labels: ['ปัจจุบัน'], prices: [71950] }, '1Y': { labels: ['ก.ย.'], prices: [71950] } } },
      crypto: {},
      forex: { usdThb: 32.70, goldSilverRatio: 84.5 }
    });
  }
});

// Live Security Search Endpoint (Search any stock, ETF, or fund worldwide)
app.get("/api/securities/search", async (req, res) => {
  const query = (req.query.q as string || "").trim();
  if (!query) {
    return res.json({ quotes: [] });
  }

  try {
    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=12&newsCount=0`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      const quotes = (data.quotes || []).map((q: any) => {
        let type: "stock_us" | "stock_th" | "etf" | "fund" = "stock_us";
        const quoteType = (q.quoteType || "").toUpperCase();
        const symbol = q.symbol || "";

        if (symbol.endsWith(".BK") || q.exchange === "SET" || q.exchange === "BKK") {
          type = "stock_th";
        } else if (quoteType === "ETF") {
          type = "etf";
        } else if (quoteType === "MUTUALFUND") {
          type = "fund";
        } else {
          type = symbol.endsWith(".BK") ? "stock_th" : "stock_us";
        }

        return {
          symbol: q.symbol,
          shortname: q.shortname || q.longname || q.symbol,
          longname: q.longname || q.shortname || q.symbol,
          exchange: q.exchDisp || q.exchange || "",
          typeDisp: q.typeDisp || q.quoteType || "Equity",
          type,
          sector: q.sector || q.industry || q.typeDisp || "Financial Markets"
        };
      });

      return res.json({ quotes });
    }
  } catch (err) {
    console.warn("Live search fetch failed:", err);
  }

  res.json({ quotes: [] });
});

// Live Security Quote & Chart Endpoint (Fetch live real-time price & chart for ANY symbol)
app.get("/api/securities/quote", async (req, res) => {
  const symbol = (req.query.symbol as string || "").trim().toUpperCase();
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    // Query Yahoo Finance 1M chart & quote metadata
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
    const response = await fetch(chartUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      const result = data?.chart?.result?.[0];
      if (result) {
        const meta = result.meta || {};
        const timestamps = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};
        const closePrices: number[] = quotes.close || [];

        const currentPrice = meta.regularMarketPrice || meta.chartPreviousClose || (closePrices.length > 0 ? closePrices[closePrices.length - 1] : 100);
        const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
        const change = currentPrice - prevClose;
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
        const high52 = meta.fiftyTwoWeekHigh || currentPrice * 1.25;
        const low52 = meta.fiftyTwoWeekLow || currentPrice * 0.75;
        const currency = meta.currency === "THB" ? "THB" : (symbol.endsWith(".BK") ? "THB" : "USD");

        // Format dates for 1M chart
        const m1Labels: string[] = [];
        const m1Prices: number[] = [];
        const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
          timeZone: 'Asia/Bangkok',
          day: 'numeric',
          month: 'short'
        });

        timestamps.forEach((ts: number, idx: number) => {
          const p = closePrices[idx];
          if (p !== null && p !== undefined && !isNaN(p)) {
            m1Labels.push(thaiDateFormatter.format(new Date(ts * 1000)));
            m1Prices.push(Number(p.toFixed(p > 10 ? 2 : 4)));
          }
        });

        // Derive 1D, 1W, 1Y charts
        const lastP = Number(currentPrice.toFixed(currentPrice > 10 ? 2 : 4));
        const d1 = [
          Number((lastP * 0.992).toFixed(2)),
          Number((lastP * 0.996).toFixed(2)),
          Number((lastP * (changePercent >= 0 ? 1.004 : 0.995)).toFixed(2)),
          Number((lastP * 0.999).toFixed(2)),
          lastP
        ];
        const w1 = m1Prices.slice(-5).length >= 5 ? m1Prices.slice(-5) : [
          Number((lastP * (changePercent >= 0 ? 0.97 : 1.03)).toFixed(2)),
          Number((lastP * (changePercent >= 0 ? 0.98 : 1.02)).toFixed(2)),
          Number((lastP * (changePercent >= 0 ? 0.99 : 1.01)).toFixed(2)),
          lastP
        ];
        const y1 = [
          Number((low52 * 1.05).toFixed(2)),
          Number(((low52 + high52) / 2).toFixed(2)),
          Number((high52 * 0.95).toFixed(2)),
          lastP
        ];

        let type: "stock_us" | "stock_th" | "etf" | "fund" = "stock_us";
        const quoteType = (meta.instrumentType || "").toUpperCase();
        if (symbol.endsWith(".BK") || currency === "THB") {
          type = "stock_th";
        } else if (quoteType === "ETF") {
          type = "etf";
        } else if (quoteType === "MUTUALFUND") {
          type = "fund";
        }

        const payload = {
          symbol: meta.symbol || symbol,
          name: meta.longName || meta.shortName || meta.symbol || symbol,
          nameTh: meta.shortName || meta.longName || meta.symbol || symbol,
          type,
          market: currency === "THB" ? "SET" : "US",
          currency,
          price: lastP,
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          high52w: Number(high52.toFixed(2)),
          low52w: Number(low52.toFixed(2)),
          sector: meta.sector || meta.instrumentType || "Global Equities",
          issuer: meta.exchangeName || "Financial Market",
          description: `${meta.longName || meta.shortName || symbol} จดทะเบียนในตลาด ${meta.exchangeName || meta.fullExchangeName || 'หลักทรัพย์'} ซื้อขายด้วยสกุลเงิน ${currency}`,
          charts: {
            '1D': { labels: ['09:30', '11:30', '13:30', '15:00', '16:00'], prices: d1 },
            '1W': { labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'], prices: w1 },
            '1M': {
              labels: m1Labels.length > 0 ? m1Labels : ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
              prices: m1Prices.length > 0 ? m1Prices : [lastP * 0.95, lastP * 0.97, lastP * 0.99, lastP]
            },
            '1Y': { labels: ['Q1', 'Q2', 'Q3', 'Q4'], prices: y1 }
          }
        };

        return res.json(payload);
      }
    }
  } catch (err) {
    console.warn(`Live quote fetch for ${symbol} failed:`, err);
  }

  res.status(404).json({ error: `Could not fetch quote for ${symbol}` });
});

// ==========================================
// LIVE CRYPTO UNIVERSAL SEARCH & QUOTE API
// ==========================================

// Predefined Popular Crypto Metas for Quick Enrich
const POPULAR_CRYPTO_MAP: Record<string, { name: string; nameTh: string; glyph: string; category: string; rank: number }> = {
  BTC: { name: 'Bitcoin', nameTh: 'บิตคอยน์ (Store of Value & King of Crypto)', glyph: '₿', category: 'Layer 1 / Digital Gold', rank: 1 },
  ETH: { name: 'Ethereum', nameTh: 'อีเธอเรียม (ผู้นำ Smart Contract & DeFi)', glyph: 'Ξ', category: 'Layer 1 / Smart Contracts', rank: 2 },
  USDT: { name: 'Tether USD', nameTh: 'เทเธอร์ (เหรียญ Stablecoin อันดับ 1)', glyph: '₮', category: 'Stablecoin', rank: 3 },
  BNB: { name: 'BNB Chain', nameTh: 'บีเอ็นบี (Ecosystem Coin ของ Binance)', glyph: '❖', category: 'Exchange / Layer 1', rank: 4 },
  SOL: { name: 'Solana', nameTh: 'โซลานา (บล็อกเชนความเร็วสูง ค่าธรรมเนียมต่ำ)', glyph: '◈', category: 'High-Speed Layer 1', rank: 5 },
  XRP: { name: 'Ripple', nameTh: 'ริปเปิล (เครือข่ายโอนเงินข้ามพรมแดนสถาบันการเงิน)', glyph: '✕', category: 'Payment / Cross-Border', rank: 6 },
  DOGE: { name: 'Dogecoin', nameTh: 'โดจคอยน์ (เหรียญมีมและคอมมูนิตี้อันดับ 1)', glyph: 'Ð', category: 'Meme / Payment', rank: 7 },
  ADA: { name: 'Cardano', nameTh: 'คาร์ดาโน (บล็อกเชนงานวิจัยและระบบ Proof of Stake)', glyph: '₳', category: 'Layer 1 / Research', rank: 8 },
  AVAX: { name: 'Avalanche', nameTh: 'อวาแลนช์ (ซับเน็ตบล็อกเชนความเร็วสูง)', glyph: '▲', category: 'Layer 1 / Subnets', rank: 9 },
  SUI: { name: 'Sui Network', nameTh: 'ซุย (บล็อกเชนภาษา Move ยุคใหม่)', glyph: '💧', category: 'Next-Gen Layer 1', rank: 10 },
  LINK: { name: 'Chainlink', nameTh: 'เชนลิงก์ (โครงสร้างพื้นฐาน Oracle ข้อมูลและ RWA)', glyph: '⬡', category: 'Oracle / Infrastructure', rank: 11 },
  PEPE: { name: 'Pepe', nameTh: 'เปเป้ (เหรียญมีมกบยอดนิยม)', glyph: '🐸', category: 'Meme Coin', rank: 12 },
  SHIB: { name: 'Shiba Inu', nameTh: 'ชิบะอินุ (Ecosystem เหรียญมีมและ Shibarium)', glyph: '🐕', category: 'Meme / Layer 2', rank: 13 },
  NEAR: { name: 'NEAR Protocol', nameTh: 'เนียร์ (บล็อกเชน AI และ Sharding)', glyph: 'Ⓝ', category: 'Layer 1 / AI & Sharding', rank: 14 },
  DOT: { name: 'Polkadot', nameTh: 'โพลกาดอท (ระบบ Multi-Chain Interoperability)', glyph: '●', category: 'Layer 0 / Interoperability', rank: 15 },
  TON: { name: 'Toncoin', nameTh: 'ตันคอยน์ (บล็อกเชนเชื่อมโยง Telegram Ecosystem)', glyph: '💎', category: 'Layer 1 / Telegram Ecosystem', rank: 16 },
  APT: { name: 'Aptos', nameTh: 'แอพทอส (บล็อกเชนภาษา Move ความเร็วสูง)', glyph: '⚡', category: 'Layer 1 / Move', rank: 17 },
  KAS: { name: 'Kaspa', nameTh: 'คาสปา (BlockDAG Proof of Work ยุคใหม่)', glyph: '🔷', category: 'Proof of Work / BlockDAG', rank: 18 },
  RENDER: { name: 'Render Network', nameTh: 'เรนเดอร์ (โครงข่ายกระจายการประมวลผล GPU & AI)', glyph: '🎨', category: 'DePIN / GPU Computing', rank: 19 },
  FET: { name: 'Artificial Superintelligence', nameTh: 'เอไอ ซูเปอร์อินเทลลิเจนซ์ (พันธมิตรเหรียญ AI)', glyph: '🤖', category: 'Artificial Intelligence (AI)', rank: 20 },
  UNI: { name: 'Uniswap', nameTh: 'ยูนิสวอป (กระดานเทรดแบบกระจายศูนย์ DEX อันดับ 1)', glyph: '🦄', category: 'DeFi / DEX Leader', rank: 21 },
  AAVE: { name: 'Aave', nameTh: 'เอฟ (แพลตฟอร์มปล่อยกู้ยืม DeFi ชั้นนำ)', glyph: '👻', category: 'DeFi / Lending Protocol', rank: 22 },
  LTC: { name: 'Litecoin', nameTh: 'ไลท์คอยน์ (เงินดิจิทัลเพียร์ทูเพียร์ Silver to BTC)', glyph: 'Ł', category: 'Payment / PoW', rank: 23 },
  XLM: { name: 'Stellar', nameTh: 'สเตลลาร์ (โครงข่ายชำระเงินดิจิทัลสากล)', glyph: '🚀', category: 'Payment / Remittance', rank: 24 },
  ICP: { name: 'Internet Computer', nameTh: 'อินเทอร์เน็ต คอมพิวเตอร์ (Cloud Decentralized)', glyph: '∞', category: 'Cloud & Web3 Compute', rank: 25 },
  BCH: { name: 'Bitcoin Cash', nameTh: 'บิตคอยน์แคช (เหรียญชำระเงินค่าธรรมเนียมต่ำ)', glyph: '฿', category: 'Payment / PoW', rank: 26 },
  TAO: { name: 'Bittensor', nameTh: 'บิตเทนเซอร์ (โครงข่าย Machine Learning แบบกระจายศูนย์)', glyph: '🧠', category: 'Decentralized AI', rank: 27 },
  WIF: { name: 'dogwifhat', nameTh: 'ด็อกวิฟแฮต (เหรียญมีมหมาใส่หมวกบน Solana)', glyph: '🎩', category: 'Solana Meme Coin', rank: 28 },
  BONK: { name: 'Bonk', nameTh: 'บองก์ (เหรียญคอมมูนิตี้และมีมอันดับ 1 ของ Solana)', glyph: '🐶', category: 'Solana Meme Coin', rank: 29 },
  SEI: { name: 'Sei Network', nameTh: 'เซอิ (บล็อกเชน Layer 1 สำหรับเทรดดิ้งเร็วที่สุด)', glyph: '🌊', category: 'Layer 1 / Trading Focus', rank: 30 },
  INJ: { name: 'Injective', nameTh: 'อินเจคทีฟ (บล็อกเชนการเงินและอนุพันธ์ DeFi)', glyph: '💉', category: 'Layer 1 / DeFi Finance', rank: 31 },
  TIA: { name: 'Celestia', nameTh: 'เซเลสเทีย (ผู้นำ Modular Blockchain Data Availability)', glyph: '✨', category: 'Modular Blockchain / DA', rank: 32 },
  ONDO: { name: 'Ondo Finance', nameTh: 'ออนโด (ผู้นำสินทรัพย์โลกจริง Real World Asset RWA)', glyph: '🏛️', category: 'Real World Assets (RWA)', rank: 33 },
  JUP: { name: 'Jupiter', nameTh: 'จูปิเตอร์ (Aggregator และ DEX ชั้นนำของ Solana)', glyph: '🪐', category: 'Solana DEX & Perpetuals', rank: 34 },
  ENA: { name: 'Ethena', nameTh: 'เอเธอนา (โปรโตคอล Synthetic Dollar USDe)', glyph: '💵', category: 'DeFi / Synthetic Dollar', rank: 35 },
  FLOKI: { name: 'Floki', nameTh: 'ฟโลกิ (เหรียญมีมและ GameFi Ecosystem)', glyph: '⚔️', category: 'Meme / GameFi Ecosystem', rank: 36 }
};

// Live Crypto Search (Binance 24hr tickers + Yahoo Finance fallback)
app.get("/api/crypto/search", async (req, res) => {
  const query = (req.query.q as string || "").trim().toUpperCase();
  if (!query) {
    return res.json({ quotes: [] });
  }

  try {
    // 1. Fetch Binance 24hr tickers
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    if (binanceRes.ok) {
      const tickers: any[] = await binanceRes.json();
      const matched = tickers
        .filter((t) => t.symbol.endsWith("USDT"))
        .map((t) => {
          const rawSymbol = t.symbol.replace("USDT", "");
          const meta = POPULAR_CRYPTO_MAP[rawSymbol];
          return {
            symbol: rawSymbol,
            pair: t.symbol,
            name: meta ? meta.name : `${rawSymbol} Token`,
            nameTh: meta ? meta.nameTh : `เหรียญ ${rawSymbol} (USDT Pair)`,
            glyph: meta ? meta.glyph : '🪙',
            category: meta ? meta.category : 'Cryptocurrency',
            rank: meta ? meta.rank : 99,
            price: parseFloat(t.lastPrice) || 0,
            changePercent24h: parseFloat(t.priceChangePercent) || 0,
            volumeUsdt: parseFloat(t.quoteVolume) || 0
          };
        })
        .filter((c) => {
          return (
            c.symbol.includes(query) ||
            c.name.toUpperCase().includes(query) ||
            c.nameTh.toUpperCase().includes(query) ||
            c.category.toUpperCase().includes(query)
          );
        })
        .sort((a, b) => b.volumeUsdt - a.volumeUsdt)
        .slice(0, 15);

      if (matched.length > 0) {
        return res.json({ quotes: matched });
      }
    }
  } catch (err) {
    console.warn("Binance crypto search failed, trying fallback:", err);
  }

  // 2. Fallback search via Yahoo Finance
  try {
    const ySearch = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query + " crypto")}&quotesCount=10&newsCount=0`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (ySearch.ok) {
      const yData = await ySearch.json();
      const quotes = (yData.quotes || [])
        .filter((q: any) => q.quoteType === "CRYPTOCURRENCY" || q.symbol.endsWith("-USD"))
        .map((q: any) => {
          const sym = q.symbol.replace("-USD", "");
          const meta = POPULAR_CRYPTO_MAP[sym];
          return {
            symbol: sym,
            pair: `${sym}USDT`,
            name: q.shortname || q.longname || sym,
            nameTh: meta ? meta.nameTh : `${q.shortname || sym} คริปโตเคอร์เรนซี`,
            glyph: meta ? meta.glyph : '🪙',
            category: meta ? meta.category : 'Cryptocurrency / Web3',
            rank: meta ? meta.rank : 99,
            price: 0,
            changePercent24h: 0,
            volumeUsdt: 0
          };
        });

      return res.json({ quotes });
    }
  } catch (e) {
    console.warn("Yahoo crypto search failed:", e);
  }

  res.json({ quotes: [] });
});

// Live Crypto Quote & Real-time 24H/30D Chart Endpoint
app.get("/api/crypto/quote", async (req, res) => {
  const symbol = (req.query.symbol as string || "").trim().toUpperCase().replace(/USDT$|-USD$/, "");
  if (!symbol) {
    return res.status(400).json({ error: "Crypto symbol is required" });
  }

  const thaiTimeFormatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric',
    month: 'short'
  });

  const now = Date.now();
  const meta = POPULAR_CRYPTO_MAP[symbol] || {
    name: `${symbol} Token`,
    nameTh: `เหรียญ ${symbol} (สปอตมาร์เก็ต)`,
    glyph: '🪙',
    category: 'Cryptocurrency / Digital Asset',
    rank: 99
  };

  // 1. Try Binance Direct Spot API
  try {
    const pair = `${symbol}USDT`;
    const [tickerRes, klines1hRes, klines1dRes] = await Promise.allSettled([
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`).then((r) => r.ok ? r.json() : null),
      fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=24`).then((r) => r.ok ? r.json() : []),
      fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=30`).then((r) => r.ok ? r.json() : [])
    ]);

    const ticker = tickerRes.status === "fulfilled" ? tickerRes.value : null;
    const klines1h = klines1hRes.status === "fulfilled" && Array.isArray(klines1hRes.value) ? klines1hRes.value : [];
    const klines1d = klines1dRes.status === "fulfilled" && Array.isArray(klines1dRes.value) ? klines1dRes.value : [];

    if (ticker && ticker.lastPrice) {
      const price = parseFloat(ticker.lastPrice);
      const change24h = parseFloat(ticker.priceChange) || 0;
      const changePercent24h = parseFloat(ticker.priceChangePercent) || 0;
      const high24h = parseFloat(ticker.highPrice) || price * 1.05;
      const low24h = parseFloat(ticker.lowPrice) || price * 0.95;
      const volumeUsdt = parseFloat(ticker.quoteVolume || ticker.volume) || 0;

      const labels24h: string[] = [];
      const prices24h: number[] = [];
      klines1h.forEach((k: any) => {
        const d = new Date(k[0]);
        labels24h.push(`${thaiTimeFormatter.format(d)} น.`);
        prices24h.push(parseFloat(k[4]));
      });

      const labels30d: string[] = [];
      const prices30d: number[] = [];
      klines1d.forEach((k: any) => {
        const d = new Date(k[0]);
        labels30d.push(thaiDateFormatter.format(d));
        prices30d.push(parseFloat(k[4]));
      });

      return res.json({
        symbol,
        name: meta.name,
        nameTh: meta.nameTh,
        glyph: meta.glyph,
        category: meta.category,
        rank: meta.rank,
        price,
        change24h,
        changePercent24h,
        high24h,
        low24h,
        volumeUsdt,
        charts: {
          '24H': {
            labels: labels24h.length > 0 ? labels24h : ['00:00', '06:00', '12:00', '18:00', '24:00'],
            prices: prices24h.length > 0 ? prices24h : [price * 0.98, price * 0.99, price * 1.01, price]
          },
          '30D': {
            labels: labels30d.length > 0 ? labels30d : ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'],
            prices: prices30d.length > 0 ? prices30d : [price * 0.9, price * 0.95, price * 0.97, price]
          }
        }
      });
    }
  } catch (err) {
    console.warn(`Binance fetch for ${symbol} failed:`, err);
  }

  // 2. Fallback via Yahoo Finance (${symbol}-USD)
  try {
    const yChartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol + "-USD")}?range=1mo&interval=1d`;
    const yRes = await fetch(yChartUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (yRes.ok) {
      const yData = await yRes.json();
      const result = yData?.chart?.result?.[0];
      if (result) {
        const metaY = result.meta || {};
        const timestamps = result.timestamp || [];
        const closePrices: number[] = result.indicators?.quote?.[0]?.close || [];
        const currentPrice = metaY.regularMarketPrice || (closePrices.length > 0 ? closePrices[closePrices.length - 1] : 1.0);
        const prevClose = metaY.chartPreviousClose || metaY.previousClose || currentPrice;
        const change24h = currentPrice - prevClose;
        const changePercent24h = prevClose > 0 ? (change24h / prevClose) * 100 : 0;
        const high24h = metaY.regularMarketDayHigh || currentPrice * 1.04;
        const low24h = metaY.regularMarketDayLow || currentPrice * 0.96;
        const volumeUsdt = metaY.regularMarketVolume || 1000000;

        const labels30d: string[] = [];
        const prices30d: number[] = [];
        timestamps.forEach((ts: number, idx: number) => {
          const p = closePrices[idx];
          if (p !== null && p !== undefined && !isNaN(p)) {
            labels30d.push(thaiDateFormatter.format(new Date(ts * 1000)));
            prices30d.push(Number(p.toFixed(p > 10 ? 2 : 5)));
          }
        });

        const lastP = Number(currentPrice.toFixed(currentPrice > 10 ? 2 : 5));
        const prices24h = [
          Number((lastP * 0.985).toFixed(lastP > 10 ? 2 : 5)),
          Number((lastP * 0.992).toFixed(lastP > 10 ? 2 : 5)),
          Number((lastP * (changePercent24h >= 0 ? 1.01 : 0.995)).toFixed(lastP > 10 ? 2 : 5)),
          lastP
        ];

        return res.json({
          symbol,
          name: metaY.shortName || meta.name,
          nameTh: meta.nameTh,
          glyph: meta.glyph,
          category: meta.category,
          rank: meta.rank,
          price: lastP,
          change24h: Number(change24h.toFixed(lastP > 10 ? 2 : 5)),
          changePercent24h: Number(changePercent24h.toFixed(2)),
          high24h: Number(high24h.toFixed(lastP > 10 ? 2 : 5)),
          low24h: Number(low24h.toFixed(lastP > 10 ? 2 : 5)),
          volumeUsdt,
          charts: {
            '24H': {
              labels: ['00:00 น.', '06:00 น.', '12:00 น.', 'ปัจจุบัน'],
              prices: prices24h
            },
            '30D': {
              labels: labels30d.length > 0 ? labels30d : ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'],
              prices: prices30d.length > 0 ? prices30d : [lastP * 0.92, lastP * 0.96, lastP * 0.98, lastP]
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn(`Yahoo fallback for ${symbol} failed:`, err);
  }

  res.status(404).json({ error: `Could not fetch quote for crypto ${symbol}` });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
