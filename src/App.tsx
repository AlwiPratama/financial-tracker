import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Plus, 
  Calendar,
  ChevronDown,
  FileText,
  FolderOpen,
  ArrowLeft,
  PieChart,
  Cloud,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  User,
  Info,
  Edit3,
  BarChart3,
  Activity,
  X,
  Home
} from 'lucide-react';

// --- Tipe Data & Interface ---

type TransactionType = 'pemasukan' | 'pengeluaran';
type ThemeType = 'light' | 'dark';
type LanguageType = 'id' | 'en';

interface Transaction {
  id: string;
  date: string; 
  category: string; 
  description?: string; 
  amount: number;
  type: TransactionType;
}

interface UserSettings {
  name: string;
  theme: ThemeType;
  language: LanguageType;
  greetingLight: string;
  greetingDark: string;
}

// --- Constants ---

const EXPENSE_CATEGORIES = [
  "Makanan & Minuman", "Transportasi", "Belanja Bulanan", "Tagihan & Utilitas",
  "Hiburan & Rekreasi", "Kesehatan & Obat", "Pendidikan", 
  "Piutang (Memberi Pinjaman)", 
  "Membayar Utang (Cicilan/Lunas)", 
  "Cicilan & Denda", "Lainnya"
];

const INCOME_CATEGORIES = [
  "Gaji & Upah", "Bonus & Tunjangan", "Hasil Usaha", "Investasi & Dividen",
  "Utang (Menerima Pinjaman)", 
  "Pengembalian Piutang (Utang Dibayar)", 
  "Hadiah & Hibah", "Penjualan Aset", "Pencairan Dana", "Lainnya"
];

const CATEGORY_COLORS: Record<string, string> = {
  // Expense
  "Makanan & Minuman": "#F87171", 
  "Transportasi": "#FB923C", 
  "Belanja Bulanan": "#FBBF24", 
  "Tagihan & Utilitas": "#34D399", 
  "Hiburan & Rekreasi": "#60A5FA", 
  "Kesehatan & Obat": "#818CF8", 
  "Pendidikan": "#A78BFA", 
  "Piutang (Memberi Pinjaman)": "#F472B6", 
  "Membayar Utang (Cicilan/Lunas)": "#FB7185", 
  "Cicilan & Denda": "#9CA3AF", 
  // Income
  "Gaji & Upah": "#4ADE80", 
  "Bonus & Tunjangan": "#2DD4BF", 
  "Hasil Usaha": "#22D3EE", 
  "Investasi & Dividen": "#38BDF8", 
  "Utang (Menerima Pinjaman)": "#A3E635", 
  "Pengembalian Piutang (Utang Dibayar)": "#FACC15", 
  "Hadiah & Hibah": "#FDA4AF",
  "Penjualan Aset": "#94A3B8",
  "Pencairan Dana": "#C084FC",
  "Lainnya": "#CBD5E1"
};

// --- Translations ---

