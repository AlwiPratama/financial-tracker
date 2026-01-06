# 📂 FinaryApp - Project Structure

Penjelasan lengkap struktur folder dan file dalam project.

## 🌳 Tree Structure

```
finary-app/
│
├── 📁 src/                          # Source code utama
│   ├── 📁 components/               # React components
│   │   ├── PieChartComponent.tsx   # Komponen grafik pie
│   │   └── BarChartComponent.tsx   # Komponen grafik bar
│   │
│   ├── 📁 constants/                # Data statis & konfigurasi
│   │   └── index.ts                # Kategori, warna, translations
│   │
│   ├── 📁 types/                    # TypeScript type definitions
│   │   └── index.ts                # Interfaces & types
│   │
│   ├── 📁 utils/                    # Helper functions
│   │   └── index.ts                # Format, date utils
│   │
│   ├── App.tsx                     # Main component (semua logic)
│   ├── main.tsx                    # Entry point aplikasi
│   └── index.css                   # Global CSS (Tailwind import)
│
├── 📁 public/                       # Static assets
│   └── vite.svg                    # Vite logo (favicon)
│
├── 📁 .vscode/                      # VS Code settings
│   └── extensions.json             # Recommended extensions
│
├── 📄 index.html                    # HTML template
├── 📄 package.json                  # Dependencies & scripts
├── 📄 package-lock.json             # Lock file (jangan edit manual)
│
├── ⚙️ vite.config.ts                # Vite configuration
├── ⚙️ tsconfig.json                 # TypeScript config (base)
├── ⚙️ tsconfig.app.json             # TypeScript config (app)
├── ⚙️ tsconfig.node.json            # TypeScript config (node)
├── ⚙️ eslint.config.js              # ESLint configuration
│
├── 🚀 vercel.json                   # Vercel deployment config
├── 🚀 netlify.toml                  # Netlify deployment config
│
├── 📝 README.md                     # Dokumentasi utama
├── 📝 DEPLOYMENT.md                 # Panduan deployment
├── 📝 QUICK_START.md                # Quick start guide
├── 📝 CONTRIBUTING.md               # Contribution guidelines
├── 📝 PROJECT_STRUCTURE.md          # File ini
│
└── 🔒 .gitignore                    # Git ignore rules
```

---

## 📝 File Descriptions

### 🔹 Core Application Files

#### `src/App.tsx` (MAIN FILE - 1000+ lines)
**Fungsi**: Komponen utama yang menghandle semua logic aplikasi

**Contains**:
- State management (transactions, settings, UI)
- Business logic (calculations, filtering)
- All UI components (Dashboard, Reports, Settings, Help)
- Event handlers
- LocalStorage integration
- Background animations

**Sections**:
1. **Dashboard Tab**: Summary cards, transaction list, charts
2. **Reports Tab**: Monthly ledger, archive
3. **Settings Tab**: Theme, language, profile
4. **Help Tab**: Tutorial & guide

#### `src/main.tsx`
**Fungsi**: Entry point aplikasi, mounting React ke DOM

```tsx
ReactDOM.render(<App />, document.getElementById('root'))
```

#### `src/index.css`
**Fungsi**: Import Tailwind CSS v4

```css
@import 'tailwindcss';
```

---

### 🔹 Component Files

#### `src/components/PieChartComponent.tsx`
**Fungsi**: Render pie chart dengan SVG

**Props**:
- `chartData`: Array data kategori & amount
- `totalChartAmount`: Total untuk perhitungan persentase
- `setSelectedChartItem`: Callback saat klik slice

**Features**:
- Pure SVG rendering (no library)
- Hover effect
- Click to show detail

#### `src/components/BarChartComponent.tsx`
**Fungsi**: Render bar chart

**Props**:
- `chartData`: Array data
- `setSelectedChartItem`: Callback
- `formatRupiah`: Format function
- `themeStyles`: Theme object

**Features**:
- Responsive bars
- Tooltip on hover
- Auto-scale height

