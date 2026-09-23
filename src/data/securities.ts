export type SecurityType = 'stock_us' | 'stock_th' | 'etf' | 'fund';

export interface MarketSecurity {
  id: string;
  symbol: string;
  name: string;
  nameTh: string;
  type: SecurityType;
  market: 'US' | 'SET' | 'GLOBAL' | 'THAI_FUND';
  currency: 'USD' | 'THB';
  price: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  peRatio?: number;
  dividendYield?: number;
  nav?: number;
  expenseRatio?: string;
  issuer?: string;
  sector: string;
  description: string;
  charts: {
    '1D': { labels: string[]; prices: number[] };
    '1W': { labels: string[]; prices: number[] };
    '1M': { labels: string[]; prices: number[] };
    '1Y': { labels: string[]; prices: number[] };
  };
}

export const INITIAL_SECURITIES: MarketSecurity[] = [
  // =================== US STOCKS ===================
  {
    id: 'sec-nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    nameTh: 'เอ็นวิเดีย (ผู้นำชิปประมวลผล AI และ GPU)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 132.80,
    change: 3.45,
    changePercent: 2.67,
    high52w: 140.76,
    low52w: 45.11,
    peRatio: 58.4,
    dividendYield: 0.03,
    sector: 'Semiconductors & AI',
    description: 'ผู้นำระดับโลกด้านชิปประมวลผล AI, GPU ศูนย์ข้อมูล และเทคโนโลยีการคำนวณขั้นสูง',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [129.35, 130.80, 131.50, 131.20, 132.40, 132.80]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [126.50, 128.10, 129.40, 130.20, 132.80]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [118.00, 122.50, 127.80, 132.80]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [62.00, 88.50, 115.00, 132.80]
      }
    }
  },
  {
    id: 'sec-aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    nameTh: 'แอปเปิ้ล (iPhone, Mac & Apple Intelligence)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 228.40,
    change: -1.20,
    changePercent: -0.52,
    high52w: 237.23,
    low52w: 164.08,
    peRatio: 33.2,
    dividendYield: 0.44,
    sector: 'Consumer Electronics & Tech',
    description: 'บริษัทยักษ์ใหญ่ด้านอุปกรณ์อิเล็กทรอนิกส์ ซอฟต์แวร์ และระบบนิเวศ Apple',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [229.60, 230.10, 229.00, 227.80, 228.10, 228.40]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [226.00, 227.50, 229.00, 230.10, 228.40]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [218.00, 222.00, 225.50, 228.40]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [175.00, 185.00, 210.00, 228.40]
      }
    }
  },
  {
    id: 'sec-msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    nameTh: 'ไมโครซอฟท์ (Windows, Azure Cloud & OpenAI Copilot)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 432.50,
    change: 4.10,
    changePercent: 0.96,
    high52w: 468.35,
    low52w: 320.50,
    peRatio: 35.8,
    dividendYield: 0.72,
    sector: 'Enterprise Software & Cloud',
    description: 'ผู้นำระบบปฏิบัติการ คลาวด์ Azure ซอฟต์แวร์สำนักงาน และพันธมิตรหลัก OpenAI',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [428.40, 429.50, 431.00, 430.80, 432.00, 432.50]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [424.00, 427.00, 429.50, 431.00, 432.50]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [415.00, 420.00, 426.00, 432.50]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [340.00, 380.00, 410.00, 432.50]
      }
    }
  },
  {
    id: 'sec-tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    nameTh: 'เทสลา (รถยนต์ไฟฟ้า แบตเตอรี่ และหุ่นยนต์อัตโนมัติ)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 218.90,
    change: 6.80,
    changePercent: 3.21,
    high52w: 271.00,
    low52w: 138.80,
    peRatio: 64.1,
    dividendYield: 0.0,
    sector: 'Automotive & Clean Energy',
    description: 'ผู้นำนวัตกรรมยานยนต์ไฟฟ้า พลังงานสะอาด ระบบขับขี่อัตโนมัติ Full Self-Driving',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [212.10, 215.00, 214.50, 216.80, 217.50, 218.90]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [205.00, 209.00, 212.50, 215.00, 218.90]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [195.00, 202.00, 210.00, 218.90]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [240.00, 175.00, 200.00, 218.90]
      }
    }
  },
  {
    id: 'sec-googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    nameTh: 'อัลฟาเบท (Google Search, YouTube & Gemini AI)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 168.20,
    change: 1.15,
    changePercent: 0.69,
    high52w: 191.75,
    low52w: 120.21,
    peRatio: 24.5,
    dividendYield: 0.48,
    sector: 'Internet Content & AI',
    description: 'เจ้าของแพลตฟอร์มค้นหา Google, วิดีโอ YouTube, Google Cloud และโมเดล Gemini AI',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [167.05, 167.80, 168.10, 167.90, 168.00, 168.20]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [164.00, 165.50, 166.80, 167.50, 168.20]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [159.00, 162.00, 165.00, 168.20]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [130.00, 145.00, 160.00, 168.20]
      }
    }
  },

  // =================== THAI STOCKS (SET) ===================
  {
    id: 'sec-ptt',
    symbol: 'PTT',
    name: 'PTT Public Company Limited',
    nameTh: 'ปตท. (พลังงาน ปิโตรเลียม และโครงสร้างพื้นฐาน)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 33.75,
    change: 0.50,
    changePercent: 1.50,
    high52w: 36.50,
    low52w: 31.00,
    peRatio: 9.8,
    dividendYield: 5.92,
    sector: 'Energy & Utilities',
    description: 'บริษัทพลังงานแห่งชาติชั้นนำของไทย ดำเนินธุรกิจก๊าซธรรมชาติ น้ำมัน และพลังงานหมุนเวียน',
    charts: {
      '1D': {
        labels: ['10:00', '11:30', '12:30', '14:30', '15:30', '16:30'],
        prices: [33.25, 33.50, 33.50, 33.75, 33.50, 33.75]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [32.75, 33.00, 33.25, 33.50, 33.75]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [32.00, 32.50, 33.00, 33.75]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [34.50, 33.00, 32.50, 33.75]
      }
    }
  },
  {
    id: 'sec-delta',
    symbol: 'DELTA',
    name: 'Delta Electronics (Thailand)',
    nameTh: 'เดลต้า อีเลคโทรนิคส์ (เพาเวอร์ซัพพลาย และ EV Solution)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 112.50,
    change: 2.50,
    changePercent: 2.27,
    high52w: 125.00,
    low52w: 65.00,
    peRatio: 62.5,
    dividendYield: 0.45,
    sector: 'Electronic Components',
    description: 'ผู้ผลิตชิ้นส่วนอิเล็กทรอนิกส์ อุปกรณ์แปลงกระแสไฟฟ้าสำหรับดาต้าเซ็นเตอร์ และยานยนต์ไฟฟ้า',
    charts: {
      '1D': {
        labels: ['10:00', '11:30', '12:30', '14:30', '15:30', '16:30'],
        prices: [110.00, 111.00, 112.00, 111.50, 112.00, 112.50]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [106.00, 108.50, 110.00, 111.00, 112.50]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [98.00, 102.00, 107.00, 112.50]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [72.00, 85.00, 96.00, 112.50]
      }
    }
  },
  {
    id: 'sec-bdms',
    symbol: 'BDMS',
    name: 'Bangkok Dusit Medical Services',
    nameTh: 'กรุงเทพดุสิตเวชการ (เครือโรงพยาบาลกรุงเทพ สมิติเวช พญาไท)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 27.50,
    change: -0.25,
    changePercent: -0.90,
    high52w: 30.50,
    low52w: 25.25,
    peRatio: 28.6,
    dividendYield: 2.73,
    sector: 'Health Care Services',
    description: 'เครือข่ายโรงพยาบาลเอกชนชั้นนำระดับภูมิภาค รองรับผู้ป่วยไทยและ Medical Tourism ทั่วโลก',
    charts: {
      '1D': {
        labels: ['10:00', '11:30', '12:30', '14:30', '15:30', '16:30'],
        prices: [27.75, 27.75, 27.50, 27.50, 27.25, 27.50]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [28.00, 27.75, 27.75, 27.50, 27.50]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [28.50, 28.25, 27.75, 27.50]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [27.00, 29.00, 28.50, 27.50]
      }
    }
  },
  {
    id: 'sec-scb',
    symbol: 'SCB',
    name: 'SCB X Public Company Limited',
    nameTh: 'เอสซีบี เอกซ์ (กลุ่มธุรกิจการเงินและเทคโนโลยี SCBX)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 110.00,
    change: 1.00,
    changePercent: 0.92,
    high52w: 115.50,
    low52w: 98.00,
    peRatio: 9.2,
    dividendYield: 9.38,
    sector: 'Banking & Financial Tech',
    description: 'ยานแม่กลุ่มธุรกิจการเงิน ธนาคารไทยพาณิชย์ และฟินเทคชั้นนำของประเทศไทย',
    charts: {
      '1D': {
        labels: ['10:00', '11:30', '12:30', '14:30', '15:30', '16:30'],
        prices: [109.00, 109.50, 110.00, 109.50, 110.00, 110.00]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [107.50, 108.00, 109.00, 109.50, 110.00]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [105.00, 106.50, 108.00, 110.00]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [102.00, 105.00, 107.00, 110.00]
      }
    }
  },

  // =================== ETFs ===================
  {
    id: 'sec-spy',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    nameTh: 'กองทุน ETF ดัชนีหุ้นสหรัฐฯ S&P 500 (500 บริษัทใหญ่)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 562.40,
    change: 2.80,
    changePercent: 0.50,
    high52w: 565.16,
    low52w: 409.22,
    expenseRatio: '0.09%',
    issuer: 'State Street Global Advisors',
    sector: 'Large-Cap Blend US Index',
    description: 'กองทุน ETF ที่มีมูลค่าและสภาพคล่องสูงที่สุดในโลก ลงทุนตามดัชนี S&P 500 กระจายความเสี่ยง 500 บริษัทชั้นนำ',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [559.60, 560.80, 561.40, 561.00, 562.10, 562.40]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [554.00, 556.50, 558.00, 560.50, 562.40]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [542.00, 548.00, 555.00, 562.40]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [450.00, 485.00, 520.00, 562.40]
      }
    }
  },
  {
    id: 'sec-qqq',
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    nameTh: 'กองทุน ETF ดัชนีเทคโนโลยี Nasdaq-100',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 485.70,
    change: 4.60,
    changePercent: 0.96,
    high52w: 503.52,
    low52w: 350.10,
    expenseRatio: '0.20%',
    issuer: 'Invesco',
    sector: 'Tech & Growth Index',
    description: 'กองทุน ETF ชั้นนำอิงดัชนี Nasdaq-100 รวบรวม 100 บริษัทยักษ์ใหญ่ด้านเทคโนโลยีและนวัตกรรมชั้นนำระดับโลก',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [481.10, 483.00, 484.50, 483.80, 485.00, 485.70]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [472.00, 476.00, 480.00, 482.50, 485.70]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [458.00, 466.00, 475.00, 485.70]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [380.00, 420.00, 455.00, 485.70]
      }
    }
  },
  {
    id: 'sec-gld',
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    nameTh: 'กองทุน ETF ทองคำแท่งโลก (สำรองทองคำจริง 100%)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 232.15,
    change: 0.85,
    changePercent: 0.37,
    high52w: 236.40,
    low52w: 172.50,
    expenseRatio: '0.40%',
    issuer: 'World Gold Trust Services',
    sector: 'Precious Metals / Gold',
    description: 'กองทุน ETF ทองคำที่ใหญ่ที่สุดในโลก ถือครองทองคำแท่งจริงในห้องนิรภัย HSBC ลอนดอน',
    charts: {
      '1D': {
        labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
        prices: [231.30, 231.70, 232.00, 231.80, 232.05, 232.15]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
        prices: [229.00, 230.20, 231.00, 231.50, 232.15]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [224.00, 226.50, 229.00, 232.15]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [185.00, 200.00, 218.00, 232.15]
      }
    }
  },

  // =================== THAI MUTUAL FUNDS (กองทุนรวม) ===================
  {
    id: 'sec-kusxndq',
    symbol: 'K-USXNDQ-A(A)',
    name: 'K USXNDQ Index Fund Accumulation',
    nameTh: 'กองทุนเปิดเค ยูเอส อินเด็กซ์ แฟนด์ (หุ้นเทคโนโลยีสหรัฐ)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 24.8512,
    nav: 24.8512,
    change: 0.2845,
    changePercent: 1.16,
    high52w: 25.90,
    low52w: 18.20,
    expenseRatio: '0.78%',
    issuer: 'บลจ.กสิกรไทย (KAsset)',
    sector: 'US Equity / Tech Index',
    description: 'กองทุนรวมดัชนีหุ้นสหรัฐฯ ลงทุนใน Invesco QQQ Trust สร้างผลตอบแทนตามดัชนี Nasdaq-100',
    charts: {
      '1D': {
        labels: ['เมื่อวาน', 'ราคาประกาศล่าสุด'],
        prices: [24.5667, 24.8512]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ล่าสุด'],
        prices: [24.1200, 24.3500, 24.5000, 24.6800, 24.8512]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [23.4000, 23.9000, 24.3000, 24.8512]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [19.5000, 21.2000, 23.1000, 24.8512]
      }
    }
  },
  {
    id: 'sec-scbbln',
    symbol: 'SCBBLN',
    name: 'SCB Billionaire Fund',
    nameTh: 'กองทุนเปิดไทยพาณิชย์ บิลเลียนแนร์ (หุ้นมหาเศรษฐีโลก)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 15.6420,
    nav: 15.6420,
    change: 0.1250,
    changePercent: 0.81,
    high52w: 16.20,
    low52w: 12.80,
    expenseRatio: '1.25%',
    issuer: 'บลจ.ไทยพาณิชย์ (SCBAM)',
    sector: 'Global High Conviction Equities',
    description: 'ลงทุนในหุ้นระดับโลกที่มหาเศรษฐีชั้นนำระดับโลกและกองทุนเฮดจ์ฟันด์ถือครองมากที่สุด',
    charts: {
      '1D': {
        labels: ['เมื่อวาน', 'ราคาประกาศล่าสุด'],
        prices: [15.5170, 15.6420]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ล่าสุด'],
        prices: [15.3000, 15.4200, 15.5000, 15.5800, 15.6420]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [14.9000, 15.1500, 15.4000, 15.6420]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [13.2000, 14.1000, 14.9000, 15.6420]
      }
    }
  },
  {
    id: 'sec-kfgtech',
    symbol: 'KF-GTECH',
    name: 'Krungsri Global Technology Equity Fund',
    nameTh: 'กองทุนเปิดกรุงศรีโกลบอลเทคโนโลยีอิควิตี้ (Tech ระดับโลก)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 21.4380,
    nav: 21.4380,
    change: 0.3120,
    changePercent: 1.48,
    high52w: 22.80,
    low52w: 15.10,
    expenseRatio: '1.45%',
    issuer: 'บลจ.กรุงศรี (KSAM)',
    sector: 'Global Technology Mega-Trend',
    description: 'กองทุนหลัก T. Rowe Price Global Technology Equity ลงทุนหุ้นเทคโนโลยีเติบโตสูงทั่วโลก',
    charts: {
      '1D': {
        labels: ['เมื่อวาน', 'ราคาประกาศล่าสุด'],
        prices: [21.1260, 21.4380]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ล่าสุด'],
        prices: [20.8000, 21.0000, 21.1500, 21.2800, 21.4380]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [20.1000, 20.6000, 21.0000, 21.4380]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [16.5000, 18.2000, 19.8000, 21.4380]
      }
    }
  },
  {
    id: 'sec-scbgold',
    symbol: 'SCBGOLD',
    name: 'SCB Gold THB Hedged Fund',
    nameTh: 'กองทุนเปิดไทยพาณิชย์โกลด์ (ป้องกันความเสี่ยงค่าเงิน)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 18.9240,
    nav: 18.9240,
    change: 0.0820,
    changePercent: 0.43,
    high52w: 19.40,
    low52w: 14.50,
    expenseRatio: '0.65%',
    issuer: 'บลจ.ไทยพาณิชย์ (SCBAM)',
    sector: 'Commodity / Gold',
    description: 'กองทุนรวมทองคำแท่ง ลงทุนใน SPDR Gold Trust พร้อมป้องกันความเสี่ยงอัตราแลกเปลี่ยน THB/USD',
    charts: {
      '1D': {
        labels: ['เมื่อวาน', 'ราคาประกาศล่าสุด'],
        prices: [18.8420, 18.9240]
      },
      '1W': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ล่าสุด'],
        prices: [18.6000, 18.7200, 18.8000, 18.8800, 18.9240]
      },
      '1M': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        prices: [18.2000, 18.4500, 18.7000, 18.9240]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        prices: [15.2000, 16.5000, 17.8000, 18.9240]
      }
    }
  }
];

