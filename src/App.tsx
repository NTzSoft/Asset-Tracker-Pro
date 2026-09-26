/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  RefreshCw,
  Calculator,
  Flame,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  DollarSign,
  ArrowLeftRight,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  Scale,
  Building2,
  Pin
} from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { SecuritiesHub } from './components/SecuritiesHub';
import { CryptoHub } from './components/CryptoHub';
import { PWAInstallButton, PWAMobileBanner } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { INITIAL_SECURITIES } from './data/securities';

ChartJS.register(...registerables);

export type GoldType = 'XAU' | 'BAR965' | 'ORN965' | 'BAR9999';

export interface CryptoAsset {
  symbol: 'BTC' | 'ETH' | 'BNB' | 'SOL';
  name: string;
  nameTh: string;
  rawSymbol: string;
  price: number;
  priceThb: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volumeUsdt: number;
  charts: {
    '24H': { labels: string[]; prices: number[] };
    '30D': { labels: string[]; prices: number[] };
  };
}

interface MarketData {
  timestamp: number;
  serverTime: string;
  world: {
    spot: number;
    change: number;
    changePercent: number;
    high24h: number;
    low24h: number;
    bid: number;
    ask: number;
    open: number;
    spread: string;
    charts: {
      '1D': { labels: string[]; prices: number[] };
      '1M': { labels: string[]; prices: number[] };
      '1Y': { labels: string[]; prices: number[] };
    };
  };
  thai: {
    goldBar965: { buy: number; sell: number };
    goldOrnament965: { buy: number; sell: number };
    gold9999: { buy: number; sell: number };
    gold1kg: { buy: number; sell: number };
    updateInfo: string;
    updateDate: string;
    charts: {
      '7D': { labels: string[]; prices: number[] };
      '1M': { labels: string[]; prices: number[] };
      '1Y': { labels: string[]; prices: number[] };
    };
  };
  crypto: {
    BTC: CryptoAsset;
    ETH: CryptoAsset;
    BNB: CryptoAsset;
    SOL: CryptoAsset;
  };
  forex: {
    usdThb: number;
    goldSilverRatio: number;
  };
}

// Initial fallback data
const initialMarketData: MarketData = {
  timestamp: Date.now(),
  serverTime: new Date().toISOString(),
  world: {
    spot: 4626.00,
    change: -10.25,
    changePercent: -0.22,
    high24h: 4689.00,
    low24h: 4611.42,
    bid: 4625.80,
    ask: 4626.30,
    open: 4636.25,
    spread: "0.50",
    charts: {
      '1D': {
        labels: ['00:00 น.', '03:00 น.', '06:00 น.', '09:00 น.', '12:00 น.', '15:00 น.', '18:00 น.', '21:00 น.', 'ปัจจุบัน'],
        prices: [4636.25, 4642.10, 4658.00, 4675.40, 4689.00, 4652.30, 4630.10, 4611.42, 4626.00]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [4510.00, 4580.00, 4640.00, 4626.00]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [3610.00, 3750.00, 3920.00, 3880.00, 4020.00, 4350.00, 4250.00, 4450.00, 4310.00, 4490.00, 4540.00, 4626.00]
      }
    }
  },
  thai: {
    goldBar965: { buy: 71750, sell: 71950 },
    goldOrnament965: { buy: 70312, sell: 72750 },
    gold9999: { buy: 74450, sell: 74650 },
    gold1kg: { buy: 4883800, sell: 4896900 },
    updateInfo: "เวลา 10:38 น. (ครั้งที่ 9)",
    updateDate: "25/08/2569",
    charts: {
      '7D': {
        labels: ['พุธ (19 ส.ค.)', 'พฤหัส (20 ส.ค.)', 'ศุกร์ (21 ส.ค.)', 'เสาร์ (22 ส.ค.)', 'อาทิตย์ (23 ส.ค.)', 'จันทร์ (24 ส.ค.)', 'วันนี้'],
        prices: [71100, 71350, 71500, 71800, 71800, 72100, 71950]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [69800, 70600, 71400, 71950]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [62750, 63550, 64850, 65450, 66750, 69150, 68750, 70150, 69550, 70750, 71350, 71950]
      }
    }
  },
  crypto: {
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      nameTh: 'บิตคอยน์',
      rawSymbol: 'BTCUSDT',
      price: 78900.00,
      priceThb: 2580030.00,
      change24h: -950.00,
      changePercent24h: -1.20,
      high24h: 81270.00,
      low24h: 77850.00,
      volumeUsdt: 1850000000,
      charts: {
        '24H': {
          labels: ['00:00 น.', '03:00 น.', '06:00 น.', '09:00 น.', '12:00 น.', '15:00 น.', '18:00 น.', '21:00 น.'],
          prices: [80200, 80800, 81270, 79600, 78400, 77850, 78200, 78900]
        },
        '30D': {
          labels: ['1 ส.ค.', '7 ส.ค.', '14 ส.ค.', '21 ส.ค.', 'วันนี้'],
          prices: [72500, 74800, 77200, 80500, 78900]
        }
      }
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      nameTh: 'อีเธอเรียม',
      rawSymbol: 'ETHUSDT',
      price: 2458.00,
      priceThb: 80376.60,
      change24h: -42.00,
      changePercent24h: -1.68,
      high24h: 2532.00,
      low24h: 2414.00,
      volumeUsdt: 820000000,
      charts: {
        '24H': {
          labels: ['00:00 น.', '03:00 น.', '06:00 น.', '09:00 น.', '12:00 น.', '15:00 น.', '18:00 น.', '21:00 น.'],
          prices: [2510, 2525, 2532, 2480, 2440, 2414, 2435, 2458]
        },
        '30D': {
          labels: ['1 ส.ค.', '7 ส.ค.', '14 ส.ค.', '21 ส.ค.', 'วันนี้'],
          prices: [2280, 2350, 2410, 2520, 2458]
        }
      }
    },
    BNB: {
      symbol: 'BNB',
      name: 'BNB',
      nameTh: 'บีเอ็นบี',
      rawSymbol: 'BNBUSDT',
      price: 695.50,
      priceThb: 22742.85,
      change24h: -14.20,
      changePercent24h: -2.00,
      high24h: 719.00,
      low24h: 688.00,
      volumeUsdt: 145000000,
      charts: {
        '24H': {
          labels: ['00:00 น.', '03:00 น.', '06:00 น.', '09:00 น.', '12:00 น.', '15:00 น.', '18:00 น.', '21:00 น.'],
          prices: [712, 718, 719, 705, 692, 688, 691, 695.5]
        },
        '30D': {
          labels: ['1 ส.ค.', '7 ส.ค.', '14 ส.ค.', '21 ส.ค.', 'วันนี้'],
          prices: [620, 645, 670, 715, 695.5]
        }
      }
    },
    SOL: {
      symbol: 'SOL',
      name: 'Solana',
      nameTh: 'โซลานา',
      rawSymbol: 'SOLUSDT',
      price: 97.10,
      priceThb: 3175.17,
      change24h: -5.10,
      changePercent24h: -4.98,
      high24h: 103.00,
      low24h: 95.30,
      volumeUsdt: 420000000,
      charts: {
        '24H': {
          labels: ['00:00 น.', '03:00 น.', '06:00 น.', '09:00 น.', '12:00 น.', '15:00 น.', '18:00 น.', '21:00 น.'],
          prices: [102.5, 103.0, 101.2, 98.4, 96.0, 95.3, 96.5, 97.1]
        },
        '30D': {
          labels: ['1 ส.ค.', '7 ส.ค.', '14 ส.ค.', '21 ส.ค.', 'วันนี้'],
          prices: [88.0, 92.5, 96.0, 104.5, 97.1]
        }
      }
    }
  },
  forex: {
    usdThb: 32.70,
    goldSilverRatio: 84.5
  }
};

