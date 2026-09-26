export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  nameTh: string;
  glyph: string;
  category: string;
  rank: number;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volumeUsdt: number;
  description?: string;
  charts: {
    '24H': { labels: string[]; prices: number[] };
    '30D': { labels: string[]; prices: number[] };
    '1Y': { labels: string[]; prices: number[] };
  };
}

export const INITIAL_CRYPTO_LIST: CryptoAsset[] = [
  {
    id: 'crypto-btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    nameTh: 'บิตคอยน์ (Store of Value & King of Crypto)',
    glyph: '₿',
    category: 'Layer 1 / Digital Gold',
    rank: 1,
    price: 83990,
    change24h: -150,
    changePercent24h: -0.18,
    high24h: 85250,
    low24h: 83180,
    volumeUsdt: 28500000000,
    description: 'สกุลเงินดิจิทัลแรกและมูลค่าตลาดสูงสุดในโลก เป็นสินทรัพย์ดิจิทัลที่มีจำนวนจำกัด 21 ล้านเหรียญ',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [77400, 77800, 78100, 78500, 78200, 78600, 78900]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [72500, 74800, 76200, 78900]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [34500, 37800, 42200, 43100, 51800, 68500, 64200, 68000, 61500, 66800, 63400, 78900]
      }
    }
  },
  {
    id: 'crypto-eth',
    symbol: 'ETH',
    name: 'Ethereum',
    nameTh: 'อีเธอเรียม (ผู้นำ Smart Contract & DeFi)',
    glyph: 'Ξ',
    category: 'Layer 1 / Smart Contracts',
    rank: 2,
    price: 2458,
    change24h: -32.5,
    changePercent24h: -1.31,
    high24h: 2520,
    low24h: 2420,
    volumeUsdt: 14200000000,
    description: 'แพลตฟอร์มสัญญาอัจฉริยะ (Smart Contract) และระบบนิเวศการเงินไร้ศูนย์กลาง (DeFi) ที่ใหญ่ที่สุด',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [2510, 2490, 2480, 2460, 2440, 2450, 2458]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [2380, 2420, 2550, 2458]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [1780, 2050, 2280, 2480, 2950, 3600, 3200, 3750, 3400, 3100, 2650, 2458]
      }
    }
  },
  {
    id: 'crypto-bnb',
    symbol: 'BNB',
    name: 'BNB Chain',
    nameTh: 'บีเอ็นบี (Ecosystem Coin ของ Binance)',
    glyph: '❖',
    category: 'Exchange / Layer 1',
    rank: 4,
    price: 695.5,
    change24h: 8.2,
    changePercent24h: 1.19,
    high24h: 705.0,
    low24h: 682.0,
    volumeUsdt: 1200000000,
    description: 'เหรียญหลักประจำบล็อกเชน BNB Chain และใช้สำหรับส่วนลดค่าธรรมเนียมและ Launchpad ของ Binance',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [685, 688, 690, 692, 691, 694, 695.5]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [640, 665, 680, 695.5]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [225, 240, 280, 310, 380, 580, 560, 600, 570, 590, 560, 695.5]
      }
    }
  },
  {
    id: 'crypto-sol',
    symbol: 'SOL',
    name: 'Solana',
    nameTh: 'โซลานา (บล็อกเชนความเร็วสูง ค่าธรรมเนียมต่ำ)',
    glyph: '◈',
    category: 'High-Speed Layer 1',
    rank: 5,
    price: 97.1,
    change24h: 4.8,
    changePercent24h: 5.20,
    high24h: 98.8,
    low24h: 91.5,
    volumeUsdt: 3800000000,
    description: 'บล็อกเชนประสิทธิภาพสูง รองรับธุรกรรมนับหมื่นรายการต่อวินาทีด้วยต้นทุนค่าธรรมเนียมที่ต่ำมาก',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [92.0, 93.2, 94.5, 95.8, 96.2, 96.8, 97.1]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [82.0, 88.5, 91.0, 97.1]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [32.0, 42.5, 68.0, 85.0, 102.0, 185.0, 140.0, 168.0, 135.0, 172.0, 145.0, 97.1]
      }
    }
  },
  {
    id: 'crypto-xrp',
    symbol: 'XRP',
    name: 'Ripple',
    nameTh: 'ริปเปิล (เครือข่ายโอนเงินข้ามพรมแดนสถาบันการเงิน)',
    glyph: '✕',
    category: 'Payment / Cross-Border',
    rank: 6,
    price: 2.35,
    change24h: 0.18,
    changePercent24h: 8.29,
    high24h: 2.45,
    low24h: 2.12,
    volumeUsdt: 6800000000,
    description: 'สินทรัพย์ดิจิทัลที่ออกแบบมาเพื่อการชำระเงินข้ามพรมแดนความเร็วสูงระดับสถาบันการเงินทั่วโลก',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [2.15, 2.18, 2.22, 2.28, 2.30, 2.33, 2.35]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [1.85, 1.95, 2.10, 2.35]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [0.52, 0.58, 0.62, 0.56, 0.54, 0.65, 0.51, 0.53, 0.48, 0.60, 0.58, 2.35]
      }
    }
  },
  {
    id: 'crypto-doge',
    symbol: 'DOGE',
    name: 'Dogecoin',
    nameTh: 'โดจคอยน์ (เหรียญมีมและคอมมูนิตี้อันดับ 1)',
    glyph: 'Ð',
    category: 'Meme / Payment',
    rank: 7,
    price: 0.385,
    change24h: 0.025,
    changePercent24h: 6.94,
    high24h: 0.410,
    low24h: 0.355,
    volumeUsdt: 4200000000,
    description: 'เหรียญมีมดั้งเดิมที่มีคอมมูนิตี้เหนียวแน่นและได้รับการสนับสนุนอย่างกว้างขวาง',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [0.360, 0.365, 0.372, 0.378, 0.380, 0.382, 0.385]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [0.280, 0.310, 0.350, 0.385]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [0.068, 0.075, 0.092, 0.081, 0.088, 0.185, 0.155, 0.162, 0.125, 0.138, 0.105, 0.385]
      }
    }
  },
  {
    id: 'crypto-ada',
    symbol: 'ADA',
    name: 'Cardano',
    nameTh: 'คาร์ดาโน (บล็อกเชนงานวิจัยและระบบ Proof of Stake)',
    glyph: '₳',
    category: 'Layer 1 / Research',
    rank: 8,
    price: 0.78,
    change24h: 0.04,
    changePercent24h: 5.41,
    high24h: 0.81,
    low24h: 0.73,
    volumeUsdt: 1100000000,
    description: 'บล็อกเชน Proof-of-Stake ที่พัฒนาผ่านการทบทวนเชิงวิชาการ (Peer-reviewed Research)',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [0.74, 0.75, 0.76, 0.77, 0.76, 0.77, 0.78]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [0.62, 0.68, 0.72, 0.78]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [0.28, 0.36, 0.58, 0.51, 0.58, 0.74, 0.48, 0.47, 0.38, 0.41, 0.35, 0.78]
      }
    }
  },
  {
    id: 'crypto-sui',
    symbol: 'SUI',
    name: 'Sui Network',
    nameTh: 'ซุย (บล็อกเชนภาษา Move ยุคใหม่)',
    glyph: '💧',
    category: 'Next-Gen Layer 1',
    rank: 10,
    price: 3.25,
    change24h: 0.22,
    changePercent24h: 7.26,
    high24h: 3.40,
    low24h: 2.98,
    volumeUsdt: 1850000000,
    description: 'บล็อกเชน Layer 1 ประสิทธิภาพสูง พัฒนาด้วยภาษา Move เน้นความเร็วและการประมวลผลธุรกรรมพร้อมกัน',
    charts: {
      '24H': {
        labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
        prices: [3.02, 3.08, 3.12, 3.18, 3.20, 3.22, 3.25]
      },
      '30D': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [2.10, 2.45, 2.80, 3.25]
      },
      '1Y': {
        labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
        prices: [0.45, 0.58, 0.72, 1.25, 1.65, 1.95, 1.20, 1.05, 0.88, 0.82, 1.45, 3.25]
      }
    }
  }
];