---

### 🔹 Type Definitions

#### `src/types/index.ts`
**Fungsi**: TypeScript interfaces

**Exports**:
```tsx
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
```

---

### 🔹 Constants

#### `src/constants/index.ts`
**Fungsi**: Data statis aplikasi

**Exports**:
1. **EXPENSE_CATEGORIES**: Array kategori pengeluaran
2. **INCOME_CATEGORIES**: Array kategori pemasukan
3. **CATEGORY_COLORS**: Object mapping kategori → warna
4. **TRANSLATIONS**: Object translations ID/EN

**Example**:
```tsx
import { EXPENSE_CATEGORIES, TRANSLATIONS } from './constants';

const t = TRANSLATIONS['id']; // Indonesian
console.log(t.dashboard); // "Beranda"
```

---

### 🔹 Utilities

#### `src/utils/index.ts`
**Fungsi**: Helper functions

**Exports**:
1. **formatRupiah(amount)**: Format angka ke Rupiah
   ```tsx
   formatRupiah(1000000) // "Rp 1.000.000"
   ```

2. **getMonthYearKey(date)**: Convert date ke key "YYYY-MM"
   ```tsx
   getMonthYearKey("2025-01-06") // "2025-01"
   ```

3. **getMonthName(key, lang)**: Format bulan dari key
   ```tsx
   getMonthName("2025-01", "id") // "Januari 2025"
   ```

4. **getAvailableMonths(transactions)**: List bulan yang ada data

---

### 🔹 Configuration Files

#### `package.json`
**Fungsi**: Dependencies & scripts

