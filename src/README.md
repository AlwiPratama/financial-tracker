# FinaryApp - Finance Diary 💰

Aplikasi pencatat keuangan pribadi yang indah dan mudah digunakan. Kelola pemasukan, pengeluaran, utang, dan piutang dengan antarmuka yang menarik.

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif** - Lihat saldo, pemasukan, pengeluaran, dan tracking utang/piutang
- 📈 **Visualisasi Data** - Grafik pie dan bar chart untuk analisis keuangan
- 📁 **Laporan Bulanan** - Arsip buku besar otomatis setiap bulan
- 🎨 **Tema Light & Dark** - Animasi background yang indah (bintang & awan)
- 🌐 **Dwi-bahasa** - Bahasa Indonesia & English
- 💾 **Penyimpanan Lokal** - Data tersimpan otomatis di browser
- 📱 **Responsive** - Optimal untuk desktop & mobile

## 🚀 Cara Menggunakan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 3. Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

### 4. Preview Production Build

```bash
npm run preview
```

## 🌐 Deploy ke Website

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/finary-app.git
git push -u origin main
```

2. Kunjungi [vercel.com](https://vercel.com)
3. Import repository GitHub Anda
4. Deploy otomatis! ✨

### Deploy ke Netlify

1. Build project:

```bash
npm run build
```

2. Kunjungi [netlify.com](https://netlify.com)
3. Drag & drop folder `dist/` ke Netlify
4. Website langsung live! 🎉

### Deploy ke GitHub Pages

1. Install package:

```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:

```json
{
  "homepage": "https://username.github.io/finary-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  base: "/finary-app/",
});
```

4. Deploy:

```bash
npm run deploy
```

## 📂 Struktur Folder

```
finary-app/
├── src/
│   ├── components/        # Komponen React
│   │   ├── PieChartComponent.tsx
│   │   └── BarChartComponent.tsx
│   ├── constants/         # Konstanta & data statis
│   │   └── index.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Helper functions
│   │   └── index.ts
│   ├── App.tsx           # Main component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite config
└── tsconfig.json        # TypeScript config
```

## 🛠️ Teknologi

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## 📝 Cara Menggunakan Aplikasi

1. **Tambah Transaksi**: Klik tombol (+) melayang
2. **Lihat Grafik**: Scroll ke bawah dashboard untuk analisis visual
3. **Buka Laporan**: Tab "Laporan" untuk melihat arsip bulanan
4. **Ubah Tema**: Tab "Pengaturan" untuk ganti tema & bahasa
5. **Bantuan**: Tab "Bantuan" untuk panduan lengkap

## 🎯 Kategori

### Pemasukan

- Gaji & Upah
- Bonus & Tunjangan
- Hasil Usaha
- Investasi & Dividen
- Utang (Menerima Pinjaman)
- Pengembalian Piutang
- Dan lainnya...

### Pengeluaran

- Makanan & Minuman
- Transportasi
- Belanja Bulanan
- Tagihan & Utilitas
- Piutang (Memberi Pinjaman)
- Membayar Utang
- Dan lainnya...

## 👨‍💻 Author

Created by **mhalwiii**

## 📄 License

MIT License - Bebas digunakan untuk project pribadi maupun komersial

---

💡 **Tips**: Gunakan fitur "Export Data" untuk backup manual, meskipun data sudah tersimpan otomatis di browser!

⭐ Jika project ini membantu, jangan lupa beri star di GitHub!