export const EXTENDED_CRYPTO_CATALOG: CryptoAsset[] = [
  {
    id: 'crypto-avax',
    symbol: 'AVAX',
    name: 'Avalanche',
    nameTh: 'อวาแลนช์ (ซับเน็ตบล็อกเชนความเร็วสูง)',
    glyph: '▲',
    category: 'Layer 1 / Subnets',
    rank: 9,
    price: 38.5,
    change24h: 1.2,
    changePercent24h: 3.22,
    high24h: 39.8,
    low24h: 36.8,
    volumeUsdt: 850000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [37.2, 37.8, 38.1, 38.3, 38.5] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [31.5, 34.2, 36.0, 38.5] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [11.2, 21.5, 38.0, 35.0, 42.0, 58.0, 36.0, 37.5, 27.5, 28.0, 23.5, 38.5] }
    }
  },
  {
    id: 'crypto-link',
    symbol: 'LINK',
    name: 'Chainlink',
    nameTh: 'เชนลิงก์ (โครงสร้างพื้นฐาน Oracle & RWA)',
    glyph: '⬡',
    category: 'Oracle / Infrastructure',
    rank: 11,
    price: 18.9,
    change24h: 0.85,
    changePercent24h: 4.71,
    high24h: 19.4,
    low24h: 17.8,
    volumeUsdt: 620000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [18.0, 18.2, 18.5, 18.7, 18.9] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [14.8, 16.2, 17.5, 18.9] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [8.5, 13.8, 15.2, 15.0, 19.8, 21.5, 14.5, 17.8, 13.5, 13.8, 11.2, 18.9] }
    }
  },
  {
    id: 'crypto-pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    nameTh: 'เปเป้ (เหรียญมีมกบยอดนิยม)',
    glyph: '🐸',
    category: 'Meme Coin',
    rank: 12,
    price: 0.0000185,
    change24h: 0.0000015,
    changePercent24h: 8.82,
    high24h: 0.0000195,
    low24h: 0.0000168,
    volumeUsdt: 1450000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [0.000017, 0.0000175, 0.000018, 0.0000182, 0.0000185] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [0.000012, 0.000014, 0.000016, 0.0000185] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.0000011, 0.0000013, 0.0000014, 0.0000012, 0.0000035, 0.0000085, 0.0000072, 0.0000152, 0.0000115, 0.0000128, 0.0000082, 0.0000185] }
    }
  },
  {
    id: 'crypto-shib',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    nameTh: 'ชิบะอินุ (Ecosystem เหรียญมีมและ Shibarium)',
    glyph: '🐕',
    category: 'Meme / Layer 2',
    rank: 13,
    price: 0.0000248,
    change24h: 0.0000012,
    changePercent24h: 5.08,
    high24h: 0.0000258,
    low24h: 0.0000232,
    volumeUsdt: 980000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [0.0000235, 0.000024, 0.0000242, 0.0000245, 0.0000248] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [0.000018, 0.000020, 0.000022, 0.0000248] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.0000075, 0.0000082, 0.0000105, 0.0000095, 0.0000110, 0.0000325, 0.0000240, 0.0000255, 0.0000180, 0.0000175, 0.0000140, 0.0000248] }
    }
  },
  {
    id: 'crypto-near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    nameTh: 'เนียร์ (บล็อกเชน AI และ Sharding)',
    glyph: 'Ⓝ',
    category: 'Layer 1 / AI & Sharding',
    rank: 14,
    price: 6.75,
    change24h: 0.42,
    changePercent24h: 6.63,
    high24h: 6.95,
    low24h: 6.25,
    volumeUsdt: 580000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [6.32, 6.45, 6.55, 6.68, 6.75] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [4.9, 5.5, 6.1, 6.75] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [1.25, 1.85, 3.80, 3.10, 4.20, 7.85, 6.90, 7.60, 5.40, 5.80, 4.30, 6.75] }
    }
  },
  {
    id: 'crypto-ton',
    symbol: 'TON',
    name: 'Toncoin',
    nameTh: 'ตันคอยน์ (บล็อกเชนเชื่อมโยง Telegram Ecosystem)',
    glyph: '💎',
    category: 'Layer 1 / Telegram Ecosystem',
    rank: 16,
    price: 5.62,
    change24h: 0.15,
    changePercent24h: 2.74,
    high24h: 5.80,
    low24h: 5.42,
    volumeUsdt: 340000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [5.47, 5.50, 5.55, 5.58, 5.62] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [4.8, 5.1, 5.3, 5.62] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [2.15, 2.38, 2.30, 2.25, 2.65, 4.85, 5.80, 6.90, 7.65, 6.80, 5.60, 5.62] }
    }
  },
  {
    id: 'crypto-render',
    symbol: 'RENDER',
    name: 'Render Network',
    nameTh: 'เรนเดอร์ (โครงข่ายประมวลผล GPU & AI)',
    glyph: '🎨',
    category: 'DePIN / GPU Computing',
    rank: 19,
    price: 7.85,
    change24h: 0.55,
    changePercent24h: 7.53,
    high24h: 8.10,
    low24h: 7.20,
    volumeUsdt: 410000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [7.3, 7.45, 7.6, 7.75, 7.85] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [5.8, 6.4, 7.1, 7.85] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [1.85, 3.20, 4.50, 4.10, 7.20, 11.80, 8.40, 10.50, 6.80, 6.40, 5.10, 7.85] }
    }
  },
  {
    id: 'crypto-fet',
    symbol: 'FET',
    name: 'Artificial Superintelligence',
    nameTh: 'เอไอ ซูเปอร์อินเทลลิเจนซ์ (พันธมิตรเหรียญ AI)',
    glyph: '🤖',
    category: 'Artificial Intelligence (AI)',
    rank: 20,
    price: 1.68,
    change24h: 0.12,
    changePercent24h: 7.69,
    high24h: 1.75,
    low24h: 1.52,
    volumeUsdt: 320000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [1.55, 1.58, 1.62, 1.65, 1.68] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [1.2, 1.35, 1.5, 1.68] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.32, 0.48, 0.65, 0.60, 1.15, 2.85, 2.20, 2.45, 1.55, 1.35, 1.10, 1.68] }
    }
  },
  {
    id: 'crypto-apt',
    symbol: 'APT',
    name: 'Aptos',
    nameTh: 'แอพทอส (บล็อกเชนภาษา Move ความเร็วสูง)',
    glyph: '⚡',
    category: 'Layer 1 / Move',
    rank: 17,
    price: 11.45,
    change24h: 0.65,
    changePercent24h: 6.02,
    high24h: 11.9,
    low24h: 10.6,
    volumeUsdt: 290000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [10.8, 11.0, 11.2, 11.35, 11.45] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [8.5, 9.4, 10.2, 11.45] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [5.8, 7.4, 9.8, 9.1, 10.5, 17.5, 9.2, 8.8, 6.9, 6.8, 6.2, 11.45] }
    }
  },
  {
    id: 'crypto-wif',
    symbol: 'WIF',
    name: 'dogwifhat',
    nameTh: 'ด็อกวิฟแฮต (เหรียญมีมหมาใส่หมวกบน Solana)',
    glyph: '🎩',
    category: 'Solana Meme Coin',
    rank: 28,
    price: 2.85,
    change24h: 0.28,
    changePercent24h: 10.89,
    high24h: 3.05,
    low24h: 2.52,
    volumeUsdt: 650000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [2.55, 2.65, 2.72, 2.80, 2.85] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [1.8, 2.1, 2.45, 2.85] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.05, 0.12, 0.25, 0.35, 0.85, 3.85, 2.95, 3.30, 2.15, 2.40, 1.65, 2.85] }
    }
  },
  {
    id: 'crypto-sd',
    symbol: 'SD',
    name: 'Stader',
    nameTh: 'สเตเดอร์ (โครงสร้างพื้นฐาน Liquid Staking หลายเชน)',
    glyph: '🔷',
    category: 'DeFi / Liquid Staking',
    rank: 88,
    price: 0.92,
    change24h: 0.05,
    changePercent24h: 5.75,
    high24h: 0.98,
    low24h: 0.86,
    volumeUsdt: 42000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [0.87, 0.88, 0.90, 0.91, 0.92] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [0.72, 0.78, 0.85, 0.92] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.45, 0.52, 0.68, 0.62, 0.85, 1.45, 1.10, 1.18, 0.82, 0.75, 0.68, 0.92] }
    }
  },
  {
    id: 'crypto-cake',
    symbol: 'CAKE',
    name: 'PancakeSwap',
    nameTh: 'แพนเค้กสว็อป (DEX อันดับ 1 บน BNB Chain)',
    glyph: '🥞',
    category: 'DeFi / DEX',
    rank: 65,
    price: 2.15,
    change24h: 0.08,
    changePercent24h: 3.86,
    high24h: 2.25,
    low24h: 2.05,
    volumeUsdt: 85000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [2.07, 2.09, 2.12, 2.14, 2.15] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [1.82, 1.95, 2.05, 2.15] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [1.15, 1.85, 2.65, 2.45, 2.95, 4.85, 3.20, 3.10, 2.40, 2.25, 1.85, 2.15] }
    }
  },
  {
    id: 'crypto-kas',
    symbol: 'KAS',
    name: 'Kaspa',
    nameTh: 'คาสปา (บล็อกเชน Proof of Work สถาปัตยกรรม GHOSTDAG)',
    glyph: '⚡',
    category: 'Layer 1 / GHOSTDAG',
    rank: 22,
    price: 0.165,
    change24h: 0.008,
    changePercent24h: 5.10,
    high24h: 0.175,
    low24h: 0.154,
    volumeUsdt: 120000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [0.157, 0.159, 0.162, 0.164, 0.165] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [0.135, 0.145, 0.155, 0.165] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.045, 0.085, 0.125, 0.105, 0.145, 0.185, 0.130, 0.165, 0.175, 0.195, 0.155, 0.165] }
    }
  },
  {
    id: 'crypto-tao',
    symbol: 'TAO',
    name: 'Bittensor',
    nameTh: 'บิตเทนเซอร์ (เครือข่าย Machine Learning & AI ไร้ศูนย์กลาง)',
    glyph: '🧠',
    category: 'Artificial Intelligence (AI)',
    rank: 24,
    price: 545.0,
    change24h: 32.5,
    changePercent24h: 6.34,
    high24h: 565.0,
    low24h: 508.0,
    volumeUsdt: 240000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [512.5, 520.0, 532.0, 540.0, 545.0] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [380.0, 440.0, 495.0, 545.0] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [55.0, 185.0, 290.0, 275.0, 480.0, 720.0, 560.0, 480.0, 310.0, 340.0, 280.0, 545.0] }
    }
  },
  {
    id: 'crypto-dot',
    symbol: 'DOT',
    name: 'Polkadot',
    nameTh: 'โพลกาดอท (ระบบนิเวศบล็อกเชนเชื่อมโยง Parachain)',
    glyph: '●',
    category: 'Layer 0 / Interoperability',
    rank: 15,
    price: 7.85,
    change24h: 0.28,
    changePercent24h: 3.70,
    high24h: 8.15,
    low24h: 7.45,
    volumeUsdt: 310000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [7.57, 7.62, 7.72, 7.80, 7.85] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [6.45, 6.95, 7.40, 7.85] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [3.85, 4.95, 7.85, 6.95, 8.20, 11.20, 7.40, 7.80, 5.95, 6.10, 4.85, 7.85] }
    }
  },
  {
    id: 'crypto-trx',
    symbol: 'TRX',
    name: 'TRON',
    nameTh: 'ตรอน (เครือข่ายชำระเงินและโอน USDT ยอดนิยม)',
    glyph: '🌐',
    category: 'Layer 1 / Stablecoin Network',
    rank: 18,
    price: 0.215,
    change24h: 0.005,
    changePercent24h: 2.38,
    high24h: 0.222,
    low24h: 0.208,
    volumeUsdt: 550000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [0.210, 0.211, 0.213, 0.214, 0.215] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [0.185, 0.195, 0.205, 0.215] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [0.088, 0.098, 0.105, 0.112, 0.138, 0.142, 0.122, 0.125, 0.118, 0.135, 0.158, 0.215] }
    }
  },
  {
    id: 'crypto-uni',
    symbol: 'UNI',
    name: 'Uniswap',
    nameTh: 'ยูนิสว็อป (ผู้นำกระดานเทรดแบบไร้ศูนย์กลาง DEX)',
    glyph: '🦄',
    category: 'DeFi / DEX',
    rank: 21,
    price: 9.85,
    change24h: 0.45,
    changePercent24h: 4.79,
    high24h: 10.25,
    low24h: 9.35,
    volumeUsdt: 290000000,
    charts: {
      '24H': { labels: ['00:00', '06:00', '12:00', '18:00', 'ปัจจุบัน'], prices: [9.40, 9.52, 9.65, 9.78, 9.85] },
      '30D': { labels: ['W1', 'W2', 'W3', 'W4'], prices: [7.85, 8.45, 9.15, 9.85] },
      '1Y': { labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'], prices: [4.15, 5.85, 6.95, 6.20, 11.50, 14.80, 8.20, 10.40, 7.85, 8.10, 6.45, 9.85] }
    }
  }
];

