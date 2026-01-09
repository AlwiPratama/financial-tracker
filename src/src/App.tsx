import { useState, useRef, useMemo, useEffect } from 'react';
import { Home, FileText, Settings as SettingsIcon, HelpCircle, Cloud, Wallet, TrendingUp, TrendingDown, History, Plus, PieChart, Activity, ChevronDown, BarChart3, X, Calendar, DollarSign, FileTextIcon, User, Edit3, Sun, Moon, Info } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useTransactions } from './hooks/useTransactions';
import { LoginPage } from './components/LoginPage';
import { Background } from './components/Background';
import { AccountManager } from './components/AccountManager';
import { ReportsTab } from './components/ReportsTab';
import { InstallPrompt } from './components/InstallPrompt';
import { Logo } from './components/Logo';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_COLORS, TRANSLATIONS } from './constants';
import { formatRupiah, getMonthYearKey, getMonthName } from './utils/formatters';
import { getAvailableMonths } from './utils/transactions';
import { TransactionType, TooltipState } from './types';

// Pie Chart Component
const PieChartComponent = ({ chartData, totalChartAmount, setSelectedChartItem }) => {
  let cumulativePercent = 0;
  
  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">Belum ada data grafik</div>;

  return (
    <div className="relative h-64 w-64 mx-auto my-6 group cursor-pointer">
      <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full overflow-visible">
        {chartData.map((slice, i) => {
          const percent = slice.amount / totalChartAmount;
          const startX = Math.cos(2 * Math.PI * cumulativePercent);
          const startY = Math.sin(2 * Math.PI * cumulativePercent);
          cumulativePercent += percent;
          const endX = Math.cos(2 * Math.PI * cumulativePercent);
          const endY = Math.sin(2 * Math.PI * cumulativePercent);
          const largeArcFlag = percent > 0.5 ? 1 : 0;
          
          const pathData = chartData.length === 1 
            ? "M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0" 
            : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

          return (
            <path 
              key={i} 
              d={pathData} 
              fill={slice.color} 
              className="hover:opacity-80 transition-all duration-300 hover:scale-105 origin-center"
              onClick={() => setSelectedChartItem(slice)}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Bar Chart Component
const BarChartComponent = ({ chartData, setSelectedChartItem, themeStyles }) => {
  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">Belum ada data grafik</div>;
  const maxVal = Math.max(...chartData.map(d => d.amount));
  
  return (
    <div className="h-64 flex items-end justify-around gap-2 my-6 px-2">
      {chartData.map((bar, i) => (
        <div key={i} className="flex flex-col items-center w-full group cursor-pointer" onClick={() => setSelectedChartItem(bar)}>
          <div 
            className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 relative"
            style={{ height: `${(bar.amount / maxVal) * 200}px`, backgroundColor: bar.color }}
          >
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {formatRupiah(bar.amount)}
             </div>
          </div>
          <span className={`text-[8px] mt-2 truncate w-full text-center ${themeStyles.textSecondary}`}>{bar.category.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  );
};

// Custom Calendar Picker Component
const CustomCalendarPicker = ({ selectedDate, onSelectDate, isDark, onClose }) => {
  const calendarRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const selectDate = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formatted = selected.toISOString().split('T')[0];
    onSelectDate(formatted);
    onClose();
  };

  const isSelectedDate = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const selected = new Date(selectedDate);
    return checkDate.toDateString() === selected.toDateString();
  };

  const isToday = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    return checkDate.toDateString() === today.toDateString();
  };

  // Generate years (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
  };

  const days = [];
  // Adjust for Sunday being 0, Monday should be 0 in our grid
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => selectDate(day)}
        className={`h-9 rounded-xl text-sm font-bold transition-all hover:scale-110 ${
          isSelectedDate(day)
            ? isDark 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-teal-600 text-white shadow-lg'
            : isToday(day)
            ? isDark
              ? 'bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-500/50'
              : 'bg-teal-100 text-teal-700 ring-2 ring-teal-400'
            : isDark
            ? 'text-slate-300 hover:bg-white/10'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div
      ref={calendarRef}
      className={`absolute top-full left-0 mt-2 z-50 rounded-3xl shadow-2xl border p-5 backdrop-blur-xl animate-in zoom-in-95 slide-in-from-top-2 duration-200 min-w-[320px] ${
        isDark ? 'bg-[#151623]/95 border-white/10' : 'bg-white/95 border-slate-200'
      }`}
    >
      {/* Header with Dropdowns */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <select
          value={currentMonth.getMonth()}
          onChange={handleMonthChange}
          className={`px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/20 focus:ring-indigo-500' 
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-teal-500'
          }`}
        >
          {monthNames.map((name, idx) => (
            <option key={idx} value={idx} className={isDark ? 'bg-[#151623] text-white' : 'bg-white text-slate-800'}>
              {name}
            </option>
          ))}
        </select>
        
        <select
          value={currentMonth.getFullYear()}
          onChange={handleYearChange}
          className={`px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/20 focus:ring-indigo-500' 
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-teal-500'
          }`}
        >
          {years.map((year) => (
            <option key={year} value={year} className={isDark ? 'bg-[#151623] text-white' : 'bg-white text-slate-800'}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Day Names - Starting from Monday */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((name) => (
          <div
            key={name}
            className={`text-center text-[10px] font-black uppercase ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

export default function App() {
  const { currentAccount, updateSettings, isLoading } = useAuth();
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [activeTab, setActiveTab] = useState<'dashboard' | 'laporan' | 'settings' | 'help'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);

  // Tooltip State
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false, text: '', rect: null, position: 'bottom'
  });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Chart State
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [chartFilter, setChartFilter] = useState<'all' | 'income' | 'expense'>('expense');
  const [chartScope, setChartScope] = useState<'month' | 'year'>('month');
  const [chartSelectedMonth, setChartSelectedMonth] = useState<string>(getMonthYearKey(new Date().toISOString()));
  const [selectedChartItem, setSelectedChartItem] = useState<{ category: string; amount: number; color: string } | null>(null);

  // Form State
  const [type, setType] = useState<TransactionType>('pengeluaran');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Data calculations - ALL useMemo hooks MUST be here before conditional returns
  const currentMonthKey = getMonthYearKey(new Date().toISOString());
  const allAvailableMonths = useMemo(() => getAvailableMonths(transactions), [transactions]);

  const activeTransactions = useMemo(() => {
    return transactions
      .filter(t => getMonthYearKey(t.date) === currentMonthKey)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonthKey]);

  const globalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
        return acc + (t.type === 'pemasukan' ? t.amount : -t.amount);
    }, 0);
  }, [transactions]);

  const currentSummary = useMemo(() => {
    let totalIn = 0, totalOut = 0, totalDebtTaken = 0, totalDebtPaid = 0, totalReceivablesLent = 0, totalReceivablesPaid = 0;
    
    activeTransactions.forEach(t => {
      if (t.type === 'pemasukan') {
        totalIn += t.amount;
        if (t.category.includes("Utang") && !t.category.includes("Dibayar")) totalDebtTaken += t.amount;
        else if (t.category.includes("Pengembalian")) totalReceivablesPaid += t.amount;
      } else {
        totalOut += t.amount;
        if (t.category.includes("Piutang")) totalReceivablesLent += t.amount;
        else if (t.category.includes("Membayar")) totalDebtPaid += t.amount;
      }
    });

    return { 
        totalIn, totalOut, 
        balance: globalBalance,
        totalDebtTaken, outstandingDebt: totalDebtTaken - totalDebtPaid,
        totalReceivablesLent, outstandingReceivables: totalReceivablesLent - totalReceivablesPaid,
    };
  }, [activeTransactions, globalBalance]);

  const chartData = useMemo(() => {
    let filteredTrans = [];
    
    if (chartScope === 'year') {
        const currentYear = new Date().getFullYear();
        filteredTrans = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
    } else {
        filteredTrans = transactions.filter(t => getMonthYearKey(t.date) === chartSelectedMonth);
    }

    const grouped = filteredTrans.reduce((acc, t) => {
      if (chartFilter === 'income' && t.type !== 'pemasukan') return acc;
      if (chartFilter === 'expense' && t.type !== 'pengeluaran') return acc;
      
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount, color: CATEGORY_COLORS[category] || '#ccc' }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, chartFilter, chartScope, chartSelectedMonth]);

  const totalChartAmount = chartData.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Early return BEFORE any other hooks
  if (!currentAccount) {
    return <LoginPage />;
  }

  const settings = currentAccount.settings;
  const t = TRANSLATIONS[settings.language];
  const isDark = settings.theme === 'dark';

  const themeStyles = {
    bgApp: isDark ? 'text-slate-100' : 'text-slate-700',
    navBg: isDark ? 'bg-[#0B1026]/60 border-white/5 shadow-2xl backdrop-blur-md' : 'bg-white/60 border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl',
    cardGlass: isDark ? 'bg-[#151623]/60 border-white/5 shadow-xl' : 'bg-white/70 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur-xl',
    cardHover: 'hover:scale-[1.01] transition-transform duration-500 ease-out',
    textPrimary: isDark ? 'text-white' : 'text-slate-800',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
    accentGradient: isDark ? 'bg-gradient-to-r from-indigo-400 to-cyan-300' : 'bg-gradient-to-r from-teal-500 to-emerald-600',
    inputBg: isDark ? 'bg-[#0B0C15]/50 border-white/10 text-white' : 'bg-white/50 border-slate-200 text-slate-700',
    modalBg: isDark ? 'bg-[#151623]/95 border-white/10' : 'bg-white/90 border-white',
    buttonPrimary: isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700',
    tooltipBg: isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-700',
    mobileNavContainer: isDark 
      ? 'bg-[#0B1026]/90 border-t border-white/10 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.5)] backdrop-blur-xl' 
      : 'bg-white/90 border-t border-slate-200/50 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur-xl',
    fabBg: isDark
      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40'
      : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30',
  };

  // Event Handlers
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    addTransaction({
      date, category, description: desc, amount: parseFloat(amount), type
    });
    setDesc(''); 
    setAmount(''); 
    setIsModalOpen(false);
  };

  const handleTouchStart = (text: string, e: React.TouchEvent) => {
    const target = e.currentTarget;
    longPressTimer.current = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      setTooltip({ show: true, text, rect, position: 'top' });
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500); 
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setTimeout(() => setTooltip(prev => ({ ...prev, show: false })), 1000); 
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, desc: t.navDescDashboard, icon: Home },
    { id: 'laporan', label: t.reports, desc: t.navDescReports, icon: FileText },
    { id: 'settings', label: t.settings, desc: t.navDescSettings, icon: SettingsIcon },
    { id: 'help', label: t.help, desc: t.navDescHelp, icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-700 ${themeStyles.bgApp} antialiased`}>
      <Background isDark={isDark} />

      {/* Tooltip */}
      {tooltip.show && tooltip.rect && (
        <div 
          className={`fixed z-[60] px-4 py-2.5 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-2xl border backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none ${themeStyles.tooltipBg}`}
          style={{
            left: `${tooltip.rect.left + tooltip.rect.width / 2}px`,
            top: tooltip.position === 'bottom' ? `${tooltip.rect.bottom + 16}px` : `${tooltip.rect.top - 50}px`, 
            transform: 'translateX(-50%)'
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Navbar */}
      <nav className={`${themeStyles.navBg} sticky top-0 z-30 transition-all duration-500`}>
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="transition-transform duration-500 group-hover:rotate-[15deg]">
              <Logo isDark={isDark} size={40} />
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl tracking-tighter leading-none bg-clip-text text-transparent ${themeStyles.accentGradient}`}>
                Finary<span className={themeStyles.textPrimary}>App</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Finance Diary</span>
            </div>
          </div>
          
          <div className={`hidden md:flex p-1.5 rounded-[1.2rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-white/40'}`}>
            {navItems.map(item => (
              <button 
                  key={item.id}
                  onClick={() => {setActiveTab(item.id as any); setSelectedReportKey(null);}} 
                  onMouseEnter={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setTooltip({ show: true, text: item.desc, rect, position: 'bottom' }); }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
                  className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center gap-2.5 ${activeTab === item.id ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : 'opacity-60 hover:opacity-100'}`}
              >
                  <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                  <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden px-3 py-1.5 rounded-full border border-current opacity-20 text-[10px] font-bold">
             {new Date().toLocaleDateString(settings.language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-32 md:pb-20">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 md:space-y-10 animate-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${themeStyles.textPrimary} mb-2`}>
                  {t.hello}, <span className={`text-transparent bg-clip-text ${themeStyles.accentGradient}`}>{settings.name}</span>.
                </h1>
                <p className={`${themeStyles.textSecondary} text-lg font-medium`}>
                  {isDark ? settings.greetingDark : settings.greetingLight} <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-teal-600'}`}>{getMonthName(currentMonthKey, settings.language)}</span>.
                </p>
              </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className={`col-span-1 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 ${isDark ? 'bg-gradient-to-bl from-indigo-600 via-purple-700 to-slate-900' : 'bg-gradient-to-bl from-teal-400 via-emerald-500 to-cyan-600'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Wallet size={20} /></div>
                            <span className="text-sm font-bold tracking-widest uppercase">{t.totalBalance}</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">{formatRupiah(currentSummary.balance)}</h3>
                    </div>
                </div>
              </div>

              <div className={`${themeStyles.cardGlass} ${themeStyles.cardHover} backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className={`${themeStyles.textSecondary} text-xs font-bold uppercase tracking-widest mb-2`}>{t.income}</p>
                    <h3 className="text-3xl font-black text-emerald-500 tracking-tight">{formatRupiah(currentSummary.totalIn)}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl rotate-6 shadow-sm ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                    <TrendingUp size={28} />
                  </div>
                </div>
                <div className={`space-y-3 p-4 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-white/50 border border-white/60'}`}>
                    <div className="flex justify-between text-sm">
                        <span className={`${themeStyles.textSecondary} font-medium`}>{t.totalDebt}</span>
                        <span className="font-bold text-amber-500">{formatRupiah(currentSummary.totalDebtTaken)}</span>
                    </div>
                    <div className="w-full h-px bg-current opacity-10"></div>
                    <div className="flex justify-between text-sm">
                        <span className={`${themeStyles.textSecondary} font-medium`}>{t.unpaidDebt}</span>
                        <span className="font-bold text-rose-500">{formatRupiah(currentSummary.outstandingDebt)}</span>
                    </div>
                </div>
              </div>

              <div className={`${themeStyles.cardGlass} ${themeStyles.cardHover} backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className={`${themeStyles.textSecondary} text-xs font-bold uppercase tracking-widest mb-2`}>{t.expense}</p>
                    <h3 className="text-3xl font-black text-rose-500 tracking-tight">{formatRupiah(currentSummary.totalOut)}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl -rotate-6 shadow-sm ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                    <TrendingDown size={28} />
                  </div>
                </div>
                <div className={`space-y-3 p-4 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-white/50 border border-white/60'}`}>
                    <div className="flex justify-between text-sm">
                        <span className={`${themeStyles.textSecondary} font-medium`}>{t.totalLent}</span>
                        <span className="font-bold text-blue-500">{formatRupiah(currentSummary.totalReceivablesLent)}</span>
                    </div>
                    <div className="w-full h-px bg-current opacity-10"></div>
                    <div className="flex justify-between text-sm">
                        <span className={`${themeStyles.textSecondary} font-medium`}>{t.unpaidLent}</span>
                        <span className="font-bold text-indigo-500">{formatRupiah(currentSummary.outstandingReceivables)}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Transaction List & Charts */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className={`font-black text-2xl ${themeStyles.textPrimary} flex items-center gap-3`}>
                        <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm text-teal-600'}`}><History size={20}/></div>
                        {t.recentActivity}
                    </h3>
                    <button onClick={() => setIsModalOpen(true)} className={`hidden md:flex group ${themeStyles.buttonPrimary} px-6 py-3 rounded-2xl text-sm font-bold items-center gap-3 transition-all hover:-translate-y-1 active:scale-95`}>
                        <Plus size={18} strokeWidth={3}/> {t.newRecord}
                    </button>
                </div>

                <div className="space-y-4">
                    {activeTransactions.length > 0 ? activeTransactions.map((tItem) => (
                    <div key={tItem.id} className={`group relative p-5 rounded-[1.5rem] transition-all flex items-center justify-between border-b-4 border-transparent hover:border-b-4 hover:translate-x-1 ${themeStyles.cardGlass} ${isDark ? 'hover:border-indigo-500/30' : 'hover:border-teal-300'} `}>
                        <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6 ${tItem.type === 'pemasukan' ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600')}`}>
                            {tItem.type === 'pemasukan' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        </div>
                        <div>
                            <p className={`font-bold text-lg ${themeStyles.textPrimary} leading-tight`}>{tItem.category}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                    {new Date(tItem.date).getDate()} {getMonthName(getMonthYearKey(tItem.date), settings.language)}
                                </span>
                                <span className={`text-xs ${themeStyles.textSecondary} truncate max-w-[120px] md:max-w-[300px] italic`}>{tItem.description || '-'}</span>
                            </div>
                        </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-black text-lg ${tItem.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {tItem.type === 'pemasukan' ? '+' : '-'} {formatRupiah(tItem.amount)}
                            </p>
                            <button onClick={() => deleteTransaction(tItem.id)} className={`text-[10px] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100`}>{t.delete}</button>
                        </div>
                    </div>
                    )) : (
                    <div className={`py-24 text-center rounded-[3rem] border-2 border-dashed transition-all ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                            <PieChart size={40} className="opacity-50"/>
                        </div>
                        <p className="text-lg font-bold">{t.noTransaction}</p>
                        <p className="text-sm opacity-60 mt-1">{t.startRecord}</p>
                    </div>
                    )}
                </div>

                {/* Charts Section */}
                {transactions.length > 0 && (
                    <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border mt-10 transition-all duration-500`}>
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                            <h3 className={`font-black text-xl ${themeStyles.textPrimary} flex items-center gap-3`}>
                                <Activity size={24} className={isDark ? 'text-indigo-400' : 'text-teal-600'}/> {t.chartTitle}
                            </h3>
                            
                            <div className="w-full overflow-x-auto pb-2 -mb-2 no-scrollbar">
                                <div className="flex flex-row gap-3 min-w-max">
                                    <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-white'}`}>
                                        <button 
                                            onClick={() => setChartScope('month')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${chartScope === 'month' ? (isDark ? 'bg-indigo-600 text-white shadow' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-teal-600')}`}
                                        >
                                            {t.monthView}
                                        </button>
                                        <button 
                                            onClick={() => setChartScope('year')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${chartScope === 'year' ? (isDark ? 'bg-indigo-600 text-white shadow' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-teal-600')}`}
                                        >
                                            {t.yearView}
                                        </button>
                                    </div>

                                    {chartScope === 'month' && (
                                        <div className="relative group">
                                            <select 
                                                value={chartSelectedMonth} 
                                                onChange={(e) => setChartSelectedMonth(e.target.value)} 
                                                className={`rounded-xl px-4 py-2 pr-8 text-xs font-bold appearance-none outline-none border transition-all cursor-pointer h-full ${isDark ? 'bg-black/20 border-white/5 text-slate-300' : 'bg-slate-100 border-white text-slate-600'}`}
                                            >
                                                {allAvailableMonths.map(key => (
                                                    <option key={key} value={key}>{getMonthName(key, settings.language)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
                                        </div>
                                    )}

                                    <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-white'}`}>
                                        {[
                                            { id: 'pie', icon: PieChart, label: t.chartPie },
                                            { id: 'bar', icon: BarChart3, label: t.chartBar },
                                        ].map(chartTypeOption => (
                                            <button 
                                                key={chartTypeOption.id} 
                                                onClick={() => setChartType(chartTypeOption.id as any)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${chartType === chartTypeOption.id ? (isDark ? 'bg-indigo-600 text-white shadow' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-teal-600')}`}
                                            >
                                                <chartTypeOption.icon size={14}/> <span className="hidden sm:inline">{chartTypeOption.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-white'}`}>
                                        {[
                                            { id: 'expense', label: t.filterOut },
                                            { id: 'income', label: t.filterIn },
                                            { id: 'all', label: t.filterAll },
                                        ].map(filter => (
                                            <button 
                                                key={filter.id}
                                                onClick={() => setChartFilter(filter.id as any)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${chartFilter === filter.id ? (isDark ? 'bg-indigo-600 text-white shadow' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-teal-600')}`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-3xl p-6 min-h-[300px] flex items-center justify-center relative ${isDark ? 'bg-black/20' : 'bg-white/40'}`}>
                            {chartType === 'pie' && <PieChartComponent chartData={chartData} totalChartAmount={totalChartAmount} setSelectedChartItem={setSelectedChartItem} />}
                            {chartType === 'bar' && <BarChartComponent chartData={chartData} setSelectedChartItem={setSelectedChartItem} themeStyles={themeStyles} />}
                        </div>

                        {selectedChartItem && (
                            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedChartItem(null)}>
                                <div className={`relative p-6 rounded-3xl shadow-2xl max-w-xs w-full text-center transform transition-all scale-100 animate-in zoom-in-95 ${isDark ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white text-slate-800'}`} onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setSelectedChartItem(null)} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X size={20}/></button>
                                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: selectedChartItem.color }}>
                                        {selectedChartItem.category.charAt(0)}
                                    </div>
                                    <h4 className="font-bold text-lg mb-1">{selectedChartItem.category}</h4>
                                    <p className={`text-2xl font-black ${isDark ? 'text-indigo-400' : 'text-teal-600'}`}>
                                        {formatRupiah(selectedChartItem.amount)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
          </div>
        )}

        {activeTab === 'laporan' && (
          <ReportsTab 
            transactions={transactions}
            language={settings.language}
            translations={t}
            isDark={isDark}
            selectedReportKey={selectedReportKey}
            setSelectedReportKey={setSelectedReportKey}
            accountName={settings.name}
          />
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
             <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] p-10 border shadow-2xl`}>
                <h2 className={`text-3xl font-black mb-10 flex items-center gap-4 ${themeStyles.textPrimary}`}>
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}><SettingsIcon /></div>
                  {t.settings}
                </h2>
                <div className="space-y-10">
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.profile}</h3>
                    <div className="relative">
                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                        <input type="text" value={settings.name} onChange={(e) => updateSettings({name: e.target.value})} className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg shadow-sm ${themeStyles.inputBg}`}/>
                    </div>
                  </section>
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.greetingMessage} ({isDark ? 'Dark' : 'Light'})</h3>
                    <div className="relative">
                        <Edit3 className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                        <input type="text" value={isDark ? settings.greetingDark : settings.greetingLight} onChange={(e) => updateSettings(isDark ? {greetingDark: e.target.value} : {greetingLight: e.target.value})} className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg shadow-sm ${themeStyles.inputBg}`}/>
                    </div>
                  </section>
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.appearance}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       {['light', 'dark'].map((thm) => (
                         <button key={thm} onClick={() => updateSettings({theme: thm as any})} className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${settings.theme === thm ? (isDark ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-teal-100 border-teal-400 text-teal-800') : (isDark ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50')}`}>
                            <div className={`p-3 rounded-full ${thm === 'light' ? 'bg-orange-100 text-orange-500' : 'bg-indigo-900 text-indigo-400'}`}>{thm === 'light' ? <Sun size={24}/> : <Moon size={24}/>}</div>
                            <span className="font-bold text-lg">{thm === 'light' ? t.themeLight : t.themeDark}</span>
                         </button>
                       ))}
                    </div>
                  </section>
                   <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.language}</h3>
                    <div className="grid grid-cols-2 gap-5">
                       {(['id', 'en'] as const).map((lng) => (
                         <button key={lng} onClick={() => updateSettings({language: lng})} className={`py-4 px-6 rounded-2xl border font-bold transition-all ${settings.language === lng ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : (isDark ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                            {lng === 'id' ? 'Bahasa Indonesia' : 'English (US)'}
                         </button>
                       ))}
                    </div>
                  </section>

                  {/* Account Management */}
                  <AccountManager language={settings.language} translations={t} isDark={isDark} />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
             <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] p-10 border shadow-2xl`}>
                <div className="text-center mb-12">
                   <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg ${isDark ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'}`}>
                      <Info size={48} strokeWidth={1.5} />
                   </div>
                   <h2 className={`text-4xl font-black ${themeStyles.textPrimary}`}>{t.tutorialTitle}</h2>
                </div>
                <div className="grid gap-6">
                   {[
                      { title: t.tut1Title, desc: t.tut1Desc, icon: Plus, color: isDark ? 'text-emerald-300 bg-emerald-900/30' : 'text-emerald-600 bg-emerald-100' },
                      { title: t.tut2Title, desc: t.tut2Desc, icon: FileText, color: isDark ? 'text-blue-300 bg-blue-900/30' : 'text-blue-600 bg-blue-100' },
                      { title: t.tut3Title, desc: t.tut3Desc, icon: SettingsIcon, color: isDark ? 'text-purple-300 bg-purple-900/30' : 'text-purple-600 bg-purple-100' },
                   ].map((tut, i) => (
                      <div key={i} className={`flex gap-6 p-8 rounded-[2rem] border transition-all hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                         <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${tut.color}`}>
                            <tut.icon size={32} />
                         </div>
                         <div>
                            <h3 className={`text-xl font-bold mb-2 ${themeStyles.textPrimary}`}>{tut.title}</h3>
                            <p className={`text-base leading-relaxed ${themeStyles.textSecondary}`}>{tut.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
        
        <footer className={`text-center mt-16 mb-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ${themeStyles.textSecondary}`}>
          Created by mhalwiii
        </footer>
      </main>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`md:hidden fixed bottom-28 right-6 z-50 w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 active:scale-90 transition-transform ${themeStyles.fabBg}`}
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Mobile Bottom Nav */}
      <div className={`md:hidden fixed bottom-6 inset-x-6 z-40 rounded-[2.5rem] backdrop-blur-xl h-20 flex justify-evenly items-center ${themeStyles.mobileNavContainer}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {setActiveTab(item.id as any); setSelectedReportKey(null);}}
              onTouchStart={(e) => handleTouchStart(item.desc, e)}
              onTouchEnd={handleTouchEnd}
              className={`flex flex-col items-center justify-center gap-1 transition-all w-14 h-14 rounded-2xl active:scale-90 ${activeTab === item.id ? (isDark ? 'text-white bg-white/10' : 'text-teal-600 bg-teal-50') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}
            >
              <item.icon size={22} className={activeTab === item.id ? '-translate-y-0.5 transition-transform' : ''} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </button>
          ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className={`${themeStyles.modalBg} backdrop-blur-2xl w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border`}>
            <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/80'}`}>
              <h3 className={`font-black text-2xl ${themeStyles.textPrimary}`}>{t.newTransaction}</h3>
              <button onClick={() => setIsModalOpen(false)} className={`transition-all p-3 rounded-full hover:bg-black/5 active:scale-90 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                <Plus className="rotate-45" size={28}/>
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-8 space-y-8">
              <div className={`flex p-1.5 rounded-[1.5rem] shadow-inner ${isDark ? 'bg-black/40' : 'bg-slate-100'}`}>
                <button type="button" onClick={() => handleTypeChange('pengeluaran')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${type === 'pengeluaran' ? (isDark ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'bg-rose-500 text-white shadow-lg shadow-rose-200') : 'text-slate-400 hover:text-rose-500'}`}>{t.typeExpense}</button>
                <button type="button" onClick={() => handleTypeChange('pemasukan')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${type === 'pemasukan' ? (isDark ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200') : 'text-slate-400 hover:text-emerald-500'}`}>{t.typeIncome}</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 ${themeStyles.textSecondary}`}>{t.category}</label>
                  <div className="relative group">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full rounded-3xl px-6 py-5 text-sm appearance-none focus:ring-4 outline-none transition-all font-bold cursor-pointer shadow-sm ${themeStyles.inputBg}`}>
                      {(type === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={20} className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${themeStyles.textSecondary}`}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 ${themeStyles.textSecondary}`}>{t.date}</label>
                    <div className="relative">
                      <Calendar size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${isDark ? 'text-indigo-400' : 'text-teal-600'}`} />
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className={`w-full rounded-3xl pl-14 pr-5 py-5 text-sm font-bold focus:ring-4 outline-none shadow-sm cursor-pointer ${themeStyles.inputBg}`} 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 ${themeStyles.textSecondary}`}>{t.amount}</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={`w-full rounded-3xl px-5 py-5 text-sm font-black focus:ring-4 outline-none shadow-sm ${themeStyles.inputBg} ${isDark ? 'text-indigo-400' : 'text-teal-600'}`} required />
                  </div>
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 flex justify-between ${themeStyles.textSecondary}`}>
                    <span>{t.note}</span>
                    <span className="opacity-50 font-normal lowercase italic">{t.optional}</span>
                  </label>
                  <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.descPlaceholder} className={`w-full rounded-3xl px-6 py-5 text-sm focus:ring-4 outline-none font-medium placeholder:opacity-40 shadow-sm ${themeStyles.inputBg}`} />
                </div>
              </div>

              <button type="submit" className={`w-full font-black py-6 rounded-[2rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95 mt-4 uppercase tracking-widest text-xs flex justify-center items-center gap-3 ${themeStyles.buttonPrimary}`}>
                <Plus size={20} strokeWidth={3} /> {t.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt language={settings.language} isDark={isDark} />
    </div>
  );
}