const TRANSLATIONS = {
  id: {
    dashboard: "Beranda",
    reports: "Laporan",
    settings: "Pengaturan",
    help: "Bantuan",
    hello: "Hai",
    skyText: "Langit cerah untuk hari yang cerah di bulan",
    skyTextDark: "Malam yang tenang di bulan",
    totalBalance: "Saldo Utama",
    netCashflow: "Flowcash",
    income: "Pemasukan",
    expense: "Pengeluaran",
    totalDebt: "Total Saya Berhutang",
    unpaidDebt: "Sisa Utang",
    totalLent: "Total Saya Pinjamkan",
    unpaidLent: "Belum Kembali",
    recentActivity: "Riwayat Transaksi",
    newRecord: "Tambah",
    delete: "Hapus",
    noTransaction: "Belum ada transaksi bulan ini",
    startRecord: "Mulai catat perjalanan keuanganmu!",
    backToFolder: "Kembali",
    accountingLedger: "Buku Besar",
    period: "Periode",
    date: "Tanggal",
    category: "Kategori",
    note: "Catatan",
    in: "Masuk",
    out: "Keluar",
    balance: "Sisa",
    monthlyArchive: "Arsip Bulanan",
    openData: "Lihat",
    emptyArchive: "Belum Ada Data",
    noDataSaved: "Data transaksi lama akan muncul di sini.",
    newTransaction: "Transaksi Baru",
    save: "Simpan Transaksi",
    amount: "Nominal (Rp)",
    descPlaceholder: "Cth: Kopi Kenangan...",
    optional: "Opsional",
    typeExpense: "Keluar",
    typeIncome: "Masuk",
    appearance: "Tampilan",
    profile: "Identitas",
    language: "Bahasa",
    yourName: "Nama Kamu",
    greetingMessage: "Pesan Sambutan",
    themeLight: "Langit Pagi (Terang)",
    themeDark: "Luar Angkasa (Gelap)",
    tutorialTitle: "Panduan Singkat",
    tut1Title: "Mencatat",
    tut1Desc: "Tekan tombol (+) melayang. Pilih kategori 'Utang' jika meminjam, dan 'Membayar Utang' saat melunasi.",
    tut2Title: "Analisa",
    tut2Desc: "Menu Laporan menyimpan semua riwayat bulananmu secara otomatis dan rapi.",
    tut3Title: "Personalisasi",
    tut3Desc: "Ubah nama dan tema sesuai suasana hatimu di menu Pengaturan.",
    totalFinal: "Total Akhir",
    navDescDashboard: "Ringkasan saldo & utang",
    navDescReports: "Arsip buku besar",
    navDescSettings: "Ubah profil & tema",
    navDescHelp: "Bantuan penggunaan",
    chartTitle: "Analisis Grafik",
    chartPie: "Lingkaran",
    chartBar: "Batang",
    filterAll: "Gabungan",
    filterIn: "Masuk",
    filterOut: "Keluar",
    yearView: "1 Tahun",
    monthView: "Bulanan",
    openingBalance: "Saldo Awal"
  },
  en: {
    dashboard: "Home",
    reports: "Reports",
    settings: "Settings",
    help: "Help",
    hello: "Hi",
    skyText: "Clear blue skies for cash flow in",
    skyTextDark: "Stars shining for cash flow in",
    totalBalance: "Main Balance",
    netCashflow: "Flowcash",
    income: "Income",
    expense: "Expense",
    totalDebt: "Total Debt Taken",
    unpaidDebt: "Remaining Debt",
    totalLent: "Total Loans Given",
    unpaidLent: "Not Yet Repaid",
    recentActivity: "Transaction History",
    newRecord: "Add New",
    delete: "Remove",
    noTransaction: "No transactions this month",
    startRecord: "Start tracking your financial journey!",
    backToFolder: "Go Back",
    accountingLedger: "General Ledger",
    period: "Period",
    date: "Date",
    category: "Category",
    note: "Note",
    in: "Credit",
    out: "Debit",
    balance: "Balance",
    monthlyArchive: "Monthly Archive",
    openData: "View",
    emptyArchive: "No Data Yet",
    noDataSaved: "Past transaction data will appear here.",
    newTransaction: "New Transaction",
    save: "Save Record",
    amount: "Amount (Rp)",
    descPlaceholder: "E.g., Starbucks...",
    optional: "Optional",
    typeExpense: "Expense",
    typeIncome: "Income",
    appearance: "Appearance",
    profile: "Identity",
    language: "Language",
    yourName: "Your Name",
    greetingMessage: "Greeting Message",
    themeLight: "Morning Sky (Light)",
    themeDark: "Deep Space (Dark)",
    tutorialTitle: "Quick Guide",
    tut1Title: "Recording",
    tut1Desc: "Press the floating (+) button. Use 'Utang' category when borrowing, 'Membayar Utang' when repaying.",
    tut2Title: "Analysis",
    tut2Desc: "The Reports menu automatically organizes all your monthly history neatly.",
    tut3Title: "Personalize",
    tut3Desc: "Change your name and theme to match your mood in Settings.",
    totalFinal: "Grand Total",
    navDescDashboard: "Balance & debt summary",
    navDescReports: "Ledger archives",
    navDescSettings: "Profile & theme",
    navDescHelp: "Usage guide",
    chartTitle: "Chart Analysis",
    chartPie: "Pie",
    chartBar: "Bar",
    filterAll: "Mixed",
    filterIn: "Income",
    filterOut: "Expense",
    yearView: "1 Year",
    monthView: "Monthly",
    openingBalance: "Opening Balance"
  }
};