export function generateCryptoCharts(basePrice: number, isPositive: boolean = true) {
  const p = Number(basePrice) || 10.0;

  return {
    '24H': {
      labels: ['00:00 น.', '04:00 น.', '08:00 น.', '12:00 น.', '16:00 น.', '20:00 น.', 'ปัจจุบัน'],
      prices: [
        Number((p * (isPositive ? 0.96 : 1.04)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.97 : 1.03)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.985 : 1.015)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.99 : 1.01)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.995 : 1.005)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.998 : 1.002)).toFixed(p > 10 ? 2 : 5)),
        Number(p.toFixed(p > 10 ? 2 : 5))
      ]
    },
    '30D': {
      labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
      prices: [
        Number((p * (isPositive ? 0.88 : 1.12)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.92 : 1.08)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.96 : 1.04)).toFixed(p > 10 ? 2 : 5)),
        Number(p.toFixed(p > 10 ? 2 : 5))
      ]
    },
    '1Y': {
      labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
      prices: [
        Number((p * (isPositive ? 0.55 : 1.45)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.62 : 1.38)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.70 : 1.30)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.75 : 1.25)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.82 : 1.20)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.95 : 1.15)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.88 : 1.18)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.92 : 1.12)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.85 : 1.15)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.90 : 1.08)).toFixed(p > 10 ? 2 : 5)),
        Number((p * (isPositive ? 0.86 : 1.10)).toFixed(p > 10 ? 2 : 5)),
        Number(p.toFixed(p > 10 ? 2 : 5))
      ]
    }
  };
}