export function generateRealisticCharts(basePrice: number, isPositiveTrend = true) {
  const round = (num: number) => Number(num.toFixed(num > 10 ? 2 : 4));

  const d1 = [
    round(basePrice * 0.985),
    round(basePrice * 0.992),
    round(basePrice * 0.998),
    round(basePrice * (isPositiveTrend ? 1.002 : 0.994)),
    round(basePrice * 0.999),
    round(basePrice)
  ];

  const w1 = [
    round(basePrice * (isPositiveTrend ? 0.96 : 1.04)),
    round(basePrice * (isPositiveTrend ? 0.975 : 1.025)),
    round(basePrice * (isPositiveTrend ? 0.985 : 1.015)),
    round(basePrice * (isPositiveTrend ? 0.992 : 1.008)),
    round(basePrice)
  ];

  const m1 = [
    round(basePrice * (isPositiveTrend ? 0.91 : 1.08)),
    round(basePrice * (isPositiveTrend ? 0.94 : 1.05)),
    round(basePrice * (isPositiveTrend ? 0.97 : 1.02)),
    round(basePrice)
  ];

  const y1 = [
    round(basePrice * (isPositiveTrend ? 0.65 : 1.35)),
    round(basePrice * (isPositiveTrend ? 0.70 : 1.30)),
    round(basePrice * (isPositiveTrend ? 0.74 : 1.25)),
    round(basePrice * (isPositiveTrend ? 0.78 : 1.22)),
    round(basePrice * (isPositiveTrend ? 0.82 : 1.18)),
    round(basePrice * (isPositiveTrend ? 0.86 : 1.15)),
    round(basePrice * (isPositiveTrend ? 0.90 : 1.12)),
    round(basePrice * (isPositiveTrend ? 0.88 : 1.14)),
    round(basePrice * (isPositiveTrend ? 0.92 : 1.08)),
    round(basePrice * (isPositiveTrend ? 0.95 : 1.05)),
    round(basePrice * (isPositiveTrend ? 0.97 : 1.03)),
    round(basePrice)
  ];

  return {
    '1D': {
      labels: ['09:30', '11:00', '12:30', '14:00', '15:30', '16:00'],
      prices: d1
    },
    '1W': {
      labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'],
      prices: w1
    },
    '1M': {
      labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
      prices: m1
    },
    '1Y': {
      labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
      prices: y1
    }
  };
}