// --- Helper Functions ---

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("Rp", "Rp ");
};

const getMonthYearKey = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthName = (key: string, lang: LanguageType) => {
  if (!key) return '';
  const [year, month] = key.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
};

const getAvailableMonths = (transactions: Transaction[]) => {
    const months = new Set<string>();
    // Always include current month
    months.add(getMonthYearKey(new Date().toISOString()));
    transactions.forEach(t => months.add(getMonthYearKey(t.date)));
    return Array.from(months).sort().reverse();
};

// --- Sub-Components for Charts ---

const PieChartComponent = ({ chartData, totalChartAmount, setSelectedChartItem }: any) => {
  let cumulativePercent = 0;
  
  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">Belum ada data grafik</div>;

  return (
    <div className="relative h-64 w-64 mx-auto my-6 group cursor-pointer">
      <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full overflow-visible">
        {chartData.map((slice: any, i: number) => {
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

const BarChartComponent = ({ chartData, setSelectedChartItem, formatRupiah, themeStyles }: any) => {
  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">Belum ada data grafik</div>;
  const maxVal = Math.max(...chartData.map((d: any) => d.amount));
  
  return (
    <div className="h-64 flex items-end justify-around gap-2 my-6 px-2">
      {chartData.map((bar: any, i: number) => (
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

// --- Komponen Utama ---

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'laporan' | 'settings' | 'help'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);

  // Tooltip & Settings State
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; rect: DOMRect | null; position: 'top' | 'bottom' }>({
    show: false, text: '', rect: null, position: 'bottom'
  });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [settings, setSettings] = useState<UserSettings>({
    name: 'User',
    theme: 'light',
    language: 'id',
    greetingLight: "Langit cerah untuk hari yang cerah di bulan",
    greetingDark: "Malam yang tenang di bulan"
  });

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

  // Load & Save Data
  useEffect(() => {
    const savedData = localStorage.getItem('keuanganku_v4');
    const savedSettings = localStorage.getItem('keuanganku_settings');
    if (savedData) try { setTransactions(JSON.parse(savedData)); } catch (e) { console.error(e); }
    if (savedSettings) try { 
      const parsedSettings = JSON.parse(savedSettings);
      if (!parsedSettings.greetingLight) parsedSettings.greetingLight = "Langit cerah untuk hari yang cerah di bulan";
      if (!parsedSettings.greetingDark) parsedSettings.greetingDark = "Malam yang tenang di bulan";
      setSettings(parsedSettings); 
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('keuanganku_v4', JSON.stringify(transactions));
    localStorage.setItem('keuanganku_settings', JSON.stringify(settings));
  }, [transactions, settings]);

  const t = TRANSLATIONS[settings.language];
  const isDark = settings.theme === 'dark';

  // --- REFINED THEME STYLES ---
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

  // --- Background Generators ---
  const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({ id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, size: `${Math.random() * 2 + 1}px`, animationDuration: `${Math.random() * 3 + 2}s`, animationDelay: `${Math.random() * 5}s`, opacity: Math.random() * 0.5 + 0.3 })), []);
  const parkClouds = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({ id: i, top: `${Math.random() * 40}%`, left: `-20%`, scale: Math.random() * 0.6 + 0.6, opacity: Math.random() * 0.3 + 0.6, duration: `${Math.random() * 40 + 40}s`, delay: `${Math.random() * -40}s` })), []);
  const fallingLeaves = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({ id: i, left: `${Math.random() * 100}%`, scale: Math.random() * 0.4 + 0.2, rotation: Math.random() * 360, duration: `${Math.random() * 15 + 15}s`, delay: `${Math.random() * 15}s` })), []);
  const birds = useMemo(() => {
    const items = [];
    for(let i=0; i<2; i++) items.push({ id: `solo-${i}`, top: `${10 + Math.random() * 20}%`, delay: `${Math.random() * 20}s`, duration: `${25 + Math.random() * 10}s` });
    for(let i=0; i<3; i++) items.push({ id: `group-${i}`, top: `${20 + Math.random() * 5}%`, delay: `${Math.random() * 20 + 20}s`, duration: `30s` });
    return items;
  }, []);

  // --- Data Logic ---
  const currentMonthKey = getMonthYearKey(new Date().toISOString());
  const allAvailableMonths = useMemo(() => getAvailableMonths(transactions), [transactions]);

  // Active Transactions for Dashboard List (Current Month Only)
  const activeTransactions = useMemo(() => {
    return transactions
      .filter(t => getMonthYearKey(t.date) === currentMonthKey)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonthKey]);

  const availableReportMonths = useMemo(() => {
    return allAvailableMonths;
  }, [allAvailableMonths]);

  // GLOBAL BALANCE (All time)
  const globalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
        return acc + (t.type === 'pemasukan' ? t.amount : -t.amount);
    }, 0);
  }, [transactions]);

  // CURRENT MONTH Summary (For Dashboard Cards)
  const currentSummary = useMemo(() => {
    let totalIn = 0, totalOut = 0, totalDebtTaken = 0, totalDebtPaid = 0, totalReceivablesLent = 0, totalReceivablesPaid = 0;
    
    // Only process activeTransactions (Current Month)
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

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    // 1. Determine which transactions to include
    let filteredTrans = [];
    
    if (chartScope === 'year') {
        const currentYear = new Date().getFullYear();
        filteredTrans = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
    } else {
        // Filter by selected month
        filteredTrans = transactions.filter(t => getMonthYearKey(t.date) === chartSelectedMonth);
    }

    // 2. Group by Category
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

  // --- Event Handlers ---
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setTransactions([...transactions, {
      id: crypto.randomUUID(), date, category, description: desc, amount: parseFloat(amount), type
    }]);
    setDesc(''); setAmount(''); setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
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
    { id: 'settings', label: t.settings, desc: t.navDescSettings, icon: Settings },
    { id: 'help', label: t.help, desc: t.navDescHelp, icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-700 ${themeStyles.bgApp} antialiased`}>
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {isDark ? (
           <>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0B1026] to-[#050505]" />
            {stars.map(star => <div key={star.id} className="absolute rounded-full bg-white" style={{ top: star.top, left: star.left, width: star.size, height: star.size, opacity: star.opacity, animation: `twinkle ${star.animationDuration} infinite ease-in-out ${star.animationDelay}` }} />)}
            <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse duration-[8s]" />
            <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[130px] animate-pulse duration-[10s]" />
           </>
        ) : (
           <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#C8EAFF] to-[#F0FFF4]" />
            <div className="absolute top-[5%] right-[5%] w-[120px] h-[120px] bg-yellow-100 rounded-full blur-[40px] opacity-80" />
            {parkClouds.map(cloud => (
              <div key={cloud.id} className="absolute" style={{ top: cloud.top, left: cloud.left, opacity: cloud.opacity, transform: `scale(${cloud.scale})`, animation: `float-cloud ${cloud.duration} infinite linear ${cloud.delay}` }}>
                 <div className="w-[100px] h-[40px] bg-white rounded-full blur-[10px] relative">
                    <div className="absolute -top-[20px] left-[15px] w-[40px] h-[40px] bg-white rounded-full"></div>
                    <div className="absolute -top-[30px] left-[40px] w-[50px] h-[50px] bg-white rounded-full"></div>
                 </div>
              </div>
            ))}
            {birds.map(bird => (
                <div key={bird.id} className="absolute text-slate-600/40" style={{ top: bird.top, left: '-50px', animation: `fly-bird ${bird.duration} infinite linear ${bird.delay}` }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12C2 12 5 9 12 12C19 15 22 12 22 12"/></svg>
                </div>
            ))}
            {fallingLeaves.map(leaf => (
                <div key={leaf.id} className="absolute text-emerald-200/60" style={{ top: '-20px', left: leaf.left, transform: `scale(${leaf.scale})`, animation: `fall-leaf ${leaf.duration} infinite ease-in-out ${leaf.delay}` }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{transform: `rotate(${leaf.rotation}deg)`}}><path d="M12 2C12 2 14 8 20 12C14 16 12 22 12 22C12 22 10 16 4 12C10 8 12 2 12 2Z"/></svg>
                </div>
            ))}
           </>
        )}
      </div>

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 3px white; } }
        @keyframes float-cloud { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(120vw) scale(1); } }
        @keyframes fly-bird { 0% { transform: translateX(0) translateY(0) scale(0.8); } 25% { transform: translateX(30vw) translateY(10px) scale(0.8); } 50% { transform: translateX(60vw) translateY(-5px) scale(0.8); } 100% { transform: translateX(110vw) translateY(0) scale(0.8); } }
        @keyframes fall-leaf { 0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; } }
        
        .custom-date-trigger::-webkit-calendar-picker-indicator {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            opacity: 0;
            cursor: pointer;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- TOOLTIP --- */}
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
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t ${themeStyles.tooltipBg} ${tooltip.position === 'bottom' ? '-top-1.5 border-b-0 border-r-0' : '-bottom-1.5 border-t-0 border-l-0 bg-inherit'}`} />
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className={`${themeStyles.navBg} sticky top-0 z-30 transition-all duration-500 border-b`}>
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-[15deg] ${isDark ? 'bg-gradient-to-tr from-indigo-600 to-purple-600' : 'bg-gradient-to-tr from-teal-400 to-emerald-500'}`}>
              <Cloud size={20} className="text-white relative z-10" fill="currentColor" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center gap-2.5 ${activeTab === item.id ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
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

      {/* --- CONTENT --- */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Summary Cards */}
              <div className={`col-span-1 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 ${isDark ? 'bg-gradient-to-bl from-indigo-600 via-purple-700 to-slate-900' : 'bg-gradient-to-bl from-teal-400 via-emerald-500 to-cyan-600'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Wallet size={20} /></div>
                            <span className="text-sm font-bold tracking-widest uppercase">{t.totalBalance}</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">{formatRupiah(currentSummary.balance)}</h3>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                         <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                            {t.netCashflow}
                         </span>
                    </div>
                </div>
              </div>

              <div className={`${themeStyles.cardGlass} ${themeStyles.cardHover} backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col justify-between border`}>
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

              <div className={`${themeStyles.cardGlass} ${themeStyles.cardHover} backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col justify-between border`}>
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

            {/* --- LIST & CHART SECTION --- */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className={`font-black text-2xl ${themeStyles.textPrimary} flex items-center gap-3`}>
                        <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm text-teal-600'}`}><History size={20}/></div>
                        {t.recentActivity}
                    </h3>
                    {/* Desktop Button only */}
                    <button onClick={() => setIsModalOpen(true)} className={`hidden md:flex group ${themeStyles.buttonPrimary} px-6 py-3 rounded-2xl text-sm font-bold items-center gap-3 transition-all hover:-translate-y-1 active:scale-95`}>
                        <Plus size={18} strokeWidth={3}/> {t.newRecord}
                    </button>
                </div>

                <div className="space-y-4">
                    {activeTransactions.length > 0 ? activeTransactions.map((tItem) => (
                    <div key={tItem.id} className={`group relative p-5 rounded-[1.5rem] transition-all flex items-center justify-between border-b-4 border-transparent hover:border-b-4 hover:translate-x-1 ${themeStyles.cardGlass} border ${isDark ? 'hover:border-indigo-500/30' : 'hover:border-teal-300'} `}>
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
                            <button onClick={() => handleDelete(tItem.id)} className={`text-[10px] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100`}>{t.delete}</button>
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

                {/* --- CHART SECTION --- */}
                {transactions.length > 0 && (
                    <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border mt-10 transition-all duration-500`}>
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                            <h3 className={`font-black text-xl ${themeStyles.textPrimary} flex items-center gap-3`}>
                                <Activity size={24} className={isDark ? 'text-indigo-400' : 'text-teal-600'}/> {t.chartTitle}
                            </h3>
                            
                            {/* Horizontal scrolling wrapper for filters on mobile */}
                            <div className="w-full overflow-x-auto pb-2 -mb-2 no-scrollbar">
                                <div className="flex flex-row gap-3 min-w-max">
                                    {/* Scope Selector */}
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

                                    {/* Month Selector */}
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

                                    {/* Chart Type */}
                                    <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-white'}`}>
                                        {[
                                            { id: 'pie', icon: PieChart, label: t.chartPie },
                                            { id: 'bar', icon: BarChart3, label: t.chartBar },
                                        ].map(type => (
                                            <button 
                                                key={type.id} 
                                                onClick={() => setChartType(type.id as any)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${chartType === type.id ? (isDark ? 'bg-indigo-600 text-white shadow' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-teal-600')}`}
                                            >
                                                <type.icon size={14}/> <span className="hidden sm:inline">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Data Filter */}
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
                            {chartType === 'bar' && <BarChartComponent chartData={chartData} setSelectedChartItem={setSelectedChartItem} formatRupiah={formatRupiah} themeStyles={themeStyles} />}
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {selectedReportKey ? (
              <div className="space-y-8">
                <button onClick={() => setSelectedReportKey(null)} className={`flex items-center gap-3 font-bold transition-all px-6 py-3 rounded-2xl w-fit group hover:pl-4 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-white/80 text-slate-600 shadow-sm'}`}>
                  <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1"/> {t.backToFolder}
                </button>
                
                <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border`}>
                  <div className={`p-10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-gradient-to-r from-teal-50/50 to-blue-50/50'}`}>
                    <div>
                      <h2 className={`text-3xl font-black ${themeStyles.textPrimary}`}>{t.accountingLedger}</h2>
                      <p className={`${themeStyles.textSecondary} font-medium mt-2 flex items-center gap-2`}>
                        <Calendar size={16}/> {t.period} <span className="font-bold">{getMonthName(selectedReportKey, settings.language)}</span>
                      </p>
                    </div>
                    <div className={`p-5 rounded-3xl shadow-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-blue-600'}`}>
                      <FileText size={32}/>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/30'}`}>
                        <tr>
                          <th className={`px-4 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>No.</th>
                          
                          {[t.date, t.category, t.note, t.in, t.out, t.balance].map((head, i) => (
                              <th key={i} className={`px-8 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary} ${i > 2 ? 'text-right' : ''}`}>{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                        {(() => {
                          // Calculate Opening Balance
                          const openingBalance = transactions
                            .filter(t => getMonthYearKey(t.date) < selectedReportKey)
                            .reduce((acc, t) => acc + (t.type === 'pemasukan' ? t.amount : -t.amount), 0);

                          let runningBal = openingBalance;
                          
                          const filtered = transactions.filter(t => getMonthYearKey(t.date) === selectedReportKey).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                          const totalDebit = filtered.filter(t => t.type === 'pemasukan').reduce((acc, curr) => acc + curr.amount, 0);
                          const totalCredit = filtered.filter(t => t.type === 'pengeluaran').reduce((acc, curr) => acc + curr.amount, 0);

                          const rows = filtered.map((tItem, idx) => {
                              const isDebit = tItem.type === 'pemasukan';
                              runningBal += isDebit ? tItem.amount : -tItem.amount;
                              return (
                                <tr key={tItem.id} className={`transition-colors hover:bg-black/5`}>
                                  <td className={`px-4 py-5 font-medium ${themeStyles.textSecondary}`}>{idx + 1}</td>
                                  
                                  <td className={`px-8 py-5 font-medium ${themeStyles.textSecondary}`}>{new Date(tItem.date).getDate()}</td>
                                  <td className={`px-8 py-5 font-bold ${themeStyles.textPrimary}`}>{tItem.category}</td>
                                  <td className="px-8 py-5 text-slate-400 italic max-w-[200px] truncate">{tItem.description || '-'}</td>
                                  <td className="px-8 py-5 text-right font-bold text-emerald-500 whitespace-nowrap min-w-[150px]">{isDebit ? formatRupiah(tItem.amount) : ''}</td>
                                  <td className="px-8 py-5 text-right font-bold text-rose-500 whitespace-nowrap min-w-[150px]">{!isDebit ? formatRupiah(tItem.amount) : ''}</td>
                                  <td className={`px-8 py-5 text-right font-black whitespace-nowrap min-w-[150px] ${themeStyles.textPrimary}`}>{formatRupiah(runningBal)}</td>
                                </tr>
                              );
                            });
                           return (
                             <>
                               {/* Opening Balance Row */}
                               <tr className={`font-bold italic ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
                                 <td colSpan={6} className="px-8 py-4 text-right opacity-70">{t.openingBalance}</td>
                                 <td className={`px-8 py-4 text-right font-black whitespace-nowrap min-w-[150px] ${themeStyles.textPrimary}`}>{formatRupiah(openingBalance)}</td>
                               </tr>
                               {rows}
                               <tr className={`font-black text-sm ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
                                 <td colSpan={4} className="px-8 py-6 text-right uppercase tracking-widest text-xs opacity-50">{t.totalFinal}</td>
                                 <td className="px-8 py-6 text-right text-emerald-500 whitespace-nowrap min-w-[150px]">{formatRupiah(totalDebit)}</td>
                                 <td className="px-8 py-6 text-right text-rose-500 whitespace-nowrap min-w-[150px]">{formatRupiah(totalCredit)}</td>
                                 <td className={`px-8 py-6 text-right whitespace-nowrap min-w-[150px] ${isDark ? 'text-indigo-400' : 'text-blue-600'}`}>{formatRupiah(openingBalance + totalDebit - totalCredit)}</td>
                               </tr>
                             </>
                           );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className={`text-3xl font-black mb-8 tracking-tight ${themeStyles.textPrimary} flex items-center gap-4`}>
                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}><FolderOpen className={isDark ? 'text-indigo-400' : 'text-blue-600'}/></div>
                    {t.monthlyArchive}
                </h2>
                {availableReportMonths.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {availableReportMonths.map(key => (
                      <button key={key} onClick={() => setSelectedReportKey(key)} className={`${themeStyles.cardGlass} p-8 rounded-[2.5rem] flex flex-col items-center group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border`}>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-sm ${isDark ? 'bg-gradient-to-tr from-amber-600/20 to-orange-600/20 text-orange-400' : 'bg-gradient-to-tr from-amber-100 to-orange-100 text-orange-500'}`}>
                          <Calendar size={32} strokeWidth={2.5}/>
                        </div>
                        <span className={`font-bold text-xl ${themeStyles.textPrimary}`}>{getMonthName(key, settings.language)}</span>
                        <span className={`text-[10px] uppercase font-black tracking-widest mt-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>{t.openData}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`py-32 text-center rounded-[3rem] border-2 border-dashed ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                    <FolderOpen size={80} className={`mx-auto mb-6 opacity-20`}/>
                    <p className="font-bold text-xl opacity-50">{t.emptyArchive}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
             <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] p-10 border shadow-2xl`}>
                <h2 className={`text-3xl font-black mb-10 flex items-center gap-4 ${themeStyles.textPrimary}`}>
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}><Settings /></div>
                  {t.settings}
                </h2>
                <div className="space-y-10">
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.profile}</h3>
                    <div className="relative">
                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                        <input type="text" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg shadow-sm border ${themeStyles.inputBg}`}/>
                    </div>
                  </section>
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.greetingMessage} ({isDark ? 'Dark' : 'Light'})</h3>
                    <div className="relative">
                        <Edit3 className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                        <input type="text" value={isDark ? settings.greetingDark : settings.greetingLight} onChange={(e) => setSettings({...settings, [isDark ? 'greetingDark' : 'greetingLight']: e.target.value})} className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg shadow-sm border ${themeStyles.inputBg}`}/>
                    </div>
                  </section>
                  <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.appearance}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       {['light', 'dark'].map((thm) => (
                         <button key={thm} onClick={() => setSettings({...settings, theme: thm as ThemeType})} className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${settings.theme === thm ? (isDark ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-teal-100 border-teal-400 text-teal-800') : (isDark ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50')}`}>
                            <div className={`p-3 rounded-full ${thm === 'light' ? 'bg-orange-100 text-orange-500' : 'bg-indigo-900 text-indigo-400'}`}>{thm === 'light' ? <Sun size={24}/> : <Moon size={24}/>}</div>
                            <span className="font-bold text-lg">{thm === 'light' ? t.themeLight : t.themeDark}</span>
                         </button>
                       ))}
                    </div>
                  </section>
                   <section>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{t.language}</h3>
                    <div className="grid grid-cols-2 gap-5">
                       {['id', 'en'].map((lng) => (
                         <button key={lng} onClick={() => setSettings({...settings, language: lng as LanguageType})} className={`py-4 px-6 rounded-2xl border font-bold transition-all ${settings.language === lng ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white') : (isDark ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                            {lng === 'id' ? 'Bahasa Indonesia' : 'English (US)'}
                         </button>
                       ))}
                    </div>
                  </section>
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
                      { title: t.tut3Title, desc: t.tut3Desc, icon: Settings, color: isDark ? 'text-purple-300 bg-purple-900/30' : 'text-purple-600 bg-purple-100' },
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

      {/* --- MOBILE FAB (Floating) --- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`md:hidden fixed bottom-28 right-6 z-50 w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 active:scale-90 transition-transform ${themeStyles.fabBg}`}
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* --- MOBILE BOTTOM NAV (Floating Pill) --- */}
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

      {/* MODAL */}
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
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full rounded-3xl px-6 py-5 text-sm appearance-none focus:ring-4 outline-none transition-all font-bold cursor-pointer shadow-sm border ${themeStyles.inputBg}`}>
                      {(type === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={20} className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${themeStyles.textSecondary}`}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 ${themeStyles.textSecondary}`}>{t.date}</label>
                    
                    <div 
                      className={`relative w-full rounded-3xl px-5 py-5 text-sm font-bold shadow-sm cursor-pointer hover:opacity-80 transition-opacity border ${themeStyles.inputBg} flex items-center`}
                    >
                      <span>{new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 custom-date-trigger" 
                        required 
                      />
                    </div>

                  </div>
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 ${themeStyles.textSecondary}`}>{t.amount}</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={`w-full rounded-3xl px-5 py-5 text-sm font-black focus:ring-4 outline-none shadow-sm border ${themeStyles.inputBg} ${isDark ? 'text-indigo-400' : 'text-teal-600'}`} required />
                  </div>
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest block mb-3 ml-2 flex justify-between ${themeStyles.textSecondary}`}>
                    <span>{t.note}</span>
                    <span className="opacity-50 font-normal lowercase italic">{t.optional}</span>
                  </label>
                  <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.descPlaceholder} className={`w-full rounded-3xl px-6 py-5 text-sm focus:ring-4 outline-none font-medium placeholder:opacity-40 shadow-sm border ${themeStyles.inputBg}`} />
                </div>
              </div>

              <button type="submit" className={`w-full font-black py-6 rounded-[2rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95 mt-4 uppercase tracking-widest text-xs flex justify-center items-center gap-3 ${themeStyles.buttonPrimary}`}>
                <Plus size={20} strokeWidth={3} /> {t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