export function createCustomCrypto(params: {
  symbol: string;
  name: string;
  nameTh?: string;
  glyph?: string;
  category?: string;
  price: number;
  changePercent24h?: number;
  description?: string;
}): CryptoAsset {
  const symbol = params.symbol.trim().toUpperCase();
  const price = params.price || 1.0;
  const changePct = params.changePercent24h || 2.5;
  const change24h = (price * changePct) / 100;
  const high24h = price * (1 + Math.abs(changePct) / 100 + 0.02);
  const low24h = price * (1 - Math.abs(changePct) / 100 - 0.02);

  return {
    id: `crypto-custom-${symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
    symbol,
    name: params.name || `${symbol} Token`,
    nameTh: params.nameTh || params.name || `เหรียญ ${symbol}`,
    glyph: params.glyph || '🪙',
    category: params.category || 'Cryptocurrency / Web3 Asset',
    rank: 99,
    price: Number(price.toFixed(price > 10 ? 2 : 5)),
    change24h: Number(change24h.toFixed(price > 10 ? 2 : 5)),
    changePercent24h: Number(changePct.toFixed(2)),
    high24h: Number(high24h.toFixed(price > 10 ? 2 : 5)),
    low24h: Number(low24h.toFixed(price > 10 ? 2 : 5)),
    volumeUsdt: 5000000,
    description: params.description || `สินทรัพย์คริปโต ${symbol} ที่เพิ่มเข้าสู่ระบบ`,
    charts: generateCryptoCharts(price, changePct >= 0)
  };
}
