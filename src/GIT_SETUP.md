# 🚀 Panduan Push ke GitHub & Deploy Website

Panduan step-by-step lengkap untuk pemula!

---

## 📋 Persiapan

### 1. Install Git (Jika Belum)

**Windows**: Download dari [git-scm.com](https://git-scm.com/downloads)

**Mac**: 
```bash
brew install git
```

**Linux**:
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/Fedora
```

### 2. Setup Git (First Time)

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@example.com"
```

---

## 🌐 Step 1: Buat Repository di GitHub

1. **Login** ke [github.com](https://github.com)

2. **Klik** tombol **"New"** (hijau) atau **"+"** → **"New repository"**

3. **Isi form**:
   - Repository name: `finary-app` (atau nama lain)
   - Description: "Beautiful personal finance tracker app"
   - Visibility: **Public** (atau Private jika premium)
   - ❌ **JANGAN** centang "Add README" (sudah ada)
   - ❌ **JANGAN** centang "Add .gitignore" (sudah ada)
   - ❌ **JANGAN** centang "Choose a license" (sudah ada)

4. **Klik** "Create repository"

5. **SIMPAN** URL repository:
   ```
   https://github.com/USERNAME/finary-app.git
   ```

---

## 💻 Step 2: Push Code dari VS Code

### Cara 1: Via Terminal (RECOMMENDED)

1. **Buka Terminal** di VS Code (`Ctrl + `` atau View → Terminal)

2. **Initialize Git**:
```bash
git init
```

3. **Add semua file**:
```bash
git add .
```

4. **Commit**:
```bash
git commit -m "Initial commit: FinaryApp v1.0"
```

5. **Set main branch**:
```bash
git branch -M main
```

6. **Add remote** (ganti USERNAME & REPO_NAME):
```bash
git remote add origin https://github.com/USERNAME/finary-app.git
```

7. **Push**:
```bash
git push -u origin main
```

**DONE!** ✅ Code sudah di GitHub!

---

### Cara 2: Via VS Code GUI (Alternatif)

1. **Klik icon Source Control** (ikon cabang di sidebar kiri)

2. **Klik** "Initialize Repository"

3. **Ketik commit message**: "Initial commit: FinaryApp v1.0"

4. **Klik** "Commit"

5. **Klik** "Publish Branch"

6. **Login GitHub** jika diminta

7. **Pilih** Public/Private

**DONE!** ✅

---

## 🔒 Authentication

### Jika Minta Password

GitHub **TIDAK** support password biasa lagi. Gunakan salah satu:

#### Option 1: Personal Access Token (PAT)

1. **Buka** [github.com/settings/tokens](https://github.com/settings/tokens)

2. **Klik** "Generate new token" → "Generate new token (classic)"

3. **Settings**:
   - Note: "FinaryApp Development"
   - Expiration: 90 days (atau Custom)
   - Scopes: ✅ **repo** (centang semua)

4. **Klik** "Generate token"

5. **COPY token** (hanya muncul 1x!)

6. **Saat push**, paste token sebagai password

7. **Simpan di Git** (optional, biar nggak diminta terus):
```bash
git config --global credential.helper store
```

#### Option 2: SSH Keys (Lebih Aman)

1. **Generate SSH key**:
```bash
ssh-keygen -t ed25519 -C "email@example.com"
```

2. **Press Enter** 3x (default location & no passphrase)

3. **Copy public key**:

**Windows**:
```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```

**Mac/Linux**:
```bash
cat ~/.ssh/id_ed25519.pub
```

4. **Add ke GitHub**:
   - Buka [github.com/settings/keys](https://github.com/settings/keys)
   - Klik "New SSH key"
   - Title: "My Laptop"
   - Paste key
   - Klik "Add SSH key"

5. **Update remote URL**:
```bash
git remote set-url origin git@github.com:USERNAME/finary-app.git
```

6. **Test**:
```bash
ssh -T git@github.com
```

**DONE!** No password needed anymore! ✅

---

## 🌐 Step 3: Deploy ke Website (GRATIS)

### A. Deploy ke Vercel (PALING MUDAH!)

1. **Buka** [vercel.com](https://vercel.com)

2. **Klik** "Sign Up" → **Login dengan GitHub**

3. **Klik** "Add New Project"

4. **Import** repository `finary-app`

5. **Settings auto-detect**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Klik** "Deploy"

7. **Tunggu** 1-2 menit...

8. **DONE!** ✅ Website live di:
   ```
   https://finary-app.vercel.app
   ```

**Bonus**: Setiap kali push ke GitHub, auto-deploy! 🎉

---

### B. Deploy ke Netlify (Alternatif)

1. **Buka** [netlify.com](https://netlify.com)

2. **Sign up** → Login dengan GitHub

3. **Klik** "Add new site" → "Import an existing project"

4. **Pilih** GitHub → Authorize Netlify

5. **Pilih** repository `finary-app`

6. **Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

7. **Klik** "Deploy"

8. **DONE!** ✅ Website live di:
   ```
   https://finary-app.netlify.app
   ```

---

### C. Deploy ke GitHub Pages (Gratis Selamanya)

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Update `package.json`**:

Tambahkan 2 baris ini:
```json
{
  "homepage": "https://USERNAME.github.io/finary-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Ganti `USERNAME` dengan username GitHub kamu!

3. **Update `vite.config.ts`**:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/finary-app/'  // Nama repository
})
```

4. **Deploy**:
```bash
npm run deploy
```

5. **Aktifkan GitHub Pages**:
   - Buka `https://github.com/USERNAME/finary-app/settings/pages`
   - Source: **gh-pages** branch
   - Folder: **/ (root)**
   - Klik **Save**

6. **DONE!** ✅ Website live di:
   ```
   https://USERNAME.github.io/finary-app
   ```

**Note**: Deployment pertama bisa 5-10 menit

---

## 🎯 Step 4: Update Code (Setelah Deploy)

### Jika Edit Code:

1. **Save** file di VS Code

2. **Terminal**:
```bash
git add .
git commit -m "feat: tambah fitur export CSV"
git push
```

3. **Auto-deploy** di Vercel/Netlify! ✅

4. **GitHub Pages**: jalankan `npm run deploy` lagi

---

## 🔧 Troubleshooting

### ❌ "fatal: not a git repository"

```bash
git init
```

### ❌ "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/finary-app.git
```

### ❌ "failed to push some refs"

```bash
git pull origin main --rebase
git push -u origin main
```

### ❌ "Permission denied (publickey)"

Setup SSH keys lagi (lihat di atas)

### ❌ Build error di Vercel/Netlify

1. Check **build logs** di dashboard
2. Pastikan `package.json` benar
3. Test build lokal: `npm run build`
4. Cek Node version (vercel uses Node 18+)

### ❌ 404 setelah deploy

**Vercel/Netlify**: Sudah dihandle otomatis ✅

**GitHub Pages**: 
- Pastikan `base` di `vite.config.ts` benar
- Tunggu 5-10 menit
- Clear browser cache

---

## 📱 Cek Website di Mobile

1. **Buka URL** di smartphone
2. **Share** ke teman!
3. **Bookmark** untuk akses cepat

---

## 🎉 Selamat!

Website kamu sudah live! 

**Next Steps**:
- ⭐ Star repository di GitHub
- 📢 Share ke social media
- 📝 Update README dengan URL live
- 🚀 Tambah fitur baru

**Need Help?**
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) untuk detail
- Baca error message dengan teliti
- Google error message
- Ask di GitHub Issues

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

**Happy Deploying! 🚀🎉**
