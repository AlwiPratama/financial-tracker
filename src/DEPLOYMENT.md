# 🚀 Panduan Deployment FinaryApp

Panduan lengkap untuk deploy aplikasi FinaryApp ke berbagai platform hosting.

## 📋 Persiapan Awal

### 1. Setup Git Repository

```bash
# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit: FinaryApp v1.0"

# Create repository di GitHub dulu, lalu:
git remote add origin https://github.com/USERNAME/finary-app.git
git branch -M main
git push -u origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Test Build Lokal

```bash
# Build project
npm run build

# Preview hasil build
npm run preview
```

---

## 🌐 Deploy ke Vercel (RECOMMENDED)

**Vercel** adalah pilihan terbaik untuk React apps. Gratis, cepat, dan mudah!

### Cara 1: Via Website (Paling Mudah)

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Add New"** → **"Project"**
3. Import repository GitHub Anda
4. Settings otomatis terdeteksi:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Klik **"Deploy"**
6. ✅ Done! Website live dalam 1-2 menit

### Cara 2: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

**URL Hasil**: `https://finary-app.vercel.app`

---

## 🎯 Deploy ke Netlify

### Cara 1: Drag & Drop

1. Build project:
```bash
npm run build
```

2. Buka [app.netlify.com](https://app.netlify.com)
3. Drag & drop folder `dist/` ke Netlify
4. ✅ Done!

### Cara 2: Via Git (Otomatis)

1. Buka [app.netlify.com](https://app.netlify.com)
2. **"Add new site"** → **"Import an existing project"**
3. Pilih GitHub repository
4. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Klik **"Deploy"**

### Cara 3: Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy ke production
netlify deploy --prod
```

**URL Hasil**: `https://finary-app.netlify.app`

---

## 📦 Deploy ke GitHub Pages

### Setup

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://USERNAME.github.io/finary-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/finary-app/'  // Nama repository
})
```

### Deploy

```bash
npm run deploy
```

### Aktivasi GitHub Pages

1. Buka repository di GitHub
2. **Settings** → **Pages**
3. Source: `gh-pages` branch
4. Klik **"Save"**

**URL Hasil**: `https://USERNAME.github.io/finary-app`

---

## ☁️ Deploy ke Cloudflare Pages

1. Buka [pages.cloudflare.com](https://pages.cloudflare.com)
2. **"Create a project"** → **"Connect to Git"**
3. Pilih repository
4. Settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output: `dist`
5. Klik **"Save and Deploy"**

**URL Hasil**: `https://finary-app.pages.dev`

---

## 🔧 Deploy ke Railway

1. Buka [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository
4. Railway otomatis detect Vite project
5. ✅ Deploy otomatis!

**URL Hasil**: `https://finary-app.up.railway.app`

---

## 🐳 Deploy dengan Docker (Advanced)

### Create Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Build & Run

```bash
# Build image
docker build -t finary-app .

# Run container
docker run -p 8080:80 finary-app
```

Access: `http://localhost:8080`

---

## 🎨 Custom Domain

### Vercel
1. **Settings** → **Domains**
2. Tambahkan domain custom
3. Update DNS records sesuai instruksi

### Netlify
1. **Domain settings** → **Add custom domain**
2. Update DNS atau gunakan Netlify DNS

### GitHub Pages
1. Settings → Pages → Custom domain
2. Tambahkan CNAME record di DNS provider

---

## 🔒 Environment Variables (Jika Diperlukan)

### Vercel
```bash
vercel env add VITE_API_KEY
```

### Netlify
```bash
netlify env:set VITE_API_KEY "your-value"
```

Atau via dashboard di **Site settings** → **Environment variables**

---

## 📊 Monitoring & Analytics

### Google Analytics (Optional)

1. Install package:
```bash
npm install react-ga4
```

2. Add to `src/main.tsx`:
```tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

---

## ⚡ Performance Tips

1. **Enable Compression**: Sudah otomatis di Vercel/Netlify
2. **CDN**: Otomatis aktif
3. **Cache Headers**: Configured via platform
4. **Image Optimization**: Gunakan format WebP jika ada gambar

---

## 🐛 Troubleshooting

### Build Error

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Page Refresh

Pastikan ada config untuk SPA routing:
- Vercel: `vercel.json` ✅
- Netlify: `netlify.toml` ✅
- GitHub Pages: Gunakan hash router atau 404.html trick

### Blank Page

Check browser console dan pastikan `base` di `vite.config.ts` benar.

---

## 📝 Checklist Pre-Deploy

- [ ] Test build lokal (`npm run build`)
- [ ] Test preview (`npm run preview`)
- [ ] Update README dengan URL live
- [ ] Hapus console.log untuk production
- [ ] Set environment variables jika ada
- [ ] Test di berbagai browser
- [ ] Test responsive (mobile, tablet, desktop)

---

## 🎉 Post-Deployment

1. **Test URL live**
2. **Share dengan teman!**
3. **Monitor analytics**
4. **Backup data secara berkala**

---

## 📞 Support

Jika ada masalah deployment:
- Check dokumentasi platform
- Baca error message dengan teliti
- Google error message
- Ask di GitHub Issues

**Happy Deploying! 🚀**