const GOLD_CONFIG: Record<
  GoldType,
  {
    id: GoldType;
    symbol: string;
    name: string;
    nameTh: string;
    badgeColor: string;
    accentColor: string;
    chartColor: string;
    chartBgGradient: string;
    borderColor: string;
    glyph: string;
    category: string;
    unitTh: string;
  }
> = {
  XAU: {
    id: 'XAU',
    symbol: 'XAU/USD',
    name: 'Spot Gold',
    nameTh: 'ทองคำโลก (Spot Gold)',
    badgeColor: 'from-amber-400 to-yellow-600',
    accentColor: 'text-amber-400',
    chartColor: '#f59e0b',
    chartBgGradient: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'border-amber-500/40',
    glyph: '✦',
    category: 'Global Market / ตลาดโลก',
    unitTh: 'ดอลลาร์/ทรอยออนซ์'
  },
  BAR965: {
    id: 'BAR965',
    symbol: 'BAR 96.5%',
    name: 'Thai Gold Bar 96.5%',
    nameTh: 'ทองคำแท่ง 96.5%',
    badgeColor: 'from-yellow-400 to-amber-600',
    accentColor: 'text-yellow-400',
    chartColor: '#eab308',
    chartBgGradient: 'rgba(234, 179, 8, 0.2)',
    borderColor: 'border-yellow-500/40',
    glyph: '▮',
    category: 'สมาคมค้าทองคำ (มาตรฐานไทย)',
    unitTh: 'บาทละ (15.244 กรัม)'
  },
  ORN965: {
    id: 'ORN965',
    symbol: 'ORN 96.5%',
    name: 'Thai Gold Ornament 96.5%',
    nameTh: 'ทองรูปพรรณ 96.5%',
    badgeColor: 'from-orange-400 to-amber-600',
    accentColor: 'text-orange-400',
    chartColor: '#f97316',
    chartBgGradient: 'rgba(249, 115, 22, 0.2)',
    borderColor: 'border-orange-500/40',
    glyph: '💍',
    category: 'เครื่องประดับ / สมาคมค้าทองคำ',
    unitTh: 'บาทละ (15.16 กรัม)'
  },
  BAR9999: {
    id: 'BAR9999',
    symbol: 'GOLD 99.99%',
    name: 'Pure Gold 99.99% & 1kg',
    nameTh: 'ทองคำแท่ง 99.99% & 1 กก.',
    badgeColor: 'from-amber-300 to-yellow-500',
    accentColor: 'text-amber-300',
    chartColor: '#fbbf24',
    chartBgGradient: 'rgba(251, 191, 36, 0.2)',
    borderColor: 'border-amber-400/40',
    glyph: '★',
    category: 'มาตรฐานสากล LBMA 99.99%',
    unitTh: 'บาทละ / แท่ง 1 กิโลกรัม'
  }
};

const CRYPTO_CONFIG: Record<
  'BTC' | 'ETH' | 'BNB' | 'SOL',
  {
    symbol: 'BTC' | 'ETH' | 'BNB' | 'SOL';
    name: string;
    nameTh: string;
    badgeColor: string;
    accentColor: string;
    chartColor: string;
    chartBgGradient: string;
    borderColor: string;
    glyph: string;
    category: string;
    rank: number;
  }
> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    nameTh: 'บิตคอยน์',
    badgeColor: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-400',
    chartColor: '#f59e0b',
    chartBgGradient: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'border-amber-500/40',
    glyph: '₿',
    category: 'Digital Gold / Layer 1',
    rank: 1
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    nameTh: 'อีเธอเรียม',
    badgeColor: 'from-indigo-500 to-violet-600',
    accentColor: 'text-indigo-400',
    chartColor: '#818cf8',
    chartBgGradient: 'rgba(129, 140, 248, 0.15)',
    borderColor: 'border-indigo-500/40',
    glyph: 'Ξ',
    category: 'Smart Contracts / Layer 1',
    rank: 2
  },
  BNB: {
    symbol: 'BNB',
    name: 'BNB',
    nameTh: 'บีเอ็นบี',
    badgeColor: 'from-yellow-500 to-amber-600',
    accentColor: 'text-yellow-400',
    chartColor: '#facc15',
    chartBgGradient: 'rgba(250, 204, 21, 0.15)',
    borderColor: 'border-yellow-500/40',
    glyph: '❖',
    category: 'Ecosystem / BNB Chain',
    rank: 4
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    nameTh: 'โซลานา',
    badgeColor: 'from-cyan-500 to-emerald-600',
    accentColor: 'text-cyan-400',
    chartColor: '#06b6d4',
    chartBgGradient: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'border-cyan-500/40',
    glyph: '◈',
    category: 'High Speed / DeFi',
    rank: 5
  }
};