**Important scripts**:
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Check code quality
```

**Main dependencies**:
- `react` + `react-dom`: UI framework
- `lucide-react`: Icons
- `typescript`: Type safety
- `vite`: Build tool
- `tailwindcss`: Styling

#### `vite.config.ts`
**Fungsi**: Vite build configuration

```ts
export default defineConfig({
  plugins: [react()],
  // base: '/finary-app/'  // Uncomment untuk GitHub Pages
})
```

#### `tsconfig.json` (3 files)
**Fungsi**: TypeScript compiler options

- `tsconfig.json`: Base config
- `tsconfig.app.json`: App code config
- `tsconfig.node.json`: Node/Vite config

#### `eslint.config.js`
**Fungsi**: Code linting rules

Rules untuk:
- React hooks
- TypeScript
- Code quality

---

### 🔹 Deployment Files

#### `vercel.json`
**Fungsi**: Vercel deployment config

Rewrite semua route ke `index.html` (untuk SPA routing)

#### `netlify.toml`
**Fungsi**: Netlify deployment config

Settings:
- Build command
- Publish directory
- Redirects

---

### 🔹 Documentation

#### `README.md`
**Isi**: 
- Project overview
- Features
- Installation
- Usage
- Tech stack
- Deployment options

#### `DEPLOYMENT.md`
**Isi**:
- Step-by-step deployment ke 6 platform
- Custom domain setup
- Troubleshooting
- Environment variables

#### `QUICK_START.md`
**Isi**:
- 5-minute getting started
- Basic usage tutorial
- Feature walkthrough

#### `CONTRIBUTING.md`
**Isi**:
- How to contribute
- Code style guide
- Commit message format
- PR process

---

## 🔄 Data Flow

### 1. User Input
```
User → Modal Form → handleAddTransaction() 
→ setTransactions() → localStorage → Re-render
```

### 2. Data Display
```
localStorage → useEffect() → setTransactions() 
→ useMemo() calculations → Render UI
```

### 3. Theme Change
```
Settings Tab → setSettings() → localStorage 
→ Re-render with new themeStyles
```

---

## 💾 Data Storage

**LocalStorage Keys**:
- `keuanganku_v4`: Array of transactions
- `keuanganku_settings`: User settings object

**Format**:
```json
{
  "transactions": [
    {
      "id": "uuid",
      "date": "2025-01-06",
      "category": "Gaji & Upah",
      "description": "Gaji Bulanan",
      "amount": 5000000,
      "type": "pemasukan"
    }
  ],
  "settings": {
    "name": "User",
    "theme": "light",
    "language": "id",
    "greetingLight": "...",
    "greetingDark": "..."
  }
}
```

---

## 🎨 Styling System

**Tech**: Tailwind CSS v4

**Theme Tokens**: Dynamic via `themeStyles` object in App.tsx

**Responsive**:
- Mobile-first approach
- Breakpoints: `md:`, `lg:`, `xl:`

**Animations**:
- Custom CSS keyframes
- Tailwind utilities
- SVG animations

---

## 🧩 Component Hierarchy

```
App
├── Background Animation
├── Tooltip
├── Navbar
│   └── Navigation Items (4)
├── Main Content
│   ├── Dashboard Tab
│   │   ├── Header (Greeting)
│   │   ├── Summary Cards (3)
│   │   ├── Transaction List
│   │   └── Chart Section
│   │       ├── PieChartComponent
│   │       └── BarChartComponent
│   ├── Reports Tab
│   │   ├── Archive List
│   │   └── Ledger Table
│   ├── Settings Tab
│   └── Help Tab
├── Mobile FAB Button
├── Mobile Bottom Nav
└── Transaction Modal
```

---

## 🚀 Build Process

```
npm run build
│
├── TypeScript Compilation (tsconfig.app.json)
├── Vite Bundling
├── Tailwind CSS Processing
├── Asset Optimization
└── Output to dist/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── vite.svg
```

---

## 📚 Learning Path

**Untuk Pemula**:
1. Mulai dari `src/main.tsx` (entry point)
2. Baca `src/App.tsx` section by section
3. Pahami `src/types/index.ts` untuk struktur data
4. Eksplor `src/constants/index.ts` untuk data
5. Check `src/utils/index.ts` untuk helper functions

**Untuk Development**:
1. Clone & setup (lihat QUICK_START.md)
2. Buat branch baru
3. Edit files di `src/`
4. Test dengan `npm run dev`
5. Build test dengan `npm run build`
6. Submit PR (lihat CONTRIBUTING.md)

---

## 🔧 Customization Points

### Tambah Kategori Baru
**File**: `src/constants/index.ts`

```ts
export const EXPENSE_CATEGORIES = [
  "Kategori Baru",  // Tambah di sini
  ...
];

export const CATEGORY_COLORS = {
  "Kategori Baru": "#FF5733",  // Warna baru
  ...
};
```

### Tambah Bahasa Baru
**File**: `src/constants/index.ts`

```ts
export const TRANSLATIONS = {
  id: { ... },
  en: { ... },
  es: {  // Spanish
    dashboard: "Panel",
    // ... semua key
  }
};
```

### Ubah Theme Colors
**File**: `src/App.tsx` → `themeStyles` object

```tsx
const themeStyles = {
  accentGradient: isDark 
    ? 'bg-gradient-to-r from-purple-400 to-pink-300'  // Ganti
    : 'bg-gradient-to-r from-blue-500 to-green-600',
  // ...
};
```

---

## ⚡ Performance Optimizations

**Already Implemented**:
- ✅ `useMemo` for expensive calculations
- ✅ `useCallback` for event handlers (could add more)
- ✅ Component lazy loading (could improve)
- ✅ LocalStorage debouncing (via useEffect deps)

**Could Improve**:
- [ ] React.memo for components
- [ ] Virtual scrolling for long lists
- [ ] Code splitting
- [ ] Service Worker for offline support

---

## 🎯 Next Development

**Planned Features** (open for contribution):
1. Export data (CSV, PDF)
2. Recurring transactions
3. Budget planning
4. Multi-currency
5. Cloud sync (optional)
6. Desktop app (Electron)
7. PWA support

---

Semoga dokumentasi ini membantu! 🚀
