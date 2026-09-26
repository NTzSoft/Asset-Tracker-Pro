import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  Search,
  Pin,
  PinOff,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
  Calculator,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  Coins
} from 'lucide-react';
import { CryptoAsset, INITIAL_CRYPTO_LIST, EXTENDED_CRYPTO_CATALOG, createCustomCrypto, generateCryptoCharts } from '../data/crypto';

Chart.register(...registerables);

const STORAGE_CUSTOM_CRYPTO_KEY = 'asset_tracker_custom_cryptos';
const STORAGE_PINNED_CRYPTO_KEY = 'asset_tracker_pinned_cryptos';

interface CryptoHubProps {
  usdThb: number;
}

export function CryptoHub({ usdThb }: CryptoHubProps) {
  // Custom cryptos saved in localStorage
  const [customCryptos, setCustomCryptos] = useState<CryptoAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_CRYPTO_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pinned crypto symbols/IDs
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PINNED_CRYPTO_KEY);
      return saved ? JSON.parse(saved) : ['crypto-btc', 'crypto-eth', 'crypto-sol', 'crypto-bnb'];
    } catch {
      return ['crypto-btc', 'crypto-eth', 'crypto-sol', 'crypto-bnb'];
    }
  });

  // Master list of cryptos
  const allCryptos = useMemo(() => {
    const list = [...INITIAL_CRYPTO_LIST];
    // Merge extended catalog if not already in initial
    EXTENDED_CRYPTO_CATALOG.forEach(ext => {
      if (!list.some(item => item.symbol.toUpperCase() === ext.symbol.toUpperCase())) {
        list.push(ext);
      }
    });
    // Merge custom cryptos
    customCryptos.forEach(custom => {
      const existingIdx = list.findIndex(item => item.symbol.toUpperCase() === custom.symbol.toUpperCase());
      if (existingIdx >= 0) {
        list[existingIdx] = custom;
      } else {
        list.push(custom);
      }
    });
    return list;
  }, [customCryptos]);

  // Selected crypto for viewing chart
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [timeframe, setTimeframe] = useState<'24H' | '30D' | '1Y'>('24H');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pinned' | 'layer1' | 'meme' | 'defi_ai' | 'custom'>('all');
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Add custom crypto modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    symbol: '',
    name: '',
    nameTh: '',
    glyph: '🪙',
    category: 'Layer 1 / Web3 Asset',
    price: '',
    changePercent24h: '0',
    description: ''
  });

  // Quick Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(1);
  const [calcSymbol, setCalcSymbol] = useState<string>('BTC');

  // Automatically update calculator symbol whenever a user selects/clicks any cryptocurrency
  useEffect(() => {
    if (selectedSymbol) {
      setCalcSymbol(selectedSymbol);
      // Smart default amount for micro-priced tokens like SHIB, PEPE, BONK, etc.
      const currentAsset = allCryptos.find(c => c.symbol.toUpperCase() === selectedSymbol.toUpperCase());
      if (currentAsset && currentAsset.price < 0.01) {
        setCalcAmount(1000000); // 1 Million for micro coins like SHIB
      } else if (currentAsset && currentAsset.price < 1) {
        setCalcAmount(100);
      } else {
        setCalcAmount(1);
      }
    }
  }, [selectedSymbol]);

  // Live status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chart reference
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Active selected crypto object
  const activeCrypto = useMemo(() => {
    return allCryptos.find(c => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || allCryptos[0];
  }, [allCryptos, selectedSymbol]);

  // Save pinned cryptos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PINNED_CRYPTO_KEY, JSON.stringify(pinnedIds));
    } catch (e) {
      console.error('Failed to save pinned cryptos:', e);
    }
  }, [pinnedIds]);

  // Save custom cryptos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_CRYPTO_KEY, JSON.stringify(customCryptos));
    } catch (e) {
      console.error('Failed to save custom cryptos:', e);
    }
  }, [customCryptos]);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Pin handler
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPinnedIds(prev => {
      const isPinned = prev.includes(id);
      const next = isPinned ? prev.filter(x => x !== id) : [...prev, id];
      const target = allCryptos.find(c => c.id === id);
      showToast(isPinned ? `ยกเลิกการปักหมุด ${target?.symbol || ''}` : `ปักหมุด ${target?.symbol || ''} สำเร็จ!`);
      return next;
    });
  };

  // Delete custom crypto
  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = customCryptos.find(c => c.id === id);
    if (window.confirm(`ต้องการลบ ${target?.symbol} ออกจากรายการหรือไม่?`)) {
      setCustomCryptos(prev => prev.filter(c => c.id !== id));
      setPinnedIds(prev => prev.filter(pId => pId !== id));
      showToast(`ลบ ${target?.symbol} เรียบร้อยแล้ว`);
      if (selectedSymbol.toUpperCase() === target?.symbol.toUpperCase()) {
        setSelectedSymbol('BTC');
      }
    }
  };

  // Helper to check if running on internal full-stack node server
  const isInternalHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname.endsWith('.run.app'));

  // Search API Debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 1) {
      setApiSearchResults([]);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        let results: any[] = [];
        const q = trimmed.toLowerCase();

        // 1. Search in-memory database of all known cryptos (instant, 0-latency, 0 network errors)
        const localMatches = allCryptos.filter(c => 
          c.symbol.toLowerCase().includes(q) || 
          c.name.toLowerCase().includes(q) || 
          c.nameTh.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        ).map(c => ({
          symbol: c.symbol,
          name: c.name,
          nameTh: c.nameTh,
          glyph: c.glyph,
          category: c.category,
          rank: c.rank,
          price: c.price,
          change24h: c.change24h,
          changePercent24h: c.changePercent24h
        }));

        // 2. If running on internal server, try internal API route
        if (isInternalHost) {
          try {
            const res = await fetch(`/api/crypto/search?q=${encodeURIComponent(trimmed)}`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.quotes) && data.quotes.length > 0) {
                results = data.quotes;
              }
            }
          } catch {
            // Use local matches
          }
        }

        // Combine unique results
        const combined = [...results];
        localMatches.forEach(lm => {
          if (!combined.some(r => r.symbol.toUpperCase() === lm.symbol.toUpperCase())) {
            combined.push(lm);
          }
        });

        setApiSearchResults(combined.slice(0, 10));
      } catch (err) {
        console.warn('Crypto search query error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, allCryptos, isInternalHost]);

  // 1-Click Pin or Add from Live Search Result
  const handleAddAndPinFromApi = async (quote: any) => {
    const symbol = quote.symbol.toUpperCase();
    setIsSearchingApi(true);
    try {
      let newAsset: CryptoAsset | null = null;

      // 1. Check local catalog first (highest fidelity, zero network errors)
      const existingInCatalog = allCryptos.find(c => c.symbol.toUpperCase() === symbol);
      if (existingInCatalog) {
        newAsset = {
          ...existingInCatalog,
          id: `crypto-${symbol.toLowerCase()}-${Date.now()}`
        };
      }

      // 2. If on internal fullstack server and not in catalog, try API route
      if (!newAsset && isInternalHost) {
        try {
          const qRes = await fetch(`/api/crypto/quote?symbol=${encodeURIComponent(symbol)}`);
          if (qRes.ok) {
            const qData = await qRes.json();
            newAsset = {
              id: `crypto-${symbol.toLowerCase()}-${Date.now()}`,
              symbol: qData.symbol,
              name: qData.name || quote.name,
              nameTh: qData.nameTh || quote.nameTh || `เหรียญ ${symbol}`,
              glyph: qData.glyph || quote.glyph || '🪙',
              category: qData.category || quote.category || 'Cryptocurrency',
              rank: qData.rank || quote.rank || 99,
              price: qData.price,
              change24h: qData.change24h,
              changePercent24h: qData.changePercent24h,
              high24h: qData.high24h,
              low24h: qData.low24h,
              volumeUsdt: qData.volumeUsdt,
              description: `สินทรัพย์คริปโต ${symbol} ดึงข้อมูลสดจากตลาด`,
              charts: qData.charts
            };
          }
        } catch {
          // Fall through to custom crypto generator
        }
      }

      // 3. Fallback to custom crypto generator
      if (!newAsset) {
        newAsset = createCustomCrypto({
          symbol,
          name: quote.name || symbol,
          nameTh: quote.nameTh,
          glyph: quote.glyph || '🪙',
          category: quote.category || 'Cryptocurrency',
          price: quote.price || 1.0,
          changePercent24h: quote.changePercent24h || 2.5
        });
      }

      // Add to custom list if not existing
      setCustomCryptos(prev => {
        const exists = prev.some(c => c.symbol.toUpperCase() === symbol);
        return exists ? prev.map(c => c.symbol.toUpperCase() === symbol ? newAsset! : c) : [newAsset!, ...prev];
      });

      // Pin it
      setPinnedIds(prev => prev.includes(newAsset!.id) ? prev : [newAsset!.id, ...prev]);
      setSelectedSymbol(newAsset!.symbol);
      setSearchQuery('');
      setSearchFocused(false);
      showToast(`เพิ่มและปักหมุด ${newAsset!.symbol} เรียบร้อยแล้ว!`);
    } catch (err) {
      console.error('Add crypto failed:', err);
      showToast(`ไม่สามารถเพิ่ม ${symbol} ได้`);
    } finally {
      setIsSearchingApi(false);
    }
  };

  // Auto fetch quote in Add Modal
  const handleAutoFetchQuote = async () => {
    const sym = addForm.symbol.trim().toUpperCase();
    if (!sym) {
      setFetchError('กรุณากรอกสัญลักษณ์เหรียญ เช่น SOL, XRP, SUI, DOGE, PEPE, SD');
      return;
    }

    setIsFetchingQuote(true);
    setFetchError(null);

    try {
      // 1. Check local catalog first (instant & reliable)
      const matched = allCryptos.find(c => c.symbol.toUpperCase() === sym);
      if (matched) {
        setAddForm(prev => ({
          ...prev,
          name: matched.name,
          nameTh: matched.nameTh,
          glyph: matched.glyph,
          category: matched.category,
          price: String(matched.price),
          changePercent24h: String(matched.changePercent24h),
          description: matched.description || `เหรียญ ${sym}`
        }));
        showToast(`พบข้อมูลเหรียญ ${sym} ในฐานข้อมูล! ($${matched.price})`);
        return;
      }

      // 2. If on internal server, try backend route
      if (isInternalHost) {
        try {
          const res = await fetch(`/api/crypto/quote?symbol=${encodeURIComponent(sym)}`);
          if (res.ok) {
            const data = await res.json();
            setAddForm(prev => ({
              ...prev,
              name: data.name || prev.name,
              nameTh: data.nameTh || prev.nameTh,
              glyph: data.glyph || prev.glyph,
              category: data.category || prev.category,
              price: data.price ? String(data.price) : prev.price,
              changePercent24h: data.changePercent24h ? String(data.changePercent24h) : prev.changePercent24h,
              description: `เหรียญ ${sym} ตลาดคริปโตสากล`
            }));
            showToast(`ดึงข้อมูลสด ${sym} สำเร็จ! ($${data.price})`);
            return;
          }
        } catch {
          // Fall through
        }
      }

      // 3. Fallback: prompt manual fill
      setFetchError(`ไม่พบข้อมูลสดอัตโนมัติของ ${sym} คุณสามารถระบุชื่อและราคาได้เอง`);
    } catch {
      setFetchError('ไม่สามารถดึงข้อมูลเหรียญได้ กรุณาระบุราคาด้วยตนเอง');
    } finally {
      setIsFetchingQuote(false);
    }
  };

  // Submit Add Modal
  const handleSaveCustomCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = addForm.symbol.trim().toUpperCase();
    const price = parseFloat(addForm.price);

    if (!sym) {
      setFetchError('กรุณาระบุสัญลักษณ์เหรียญ');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setFetchError('กรุณาระบุราคาที่มากกว่า 0');
      return;
    }

    const newAsset = createCustomCrypto({
      symbol: sym,
      name: addForm.name || `${sym} Token`,
      nameTh: addForm.nameTh || `เหรียญ ${sym}`,
      glyph: addForm.glyph || '🪙',
      category: addForm.category || 'Cryptocurrency',
      price: price,
      changePercent24h: parseFloat(addForm.changePercent24h) || 0,
      description: addForm.description || `เหรียญ ${sym} เพิ่มโดยผู้ใช้งาน`
    });

    setCustomCryptos(prev => [newAsset, ...prev.filter(c => c.symbol.toUpperCase() !== sym)]);
    setPinnedIds(prev => [newAsset.id, ...prev]);
    setSelectedSymbol(newAsset.symbol);
    setIsAddModalOpen(false);
    setAddForm({
      symbol: '',
      name: '',
      nameTh: '',
      glyph: '🪙',
      category: 'Layer 1 / Web3 Asset',
      price: '',
      changePercent24h: '0',
      description: ''
    });
    showToast(`เพิ่มและปักหมุดเหรียญ ${newAsset.symbol} เรียบร้อย!`);
  };

  // Render Chart with Chart.js
  useEffect(() => {
    if (!chartCanvasRef.current || !activeCrypto) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const isPos = activeCrypto.changePercent24h >= 0;
    const generatedCharts = generateCryptoCharts(activeCrypto.price, isPos);
    const chartData = activeCrypto.charts?.[timeframe] || generatedCharts[timeframe] || generatedCharts['24H'];
    const strokeColor = isPos ? '#10b981' : '#f43f5e';
    const gradientStart = isPos ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)';
    const gradientEnd = 'rgba(15, 23, 42, 0.0)';

    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: `${activeCrypto.symbol} / USD`,
            data: chartData.prices,
            borderColor: strokeColor,
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: chartData.prices.length > 20 ? 1.5 : 4,
            pointBackgroundColor: strokeColor,
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: strokeColor,
            pointHoverBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(51, 65, 85, 0.8)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y;
                const formattedUsd = val >= 10 
                  ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `$${val.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
                const thbVal = Math.round(val * usdThb);
                return [
                  `ราคา (USD): ${formattedUsd}`,
                  `ประมาณเงินบาท: ฿${thbVal.toLocaleString()} THB`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.25)'
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 }
            }
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(51, 65, 85, 0.25)'
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 11, family: 'monospace' },
              callback: (val) => {
                const num = Number(val);
                if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
                if (num >= 1) return `$${num.toFixed(num > 10 ? 1 : 2)}`;
                return `$${num.toFixed(4)}`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeCrypto, timeframe, usdThb]);

  // Filtered cryptos for table
  const filteredCryptos = useMemo(() => {
    return allCryptos.filter(item => {
      // Category filter
      if (categoryFilter === 'pinned' && !pinnedIds.includes(item.id)) return false;
      if (categoryFilter === 'custom' && !item.id.startsWith('crypto-custom')) return false;
      if (categoryFilter === 'layer1' && !item.category.toLowerCase().includes('layer 1') && !item.category.toLowerCase().includes('gold') && !item.category.toLowerCase().includes('smart')) return false;
      if (categoryFilter === 'meme' && !item.category.toLowerCase().includes('meme')) return false;
      if (categoryFilter === 'defi_ai' && !item.category.toLowerCase().includes('defi') && !item.category.toLowerCase().includes('ai') && !item.category.toLowerCase().includes('rwa') && !item.category.toLowerCase().includes('oracle') && !item.category.toLowerCase().includes('depin')) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mSymbol = item.symbol.toLowerCase().includes(q);
        const mName = item.name.toLowerCase().includes(q);
        const mNameTh = item.nameTh.toLowerCase().includes(q);
        const mCat = item.category.toLowerCase().includes(q);
        return mSymbol || mName || mNameTh || mCat;
      }
      return true;
    });
  }, [allCryptos, categoryFilter, searchQuery, pinnedIds]);

  // Pinned cryptos list for quick cards
  const pinnedCryptosList = useMemo(() => {
    return allCryptos.filter(c => pinnedIds.includes(c.id));
  }, [allCryptos, pinnedIds]);

  // Calculator target asset
  const calcAsset = useMemo(() => {
    return allCryptos.find(c => c.symbol.toUpperCase() === calcSymbol.toUpperCase()) || activeCrypto;
  }, [allCryptos, calcSymbol, activeCrypto]);

  const convertedTHB = (calcAmount || 0) * (calcAsset?.price || 0) * usdThb;
  const convertedUSD = (calcAmount || 0) * (calcAsset?.price || 0);

  // Range percentage for day bar
  const rangePct = useMemo(() => {
    if (!activeCrypto) return 50;
    const diff = activeCrypto.high24h - activeCrypto.low24h;
    if (diff <= 0) return 50;
    const pos = ((activeCrypto.price - activeCrypto.low24h) / diff) * 100;
    return Math.min(Math.max(Math.round(pos), 0), 100);
  }, [activeCrypto]);

  return (
    <div className="space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl shadow-amber-500/20 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. UNIVERSAL SEARCH BAR & QUICK ACTION BUTTONS */}
      {/* ========================================================================= */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/70 rounded-2xl p-4 sm:p-5 shadow-xl relative z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box with Real-time Auto-Suggest dropdown */}
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเหรียญคริปโตทุกเหรียญในโลก (เช่น BTC, SOL, XRP, SUI, DOGE, PEPE, NEAR, RENDER)..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-10 py-3 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setApiSearchResults([]); }}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* LIVE API SEARCH DROPDOWN RESULTS */}
            {searchFocused && (apiSearchResults.length > 0 || isSearchingApi) && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-800 backdrop-blur-xl"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="p-2.5 bg-slate-950/80 px-4 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> ผลการค้นหาจาก Binance Spot & Global Market
                  </span>
                  <span>{isSearchingApi ? 'กำลังค้นหา...' : `พบ ${apiSearchResults.length} รายการ`}</span>
                </div>

                {isSearchingApi && (
                  <div className="p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>กำลังดึงข้อมูลเรียลไทม์จากตลาดโลก...</span>
                  </div>
                )}

                {apiSearchResults.map((quote) => {
                  const isAlreadyPinned = pinnedIds.some(id => id.includes(quote.symbol.toLowerCase()));
                  return (
                    <div
                      key={quote.symbol}
                      className="p-3.5 px-4 hover:bg-slate-800/80 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base shrink-0">
                          {quote.glyph || '🪙'}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{quote.symbol}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {quote.category || 'Spot USDT'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{quote.name} • {quote.nameTh}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {quote.price > 0 && (
                          <div className="text-right">
                            <p className="text-sm font-mono font-bold text-white">${quote.price >= 10 ? quote.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : quote.price.toFixed(4)}</p>
                            <span className={`text-[11px] font-mono ${quote.changePercent24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {quote.changePercent24h >= 0 ? '+' : ''}{quote.changePercent24h.toFixed(2)}%
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleAddAndPinFromApi(quote)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isAlreadyPinned
                              ? 'bg-slate-800 text-amber-400 border border-amber-400/40 hover:bg-slate-700'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5 fill-current" />
                          <span>{isAlreadyPinned ? 'ปักหมุดอยู่แล้ว (ดู)' : '+ ปักหมุดทันที'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มเหรียญใหม่เข้าระบบ</span>
            </button>
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/60 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> หมวดหมู่:
          </span>
          {[
            { id: 'all', label: 'ทั้งหมด (All Cryptos)' },
            { id: 'pinned', label: `★ ปักหมุดไว้ (${pinnedIds.length})` },
            { id: 'layer1', label: 'Layer 1 / Smart Contract' },
            { id: 'meme', label: '🐸 Meme Coins' },
            { id: 'defi_ai', label: '🤖 DeFi & AI & RWA' },
            { id: 'custom', label: `เหรียญที่เพิ่มเอง (${customCryptos.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PINNED CRYPTOS CAROUSEL / SELECTOR CARDS */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-amber-400 fill-current" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              เหรียญที่ปักหมุดไว้ (Pinned Watchlist) • {pinnedCryptosList.length} เหรียญ
            </h3>
          </div>
          <span className="text-xs text-slate-400">คลิกที่การ์ดเพื่อดูกราฟและรายละเอียด</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {pinnedCryptosList.map((item) => {
            const isSelected = selectedSymbol.toUpperCase() === item.symbol.toUpperCase();
            const isPos = item.changePercent24h >= 0;
            const priceFormatted = item.price >= 10
              ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
            const priceThb = Math.round(item.price * usdThb);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedSymbol(item.symbol)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/15'
                    : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Header with symbol and pin toggle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-base shadow">
                      {item.glyph}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-base">{item.symbol}</span>
                        {item.rank <= 50 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            #{item.rank}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[120px]">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleTogglePin(item.id, e)}
                      title="ยกเลิกปักหมุด"
                      className="p-1 rounded-lg hover:bg-slate-700/80 text-amber-400 transition-colors"
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isPos ? '▲ +' : '▼ '}{item.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-2">
                  <p className="text-xl sm:text-2xl font-black text-white font-mono">
                    {priceFormatted}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    ≈ ฿{priceThb.toLocaleString()} บาท
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE CRYPTO CHART & DETAILED METRICS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Interactive Crypto Chart */}
        <div className="lg:col-span-2 bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl">{activeCrypto.glyph}</span>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  กราฟราคา {activeCrypto.name} ({activeCrypto.symbol}/USDT)
                </h2>
                <button
                  onClick={(e) => handleTogglePin(activeCrypto.id, e)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    pinnedIds.includes(activeCrypto.id)
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
                >
                  <Pin className={`w-3 h-3 ${pinnedIds.includes(activeCrypto.id) ? 'fill-current' : ''}`} />
                  <span>{pinnedIds.includes(activeCrypto.id) ? 'ปักหมุดแล้ว' : '+ ปักหมุด'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeCrypto.nameTh} • {activeCrypto.category}</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
              {(['24H', '30D', '1Y'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf === '24H' ? '24 ชม.' : tf === '30D' ? '30 วัน' : '1 ปี (รายเดือน)'}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative w-full h-72 sm:h-80 md:h-96">
            <canvas ref={chartCanvasRef} id="cryptoHubChartCanvas" />
          </div>

          {/* Range Meter */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-slate-400">ต่ำสุด 24 ชม.:</span>
                <span className="font-bold text-rose-400 ml-1 font-mono">
                  ${activeCrypto.low24h >= 10 ? activeCrypto.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 }) : activeCrypto.low24h.toFixed(4)}
                </span>
              </div>
              <div className="hidden sm:block text-slate-600">|</div>
              <div>
                <span className="text-slate-400">สูงสุด 24 ชม.:</span>
                <span className="font-bold text-emerald-400 ml-1 font-mono">
                  ${activeCrypto.high24h >= 10 ? activeCrypto.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 }) : activeCrypto.high24h.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-56 flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Day Range Position</span>
                <span className="text-amber-400 font-semibold">{rangePct}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/80">
                <div 
                  className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${rangePct}%` }} 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Active Crypto Overview & Calculator */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* Active Crypto Spotlight Card */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 border-l-4 border-l-amber-400 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {activeCrypto.name} ({activeCrypto.symbol})
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Binance Spot Feed
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {activeCrypto.price >= 10 
                  ? `$${activeCrypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                  : `$${activeCrypto.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>

            <div className="mt-1 font-mono text-sm text-amber-400 font-bold">
              ≈ ฿{Math.round(activeCrypto.price * usdThb).toLocaleString()} บาท
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs border ${
                activeCrypto.changePercent24h >= 0 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {activeCrypto.changePercent24h >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {activeCrypto.changePercent24h >= 0 ? '+' : ''}{activeCrypto.change24h.toFixed(activeCrypto.price > 10 ? 2 : 4)} ({activeCrypto.changePercent24h >= 0 ? '+' : ''}{activeCrypto.changePercent24h.toFixed(2)}%)
              </span>
              <span className="text-xs text-slate-400">24h Change</span>
            </div>
          </div>

          {/* Volume & Details */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">ข้อมูลและสภาพคล่อง 24 ชม.</h3>
              <span className="text-[11px] font-mono text-amber-400/90">{activeCrypto.category}</span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">24h Trading Volume (ปริมาณซื้อขาย)</span>
              <p className="text-lg font-bold text-slate-100 mt-1 font-mono">
                ${(activeCrypto.volumeUsdt).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
              </p>
              <span className="text-[10px] text-slate-400">≈ ฿{Math.round(activeCrypto.volumeUsdt * usdThb).toLocaleString()} บาท</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">อันดับตลาด (Rank)</span>
                <span className="font-bold text-slate-200 mt-0.5 block">#{activeCrypto.rank}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">อัตราแลกเปลี่ยน</span>
                <span className="font-bold text-slate-200 mt-0.5 block font-mono">฿{usdThb.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Crypto Value Calculator (แปลงมูลค่าเหรียญตามที่เลือก ↔ THB) */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-1.5 truncate">
                <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>แปลงมูลค่า {calcAsset.symbol} ↔ THB</span>
              </h3>
              <select
                value={calcAsset.symbol}
                onChange={(e) => {
                  setSelectedSymbol(e.target.value);
                  setCalcSymbol(e.target.value);
                }}
                className="bg-slate-900 text-xs font-bold text-amber-400 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[130px] truncate"
              >
                {allCryptos.map(c => (
                  <option key={c.id} value={c.symbol}>
                    {c.glyph} {c.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {/* Amount input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={calcAmount || ''}
                    onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono font-bold focus:outline-none focus:border-amber-400 pr-16"
                    placeholder="ใส่จำนวนเหรียญ"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-amber-400 font-bold font-mono">
                    {calcAsset.symbol}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] text-slate-500 font-medium shrink-0">จำนวน:</span>
                {(calcAsset.price < 0.01 
                  ? [100000, 1000000, 10000000, 50000000] // Micro tokens like SHIB, PEPE
                  : calcAsset.price < 1 
                  ? [10, 100, 500, 1000] // Sub-dollar tokens like DOGE, ADA, XRP
                  : [0.1, 1, 5, 10] // High value tokens like BTC, ETH, SOL, BNB
                ).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCalcAmount(preset)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold transition-colors shrink-0 ${
                      calcAmount === preset
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-800'
                    }`}
                  >
                    {preset >= 1000000 
                      ? `${(preset / 1000000)}M` 
                      : preset >= 1000 
                      ? `${(preset / 1000)}k` 
                      : preset}
                  </button>
                ))}
              </div>

              {/* Converted Output Card */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">มูลค่าเงินบาท (THB):</span>
                  <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">
                    ฿{convertedTHB >= 1000 
                      ? Math.round(convertedTHB).toLocaleString()
                      : convertedTHB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-1.5">
                  <span>มูลค่าดอลลาร์ (USD):</span>
                  <span className="font-mono text-slate-300">
                    ${convertedUSD >= 1000 
                      ? convertedUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : convertedUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. COMPREHENSIVE CRYPTO TABLE & PINNING INTERFACE */}
      {/* ========================================================================= */}
      <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              ตารางสรุปราคาสินทรัพย์คริปโตเคอร์เรนซี ({filteredCryptos.length} เหรียญ)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Binance Spot Feed • คลิกเพื่อเลือกดูกราฟ หรือปักหมุด</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">ปักหมุด</th>
                <th className="pb-3">สินทรัพย์ (Asset)</th>
                <th className="pb-3 text-right">ราคา (USD)</th>
                <th className="pb-3 text-right">ราคาแปลงเงินบาท (THB)</th>
                <th className="pb-3 text-right">เปลี่ยนแปลง 24 ชม.</th>
                <th className="pb-3 text-right">ช่วงราคา 24 ชม. (High / Low)</th>
                <th className="pb-3 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCryptos.map((item) => {
                const isSelected = selectedSymbol.toUpperCase() === item.symbol.toUpperCase();
                const isPinned = pinnedIds.includes(item.id);
                const isPos = item.changePercent24h >= 0;
                const isCustom = item.id.startsWith('crypto-custom');

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${isSelected ? 'bg-amber-500/10' : ''}`}
                  >
                    {/* Pin button column */}
                    <td className="py-3.5 pl-2">
                      <button
                        onClick={(e) => handleTogglePin(item.id, e)}
                        title={isPinned ? 'ยกเลิกการปักหมุด' : 'ปักหมุดไว้ด้านบน'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isPinned 
                            ? 'text-amber-400 hover:text-amber-300' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Pin className={`w-4 h-4 ${isPinned ? 'fill-current text-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Asset Name and Symbol */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                          {item.glyph}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{item.symbol}</span>
                            {isCustom && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                ผู้ใช้เพิ่ม
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">{item.name} • {item.nameTh}</span>
                        </div>
                      </div>
                    </td>

                    {/* Price in USD */}
                    <td className="py-3.5 text-right font-mono font-bold text-white">
                      {item.price >= 10 
                        ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`}
                    </td>

                    {/* Price in THB */}
                    <td className="py-3.5 text-right font-mono font-bold text-amber-400">
                      ฿{Math.round(item.price * usdThb).toLocaleString()}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 text-right font-mono">
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-semibold text-xs ${
                        isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isPos ? '▲ +' : '▼ '}{item.changePercent24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h Range */}
                    <td className="py-3.5 text-right font-mono text-slate-400 text-xs">
                      ${item.high24h >= 10 ? item.high24h.toLocaleString('en-US', { maximumFractionDigits: 2 }) : item.high24h.toFixed(4)} / ${item.low24h >= 10 ? item.low24h.toLocaleString('en-US', { maximumFractionDigits: 2 }) : item.low24h.toFixed(4)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedSymbol(item.symbol)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                            isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? 'กำลังดู' : 'เลือก'}
                        </button>
                        {isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustom(item.id, e)}
                            title="ลบเหรียญที่เพิ่มเอง"
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ADD CUSTOM CRYPTO MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">เพิ่มเหรียญคริปโตใหม่เข้าระบบ</h3>
                  <p className="text-xs text-slate-400">กรอกสัญลักษณ์เพื่อดึงข้อมูลสด หรือตั้งค่าด้วยตนเอง</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomCrypto} className="p-5 space-y-4">
              {fetchError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              {/* Symbol Input with Auto-Fetch */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  สัญลักษณ์เหรียญ (Symbol) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={addForm.symbol}
                    onChange={(e) => setAddForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    placeholder="เช่น XRP, SOL, SUI, DOGE, PEPE, NEAR..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm uppercase font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAutoFetchQuote}
                    disabled={isFetchingQuote}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingQuote ? 'animate-spin' : ''}`} />
                    <span>{isFetchingQuote ? 'กำลังดึง...' : 'ดึงราคา Real-time'}</span>
                  </button>
                </div>
              </div>

              {/* Name & NameTH */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อเหรียญ (ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="เช่น Sui Network"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">คำอธิบายภาษาไทย</label>
                  <input
                    type="text"
                    value={addForm.nameTh}
                    onChange={(e) => setAddForm(prev => ({ ...prev, nameTh: e.target.value }))}
                    placeholder="เช่น ซุย (บล็อกเชน Layer 1)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Price & Change */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ราคาล่าสุด (USD) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={addForm.price}
                    onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="เช่น 3.25"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">เปลี่ยนแปลง 24 ชม. (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addForm.changePercent24h}
                    onChange={(e) => setAddForm(prev => ({ ...prev, changePercent24h: e.target.value }))}
                    placeholder="เช่น 5.2"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Emoji Icon & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ไอคอน / Emoji</label>
                  <input
                    type="text"
                    value={addForm.glyph}
                    onChange={(e) => setAddForm(prev => ({ ...prev, glyph: e.target.value }))}
                    placeholder="เช่น 🪙, 💧, 🐸"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                  <input
                    type="text"
                    value={addForm.category}
                    onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="เช่น Layer 1 / Meme Coin"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  บันทึกและปักหมุด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