export function createCustomSecurity(params: {
  symbol: string;
  name: string;
  nameTh?: string;
  type: SecurityType;
  market?: 'US' | 'SET' | 'GLOBAL' | 'THAI_FUND';
  currency?: 'USD' | 'THB';
  price: number;
  change?: number;
  changePercent?: number;
  sector?: string;
  issuer?: string;
  description?: string;
  peRatio?: number;
  dividendYield?: number;
}): MarketSecurity {
  const symbolUpper = params.symbol.trim().toUpperCase();
  const isUSD = params.currency ? params.currency === 'USD' : (params.type === 'stock_us' || (params.type === 'etf' && !params.symbol.startsWith('K-') && !params.symbol.startsWith('SCB')));
  const currency: 'USD' | 'THB' = isUSD ? 'USD' : 'THB';
  
  let market: 'US' | 'SET' | 'GLOBAL' | 'THAI_FUND' = params.market || 'GLOBAL';
  if (!params.market) {
    if (params.type === 'stock_us') market = 'US';
    else if (params.type === 'stock_th') market = 'SET';
    else if (params.type === 'fund') market = 'THAI_FUND';
    else market = 'GLOBAL';
  }

  const changePercent = params.changePercent ?? (Math.random() * 4 - 1.5);
  const change = params.change ?? Number((params.price * (changePercent / 100)).toFixed(2));
  const high52w = Number((params.price * 1.22).toFixed(2));
  const low52w = Number((params.price * 0.78).toFixed(2));

  return {
    id: `custom-${symbolUpper.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
    symbol: symbolUpper,
    name: params.name || symbolUpper,
    nameTh: params.nameTh || params.name || symbolUpper,
    type: params.type,
    market,
    currency,
    price: params.price,
    change,
    changePercent: Number(changePercent.toFixed(2)),
    high52w,
    low52w,
    sector: params.sector || (params.type === 'fund' ? 'กองทุนรวม' : 'การลงทุน & เทคโนโลยี'),
    issuer: params.issuer || (params.type === 'fund' ? 'บลจ.ชั้นนำ' : 'บริษัทจดทะเบียน'),
    description: params.description || `สินทรัพย์ ${symbolUpper} สำหรับติดตามพอร์ตการลงทุนส่วนตัว`,
    peRatio: params.peRatio,
    dividendYield: params.dividendYield,
    charts: generateRealisticCharts(params.price, changePercent >= 0)
  };
}

// =================== EXTENDED CATALOG FOR SEARCH & ONE-CLICK ADD ===================
export const EXTENDED_CATALOG: MarketSecurity[] = [
  // US STOCKS
  {
    id: 'cat-meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    nameTh: 'เมตา (Facebook, Instagram, WhatsApp & Llama AI)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 512.30,
    change: 8.40,
    changePercent: 1.67,
    high52w: 544.23,
    low52w: 279.40,
    peRatio: 26.8,
    dividendYield: 0.39,
    sector: 'Social Media & Generative AI',
    description: 'เจ้าของแพลตฟอร์มโซเชียลมีเดียระดับโลก และผู้พัฒนาโมเดลปัญญาประดิษฐ์ Open Source Llama',
    charts: generateRealisticCharts(512.30, true)
  },
  {
    id: 'cat-amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    nameTh: 'แอมะซอน (E-Commerce, AWS Cloud & Bedrock AI)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 182.90,
    change: 1.45,
    changePercent: 0.80,
    high52w: 201.20,
    low52w: 118.35,
    peRatio: 42.1,
    dividendYield: 0.0,
    sector: 'E-Commerce & Cloud Computing',
    description: 'ผู้นำแพลตฟอร์มอีคอมเมิร์ซระดับโลกและผู้ให้บริการคลาวด์สาธารณะอันดับหนึ่ง AWS',
    charts: generateRealisticCharts(182.90, true)
  },
  {
    id: 'cat-amd',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    nameTh: 'เอเอ็มดี (ชิปโปรเซสเซอร์ Ryzen & Instinct AI)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 154.20,
    change: 3.80,
    changePercent: 2.53,
    high52w: 227.30,
    low52w: 93.12,
    peRatio: 110.4,
    dividendYield: 0.0,
    sector: 'Semiconductors',
    description: 'ผู้ผลิตชิปประมวลผล CPU และ GPU ประสิทธิภาพสูงสำหรับการประมวลผล AI และเกมมิ่ง',
    charts: generateRealisticCharts(154.20, true)
  },
  {
    id: 'cat-pltr',
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    nameTh: 'พาแลนเทียร์ (แพลตฟอร์ม Enterprise AI & Big Data AIP)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 31.85,
    change: 1.25,
    changePercent: 4.08,
    high52w: 33.12,
    low52w: 13.68,
    peRatio: 92.3,
    dividendYield: 0.0,
    sector: 'Big Data Analytics & AI Platform',
    description: 'ผู้พัฒนาแพลตฟอร์มวิเคราะห์ข้อมูลและ AI ให้กับรัฐบาล กองทัพ และองค์กรยักษ์ใหญ่ทั่วโลก',
    charts: generateRealisticCharts(31.85, true)
  },
  {
    id: 'cat-coin',
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    nameTh: 'คอยน์เบส (แพลตฟอร์มเทรดคริปโตและสถาบันการเงินดิจิทัล)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 215.60,
    change: 7.30,
    changePercent: 3.50,
    high52w: 283.48,
    low52w: 69.63,
    peRatio: 38.5,
    dividendYield: 0.0,
    sector: 'Crypto Exchange & Fintech',
    description: 'ศูนย์ซื้อขายสินทรัพย์ดิจิทัลอันดับหนึ่งในสหรัฐอเมริกา และผู้ดูแล Custody ให้กองทุน Bitcoin ETF',
    charts: generateRealisticCharts(215.60, true)
  },
  {
    id: 'cat-nflx',
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    nameTh: 'เน็ตฟลิกซ์ (ผู้นำบริการสตรีมมิ่งความบันเทิงระดับโลก)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 685.40,
    change: 5.60,
    changePercent: 0.82,
    high52w: 711.33,
    low52w: 344.73,
    peRatio: 41.2,
    dividendYield: 0.0,
    sector: 'Entertainment Streaming',
    description: 'ผู้ให้บริการสตรีมมิ่งภาพยนตร์และซีรีส์ชั้นนำระดับโลก พร้อมฐานสมาชิกกว่า 270 ล้านคน',
    charts: generateRealisticCharts(685.40, true)
  },
  {
    id: 'cat-brkb',
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway Inc.',
    nameTh: 'เบิร์กเชียร์ แฮธาเวย์ (โฮลดิ้งของ Warren Buffett)',
    type: 'stock_us',
    market: 'US',
    currency: 'USD',
    price: 452.80,
    change: 1.10,
    changePercent: 0.24,
    high52w: 460.00,
    low52w: 337.00,
    peRatio: 21.4,
    dividendYield: 0.0,
    sector: 'Multi-Sector Holding & Insurance',
    description: 'กลุ่มบริษัทโฮลดิ้งการลงทุนของ Warren Buffett ลงทุนในธุรกิจประกัน พลังงาน ทางรถไฟ และหุ้นระดับโลก',
    charts: generateRealisticCharts(452.80, true)
  },

  // THAI STOCKS (SET)
  {
    id: 'cat-cpall',
    symbol: 'CPALL',
    name: 'CP ALL Public Company Limited',
    nameTh: 'ซีพี ออลล์ (ร้านสะดวกซื้อ 7-Eleven & โลตัส/แม็คโคร)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 62.25,
    change: 0.75,
    changePercent: 1.22,
    high52w: 68.00,
    low52w: 50.00,
    peRatio: 27.4,
    dividendYield: 2.15,
    sector: 'Commerce & Retail',
    description: 'ผู้นำธุรกิจค้าปลีก ร้านสะดวกซื้อ 7-Eleven ในไทยกว่า 14,000 สาขา และเครือข่ายค้าส่ง Lotus\'s/Makro',
    charts: generateRealisticCharts(62.25, true)
  },
  {
    id: 'cat-advanc',
    symbol: 'ADVANC',
    name: 'Advanced Info Service PCL',
    nameTh: 'แอดวานซ์ อินโฟร์ เซอร์วิส (AIS เครือข่าย 5G และเน็ตบ้าน)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 254.00,
    change: 3.00,
    changePercent: 1.20,
    high52w: 260.00,
    low52w: 200.00,
    peRatio: 23.8,
    dividendYield: 3.94,
    sector: 'Telecommunications',
    description: 'ผู้ให้บริการโทรคมนาคม คลื่น 5G และบรอดแบนด์อินเทอร์เน็ตอันดับ 1 ของประเทศไทย',
    charts: generateRealisticCharts(254.00, true)
  },
  {
    id: 'cat-gulf',
    symbol: 'GULF',
    name: 'Gulf Energy Development PCL',
    nameTh: 'กัลฟ์ เอ็นเนอร์จี (โรงไฟฟ้า ดาต้าเซ็นเตอร์ และคลาวด์)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 52.50,
    change: 1.25,
    changePercent: 2.44,
    high52w: 56.00,
    low52w: 39.50,
    peRatio: 34.5,
    dividendYield: 1.62,
    sector: 'Energy & Digital Infrastructure',
    description: 'ผู้ผลิตพลังงานไฟฟ้ารายใหญ่ พร้อมขยายสู่โครงสร้างพื้นฐานดิจิทัล คลาวด์ และศูนย์ Data Center',
    charts: generateRealisticCharts(52.50, true)
  },
  {
    id: 'cat-aot',
    symbol: 'AOT',
    name: 'Airports of Thailand PCL',
    nameTh: 'ท่าอากาศยานไทย (สุวรรณภูมิ ดอนเมือง ภูเก็ต เชียงใหม่)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 58.75,
    change: -0.25,
    changePercent: -0.42,
    high52w: 74.25,
    low52w: 55.00,
    peRatio: 44.2,
    dividendYield: 1.28,
    sector: 'Transportation & Aviation',
    description: 'ผู้บริหารจัดการท่าอากาศยานนานาชาติหลัก 6 แห่งของประเทศไทย รองรับการท่องเที่ยวระดับโลก',
    charts: generateRealisticCharts(58.75, false)
  },
  {
    id: 'cat-kbank',
    symbol: 'KBANK',
    name: 'Kasikornbank Public Company Limited',
    nameTh: 'ธนาคารกสิกรไทย (K PLUS & KBTG นวัตกรรมดิจิทัล)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 148.50,
    change: 1.50,
    changePercent: 1.02,
    high52w: 155.00,
    low52w: 118.00,
    peRatio: 7.9,
    dividendYield: 5.05,
    sector: 'Banking & Mobile Banking',
    description: 'ธนาคารพาณิชย์ชั้นนำของไทย ผู้นำดิจิทัลแบงก์กิ้งผ่านแอป K PLUS และนวัตกรรม AI จาก KBTG',
    charts: generateRealisticCharts(148.50, true)
  },
  {
    id: 'cat-or',
    symbol: 'OR',
    name: 'PTT Oil and Retail Business PCL',
    nameTh: 'ปตท. น้ำมันและการค้าปลีก (ปั๊ม PTT Station & Café Amazon)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 14.80,
    change: 0.10,
    changePercent: 0.68,
    high52w: 20.20,
    low52w: 13.90,
    peRatio: 16.5,
    dividendYield: 3.65,
    sector: 'Retail & Energy Station',
    description: 'สถานีบริการน้ำมัน PTT Station เครือข่ายร้านกาแฟ Café Amazon และธุรกิจไลฟ์สไตล์',
    charts: generateRealisticCharts(14.80, true)
  },
  {
    id: 'cat-mint',
    symbol: 'MINT',
    name: 'Minor International PCL',
    nameTh: 'ไมเนอร์ อินเตอร์เนชั่นแนล (โรงแรม Anantara, The Pizza, Swensen\'s)',
    type: 'stock_th',
    market: 'SET',
    currency: 'THB',
    price: 28.50,
    change: 0.50,
    changePercent: 1.79,
    high52w: 35.00,
    low52w: 26.00,
    peRatio: 22.1,
    dividendYield: 2.11,
    sector: 'Tourism, Hotel & Food',
    description: 'กลุ่มธุรกิจโรงแรมระดับโลกกว่า 500 แห่ง และแบรนด์ร้านอาหารชั้นนำกว่า 2,600 สาขา',
    charts: generateRealisticCharts(28.50, true)
  },

  // ETFS
  {
    id: 'cat-voo',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    nameTh: 'กองทุน Vanguard S&P 500 (ค่าธรรมเนียมต่ำพิเศษ 0.03%)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 516.40,
    change: 2.60,
    changePercent: 0.51,
    high52w: 520.10,
    low52w: 375.20,
    expenseRatio: '0.03%',
    issuer: 'Vanguard',
    sector: 'US Large-Cap Index',
    description: 'ETF ยอดนิยมสำหรับนักลงทุนระยะยาว ลงทุนในดัชนี S&P 500 ด้วยค่าธรรมเนียมต่ำที่สุดในอุตสาหกรรม',
    charts: generateRealisticCharts(516.40, true)
  },
  {
    id: 'cat-schd',
    symbol: 'SCHD',
    name: 'Schwab U.S. Dividend Equity ETF',
    nameTh: 'กองทุน Schwab หุ้นปันผลคุณภาพสูงสหรัฐฯ (Dividend Growth)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 82.45,
    change: 0.35,
    changePercent: 0.43,
    high52w: 83.90,
    low52w: 68.20,
    expenseRatio: '0.06%',
    dividendYield: 3.42,
    issuer: 'Charles Schwab',
    sector: 'High Dividend US Equities',
    description: 'ETF รวมหุ้นปันผลเติบโตต่อเนื่อง มีกระแสเงินสดแข็งแกร่งและอัตราจ่ายปันผลสม่ำเสมอ',
    charts: generateRealisticCharts(82.45, true)
  },
  {
    id: 'cat-smh',
    symbol: 'SMH',
    name: 'VanEck Semiconductor ETF',
    nameTh: 'กองทุน ETF ชิปเซมิคอนดักเตอร์โลก (NVDA, TSM, ASML)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 248.60,
    change: 5.20,
    changePercent: 2.14,
    high52w: 283.40,
    low52w: 138.50,
    expenseRatio: '0.35%',
    issuer: 'VanEck',
    sector: 'Global Semiconductor Mega-Trend',
    description: 'กองทุนรวมผู้ผลิตชิปฮาร์ดแวร์และเซมิคอนดักเตอร์ชั้นนำของโลก หัวใจของเทคโนโลยี AI',
    charts: generateRealisticCharts(248.60, true)
  },
  {
    id: 'cat-arkk',
    symbol: 'ARKK',
    name: 'ARK Innovation ETF',
    nameTh: 'กองทุน ARK นวัตกรรมเปลี่ยนโลก (Cathie Wood)',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 44.80,
    change: 1.10,
    changePercent: 2.52,
    high52w: 54.10,
    low52w: 34.00,
    expenseRatio: '0.75%',
    issuer: 'ARK Invest',
    sector: 'Disruptive Innovation',
    description: 'กองทุน Active ETF มุ่งเน้นลงทุนในเทคโนโลยีนวัตกรรมเปลี่ยนโลก เช่น AI, ยีนส์บำบัด, ยานยนต์ไร้คนขับ',
    charts: generateRealisticCharts(44.80, true)
  },
  {
    id: 'cat-tlt',
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    nameTh: 'กองทุน ETF พันธบัตรรัฐบาลสหรัฐฯ ระยะยาว 20 ปี+',
    type: 'etf',
    market: 'GLOBAL',
    currency: 'USD',
    price: 98.20,
    change: -0.40,
    changePercent: -0.41,
    high52w: 101.50,
    low52w: 82.40,
    expenseRatio: '0.15%',
    dividendYield: 3.85,
    issuer: 'BlackRock iShares',
    sector: 'US Long-Term Government Bonds',
    description: 'กองทุน ETF พันธบัตรรัฐบาลสหรัฐระยะยาว ได้รับประโยชน์สูงสุดเมื่อธนาคารกลางสหรัฐฯ ปรับลดอัตราดอกเบี้ย',
    charts: generateRealisticCharts(98.20, false)
  },

  // THAI MUTUAL FUNDS
  {
    id: 'cat-kusa',
    symbol: 'K-USA-A(A)',
    name: 'K USA Equity Fund Accumulation',
    nameTh: 'กองทุนเปิดเค ยูเอสเอ อิควิตี้ (หุ้นเติบโตสหรัฐฯ Morgan Stanley)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 14.3250,
    nav: 14.3250,
    change: 0.1850,
    changePercent: 1.31,
    high52w: 15.10,
    low52w: 10.40,
    expenseRatio: '1.60%',
    issuer: 'บลจ.กสิกรไทย (KAsset)',
    sector: 'US Growth Equity',
    description: 'กองทุนหลัก Morgan Stanley US Growth Fund ลงทุนในหุ้นเติบโตขนาดใหญ่และกลางในสหรัฐอเมริกา',
    charts: generateRealisticCharts(14.3250, true)
  },
  {
    id: 'cat-binnotech',
    symbol: 'B-INNOTECH',
    name: 'Bualuang Innotech Fund',
    nameTh: 'กองทุนเปิดบัวหลวงอินโนเวชั่นและเทคโนโลยี',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 28.4500,
    nav: 28.4500,
    change: 0.4200,
    changePercent: 1.50,
    high52w: 30.20,
    low52w: 21.00,
    expenseRatio: '1.28%',
    issuer: 'บลจ.บัวหลวง (BBLAM)',
    sector: 'Global Technology Mega-Cap',
    description: 'กองทุนหลัก Fidelity Global Technology Fund ลงทุนในบริษัทเทคโนโลยีชั้นนำทั่วโลกที่มีงบการเงินแข็งแกร่ง',
    charts: generateRealisticCharts(28.4500, true)
  },
  {
    id: 'cat-oneugg',
    symbol: 'ONE-UGG-RA',
    name: 'ONE Ultimate Global Growth Fund',
    nameTh: 'กองทุนเปิด วรรณ อัลติเมท โกลบอล โกรว์ธ (Baillie Gifford)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 22.1800,
    nav: 22.1800,
    change: 0.3500,
    changePercent: 1.60,
    high52w: 24.50,
    low52w: 16.20,
    expenseRatio: '1.65%',
    issuer: 'บลจ.วรรณ (ONEAM)',
    sector: 'Global Disruptive Growth',
    description: 'กองทุนหลัก Baillie Gifford Worldwide Long Term Global Growth คัดเลือกบริษัทที่มีศักยภาพเติบโต 5-10 ปีข้างหน้า',
    charts: generateRealisticCharts(22.1800, true)
  },
  {
    id: 'cat-ktchina',
    symbol: 'KT-CHINA-A',
    name: 'KTAM China Equity Fund',
    nameTh: 'กองทุนเปิดเคแทม ไชน่า อิควิตี้ ฟันด์ (หุ้นจีน All-China)',
    type: 'fund',
    market: 'THAI_FUND',
    currency: 'THB',
    price: 7.8420,
    nav: 7.8420,
    change: 0.0920,
    changePercent: 1.19,
    high52w: 8.90,
    low52w: 5.60,
    expenseRatio: '1.75%',
    issuer: 'บลจ.กรุงไทย (KTAM)',
    sector: 'China Equity (A-Shares & H-Shares)',
    description: 'กองทุนหลัก BGF China Fund ลงทุนในหุ้นจีนที่มีศักยภาพการเติบโตสูง ทั้ง A-Shares และตลาดฮ่องกง',
    charts: generateRealisticCharts(7.8420, true)
  }
];

