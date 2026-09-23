import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Pin,
  PinOff,
  TrendingUp,
  TrendingDown,
  Building2,
  PieChart,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  SlidersHorizontal,
  Globe,
  Sparkles,
  DollarSign,
  Star,
  Check,
  Filter,
  Plus,
  PlusCircle,
  Trash2,
  X,
  Clock,
  AlertCircle,
  FolderPlus,
  Loader2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Chart as ChartJS } from 'chart.js';
import {
  MarketSecurity,
  SecurityType,
  INITIAL_SECURITIES,
  EXTENDED_CATALOG,
  createCustomSecurity,
  generateRealisticCharts
} from '../data/securities';

interface SecuritiesHubProps {
  securities?: MarketSecurity[];
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
  usdThb: number;
}

interface LiveSearchResult {
  symbol: string;
  shortname: string;
  longname: string;
  exchange: string;
  typeDisp: string;
  type: SecurityType;
  sector: string;
}

export const SecuritiesHub: React.FC<SecuritiesHubProps> = ({
  securities: propSecurities = INITIAL_SECURITIES,
  pinnedIds,
  onTogglePin,
  usdThb
}) => {
  // Custom user-added securities state from localStorage
  const [customSecurities, setCustomSecurities] = useState<MarketSecurity[]>(() => {
    try {
      const saved = localStorage.getItem('asset_tracker_custom_securities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save custom securities to localStorage
  const saveCustomSecurities = (items: MarketSecurity[]) => {
    setCustomSecurities(items);
    try {
      localStorage.setItem('asset_tracker_custom_securities', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save custom securities', e);
    }
  };

  // Combine default and custom securities (avoiding duplicate IDs)
  const allSecurities = useMemo(() => {
    const map = new Map<string, MarketSecurity>();
    propSecurities.forEach((s) => map.set(s.id, s));
    customSecurities.forEach((s) => map.set(s.id, s));
    return Array.from(map.values());
  }, [propSecurities, customSecurities]);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pinned' | 'custom' | SecurityType>('all');
  const [selectedId, setSelectedId] = useState<string>(allSecurities[0]?.id || 'sec-nvda');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  // Live market search state
  const [liveSearchResults, setLiveSearchResults] = useState<LiveSearchResult[]>([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [loadingSymbol, setLoadingSymbol] = useState<string | null>(null);

  // Modal / Creator State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFetchingQuoteModal, setIsFetchingQuoteModal] = useState(false);

  // Form State for Adding Custom Asset
  const [formSymbol, setFormSymbol] = useState('');
  const [formName, setFormName] = useState('');
  const [formNameTh, setFormNameTh] = useState('');
  const [formType, setFormType] = useState<SecurityType>('stock_us');
  const [formCurrency, setFormCurrency] = useState<'USD' | 'THB'>('USD');
  const [formPrice, setFormPrice] = useState<string>('100.00');
  const [formSector, setFormSector] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formChangePct, setFormChangePct] = useState<string>('1.5');

  // Investment Simulator State
  const [dcaAmount, setDcaAmount] = useState<number>(5000);
  const [dcaMonths, setDcaMonths] = useState<number>(12);
  const [expectedGrowthPct, setExpectedGrowthPct] = useState<number>(12);

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Live search effect
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 1) {
      setLiveSearchResults([]);
      setIsLiveSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLiveSearching(true);
      try {
        const res = await fetch(`/api/securities/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.quotes)) {
            setLiveSearchResults(data.quotes);
          }
        }
      } catch (err) {
        console.warn('Live search error:', err);
      } finally {
        setIsLiveSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Selected Security object
  const activeSecurity = useMemo(() => {
    return allSecurities.find((s) => s.id === selectedId) || allSecurities[0];
  }, [allSecurities, selectedId]);

  // Pinned securities list
  const pinnedSecurities = useMemo(() => {
    return allSecurities.filter((s) => pinnedIds.includes(s.id));
  }, [allSecurities, pinnedIds]);

  // Filtered securities list from active collection
  const filteredSecurities = useMemo(() => {
    return allSecurities.filter((item) => {
      if (typeFilter === 'pinned' && !pinnedIds.includes(item.id)) {
        return false;
      }
      if (typeFilter === 'custom' && !item.id.startsWith('custom-') && !customSecurities.some((c) => c.id === item.id)) {
        return false;
      }
      if (typeFilter !== 'all' && typeFilter !== 'pinned' && typeFilter !== 'custom' && item.type !== typeFilter) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameTh.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        (item.issuer && item.issuer.toLowerCase().includes(q))
      );
    });
  }, [allSecurities, typeFilter, pinnedIds, searchQuery, customSecurities]);

  // Extended catalog search matches (items in catalog not yet in active list)
  const catalogSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const existingSymbols = new Set(allSecurities.map((s) => s.symbol.toUpperCase()));

    return EXTENDED_CATALOG.filter((item) => {
      if (existingSymbols.has(item.symbol.toUpperCase())) return false;
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameTh.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q)
      );
    }).slice(0, 4);
  }, [searchQuery, allSecurities]);

  // Direct fetch live quote for ANY ticker and add to list + optional pin
  const handleFetchAndAddSecurity = async (rawSymbol: string, pinImmediately: boolean = true) => {
    const symbol = rawSymbol.trim().toUpperCase();
    if (!symbol) return;

    // Check if already in list
    const existing = allSecurities.find((s) => s.symbol.toUpperCase() === symbol);
    if (existing) {
      setSelectedId(existing.id);
      if (pinImmediately && !pinnedIds.includes(existing.id)) {
        onTogglePin(existing.id);
        showToast(`ปักหมุด "${existing.symbol}" เรียบร้อยแล้ว ⭐`);
      } else {
        showToast(`สินทรัพย์ "${existing.symbol}" อยู่ในรายการแล้ว`);
      }
      return;
    }

    setLoadingSymbol(symbol);
    try {
      // 1. Try to fetch live quote from API
      const res = await fetch(`/api/securities/quote?symbol=${encodeURIComponent(symbol)}`);
      if (res.ok) {
        const liveData = await res.json();
        const newSec: MarketSecurity = {
          id: `custom-${symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
          symbol: liveData.symbol || symbol,
          name: liveData.name || symbol,
          nameTh: liveData.nameTh || liveData.name || symbol,
          type: liveData.type || (symbol.endsWith('.BK') ? 'stock_th' : 'stock_us'),
          market: liveData.market || (symbol.endsWith('.BK') ? 'SET' : 'US'),
          currency: liveData.currency || (symbol.endsWith('.BK') ? 'THB' : 'USD'),
          price: liveData.price || 100,
          change: liveData.change || 0,
          changePercent: liveData.changePercent || 0,
          high52w: liveData.high52w || liveData.price * 1.2,
          low52w: liveData.low52w || liveData.price * 0.8,
          sector: liveData.sector || 'การลงทุน & หุ้นสากล',
          issuer: liveData.issuer || 'Listed Security',
          description: liveData.description || `สินทรัพย์ ${symbol} จากตลาดการเงินโลก`,
          charts: liveData.charts || generateRealisticCharts(liveData.price || 100, (liveData.changePercent || 0) >= 0)
        };

        const updated = [newSec, ...customSecurities];
        saveCustomSecurities(updated);
        setSelectedId(newSec.id);
        if (pinImmediately && !pinnedIds.includes(newSec.id)) {
          onTogglePin(newSec.id);
        }
        showToast(`เพิ่ม & ปักหมุด "${newSec.symbol} (${newSec.currency === 'USD' ? '$' : '฿'}${newSec.price})" เรียบร้อยแล้ว 🚀`);
        return;
      }
    } catch (e) {
      console.warn('Direct live quote fetch failed, creating security with fallback data', e);
    } finally {
      setLoadingSymbol(null);
    }

    // Fallback: Check extended catalog or create new with generated charts
    const catalogMatch = EXTENDED_CATALOG.find((s) => s.symbol.toUpperCase() === symbol);
    if (catalogMatch) {
      const updated = [catalogMatch, ...customSecurities];
      saveCustomSecurities(updated);
      setSelectedId(catalogMatch.id);
      if (pinImmediately && !pinnedIds.includes(catalogMatch.id)) {
        onTogglePin(catalogMatch.id);
      }
      showToast(`เพิ่ม "${catalogMatch.symbol}" เข้าสู่รายการแล้ว 🎉`);
      return;
    }

    // Create realistic custom security if live API didn't respond
    const isThai = symbol.endsWith('.BK') || symbol.startsWith('SET:') || symbol.startsWith('K-') || symbol.startsWith('SCB');
    const newSec = createCustomSecurity({
      symbol,
      name: symbol,
      nameTh: symbol,
      type: isThai ? 'stock_th' : 'stock_us',
      currency: isThai ? 'THB' : 'USD',
      price: isThai ? 50.0 : 150.0,
      sector: 'การเงิน & หุ้นตลาดโลก',
      description: `สินทรัพย์ ${symbol} ที่เพิ่มเข้าสู่ระบบ`
    });

    const updated = [newSec, ...customSecurities];
    saveCustomSecurities(updated);
    setSelectedId(newSec.id);
    if (pinImmediately && !pinnedIds.includes(newSec.id)) {
      onTogglePin(newSec.id);
    }
    showToast(`เพิ่ม "${newSec.symbol}" เข้าสู่ระบบและปักหมุดแล้ว ✨`);
  };

  // Add item from catalog to active list
  const handleAddFromCatalog = (catalogItem: MarketSecurity, pin: boolean = true) => {
    if (allSecurities.some((s) => s.symbol.toUpperCase() === catalogItem.symbol.toUpperCase())) {
      showToast(`สัญลักษณ์ ${catalogItem.symbol} อยู่ในรายการของคุณแล้ว`);
      setSelectedId(catalogItem.id);
      return;
    }
    const updated = [catalogItem, ...customSecurities];
    saveCustomSecurities(updated);
    setSelectedId(catalogItem.id);
    if (pin && !pinnedIds.includes(catalogItem.id)) {
      onTogglePin(catalogItem.id);
    }
    showToast(`เพิ่ม & ปักหมุด "${catalogItem.symbol} - ${catalogItem.name}" แล้ว 🎉`);
  };

  // Fetch data inside modal form
  const handleAutoFillModalData = async () => {
    const sym = formSymbol.trim().toUpperCase();
    if (!sym) {
      alert('กรุณากรอกสัญลักษณ์ย่อของหุ้น (Symbol) เช่น NVDA, TSLA, DELTA.BK, PTT.BK, SPY');
      return;
    }

    setIsFetchingQuoteModal(true);
    try {
      const res = await fetch(`/api/securities/quote?symbol=${encodeURIComponent(sym)}`);
      if (res.ok) {
        const data = await res.json();
        setFormName(data.name || sym);
        setFormNameTh(data.nameTh || data.name || sym);
        setFormPrice(data.price ? data.price.toString() : '100.00');
        setFormCurrency(data.currency === 'THB' ? 'THB' : 'USD');
        setFormType(data.type || (sym.endsWith('.BK') ? 'stock_th' : 'stock_us'));
        setFormSector(data.sector || '');
        setFormIssuer(data.issuer || '');
        setFormDescription(data.description || '');
        setFormChangePct(data.changePercent ? data.changePercent.toString() : '1.5');
        showToast(`ดึงข้อมูลสดของ ${sym} สำเร็จ!`);
      } else {
        showToast(`ไม่พบข้อมูลสดอัตโนมัติของ ${sym} คุณสามารถกรอกข้อมูลเองได้`);
      }
    } catch {
      showToast(`ไม่สามารถเชื่อมต่อราคาอัตโนมัติได้ คุณสามารถกรอกข้อมูลเองได้`);
    } finally {
      setIsFetchingQuoteModal(false);
    }
  };

  // Add custom security from form
  const handleCreateCustomSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    if (!formSymbol.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert('กรุณาระบุสัญลักษณ์และราคาที่ถูกต้อง');
      return;
    }

    const changePctNum = parseFloat(formChangePct) || 0;
    const newSec = createCustomSecurity({
      symbol: formSymbol.trim().toUpperCase(),
      name: formName.trim() || formSymbol.trim().toUpperCase(),
      nameTh: formNameTh.trim() || formName.trim() || formSymbol.trim().toUpperCase(),
      type: formType,
      currency: formCurrency,
      price: priceNum,
      changePercent: changePctNum,
      sector: formSector.trim() || (formType === 'fund' ? 'กองทุนรวม' : 'การลงทุน & หุ้น'),
      issuer: formIssuer.trim() || (formType === 'fund' ? 'บลจ.ชั้นนำ' : 'บริษัทจดทะเบียน'),
      description: formDescription.trim() || `สินทรัพย์ ${formSymbol.trim().toUpperCase()} ที่เพิ่มด้วยตนเอง`
    });

    const updated = [newSec, ...customSecurities];
    saveCustomSecurities(updated);
    setSelectedId(newSec.id);
    if (!pinnedIds.includes(newSec.id)) {
      onTogglePin(newSec.id);
    }
    setIsAddModalOpen(false);
    showToast(`เพิ่มและปักหมุด "${newSec.symbol}" เรียบร้อยแล้ว 🚀`);

    // Reset Form
    setFormSymbol('');
    setFormName('');
    setFormNameTh('');
    setFormPrice('100.00');
    setFormSector('');
    setFormIssuer('');
    setFormDescription('');
  };

  // Remove custom security
  const handleRemoveCustomSecurity = (id: string, symbol: string) => {
    if (confirm(`คุณต้องการลบ "${symbol}" ออกจากรายการใช่หรือไม่?`)) {
      const updated = customSecurities.filter((s) => s.id !== id);
      saveCustomSecurities(updated);
      if (selectedId === id) {
        setSelectedId(allSecurities[0]?.id || 'sec-nvda');
      }
      showToast(`ลบ "${symbol}" ออกจากรายการแล้ว`);
    }
  };

  // Chart Rendering
  useEffect(() => {
    if (!chartCanvasRef.current || !activeSecurity) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    let chartData = activeSecurity.charts[timeframe] || activeSecurity.charts['1M'] || {
      labels: ['จุดที่ 1', 'จุดที่ 2', 'จุดที่ 3', 'จุดที่ 4'],
      prices: [activeSecurity.price * 0.95, activeSecurity.price * 0.98, activeSecurity.price * 0.97, activeSecurity.price]
    };

    // If 1Y timeframe is selected and chartData has legacy 4 quarters, enhance to 12 months
    if (timeframe === '1Y' && chartData.labels.length <= 4) {
      chartData = generateRealisticCharts(activeSecurity.price, activeSecurity.changePercent >= 0)['1Y'];
    }
    const isPositive = activeSecurity.changePercent >= 0;

    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, isPositive ? 'rgba(52, 211, 153, 0.25)' : 'rgba(244, 63, 94, 0.25)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: `${activeSecurity.symbol} (${activeSecurity.name})`,
            data: chartData.prices,
            borderColor: isPositive ? '#10b981' : '#f43f5e',
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: chartData.prices.length > 15 ? 0 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: isPositive ? '#10b981' : '#f43f5e',
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            fill: true,
            backgroundColor: gradient
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
            backgroundColor: '#0f172a',
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y;
                const isUSD = activeSecurity.currency === 'USD';
                const formatted = val.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                });
                if (isUSD) {
                  const thbEquivalent = Math.round(val * usdThb).toLocaleString();
                  return [
                    `ราคา: $${formatted} USD`,
                    `เทียบเงินบาท: ≈ ฿${thbEquivalent} THB`
                  ];
                } else {
                  return `ราคา / NAV: ฿${formatted} THB`;
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
              callback: (val) =>
                activeSecurity.currency === 'USD'
                  ? `$${Number(val).toLocaleString()}`
                  : `฿${Number(val).toLocaleString()}`
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [activeSecurity, timeframe, usdThb]);

  // Type helper badge
  const getTypeBadge = (type: SecurityType) => {
    switch (type) {
      case 'stock_us':
        return { label: 'หุ้นสหรัฐฯ (US)', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'stock_th':
        return { label: 'หุ้นไทย (SET)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'etf':
        return { label: 'กองทุน ETF', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'fund':
        return { label: 'กองทุนรวม (Fund)', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      default:
        return { label: 'สินทรัพย์', bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  // DCA Compound calculation
  const totalInvested = dcaAmount * dcaMonths;
  const monthlyRate = expectedGrowthPct / 100 / 12;
  const simulatedFutureValue = Math.round(
    monthlyRate > 0
      ? dcaAmount * ((Math.pow(1 + monthlyRate, dcaMonths) - 1) / monthlyRate) * (1 + monthlyRate)
      : totalInvested
  );
  const estimatedProfit = simulatedFutureValue - totalInvested;
  const estimatedProfitPct = totalInvested > 0 ? (estimatedProfit / totalInvested) * 100 : 0;

  // Active Security range 52W calculation
  const high52 = activeSecurity?.high52w || (activeSecurity?.price ? activeSecurity.price * 1.2 : 100);
  const low52 = activeSecurity?.low52w || (activeSecurity?.price ? activeSecurity.price * 0.8 : 50);
  const range52Pct = activeSecurity
    ? Math.min(100, Math.max(0, Math.round(((activeSecurity.price - low52) / Math.max(0.01, high52 - low52)) * 100)))
    : 50;

  return (
    <div className="space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400/80 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. UNIVERSAL SEARCH, ADD & CATEGORY FILTER BAR */}
      <section id="securities-search-filter" className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Universal Search & Quick Add Input */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              {isLiveSearching ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleFetchAndAddSecurity(searchQuery.trim(), true);
                }
              }}
              placeholder="ค้นหาหุ้น / กองทุน ทุกตัวในตลาด (เช่น TSLA, META, PTT.BK, DELTA.BK, VOO, K-USA, ARM, SMCI, SOXL)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-28 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <>
                  <button
                    onClick={() => handleFetchAndAddSecurity(searchQuery.trim(), true)}
                    disabled={loadingSymbol === searchQuery.trim().toUpperCase()}
                    className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                    title="ดึงราคาและปักหมุดทันที"
                  >
                    {loadingSymbol === searchQuery.trim().toUpperCase() ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>ค้นหา & เพิ่ม</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setLiveSearchResults([]);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded-lg"
                  >
                    ล้าง
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-slate-500 hidden sm:inline-block pr-2">
                  ค้นหาได้ทุกตลาดทั่วโลก
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Custom Asset Button */}
          <button
            onClick={() => {
              setFormSymbol(searchQuery.trim().toUpperCase());
              setFormName(searchQuery.trim().toUpperCase());
              setFormNameTh(searchQuery.trim().toUpperCase());
              setFormPrice('100.00');
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/10 transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ เพิ่มหุ้น / สินทรัพย์เอง (Custom Add)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* LIVE GLOBAL SEARCH RESULTS: MATCHED DIRECTLY FROM WORLD FINANCIAL EXCHANGES */}
        {/* ========================================================================= */}
        {liveSearchResults.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/70 p-3.5 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Globe className="w-4 h-4" />
                <span>ผลการค้นหาจากตลาดหุ้นทั่วโลก (Live Market Match) — คลิกเพื่อปักหมุดหรือเพิ่มเข้าพอร์ต:</span>
              </div>
              <span className="text-[11px] text-slate-400">พบ {liveSearchResults.length} รายการ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {liveSearchResults.map((item) => {
                const isExisting = allSecurities.some((s) => s.symbol.toUpperCase() === item.symbol.toUpperCase());
                const isPinned = pinnedIds.some((id) => allSecurities.find((s) => s.id === id)?.symbol.toUpperCase() === item.symbol.toUpperCase());
                const isLoading = loadingSymbol === item.symbol.toUpperCase();

                return (
                  <div
                    key={item.symbol}
                    className="bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 rounded-xl p-3 flex flex-col justify-between gap-2 transition-all hover:bg-slate-850 shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {item.exchange || (item.symbol.endsWith('.BK') ? 'SET' : 'US')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium truncate mt-0.5" title={item.longname || item.shortname}>
                        {item.longname || item.shortname}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.sector || item.typeDisp}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.symbol.endsWith('.BK') ? '🇹🇭 SET' : '🇺🇸 US'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFetchAndAddSecurity(item.symbol, true)}
                          disabled={isLoading}
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all border ${
                            isPinned
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-transparent shadow-sm'
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Pin className="w-3.5 h-3.5" />
                          )}
                          <span>{isPinned ? 'ปักหมุดแล้ว ⭐' : 'ปักหมุด & เพิ่ม'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CATALOG PRESETS DISCOVERY */}
        {liveSearchResults.length === 0 && catalogSuggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/60 p-3.5 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Globe className="w-4 h-4" />
                <span>ค้นพบในคลังสินทรัพย์สากล (Global Universe) — คลิกเพื่อปักหมุดหรือเพิ่มเข้าสู่พอร์ต:</span>
              </div>
              <span className="text-[11px] text-slate-400">พบ {catalogSuggestions.length} รายการ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {catalogSuggestions.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 rounded-xl p-3 flex flex-col justify-between gap-2 transition-all hover:bg-slate-850 shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        {item.currency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium truncate mt-0.5" title={item.nameTh}>
                      {item.nameTh}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.sector}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
                    <span className="font-mono font-bold text-xs text-slate-200">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)}` : `฿${item.price.toFixed(2)}`}
                    </span>
                    <button
                      onClick={() => handleAddFromCatalog(item, true)}
                      className="inline-flex items-center gap-1 bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all border border-amber-400/30"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>+ ปักหมุด</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add Banner when search text is typed but not yet added */}
        {searchQuery.trim() && filteredSecurities.length === 0 && liveSearchResults.length === 0 && catalogSuggestions.length === 0 && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  ต้องการเพิ่มและดึงข้อมูลหุ้น <span className="text-amber-400 font-mono">"{searchQuery.toUpperCase()}"</span> ใช่หรือไม่?
                </div>
                <div className="text-xs text-slate-400">
                  ระบบจะดึงราคาและประวัติกราฟจากตลาดหุ้นสากลมาแสดงในพอร์ตของคุณทันที
                </div>
              </div>
            </div>
            <button
              onClick={() => handleFetchAndAddSecurity(searchQuery.trim(), true)}
              disabled={loadingSymbol === searchQuery.trim().toUpperCase()}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all whitespace-nowrap"
            >
              {loadingSymbol === searchQuery.trim().toUpperCase() ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              <span>ดึงราคาและปักหมุด "{searchQuery.toUpperCase()}"</span>
            </button>
          </div>
        )}

        {/* Category & Pin Filter Chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> ตัวกรอง:
          </span>

          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ทั้งหมด ({allSecurities.length})
          </button>

          <button
            onClick={() => setTypeFilter('pinned')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'pinned'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>ที่ปักหมุดไว้ ({pinnedIds.length})</span>
          </button>

          {customSecurities.length > 0 && (
            <button
              onClick={() => setTypeFilter('custom')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                typeFilter === 'custom'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>สินทรัพย์ที่เพิ่มเอง ({customSecurities.length})</span>
            </button>
          )}

          <button
            onClick={() => setTypeFilter('stock_us')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === 'stock_us'
                ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇺🇸 หุ้นสหรัฐฯ (US Stocks)
          </button>

          <button
            onClick={() => setTypeFilter('stock_th')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === 'stock_th'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇹🇭 หุ้นไทย (SET)
          </button>

          <button
            onClick={() => setTypeFilter('etf')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === 'etf'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📊 กองทุน ETF
          </button>

          <button
            onClick={() => setTypeFilter('fund')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === 'fund'
                ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏦 กองทุนรวม (Mutual Funds)
          </button>
        </div>
      </section>

      {/* 2. PINNED WATCHLIST CAROUSEL (รายการสินทรัพย์ที่ปักหมุดไว้) */}
      {pinnedSecurities.length > 0 && (
        <section id="pinned-watchlist" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>สินทรัพย์ที่ปักหมุดไว้ (Pinned Watchlist)</span>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
                  {pinnedSecurities.length}
                </span>
              </h2>
            </div>
            <span className="text-xs text-slate-400">คลิกที่การ์ดเพื่อดูกราฟและข้อมูลเชิงลึก</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pinnedSecurities.map((sec) => {
              const isSelected = sec.id === selectedId;
              const isPositive = sec.changePercent >= 0;
              const badge = getTypeBadge(sec.type);

              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedId(sec.id)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer group shadow-lg ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400/90 ring-2 ring-amber-400/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {/* Pin action button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(sec.id);
                    }}
                    title="ถอนหมุด (Unpin)"
                    className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-amber-400 hover:text-rose-400 transition-colors z-10"
                  >
                    <PinOff className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 mb-2 pr-8">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">{sec.market}</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-extrabold text-lg text-white font-mono group-hover:text-amber-400 transition-colors">
                        {sec.symbol}
                      </div>
                      <div className="text-xs text-slate-400 font-medium truncate max-w-[150px]" title={sec.nameTh}>
                        {sec.nameTh}
                      </div>
                    </div>
                  </div>

                  {/* Price and Change */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <div className="text-base font-extrabold font-mono text-white">
                        {sec.currency === 'USD'
                          ? `$${sec.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          : `฿${sec.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
                      </div>
                      {sec.currency === 'USD' && (
                        <div className="text-[11px] font-mono text-slate-400">
                          ≈ ฿{Math.round(sec.price * usdThb).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                        isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>
                        {isPositive ? '+' : ''}
                        {sec.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. MAIN DETAIL & INTERACTIVE CHART PANEL */}
      {activeSecurity && (
        <section
          id="security-detail-chart"
          className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl"
        >
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center font-bold font-mono text-amber-400 text-xl shrink-0 shadow-inner">
                {activeSecurity.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                    {activeSecurity.symbol}
                  </h1>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getTypeBadge(activeSecurity.type).bg}`}
                  >
                    {getTypeBadge(activeSecurity.type).label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {activeSecurity.market}
                  </span>
                  {activeSecurity.id.startsWith('custom-') && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <FolderPlus className="w-3 h-3" /> เพิ่มเข้าพอร์ตแล้ว
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm font-medium mt-1">
                  {activeSecurity.name} ({activeSecurity.nameTh})
                </p>
              </div>
            </div>

            {/* Actions: Pin button and Remove custom button */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeSecurity.id.startsWith('custom-') && (
                <button
                  onClick={() => handleRemoveCustomSecurity(activeSecurity.id, activeSecurity.symbol)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                  title="ลบสินทรัพย์นี้ออกจากรายการของคุณ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบออกจากรายการ</span>
                </button>
              )}

              <button
                onClick={() => onTogglePin(activeSecurity.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  pinnedIds.includes(activeSecurity.id)
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Pin className={`w-4 h-4 ${pinnedIds.includes(activeSecurity.id) ? 'fill-slate-950' : ''}`} />
                <span>{pinnedIds.includes(activeSecurity.id) ? 'ปักหมุดแล้ว ⭐' : 'ปักหมุดสินทรัพย์นี้ (Pin)'}</span>
              </button>
            </div>
          </div>

          {/* Body: Chart & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Left 2 Columns: Chart View */}
            <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
              
              {/* Timeframe selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> ช่วงเวลา:
                  </span>
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          timeframe === tf
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tf === '1D' ? '1 วัน' : tf === '1W' ? '1 สัปดาห์' : tf === '1M' ? '1 เดือน' : '1 ปี (รายเดือน)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-400 hidden sm:block">
                  กราฟแสดงราคา & แนวโน้มผลตอบแทน
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 relative h-72 sm:h-80 w-full shadow-inner">
                <canvas ref={chartCanvasRef} />
              </div>

              {/* 52-Week Range Bar */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                  <span>
                    ต่ำสุด 52 สัปดาห์: <strong className="text-slate-200 font-mono">{low52.toLocaleString()}</strong>
                  </span>
                  <span className="font-semibold text-amber-400">ตำแหน่งราคาในรอบปี ({range52Pct}%)</span>
                  <span>
                    สูงสุด 52 สัปดาห์: <strong className="text-slate-200 font-mono">{high52.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${range52Pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Column: KPIs & Fundamental Metrics */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              
              {/* Price & Change Card */}
              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 border-l-4 border-l-amber-400 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">
                    {activeSecurity.symbol} • {activeSecurity.market}
                  </span>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {activeSecurity.currency}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                    {activeSecurity.currency === 'USD'
                      ? `$${activeSecurity.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : `฿${activeSecurity.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
                  </span>
                  <span className="text-xs text-slate-400">{activeSecurity.currency}</span>
                </div>

                {activeSecurity.currency === 'USD' && (
                  <div className="mt-1 font-mono text-sm text-amber-400 font-bold">
                    ≈ ฿{Math.round(activeSecurity.price * usdThb).toLocaleString()} บาท
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs border ${
                      activeSecurity.changePercent >= 0
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {activeSecurity.changePercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {activeSecurity.changePercent >= 0 ? '+' : ''}
                    {activeSecurity.change.toFixed(2)} ({activeSecurity.changePercent >= 0 ? '+' : ''}
                    {activeSecurity.changePercent.toFixed(2)}%)
                  </span>
                  <span className="text-xs text-slate-400">เปลี่ยนแปลงล่าสุด</span>
                </div>
              </div>

              {/* Financial & Fund Attributes */}
              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  ข้อมูลปัจจัยพื้นฐาน & สถิติ
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">หมวดอุตสาหกรรม</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={activeSecurity.sector}>
                      {activeSecurity.sector}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">ผู้ออก/บลจ. (Issuer)</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={activeSecurity.issuer || 'Listed Company'}>
                      {activeSecurity.issuer || 'บริษัทจดทะเบียน'}
                    </span>
                  </div>

                  {activeSecurity.peRatio !== undefined && (
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
                      <span className="font-bold text-slate-200 mt-0.5 block font-mono">
                        {activeSecurity.peRatio}x
                      </span>
                    </div>
                  )}

                  {activeSecurity.dividendYield !== undefined && (
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">ปันผลเฉลี่ย (Dividend)</span>
                      <span className="font-bold text-amber-400 mt-0.5 block font-mono">
                        {activeSecurity.dividendYield}%
                      </span>
                    </div>
                  )}

                  {activeSecurity.expenseRatio && (
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">ค่าธรรมเนียม (TER)</span>
                      <span className="font-bold text-slate-200 mt-0.5 block font-mono">
                        {activeSecurity.expenseRatio}
                      </span>
                    </div>
                  )}

                  {activeSecurity.nav && (
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">NAV ต่อหน่วย</span>
                      <span className="font-bold text-slate-200 mt-0.5 block font-mono">
                        ฿{activeSecurity.nav.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-semibold block mb-1">เกี่ยวกับสินทรัพย์:</span>
                  {activeSecurity.description}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. DCA INVESTMENT CALCULATOR SIMULATOR */}
      <section
        id="dca-investment-simulator"
        className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                จำลองการออมแบบ DCA ใน {activeSecurity ? activeSecurity.symbol : 'สินทรัพย์ที่เลือก'}
              </h2>
              <p className="text-xs text-slate-400">
                คำนวณผลตอบแทนทบต้นจากการลงทุนสม่ำเสมอทุกเดือน (Dollar-Cost Averaging)
              </p>
            </div>
          </div>

          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
            ค่าเงินคำนวณ: บาท (THB)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-1 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>ออมเดือนละ (บาท):</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  ฿{dcaAmount.toLocaleString()} บาท
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={dcaAmount}
                onChange={(e) => setDcaAmount(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>500 บ.</span>
                <span>25,000 บ.</span>
                <span>50,000 บ.</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>ระยะเวลาการลงทุน:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {dcaMonths} เดือน ({Math.floor(dcaMonths / 12)} ปี {dcaMonths % 12 > 0 ? `${dcaMonths % 12} ด.` : ''})
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={60}
                step={3}
                value={dcaMonths}
                onChange={(e) => setDcaMonths(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>3 เดือน</span>
                <span>2.5 ปี</span>
                <span>5 ปี</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>ผลตอบแทนคาดการณ์ต่อปี:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {expectedGrowthPct}% ต่อปี
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={expectedGrowthPct}
                onChange={(e) => setExpectedGrowthPct(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>2% (ปันผล)</span>
                <span>12% (ตลาดหุ้น)</span>
                <span>30% (Tech/High Growth)</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">เงินต้นสะสมทั้งหมด</span>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white font-mono block">
                  ฿{totalInvested.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {dcaMonths} งวด × ฿{dcaAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">กำไร / ดอกเบี้ยทบต้นคาดการณ์</span>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono block">
                  +฿{estimatedProfit.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-500/80 font-semibold mt-1 block">
                  +{estimatedProfitPct.toFixed(1)}% จากเงินต้น
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between shadow-lg">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">มูลค่าพอร์ตปลายทาง</span>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-amber-400 font-mono block">
                  ฿{simulatedFutureValue.toLocaleString()}
                </span>
                <span className="text-[11px] text-amber-300/70 font-semibold mt-1 block">
                  ณ สิ้นสุดเดือนที่ {dcaMonths}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ALL SECURITIES TABLE LIST VIEW */}
      <section id="securities-table" className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>รายการสินทรัพย์ทั้งหมดในพอร์ต (Securities List)</span>
            </h2>
            <p className="text-xs text-slate-400">
              แสดง {filteredSecurities.length} รายการ (คลิกที่แถวเพื่อเปลี่ยนกราฟและวิเคราะห์)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">ปักหมุด</th>
                <th className="py-3.5 px-4 font-semibold">สัญลักษณ์ / ชื่อสินทรัพย์</th>
                <th className="py-3.5 px-4 font-semibold">ประเภท / ตลาด</th>
                <th className="py-3.5 px-4 font-semibold text-right">ราคาล่าสุด</th>
                <th className="py-3.5 px-4 font-semibold text-right">แปลงเป็นเงินบาท</th>
                <th className="py-3.5 px-4 font-semibold text-right">เปลี่ยนแปลง</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSecurities.map((sec) => {
                const isSelected = sec.id === selectedId;
                const isPinned = pinnedIds.includes(sec.id);
                const isPositive = sec.changePercent >= 0;
                const badge = getTypeBadge(sec.type);

                return (
                  <tr
                    key={sec.id}
                    onClick={() => setSelectedId(sec.id)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-slate-800/90 font-medium text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    {/* Pin button */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onTogglePin(sec.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          isPinned
                            ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={isPinned ? 'ถอนหมุด' : 'ปักหมุด'}
                      >
                        <Star className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                          {sec.symbol}
                        </span>
                        {sec.id.startsWith('custom-') && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]" title={sec.nameTh}>
                        {sec.nameTh}
                      </div>
                    </td>

                    {/* Type & Market */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{sec.market}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-base">
                      {sec.currency === 'USD'
                        ? `$${sec.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : `฿${sec.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
                    </td>

                    {/* Converted THB */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 text-sm">
                      {sec.currency === 'USD' ? (
                        <span className="text-amber-400/90 font-semibold">
                          ฿{Math.round(sec.price * usdThb).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    {/* Change % */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                          isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {sec.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Manage actions */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {sec.id.startsWith('custom-') ? (
                        <button
                          onClick={() => handleRemoveCustomSecurity(sec.id, sec.symbol)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="ลบออกจากรายการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedId(sec.id)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                        >
                          ดูกราฟ
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. MODAL: ADD CUSTOM SECURITY (WITH AUTO-FETCH LIVE MARKET DATA) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">เพิ่มหุ้น / กองทุน / ETF ใหม่</h3>
                  <p className="text-xs text-slate-400">ค้นหาและเพิ่มสินทรัพย์ทุกตัวในตลาดโลกได้ทันที</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Auto-Fill helper */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> ดึงราคาและข้อมูลอัตโนมัติจากตลาดโลก:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formSymbol}
                  onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
                  placeholder="เช่น NVDA, TSLA, PTT.BK, DELTA.BK, VOO"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAutoFillModalData}
                  disabled={isFetchingQuoteModal}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  {isFetchingQuoteModal ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>ดึงข้อมูลสด</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                * หุ้นไทยพิมพ์ชื่อตามด้วย .BK เช่น <code className="text-amber-400">PTT.BK</code>, <code className="text-amber-400">DELTA.BK</code>, <code className="text-amber-400">CPALL.BK</code>
              </span>
            </div>

            <form onSubmit={handleCreateCustomSecurity} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ชื่อเต็มภาษาอังกฤษ</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="เช่น Apple Inc."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ชื่อภาษาไทย / คำอธิบายสั้น</label>
                  <input
                    type="text"
                    value={formNameTh}
                    onChange={(e) => setFormNameTh(e.target.value)}
                    placeholder="เช่น แอปเปิ้ล (iPhone & Mac)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ประเภทสินทรัพย์</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as SecurityType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="stock_us">หุ้นสหรัฐฯ (US)</option>
                    <option value="stock_th">หุ้นไทย (SET)</option>
                    <option value="etf">กองทุน ETF</option>
                    <option value="fund">กองทุนรวม (Fund)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">สกุลเงิน</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value as 'USD' | 'THB')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="THB">THB (฿)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ราคาล่าสุด</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">หมวดอุตสาหกรรม</label>
                  <input
                    type="text"
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    placeholder="เช่น Technology, Semiconductors"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">เปลี่ยนแปลง (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formChangePct}
                    onChange={(e) => setFormChangePct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">รายละเอียดสินทรัพย์</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="รายละเอียดสรุปเกี่ยวกับธุรกิจหรือนโยบายกองทุน..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-400/20 transition-all"
                >
                  บันทึก & ปักหมุดทันที ⭐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