export default function App() {
  // Main Tab Navigation: 'gold' (unified), 'crypto', or 'securities' (stocks/funds/etf)
  const [mainTab, setMainTab] = useState<'gold' | 'crypto' | 'securities'>('gold');

  // Pinned securities state (persisted to localStorage)
  const [pinnedSecurityIds, setPinnedSecurityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asset_tracker_pinned_securities');
      return saved ? JSON.parse(saved) : ['sec-nvda', 'sec-spy', 'sec-ptt', 'sec-kusxndq'];
    } catch {
      return ['sec-nvda', 'sec-spy', 'sec-ptt', 'sec-kusxndq'];
    }
  });

  const handleTogglePin = useCallback((id: string) => {
    setPinnedSecurityIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('asset_tracker_pinned_securities', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save pinned securities to localStorage', e);
      }
      return next;
    });
  }, []);

  // Sub-selection inside Gold
  const [selectedGold, setSelectedGold] = useState<GoldType>('XAU');
  const [goldTimeframe, setGoldTimeframe] = useState<'SHORT' | '1M' | '1Y'>('SHORT');

  // Sub-selection inside Crypto
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'BNB' | 'SOL'>('BTC');
  const [cryptoTimeframe, setCryptoTimeframe] = useState<'24H' | '30D'>('24H');
  
  const [data, setData] = useState<MarketData>(initialMarketData);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [priceFlash, setPriceFlash] = useState<boolean>(false);

  // Gold Calculator state
  const [calcType, setCalcType] = useState<'96.5' | '99.99' | 'ornament'>('96.5');
  const [calcAmount, setCalcAmount] = useState<number>(5);
  const [calcUnit, setCalcUnit] = useState<'baht' | 'gram'>('baht');

  // Crypto Calculator state
  const [cryptoCalcSymbol, setCryptoCalcSymbol] = useState<'BTC' | 'ETH' | 'BNB' | 'SOL'>('BTC');
  const [cryptoCalcAmount, setCryptoCalcAmount] = useState<number>(1);

  const goldChartRef = useRef<HTMLCanvasElement | null>(null);
  const cryptoChartRef = useRef<HTMLCanvasElement | null>(null);
  const goldChartInstance = useRef<ChartJS | null>(null);
  const cryptoChartInstance = useRef<ChartJS | null>(null);

  // Fetch live market data (supports both Full-Stack Node.js backend and Static Hosting / PWA on asset.ntzsoft.net)
  const fetchLiveData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      let marketPayload: MarketData | null = null;
      const isInternalHost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname.endsWith('.run.app'));

      // 1. If running on internal Full-Stack Node server (e.g. dev/preview on Cloud Run), try backend route
      if (isInternalHost) {
        try {
          const res = await fetch('/api/gold-live');
          if (res.ok) {
            const json = await res.json();
            if (json && json.world && json.thai) {
              marketPayload = json;
            }
          }
        } catch {
          // Fall through to direct client fetch
        }
      }

      // 2. Direct client-side fetch (for static hosting on asset.ntzsoft.net, PWA standalone, or backend fallback)
      if (!marketPayload) {
        const cryptoSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];
        const [
          spotRes,
          klines1hRes,
          klines1dRes,
          thaiRes,
          fxRes,
          cryptoRes
        ] = await Promise.allSettled([
          fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT')
            .then(r => r.ok ? r.json() : null)
            .catch(() => null),
          fetch('https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1h&limit=24')
            .then(r => r.ok ? r.json() : null)
            .catch(() => null),
          fetch('https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1d&limit=30')
            .then(r => r.ok ? r.json() : null)
            .catch(() => null),
          fetch('https://api.chnwt.dev/thai-gold-api/latest')
            .then(r => r.ok ? r.json() : null)
            .catch(() => null),
          fetch('https://open.er-api.com/v6/latest/USD')
            .then(r => r.ok ? r.json() : null)
            .catch(() => null),
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(cryptoSymbols))}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        ]);

        const spotData = spotRes.status === 'fulfilled' ? spotRes.value : null;
        const klines1h = klines1hRes.status === 'fulfilled' && Array.isArray(klines1hRes.value) ? klines1hRes.value : [];
        const klines1d = klines1dRes.status === 'fulfilled' && Array.isArray(klines1dRes.value) ? klines1dRes.value : [];
        const thaiData = thaiRes.status === 'fulfilled' ? thaiRes.value : null;
        const fxData = fxRes.status === 'fulfilled' ? fxRes.value : null;
        const cryptoData = cryptoRes.status === 'fulfilled' && Array.isArray(cryptoRes.value) ? cryptoRes.value : [];

        const spot = spotData && !isNaN(parseFloat(spotData.lastPrice)) ? parseFloat(spotData.lastPrice) : 4626.00;
        const change = spotData && !isNaN(parseFloat(spotData.priceChange)) ? parseFloat(spotData.priceChange) : -10.25;
        const changePercent = spotData && !isNaN(parseFloat(spotData.priceChangePercent)) ? parseFloat(spotData.priceChangePercent) : -0.22;
        const high = spotData && !isNaN(parseFloat(spotData.highPrice)) ? parseFloat(spotData.highPrice) : Number((spot * 1.012).toFixed(2));
        const low = spotData && !isNaN(parseFloat(spotData.lowPrice)) ? parseFloat(spotData.lowPrice) : Number((spot * 0.988).toFixed(2));
        const bid = spotData && !isNaN(parseFloat(spotData.bidPrice)) ? parseFloat(spotData.bidPrice) : Number((spot - 0.50).toFixed(2));
        const ask = spotData && !isNaN(parseFloat(spotData.askPrice)) ? parseFloat(spotData.askPrice) : Number((spot + 0.50).toFixed(2));
        const open = spotData && !isNaN(parseFloat(spotData.openPrice)) ? parseFloat(spotData.openPrice) : Number((spot - change).toFixed(2));

        const usdThb = fxData && fxData.rates && !isNaN(parseFloat(fxData.rates.THB)) ? parseFloat(fxData.rates.THB) : 32.70;

        let tgBuy96 = 71750;
        let tgSell96 = 71950;
        let tgBuyOrn = 70312;
        let tgSellOrn = 72750;
        let tgUpdate = "ประกาศสมาคมค้าทองคำ (ล่าสุด)";
        let tgDate = new Date().toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });

        if (thaiData && thaiData.response && thaiData.response.price) {
          const p = thaiData.response.price;
          if (p.gold_bar) {
            tgBuy96 = parseFloat(p.gold_bar.buy.replace(/,/g, '')) || tgBuy96;
            tgSell96 = parseFloat(p.gold_bar.sell.replace(/,/g, '')) || tgSell96;
          }
          if (p.gold) {
            tgBuyOrn = parseFloat(p.gold.buy.replace(/,/g, '')) || tgBuyOrn;
            tgSellOrn = parseFloat(p.gold.sell.replace(/,/g, '')) || tgSellOrn;
          }
          if (thaiData.response.update_time) tgUpdate = thaiData.response.update_time;
          if (thaiData.response.update_date) tgDate = thaiData.response.update_date;
        } else {
          const calc965 = Math.round((spot * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
          tgBuy96 = calc965 - 100;
          tgSell96 = calc965;
          tgBuyOrn = Math.round(calc965 * 0.98);
          tgSellOrn = calc965 + 500;
        }

        const tgBuy99 = Math.round((tgSell96 * (99.99 / 96.5)) - 100);
        const tgSell99 = Math.round(tgSell96 * (99.99 / 96.5));

        const thaiTimeFmt = new Intl.DateTimeFormat('th-TH', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const thaiDateFmt = new Intl.DateTimeFormat('th-TH', {
          timeZone: 'Asia/Bangkok',
          day: 'numeric',
          month: 'short'
        });
        const thaiDayNameFmt = new Intl.DateTimeFormat('th-TH', {
          timeZone: 'Asia/Bangkok',
          weekday: 'short'
        });

        const nowTs = Date.now();
        const clientWorld24hLabels: string[] = [];
        const clientWorld24hPrices: number[] = [];

        if (klines1h.length > 0) {
          klines1h.forEach((k: any) => {
            const time = new Date(k[0]);
            clientWorld24hLabels.push(`${thaiTimeFmt.format(time)} น.`);
            clientWorld24hPrices.push(parseFloat(k[4]));
          });
        } else {
          for (let i = 24; i >= 0; i -= 3) {
            const d = new Date(nowTs - i * 3600 * 1000);
            clientWorld24hLabels.push(`${thaiTimeFmt.format(d)} น.`);
            clientWorld24hPrices.push(spot - (Math.sin(i) * 15));
          }
        }

        const clientWorld30dLabels: string[] = [];
        const clientWorld30dPrices: number[] = [];
        if (klines1d.length > 0) {
          klines1d.forEach((k: any) => {
            const d = new Date(k[0]);
            clientWorld30dLabels.push(thaiDateFmt.format(d));
            clientWorld30dPrices.push(parseFloat(k[4]));
          });
        } else {
          ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'].forEach((lbl, idx) => {
            clientWorld30dLabels.push(lbl);
            clientWorld30dPrices.push(spot - (3 - idx) * 40);
          });
        }

        const clientThai7dLabels: string[] = [];
        const clientThai7dPrices: number[] = [];
        const clientThai1mLabels: string[] = [];
        const clientThai1mPrices: number[] = [];

        if (klines1d.length >= 7) {
          const last7 = klines1d.slice(-7);
          last7.forEach((k: any, idx: number) => {
            const d = new Date(k[0]);
            if (idx === last7.length - 1) {
              clientThai7dLabels.push("วันนี้");
            } else {
              clientThai7dLabels.push(`${thaiDayNameFmt.format(d)} (${thaiDateFmt.format(d)})`);
            }
            const p965 = Math.round((parseFloat(k[4]) * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
            clientThai7dPrices.push(p965);
          });
          if (clientThai7dPrices.length > 0) {
            clientThai7dPrices[clientThai7dPrices.length - 1] = tgSell96;
          }
        } else {
          ['6 วันก่อน', '5 วันก่อน', '4 วันก่อน', '3 วันก่อน', '2 วันก่อน', 'เมื่อวาน', 'วันนี้'].forEach((lbl, idx) => {
            clientThai7dLabels.push(lbl);
            clientThai7dPrices.push(tgSell96 - (6 - idx) * 60);
          });
        }

        if (klines1d.length > 0) {
          klines1d.forEach((k: any) => {
            const d = new Date(k[0]);
            clientThai1mLabels.push(thaiDateFmt.format(d));
            const p965 = Math.round((parseFloat(k[4]) * usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50;
            clientThai1mPrices.push(p965);
          });
        } else {
          ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'].forEach((lbl, idx) => {
            clientThai1mLabels.push(lbl);
            clientThai1mPrices.push(tgSell96 - (3 - idx) * 750);
          });
        }

        // Crypto mapping
        const cryptoTickerMap: Record<string, any> = {};
        cryptoData.forEach((c: any) => {
          if (c && c.symbol) cryptoTickerMap[c.symbol] = c;
        });

        const makeClientCrypto = (sym: 'BTC' | 'ETH' | 'BNB' | 'SOL', name: string, nameTh: string, raw: string, fb: number): CryptoAsset => {
          const t = cryptoTickerMap[raw];
          const p = t && !isNaN(parseFloat(t.lastPrice)) ? parseFloat(t.lastPrice) : fb;
          const c24 = t && !isNaN(parseFloat(t.priceChange)) ? parseFloat(t.priceChange) : 0;
          const cp24 = t && !isNaN(parseFloat(t.priceChangePercent)) ? parseFloat(t.priceChangePercent) : 0;
          const h24 = t && !isNaN(parseFloat(t.highPrice)) ? parseFloat(t.highPrice) : p * 1.02;
          const l24 = t && !isNaN(parseFloat(t.lowPrice)) ? parseFloat(t.lowPrice) : p * 0.98;
          const v = t && !isNaN(parseFloat(t.quoteVolume || t.volume)) ? parseFloat(t.quoteVolume || t.volume) : 500000000;

          return {
            symbol: sym,
            name,
            nameTh,
            rawSymbol: raw,
            price: p,
            priceThb: p * usdThb,
            change24h: c24,
            changePercent24h: cp24,
            high24h: h24,
            low24h: l24,
            volumeUsdt: v,
            charts: {
              '24H': {
                labels: ['00:00 น.', '06:00 น.', '12:00 น.', '18:00 น.', 'ปัจจุบัน'],
                prices: [p - c24, p - (c24 * 0.5), p + (c24 * 0.2), p - (c24 * 0.1), p]
              },
              '30D': {
                labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'ปัจจุบัน'],
                prices: [p * 0.94, p * 0.97, p * 0.96, p]
              }
            }
          };
        };

        const clientCrypto = {
          BTC: makeClientCrypto('BTC', 'Bitcoin', 'บิตคอยน์', 'BTCUSDT', 78800),
          ETH: makeClientCrypto('ETH', 'Ethereum', 'อีเธอเรียม', 'ETHUSDT', 2450),
          BNB: makeClientCrypto('BNB', 'BNB', 'บีเอ็นบี', 'BNBUSDT', 695),
          SOL: makeClientCrypto('SOL', 'Solana', 'โซลานา', 'SOLUSDT', 97)
        };

        marketPayload = {
          timestamp: nowTs,
          serverTime: new Date().toISOString(),
          world: {
            spot,
            change,
            changePercent,
            high24h: high,
            low24h: low,
            bid,
            ask,
            open,
            spread: (ask - bid).toFixed(2),
            charts: {
              '1D': {
                labels: clientWorld24hLabels,
                prices: clientWorld24hPrices
              },
              '1M': {
                labels: clientWorld30dLabels,
                prices: clientWorld30dPrices
              },
              '1Y': {
                labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
                prices: [
                  Math.round(spot * 0.78),
                  Math.round(spot * 0.81),
                  Math.round(spot * 0.85),
                  Math.round(spot * 0.84),
                  Math.round(spot * 0.87),
                  Math.round(spot * 0.94),
                  Math.round(spot * 0.92),
                  Math.round(spot * 0.96),
                  Math.round(spot * 0.93),
                  Math.round(spot * 0.97),
                  Math.round(spot * 0.98),
                  spot
                ]
              }
            }
          },
          thai: {
            goldBar965: { buy: tgBuy96, sell: tgSell96 },
            goldOrnament965: { buy: tgBuyOrn, sell: tgSellOrn },
            gold9999: { buy: tgBuy99, sell: tgSell99 },
            gold1kg: { buy: Math.round(tgBuy99 * (1000 / 15.244)), sell: Math.round(tgSell99 * (1000 / 15.244)) },
            updateInfo: tgUpdate,
            updateDate: tgDate,
            charts: {
              '7D': {
                labels: clientThai7dLabels,
                prices: clientThai7dPrices
              },
              '1M': {
                labels: clientThai1mLabels,
                prices: clientThai1mPrices
              },
              '1Y': {
                labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
                prices: [
                  tgSell96 - 9200,
                  tgSell96 - 8400,
                  tgSell96 - 7100,
                  tgSell96 - 6500,
                  tgSell96 - 5200,
                  tgSell96 - 2800,
                  tgSell96 - 3200,
                  tgSell96 - 1800,
                  tgSell96 - 2400,
                  tgSell96 - 1200,
                  tgSell96 - 600,
                  tgSell96
                ]
              }
            }
          },
          crypto: clientCrypto,
          forex: {
            usdThb,
            goldSilverRatio: 84.5
          }
        };
      }

      if (marketPayload) {
        setData(marketPayload);
        setPriceFlash(true);
        setTimeout(() => setPriceFlash(false), 800);
      }
    } catch (err) {
      console.error('Failed to sync live data:', err);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
      const now = new Date();
      const timeInThai = now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(`${timeInThai} น.`);
    }
  }, []);

  // Poll data every 10 seconds for real-time rates
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(() => {
      fetchLiveData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Unified Gold Chart Renderer (Supports XAU, BAR965, ORN965, BAR9999)
  useEffect(() => {
    if (mainTab !== 'gold') return;
    if (!goldChartRef.current) return;

    if (goldChartInstance.current) {
      goldChartInstance.current.destroy();
    }

    const ctx = goldChartRef.current.getContext('2d');
    if (!ctx) return;

    const goldConfig = GOLD_CONFIG[selectedGold];
    let chartLabels: string[] = [];
    let chartPrices: number[] = [];
    let isUSD = false;
    let labelText = '';

    if (selectedGold === 'XAU') {
      isUSD = true;
      labelText = 'XAU/USD (Spot Gold)';
      if (goldTimeframe === 'SHORT') {
        chartLabels = data.world.charts['1D'].labels;
        chartPrices = data.world.charts['1D'].prices;
      } else if (goldTimeframe === '1M') {
        chartLabels = data.world.charts['1M'].labels;
        chartPrices = data.world.charts['1M'].prices;
      } else {
        chartLabels = data.world.charts['1Y']?.labels || ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
        chartPrices = data.world.charts['1Y']?.prices || [3610, 3750, 3920, 3880, 4020, 4350, 4250, 4450, 4310, 4490, 4540, data.world.spot];
      }
    } else {
      isUSD = false;
      const thaiChartObj = goldTimeframe === 'SHORT'
        ? data.thai.charts['7D']
        : goldTimeframe === '1M'
        ? data.thai.charts['1M']
        : (data.thai.charts['1Y'] || {
            labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
            prices: [62750, 63550, 64850, 65450, 66750, 69150, 68750, 70150, 69550, 70750, 71350, data.thai.goldBar965.sell]
          });

      const basePrices = thaiChartObj.prices;
      chartLabels = thaiChartObj.labels;

      if (selectedGold === 'BAR965') {
        labelText = 'ราคาทองคำแท่ง 96.5% (บาท)';
        chartPrices = basePrices;
      } else if (selectedGold === 'ORN965') {
        labelText = 'ราคาทองรูปพรรณ 96.5% (ขายออก)';
        // Ornament sell price is typically +800 baht over bar sell
        chartPrices = basePrices.map(p => p + 800);
      } else if (selectedGold === 'BAR9999') {
        labelText = 'ราคาทองคำแท่ง 99.99% (บาท)';
        // 99.99% calculated proportion
        chartPrices = basePrices.map(p => Math.round(p * (99.99 / 96.5)));
      }
    }

    const isPositive = selectedGold === 'XAU' ? data.world.changePercent >= 0 : true;
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, goldConfig.chartBgGradient);
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

    goldChartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: labelText,
          data: chartPrices,
          borderColor: goldConfig.chartColor,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: chartPrices.length > 15 ? 0 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: goldConfig.chartColor,
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          fill: true,
          backgroundColor: gradient,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#94a3b8',
            bodyColor: '#facc15',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                if (isUSD) {
                  const usd = context.parsed.y;
                  const thb = (usd * data.forex.usdThb * 0.965 * 15.244) / 31.1035;
                  return [
                    `ราคาโลก: $${usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} / oz`,
                    `ประมาณการทองไทย: ≈ ฿${Math.round(thb / 50) * 50} บาท`
                  ];
                } else {
                  return `ราคา: ฿${Number(context.parsed.y).toLocaleString()} บาท`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (val) => isUSD ? `$${Number(val).toLocaleString()}` : `${Number(val).toLocaleString()} ฿`
            }
          }
        }
      }
    });

    return () => {
      if (goldChartInstance.current) goldChartInstance.current.destroy();
    };
  }, [mainTab, selectedGold, goldTimeframe, data.world, data.thai, data.forex.usdThb]);

  // Crypto Chart Renderer (BTC, ETH, BNB, SOL)
  useEffect(() => {
    if (mainTab !== 'crypto') return;
    if (!cryptoChartRef.current) return;

    if (cryptoChartInstance.current) {
      cryptoChartInstance.current.destroy();
    }

    const ctx = cryptoChartRef.current.getContext('2d');
    if (!ctx) return;

    const currentCrypto = data.crypto[selectedCrypto] || initialMarketData.crypto[selectedCrypto];
    const chartData = cryptoTimeframe === '24H' ? currentCrypto.charts['24H'] : currentCrypto.charts['30D'];
    const config = CRYPTO_CONFIG[selectedCrypto];

    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, config.chartBgGradient);
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

    cryptoChartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: `${currentCrypto.name} (${currentCrypto.symbol}/USDT)`,
          data: chartData.prices,
          borderColor: config.chartColor,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: chartData.prices.length > 15 ? 0 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: config.chartColor,
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          fill: true,
          backgroundColor: gradient,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const usd = context.parsed.y;
                const thb = usd * data.forex.usdThb;
                return [
                  `ราคา: $${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  `เทียบเงินบาท: ≈ ฿${Math.round(thb).toLocaleString()} บาท`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (val) => `$${Number(val).toLocaleString()}`
            }
          }
        }
      }
    });

    return () => {
      if (cryptoChartInstance.current) cryptoChartInstance.current.destroy();
    };
  }, [mainTab, selectedCrypto, cryptoTimeframe, data.crypto, data.forex.usdThb]);

  // Selected Gold Stats & Pricing Calculations
  const activeGoldConfig = GOLD_CONFIG[selectedGold];
  const isWorldPositive = data.world.changePercent >= 0;
  const dayRangePct = Math.min(100, Math.max(0, Math.round(((data.world.spot - data.world.low24h) / Math.max(1, data.world.high24h - data.world.low24h)) * 100)));

  // Gold Calculator Value Calculations
  let goldRateForCalc = data.thai.goldBar965.sell;
  let goldBuyRateForCalc = data.thai.goldBar965.buy;
  if (calcType === '99.99') {
    goldRateForCalc = data.thai.gold9999.sell;
    goldBuyRateForCalc = data.thai.gold9999.buy;
  } else if (calcType === 'ornament') {
    goldRateForCalc = data.thai.goldOrnament965.sell;
    goldBuyRateForCalc = data.thai.goldOrnament965.buy;
  }

  const weightInBaht = calcUnit === 'baht' ? (calcAmount || 0) : (calcAmount || 0) / 15.244;
  const calcGoldTotalSell = Math.round(weightInBaht * goldRateForCalc);
  const calcGoldTotalBuy = Math.round(weightInBaht * goldBuyRateForCalc);

  // Selected crypto metrics
  const activeCryptoData = data.crypto[selectedCrypto] || initialMarketData.crypto[selectedCrypto];
  const isCryptoPositive = activeCryptoData.changePercent24h >= 0;
  const cryptoRangePct = Math.min(100, Math.max(0, Math.round(((activeCryptoData.price - activeCryptoData.low24h) / Math.max(0.01, activeCryptoData.high24h - activeCryptoData.low24h)) * 100)));

  // Crypto conversion calculations
  const calcCryptoAsset = data.crypto[cryptoCalcSymbol] || initialMarketData.crypto[cryptoCalcSymbol];
  const cryptoConvertedUSD = (cryptoCalcAmount || 0) * calcCryptoAsset.price;
  const cryptoConvertedTHB = cryptoConvertedUSD * data.forex.usdThb;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header id="main-header" className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Title & Brand */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
                      Gold & Asset <span className="text-amber-400">Tracker</span>
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Feed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">ราคาทองคำแท้รวมศูนย์ & คริปโตเรียลไทม์ (เลือกดูได้ในหน้าเดียว)</p>
                </div>
              </div>

              {/* Mobile Refresh */}
              <button
                onClick={() => fetchLiveData(true)}
                disabled={isRefreshing}
                className="sm:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                aria-label="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>

            {/* Live Status, USD/THB Rate & Desktop Refresh */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              {/* USD/THB Exchange Rate in Navbar */}
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium">USD/THB:</span>
                  <span className="font-bold text-amber-400 font-mono text-xs sm:text-sm">฿{data.forex.usdThb.toFixed(2)}</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  Live FX
                </span>
              </div>

              {/* Live Sync Status */}
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-xs">
                  <span className="text-slate-400 hidden md:inline">อัปเดต:</span>
                  <span className="font-semibold text-slate-200 md:ml-1 font-mono">{lastSyncTime || 'กำลังดึงข้อมูล...'}</span>
                </div>
              </div>

              {/* PWA Install Button */}
              <PWAInstallButton variant="header" />

              <button
                onClick={() => fetchLiveData(true)}
                disabled={isRefreshing}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all hover:border-slate-600 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'กำลังอัปเดต...' : 'รีเฟรชราคา'}</span>
              </button>
            </div>

          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* MAIN TABS NAVIGATION: FULL-WIDTH PROMINENT SEGMENTED CONTROL */}
          <section id="tabs-navigation" className="space-y-3">
            
            {/* Full-Width 3-Column Prominent Tab Buttons */}
            <div 
              role="tablist"
              aria-label="Main Asset Hub Selection"
              className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 p-1.5 sm:p-2 bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
              
              {/* Main Tab 1: Unified Gold (ทองคำรวมศูนย์) */}
              <button
                id="main-tab-btn-gold"
                onClick={() => setMainTab('gold')}
                role="tab"
                aria-selected={mainTab === 'gold'}
                className={`relative flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl transition-all duration-200 cursor-pointer border text-left group overflow-hidden ${
                  mainTab === 'gold'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 border-amber-300 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow ${
                    mainTab === 'gold'
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-900 border border-slate-700 text-amber-400'
                  }`}>
                    <Coins className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-80">
                      ศูนย์ข้อมูลทองคำ
                    </span>
                    <span className={`block text-sm sm:text-base font-extrabold truncate ${mainTab === 'gold' ? 'text-slate-950' : 'text-white'}`}>
                      ราคาทองคำ (Gold Hub)
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 ml-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-black ${
                    mainTab === 'gold'
                      ? 'bg-slate-950/20 text-slate-950 border border-slate-950/20'
                      : 'bg-slate-900/90 text-amber-400 border border-slate-700'
                  }`}>
                    4 ประเภท
                  </span>
                </div>
              </button>

              {/* Main Tab 2: Crypto (คริปโตเคอร์เรนซี) */}
              <button
                id="main-tab-btn-crypto"
                onClick={() => setMainTab('crypto')}
                role="tab"
                aria-selected={mainTab === 'crypto'}
                className={`relative flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl transition-all duration-200 cursor-pointer border text-left group overflow-hidden ${
                  mainTab === 'crypto'
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 border-orange-300 shadow-xl shadow-orange-500/25 ring-2 ring-orange-400/50 scale-[1.01]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow ${
                    mainTab === 'crypto'
                      ? 'bg-slate-950 text-orange-400'
                      : 'bg-slate-900 border border-slate-700 text-orange-400'
                  }`}>
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-80">
                      ตลาดคริปโตสปอต
                    </span>
                    <span className={`block text-sm sm:text-base font-extrabold truncate ${mainTab === 'crypto' ? 'text-slate-950' : 'text-white'}`}>
                      คริปโตเคอร์เรนซี (Crypto)
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-black flex items-center gap-1 ${
                    mainTab === 'crypto'
                      ? 'bg-slate-950/20 text-slate-950 border border-slate-950/20'
                      : 'bg-slate-900/90 text-orange-400 border border-slate-700'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ค้นหา & ปักหมุด</span>
                  </span>
                </div>
              </button>

              {/* Main Tab 3: Stocks, Funds & ETFs (หุ้น / กองทุน / ETF พร้อมระบบค้นหาและ Pin) */}
              <button
                id="main-tab-btn-securities"
                onClick={() => setMainTab('securities')}
                role="tab"
                aria-selected={mainTab === 'securities'}
                className={`relative flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl transition-all duration-200 cursor-pointer border text-left group overflow-hidden ${
                  mainTab === 'securities'
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-indigo-300 shadow-xl shadow-indigo-500/30 ring-2 ring-indigo-400/50 scale-[1.01]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow ${
                    mainTab === 'securities'
                      ? 'bg-slate-950 text-indigo-300'
                      : 'bg-slate-900 border border-slate-700 text-indigo-400'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-80">
                      หุ้นสหรัฐฯ / หุ้นไทย / กองทุน
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold truncate text-white">
                      หุ้น / กองทุน / ETF
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-black flex items-center gap-1 ${
                    mainTab === 'securities'
                      ? 'bg-slate-950/30 text-white border border-white/20'
                      : 'bg-slate-900/90 text-indigo-300 border border-slate-700'
                  }`}>
                    <Pin className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>{pinnedSecurityIds.length} ปักหมุด</span>
                  </span>
                </div>
              </button>

            </div>

            {/* Status & Subtitle Bar (แถบข้อมูลสถานะใต้แถบเมนู) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0 ring-4 ring-amber-400/20" />
                <span className="font-medium text-slate-200">
                  {mainTab === 'gold' && `${data.thai.updateInfo} (${data.thai.updateDate}) • Spot XAU/USD Real-time`}
                  {mainTab === 'crypto' && `ข้อมูล Binance Spot Real-time • ค้นหาและปักหมุดเหรียญใดก็ได้ในตลาดโลก • เวลาไทย UTC+7`}
                  {mainTab === 'securities' && `ตลาดหุ้นสหรัฐฯ, หุ้นไทย SET, กองทุนรวม & ETF • ค้นหาและปักหมุดส่วนตัว`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono self-end sm:self-auto bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                <span>อัตราอ้างอิง: 1 USD ≈ ฿{data.forex.usdThb.toFixed(2)} THB</span>
              </div>
            </div>

          </section>

          {/* ========================================================================= */}
          {/* TAB 1: UNIFIED GOLD HUB (ทองคำรวมศูนย์ - กดเลือกได้ 4 แบบ) */}
          {/* ========================================================================= */}
          {mainTab === 'gold' && (
            <section id="unified-gold-view" className="space-y-6">
              
              {/* 4 GOLD SELECTOR CARDS (แบบเดียวกับ Crypto) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. XAU/USD */}
                <button
                  onClick={() => setSelectedGold('XAU')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    selectedGold === 'XAU'
                      ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                        ✦
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base">XAU/USD</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">ตลาดโลก</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">Spot Gold</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isWorldPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isWorldPositive ? '▲ +' : '▼ '}{data.world.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xl sm:text-2xl font-black text-white font-mono">
                      ${data.world.spot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ≈ ฿{Math.round((data.world.spot * data.forex.usdThb * 0.965 * 15.244) / 31.1035 / 50) * 50} / บาททอง
                    </p>
                  </div>
                </button>

                {/* 2. ทองคำแท่ง 96.5% */}
                <button
                  onClick={() => setSelectedGold('BAR965')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    selectedGold === 'BAR965'
                      ? 'bg-gradient-to-b from-yellow-500/20 to-slate-900 border-yellow-400 ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-500/10'
                      : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                        ▮
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base">ทองแท่ง 96.5%</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-yellow-400/10 text-yellow-300 border border-yellow-400/20">สมาคมฯ</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">Thai Gold Bar</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      ขายออก
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">
                      ฿{data.thai.goldBar965.sell.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      รับซื้อ: ฿{data.thai.goldBar965.buy.toLocaleString()} บาท
                    </p>
                  </div>
                </button>

                {/* 3. ทองรูปพรรณ 96.5% */}
                <button
                  onClick={() => setSelectedGold('ORN965')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    selectedGold === 'ORN965'
                      ? 'bg-gradient-to-b from-orange-500/20 to-slate-900 border-orange-400 ring-2 ring-orange-400/40 shadow-lg shadow-orange-500/10'
                      : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                        💍
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base">ทองรูปพรรณ 96.5%</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">Gold Ornament</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      ขายออก
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xl sm:text-2xl font-black text-orange-400 font-mono">
                      ฿{data.thai.goldOrnament965.sell.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ฐานภาษี/รับซื้อ: ฿{data.thai.goldOrnament965.buy.toLocaleString()} บาท
                    </p>
                  </div>
                </button>

                {/* 4. ทองคำแท่ง 99.99% & 1 KG */}
                <button
                  onClick={() => setSelectedGold('BAR9999')}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    selectedGold === 'BAR9999'
                      ? 'bg-gradient-to-b from-amber-400/20 to-slate-900 border-amber-300 ring-2 ring-amber-300/40 shadow-lg shadow-amber-400/10'
                      : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                        ★
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base">ทองคำ 99.99%</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">LBMA</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">Pure 99.99% & 1kg</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      บริสุทธิ์
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                      ฿{data.thai.gold9999.sell.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      แท่ง 1 กิโลกรัม: ฿{data.thai.gold1kg.sell.toLocaleString()}
                    </p>
                  </div>
                </button>

              </div>

              {/* MAIN GOLD CHART & KPI ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Columns: Dynamic Gold Chart */}
                <div className="lg:col-span-2 bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{activeGoldConfig.glyph}</span>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          กราฟแนวโน้ม {activeGoldConfig.nameTh}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          {selectedGold === 'XAU' ? (goldTimeframe === 'SHORT' ? '24 ชม. (เวลาไทย UTC+7)' : '30 วัน') : (goldTimeframe === 'SHORT' ? '7 วันล่าสุด' : '30 วัน')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedGold === 'XAU' ? 'ราคาตลาดโลก ดอลลาร์สหรัฐต่อทรอยออนซ์ (USD/oz) • แสดงเวลาไทย' : 'ราคาทองคำมาตรฐานสมาคมค้าทองคำแห่งประเทศไทย (บาท)'}
                      </p>
                    </div>

                    {/* Timeframe selector */}
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
                      <button
                        onClick={() => setGoldTimeframe('SHORT')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          goldTimeframe === 'SHORT'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {selectedGold === 'XAU' ? '24 ชม.' : '7 วัน'}
                      </button>
                      <button
                        onClick={() => setGoldTimeframe('1M')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          goldTimeframe === '1M'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        30 วัน
                      </button>
                      <button
                        onClick={() => setGoldTimeframe('1Y')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          goldTimeframe === '1Y'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        1 ปี (รายเดือน)
                      </button>
                    </div>
                  </div>

                  {/* Chart canvas */}
                  <div className="relative w-full h-72 sm:h-80 md:h-96">
                    <canvas ref={goldChartRef} id="goldUnifiedChartCanvas" />
                  </div>

                  {/* Range Meter & High/Low */}
                  <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    {selectedGold === 'XAU' ? (
                      <>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <div>
                            <span className="text-slate-400">ต่ำสุด 24 ชม.:</span>
                            <span className="font-bold text-rose-400 ml-1 font-mono">${data.world.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="hidden sm:block text-slate-600">|</div>
                          <div>
                            <span className="text-slate-400">สูงสุด 24 ชม.:</span>
                            <span className="font-bold text-emerald-400 ml-1 font-mono">${data.world.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        <div className="w-full sm:w-56 flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                            <span>Day Range Position</span>
                            <span className="text-amber-400 font-semibold">{dayRangePct}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/80">
                            <div className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${dayRangePct}%` }} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-slate-300 font-medium">ประกาศสมาคมค้าทองคำ:</span>
                            <span className="font-bold text-amber-400">{data.thai.updateInfo}</span>
                          </div>
                        </div>
                        <div className="text-slate-400 flex items-center gap-2">
                          <span>อัตราแลกเปลี่ยนอ้างอิง:</span>
                          <span className="font-mono font-bold text-slate-200">฿{data.forex.usdThb.toFixed(2)} / USD</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right 1 Column: Active Gold Stat Cards */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  
                  {/* Selected Gold Main Price Card */}
                  <div className={`bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 border-l-4 ${activeGoldConfig.borderColor} relative overflow-hidden shadow-xl`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs uppercase tracking-wider font-semibold ${activeGoldConfig.accentColor}`}>{activeGoldConfig.name}</span>
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">Real-time</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                        {selectedGold === 'XAU' ? `$${data.world.spot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `฿${(selectedGold === 'BAR965' ? data.thai.goldBar965.sell : selectedGold === 'ORN965' ? data.thai.goldOrnament965.sell : data.thai.gold9999.sell).toLocaleString()}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {selectedGold === 'XAU' ? '/ oz' : '/ บาท'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {selectedGold === 'XAU' ? (
                        <>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs border ${
                            isWorldPositive 
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}>
                            {isWorldPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {isWorldPositive ? '+' : ''}{data.world.change.toFixed(2)} ({isWorldPositive ? '+' : ''}{data.world.changePercent.toFixed(2)}%)
                          </span>
                          <span className="text-xs text-slate-400">เทียบ 24 ชม.</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">ส่วนต่างรับซื้อ-ขายออก:</span>
                          <span className="font-mono font-bold text-amber-400">
                            ฿{(
                              selectedGold === 'BAR965' 
                                ? (data.thai.goldBar965.sell - data.thai.goldBar965.buy) 
                                : selectedGold === 'ORN965' 
                                ? (data.thai.goldOrnament965.sell - data.thai.goldOrnament965.buy) 
                                : (data.thai.gold9999.sell - data.thai.gold9999.buy)
                            ).toLocaleString()} บาท
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buy / Sell Price Breakdown */}
                  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        {selectedGold === 'XAU' ? 'ราคา Bid & Ask (เสนอซื้อ-ขาย)' : 'ราคารับซื้อ - ราคาขายออก (สมาคมฯ)'}
                      </h3>
                      <span className="text-[11px] font-mono text-amber-400/90">
                        {selectedGold === 'XAU' ? `Spread: $${data.world.spread}` : 'บาทละ 15.244 กรัม'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-slate-400 font-medium block">
                          {selectedGold === 'XAU' ? 'Bid (รับซื้อ)' : 'ราคารับซื้อ (Buy)'}
                        </span>
                        <p className="text-lg sm:text-xl font-bold text-slate-100 mt-1 font-mono">
                          {selectedGold === 'XAU' 
                            ? `$${data.world.bid.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                            : `฿${(selectedGold === 'BAR965' ? data.thai.goldBar965.buy : selectedGold === 'ORN965' ? data.thai.goldOrnament965.buy : data.thai.gold9999.buy).toLocaleString()}`}
                        </p>
                        <span className="text-[10px] text-slate-400">{selectedGold === 'ORN965' ? 'ฐานภาษีรับซื้อ' : 'ราคาหน้าร้าน'}</span>
                      </div>

                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-amber-300 font-medium block">
                          {selectedGold === 'XAU' ? 'Ask (เสนอขาย)' : 'ราคาขายออก (Sell)'}
                        </span>
                        <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1 font-mono">
                          {selectedGold === 'XAU' 
                            ? `$${data.world.ask.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                            : `฿${(selectedGold === 'BAR965' ? data.thai.goldBar965.sell : selectedGold === 'ORN965' ? data.thai.goldOrnament965.sell : data.thai.gold9999.sell).toLocaleString()}`}
                        </p>
                        <span className="text-[10px] text-slate-400">ราคากลางประกาศ</span>
                      </div>
                    </div>
                  </div>

                  {/* Standard & Specs */}
                  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">ข้อมูลมาตรฐานทองคำ</h3>
                      <span className="text-xs text-slate-400">{activeGoldConfig.category}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ความบริสุทธิ์:</span>
                        <span className="font-bold text-slate-200">
                          {selectedGold === 'XAU' ? '99.5% - 99.99% (Good Delivery)' : selectedGold === 'BAR9999' ? '99.99% (LBMA Standard)' : '96.5% (มาตรฐานไทย)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">หน่วยน้ำหนัก:</span>
                        <span className="font-bold text-slate-200">{activeGoldConfig.unitTh}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400">ทอง 1 กิโลกรัม (ประมาณ 65.6 บาท):</span>
                        <span className="font-bold text-amber-400 font-mono">
                          ฿{data.thai.gold1kg.sell.toLocaleString()} บาท
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* COMPREHENSIVE GOLD COMPARISON TABLE */}
              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">ตารางสรุปราคาทองคำทุกประเภท (คลิกเพื่อเลือกดูกราฟ)</h3>
                  </div>
                  <span className="text-xs text-slate-400">อ้างอิงประกาศล่าสุด</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                        <th className="pb-3 pl-2">ประเภททองคำ</th>
                        <th className="pb-3 text-right">ราคารับซื้อ (Buy)</th>
                        <th className="pb-3 text-right">ราคาขายออก (Sell)</th>
                        <th className="pb-3 text-right">ส่วนต่าง (Spread)</th>
                        <th className="pb-3 text-center">หน่วย</th>
                        <th className="pb-3 text-center">เลือกดู</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      
                      {/* Row 1: XAU/USD */}
                      <tr 
                        onClick={() => setSelectedGold('XAU')}
                        className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${selectedGold === 'XAU' ? 'bg-amber-500/10' : ''}`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div>
                              <span className="font-bold text-white block">ทองคำโลก Spot Gold (XAU/USD)</span>
                              <span className="text-[11px] text-slate-400">ตลาดสากล (USD/Troy Ounce)</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-slate-300">
                          ${data.world.bid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-amber-400">
                          ${data.world.ask.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          ${data.world.spread}
                        </td>
                        <td className="py-3.5 text-center text-slate-400">ทรอยออนซ์</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${selectedGold === 'XAU' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                            {selectedGold === 'XAU' ? 'กำลังดู' : 'เลือก'}
                          </span>
                        </td>
                      </tr>

                      {/* Row 2: ทองคำแท่ง 96.5% */}
                      <tr 
                        onClick={() => setSelectedGold('BAR965')}
                        className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${selectedGold === 'BAR965' ? 'bg-amber-500/10' : ''}`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div>
                              <span className="font-bold text-white block">ทองคำแท่ง 96.5% (Thai Gold Bar)</span>
                              <span className="text-[11px] text-slate-400">สมาคมค้าทองคำ (มาตรฐานไทย)</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-slate-300">
                          ฿{data.thai.goldBar965.buy.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-yellow-400">
                          ฿{data.thai.goldBar965.sell.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          ฿{(data.thai.goldBar965.sell - data.thai.goldBar965.buy).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-center text-slate-400">บาททอง (15.244 กรัม)</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${selectedGold === 'BAR965' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                            {selectedGold === 'BAR965' ? 'กำลังดู' : 'เลือก'}
                          </span>
                        </td>
                      </tr>

                      {/* Row 3: ทองรูปพรรณ 96.5% */}
                      <tr 
                        onClick={() => setSelectedGold('ORN965')}
                        className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${selectedGold === 'ORN965' ? 'bg-amber-500/10' : ''}`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                            <div>
                              <span className="font-bold text-white block">ทองรูปพรรณ 96.5% (Ornament)</span>
                              <span className="text-[11px] text-slate-400">สมาคมค้าทองคำ (เครื่องประดับ)</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-slate-300">
                          ฿{data.thai.goldOrnament965.buy.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-orange-400">
                          ฿{data.thai.goldOrnament965.sell.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          ฿{(data.thai.goldOrnament965.sell - data.thai.goldOrnament965.buy).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-center text-slate-400">บาททอง (15.16 กรัม)</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${selectedGold === 'ORN965' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                            {selectedGold === 'ORN965' ? 'กำลังดู' : 'เลือก'}
                          </span>
                        </td>
                      </tr>

                      {/* Row 4: ทองคำแท่ง 99.99% */}
                      <tr 
                        onClick={() => setSelectedGold('BAR9999')}
                        className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${selectedGold === 'BAR9999' ? 'bg-amber-500/10' : ''}`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                            <div>
                              <span className="font-bold text-white block">ทองคำแท่ง 99.99% (Pure Gold)</span>
                              <span className="text-[11px] text-slate-400">มาตรฐานสากล LBMA</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-slate-300">
                          ฿{data.thai.gold9999.buy.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-amber-300">
                          ฿{data.thai.gold9999.sell.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          ฿{(data.thai.gold9999.sell - data.thai.gold9999.buy).toLocaleString()}
                        </td>
                        <td className="py-3.5 text-center text-slate-400">บาททอง / แท่ง 1 กก.</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${selectedGold === 'BAR9999' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                            {selectedGold === 'BAR9999' ? 'กำลังดู' : 'เลือก'}
                          </span>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

              {/* GOLD CALCULATOR & CONVERTER */}
              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">เครื่องคำนวณมูลค่าทองคำ (Gold Value Calculator)</h3>
                      <p className="text-xs text-slate-400">คำนวณมูลค่าซื้อ-ขายตามน้ำหนักบาท หรือกรัม ได้อย่างแม่นยำ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setCalcType('96.5')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        calcType === '96.5' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ทองแท่ง 96.5%
                    </button>
                    <button
                      onClick={() => setCalcType('ornament')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        calcType === 'ornament' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ทองรูปพรรณ
                    </button>
                    <button
                      onClick={() => setCalcType('99.99')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        calcType === '99.99' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ทอง 99.99%
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      ระบุน้ำหนักทองคำ
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-mono font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        placeholder="ระบุน้ำหนัก"
                      />
                      <div className="absolute right-2 top-2 flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() => setCalcUnit('baht')}
                          className={`px-2 py-0.5 text-xs font-semibold rounded ${calcUnit === 'baht' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                        >
                          บาท
                        </button>
                        <button
                          onClick={() => setCalcUnit('gram')}
                          className={`px-2 py-0.5 text-xs font-semibold rounded ${calcUnit === 'gram' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                        >
                          กรัม
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {[1, 2, 5, 10, 20].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setCalcAmount(amt); setCalcUnit('baht'); }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors"
                        >
                          +{amt} บาท
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Sell Result */}
                  <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-amber-400 font-semibold block">มูลค่าขายออก (ซื้อจากร้านทอง)</span>
                      <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
                        ฿{calcGoldTotalSell.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      คิดจากราคาขายออก ฿{goldRateForCalc.toLocaleString()} / บาททอง
                    </p>
                  </div>

                  {/* Estimated Buy Result */}
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-slate-300 font-semibold block">มูลค่ารับซื้อคืน (ขายคืนร้านทอง)</span>
                      <p className="text-2xl sm:text-3xl font-black text-slate-100 font-mono mt-1">
                        ฿{calcGoldTotalBuy.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      คิดจากราคารับซื้อ ฿{goldBuyRateForCalc.toLocaleString()} / บาททอง
                    </p>
                  </div>

                </div>
              </div>

            </section>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CRYPTO HUB (ระบบค้นหา ปักหมุด และดูกราฟคริปโตทุกเหรียญในตลาด) */}
          {/* ========================================================================= */}
          {mainTab === 'crypto' && (
            <CryptoHub usdThb={data.forex.usdThb} />
          )}

          {/* ========================================================================= */}
          {/* TAB 3: STOCKS, MUTUAL FUNDS & ETFS (หุ้น กองทุนรวม และ ETF พร้อมค้นหา & Pin) */}
          {/* ========================================================================= */}
          {mainTab === 'securities' && (
            <SecuritiesHub
              securities={INITIAL_SECURITIES}
              pinnedIds={pinnedSecurityIds}
              onTogglePin={handleTogglePin}
              usdThb={data.forex.usdThb}
            />
          )}

        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-md py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Gold, Crypto, Stock & Fund Tracker • ข้อมูลเพื่อการติดตามราคาและการลงทุน (อัปเดต Real-time)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>แหล่งข้อมูล: สมาคมค้าทองคำ, Binance Spot & ตลาดการเงินสากล</span>
              <span>•</span>
              <span>เวลาประเทศไทย (UTC+7)</span>
            </div>
          </div>
        </footer>

        {/* PWA Mobile Quick Install Banner & Offline Toast */}
        <PWAMobileBanner />
        <OfflineIndicator />

      </div>
    </div>
  );
}
