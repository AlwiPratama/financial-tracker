# ⚡ Quick Start Guide - FinaryApp

Panduan cepat untuk mulai menggunakan FinaryApp dalam 5 menit!

## 🎯 Step 1: Clone & Install (2 menit)

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/finary-app.git
cd finary-app

# Install dependencies
npm install
```

## 🚀 Step 2: Jalankan App (1 menit)

```bash
npm run dev
```

Buka browser di: **http://localhost:5173**

✅ App sudah jalan!

## 📝 Step 3: Coba Fitur (2 menit)

### 1. Tambah Transaksi Pertama

- Klik tombol **(+)** melayang di kanan bawah
- Pilih tipe: **Masuk** atau **Keluar**
- Pilih kategori (misal: "Gaji & Upah")
- Isi nominal: 5000000
- Klik **Simpan Transaksi**

### 2. Lihat Dashboard

- Card "Saldo Utama" otomatis update
- Transaksi muncul di "Riwayat Transaksi"
- Scroll ke bawah untuk lihat grafik

### 3. Buka Laporan

- Klik tab **"Laporan"** di navbar
- Klik bulan sekarang
- Lihat buku besar lengkap

### 4. Ubah Tema

- Klik tab **"Pengaturan"**
- Pilih **"Luar Angkasa (Gelap)"**
- Lihat background berubah jadi bintang! ✨

### 5. Ganti Bahasa

- Di Pengaturan, klik **"English (US)"**
- Semua teks otomatis ke Bahasa Inggris

---

## 🎨 Kustomisasi

### Ubah Nama

Di tab **Pengaturan** → isi **Nama Kamu**

### Ubah Greeting

Di tab **Pengaturan** → isi **Pesan Sambutan**

Contoh:
- "Semangat menabung di bulan"
- "Yuk kelola keuangan di bulan"

---

## 🔥 Fitur Lanjutan

### Tracking Utang

1. Klik **(+)**
2. Pilih **Masuk**
3. Kategori: **"Utang (Menerima Pinjaman)"**
4. Isi nominal: 1000000
5. Simpan

➡️ Card "Total Saya Berhutang" otomatis update!

### Bayar Utang

1. Klik **(+)**
2. Pilih **Keluar**
3. Kategori: **"Membayar Utang (Cicilan/Lunas)"**
4. Isi nominal: 500000
5. Simpan

➡️ "Sisa Utang" otomatis berkurang!

### Tracking Piutang

Sama seperti utang, tapi gunakan:
- **Piutang (Memberi Pinjaman)** → Keluar
- **Pengembalian Piutang** → Masuk

---

## 📊 Analisis Keuangan

### Grafik Pie

- Filter: **Keluar** untuk lihat pengeluaran
- Klik slice untuk detail kategori

### Grafik Bar

- Ganti ke icon **batang**
- Hover untuk lihat nominal

### View Tahunan

- Klik **"1 Tahun"**
- Lihat total semua transaksi tahun ini

---

## 💾 Data Tersimpan Otomatis

- Semua data tersimpan di **localStorage browser**
- Tidak perlu login/register
- Data tetap ada setelah refresh
- Tidak hilang kecuali clear browser data

⚠️ **Backup Manual**: Screenshot laporan bulanan untuk backup!

---

## 📱 Mobile Usage

### Desktop
- Full navbar di atas
- Tombol **"Tambah"** di kanan header

### Mobile
- Bottom navigation (4 icon)
- Tombol **(+)** melayang
- Swipe untuk scroll chart filters

---

## ⌨️ Keyboard Shortcuts

Belum ada (open untuk contribution!)

---

## 🎯 Next Steps

1. ✅ Gunakan app sehari-hari
2. 📊 Analisa pengeluaran mingguan
3. 💡 Set budget bulanan (coming soon)
4. 🌐 Deploy ke website (lihat [DEPLOYMENT.md](./DEPLOYMENT.md))
5. ⭐ Star repository di GitHub!

---

## 🐛 Masalah?

### Data Hilang
- Check apakah clear browser cache
- Data tersimpan per browser (Chrome ≠ Firefox)

### Grafik Kosong
- Tambah transaksi dulu
- Pilih bulan yang ada transaksi

### Tema Tidak Berubah
- Refresh browser
- Clear cache browser

### Build Error
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Resources

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy ke website
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Kontribusi code

---

## 🎉 Selamat Mencoba!

Enjoy tracking your finances! 💰✨

**Questions?** Open an issue di GitHub
