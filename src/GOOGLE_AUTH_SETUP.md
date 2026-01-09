# Panduan Setup Google OAuth / Google OAuth Setup Guide

## 🇮🇩 Bahasa Indonesia

FinaryApp Anda sekarang mendukung login dengan akun Google! Ikuti langkah-langkah berikut untuk mengaktifkannya:

### Langkah Setup

#### 1. Akses Dashboard Supabase
Kunjungi project Supabase Anda di: https://supabase.com/dashboard/project/ksdklpjlewxowxlxrcfd

#### 2. Konfigurasi Google OAuth Provider

1. Buka **Authentication** > **Providers** di sidebar kiri
2. Cari **Google** dalam daftar provider
3. Klik untuk membuka pengaturan Google provider
4. Toggle **Enable Sign in with Google** menjadi ON

#### 3. Dapatkan Kredensial Google OAuth

Anda perlu membuat kredensial OAuth dari Google Cloud Console:

1. Kunjungi https://console.cloud.google.com/
2. Buat project baru atau pilih yang sudah ada
3. Buka **APIs & Services** > **Credentials**
4. Klik **Create Credentials** > **OAuth 2.0 Client ID**
5. Konfigurasi OAuth consent screen jika belum
6. Untuk Application type, pilih **Web application**
7. Tambahkan URL berikut:
   - **Authorized JavaScript origins**: `https://ksdklpjlewxowxlxrcfd.supabase.co`
   - **Authorized redirect URIs**: `https://ksdklpjlewxowxlxrcfd.supabase.co/auth/v1/callback`
8. Klik **Create**
9. Salin **Client ID** dan **Client Secret**

#### 4. Konfigurasi Supabase dengan Kredensial Google

Kembali ke Supabase:
1. Paste **Google Client ID** di field "Client ID"
2. Paste **Google Client Secret** di field "Client Secret"
3. Klik **Save**

#### 5. Test Integrasi

1. Aplikasi Anda sudah siap!
2. Pengguna dapat klik tombol "Masuk dengan Google"
3. Mereka akan diarahkan ke Google untuk otorisasi
4. Setelah otorisasi, mereka akan kembali ke aplikasi dan otomatis login

### Cara Kerja

- **Pengguna Google pertama kali**: Otomatis membuat akun baru menggunakan email dan nama Google
- **Pengguna existing**: Jika pengguna sudah punya akun dengan email yang sama, akan terhubung ke akun tersebut
- **Ganti akun**: Pengguna bisa beralih antara akun Google dan akun email/password dengan lancar
- **Persistensi data**: Semua data keuangan tersimpan lokal dan terhubung ke setiap akun

### Catatan Keamanan

⚠️ **Penting**: 
- Ini adalah setup development/prototype
- Untuk production, implementasikan langkah keamanan yang proper
- Jangan share kredensial OAuth secara publik
- Pertimbangkan implementasi lapisan keamanan tambahan untuk data keuangan sensitif

### Troubleshooting

**Error "Provider is not enabled"**: Pastikan Anda sudah menyelesaikan langkah 2-4 di atas

**Redirect loop**: Verifikasi bahwa redirect URIs cocok persis di Google Console dan Supabase

**Akun tidak terbuat**: Cek browser console untuk error dan verifikasi koneksi Supabase

---

## 🇬🇧 English

Your FinaryApp now supports Google authentication! Follow these steps to enable it:

### Setup Instructions

#### 1. Access Supabase Dashboard
Visit your Supabase project at: https://supabase.com/dashboard/project/ksdklpjlewxowxlxrcfd

#### 2. Configure Google OAuth Provider

1. Go to **Authentication** > **Providers** in the left sidebar
2. Find **Google** in the list of providers
3. Click to expand the Google provider settings
4. Toggle **Enable Sign in with Google** to ON

#### 3. Get Google OAuth Credentials

You need to create OAuth credentials from Google Cloud Console:

1. Visit https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if you haven't already
6. For Application type, select **Web application**
7. Add these URLs:
   - **Authorized JavaScript origins**: `https://ksdklpjlewxowxlxrcfd.supabase.co`
   - **Authorized redirect URIs**: `https://ksdklpjlewxowxlxrcfd.supabase.co/auth/v1/callback`
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

#### 4. Configure Supabase with Google Credentials

Back in Supabase:
1. Paste your **Google Client ID** in the "Client ID" field
2. Paste your **Google Client Secret** in the "Client Secret" field
3. Click **Save**

#### 5. Test the Integration

1. Your app is now ready!
2. Users can click the "Sign in with Google" button
3. They'll be redirected to Google to authorize
4. After authorization, they'll be redirected back to your app and automatically logged in

### How It Works

- **First-time Google users**: Automatically creates a new account using their Google email and name
- **Existing users**: If a user already has an account with the same email, it links to that account
- **Account switching**: Users can switch between Google accounts and email/password accounts seamlessly
- **Data persistence**: All financial data is stored locally and linked to each account

### Security Notes

⚠️ **Important**: 
- This is a development/prototype setup
- For production, implement proper security measures
- Don't share your OAuth credentials publicly
- Consider implementing additional security layers for sensitive financial data

### Troubleshooting

**"Provider is not enabled" error**: Make sure you completed steps 2-4 above

**Redirect loop**: Verify the redirect URIs match exactly in both Google Console and Supabase

**No account created**: Check the browser console for errors and verify Supabase connection

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Quick Reference

**Supabase Project URL**: `https://ksdklpjlewxowxlxrcfd.supabase.co`
**Callback URL**: `https://ksdklpjlewxowxlxrcfd.supabase.co/auth/v1/callback`
