import React, { useState } from 'react';
import { Cloud, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TRANSLATIONS } from '../constants';
import { LanguageType } from '../types';
import { Background } from './Background';
import { Logo } from './Logo';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<LanguageType>('id');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  const themeStyles = {
    bgApp: isDark ? 'text-slate-100' : 'text-slate-700',
    cardGlass: isDark ? 'bg-[#151623]/80 border-white/10 shadow-2xl' : 'bg-white/80 border-white/60 shadow-[0_20px_60px_rgb(0,0,0,0.1)] backdrop-blur-xl',
    textPrimary: isDark ? 'text-white' : 'text-slate-800',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
    accentGradient: isDark ? 'bg-gradient-to-r from-indigo-400 to-cyan-300' : 'bg-gradient-to-r from-teal-500 to-emerald-600',
    inputBg: isDark ? 'bg-[#0B0C15]/50 border-white/10 text-white' : 'bg-white/50 border-slate-200 text-slate-700',
    buttonPrimary: isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError(t.fillAllFields);
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError(t.loginError);
      }
    } else {
      if (!email || !password || !confirmPassword || !name) {
        setError(t.fillAllFields);
        return;
      }
      if (password !== confirmPassword) {
        setError(t.passwordMismatch);
        return;
      }
      const success = register(email, password, name);
      if (!success) {
        setError(t.registerError);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    
    try {
      const success = await loginWithGoogle();
      if (!success) {
        setError(language === 'id' 
          ? 'Login Google gagal. Silakan cek GOOGLE_AUTH_SETUP.md untuk panduan setup.' 
          : 'Google sign-in failed. Check GOOGLE_AUTH_SETUP.md for setup guide.');
      }
      // If success is true, the page will automatically redirect or update
    } catch (err) {
      setError(language === 'id'
        ? 'Terjadi kesalahan. Pastikan Google OAuth sudah dikonfigurasi di Supabase.'
        : 'An error occurred. Make sure Google OAuth is configured in Supabase.');
      console.error('Google sign-in error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-700 ${themeStyles.bgApp}`}>
      <Background isDark={isDark} />

      {/* Language & Theme Toggle */}
      <div className="fixed top-6 right-6 z-20 flex gap-3">
        <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white'}`}>
          {['id', 'en'].map((lng) => (
            <button 
              key={lng}
              onClick={() => setLanguage(lng as LanguageType)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${language === lng ? (isDark ? 'bg-white/20 text-white' : 'bg-white text-teal-600 shadow-sm') : 'opacity-50 hover:opacity-100'}`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'}`}
        >
          {isDark ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className={`w-full max-w-md rounded-[3rem] backdrop-blur-2xl border p-10 ${themeStyles.cardGlass} animate-in zoom-in-95 duration-700`}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo isDark={isDark} size={80} />
            </div>
            <h1 className={`font-black text-3xl tracking-tighter leading-none bg-clip-text text-transparent ${themeStyles.accentGradient} mb-2`}>
              Finary<span className={themeStyles.textPrimary}>App</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Finance Diary</p>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-black ${themeStyles.textPrimary} mb-2`}>
              {isLogin ? t.loginTitle : t.registerTitle}
            </h2>
            <p className={`text-sm ${themeStyles.textSecondary}`}>
              {isLogin ? t.loginSubtitle : t.registerSubtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.yourName}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all font-medium shadow-sm ${themeStyles.inputBg}`}
                />
              </div>
            )}

            <div className="relative">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all font-medium shadow-sm ${themeStyles.inputBg}`}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                className={`w-full pl-14 pr-14 py-4 rounded-2xl outline-none transition-all font-medium shadow-sm ${themeStyles.inputBg}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary} hover:opacity-100 opacity-50 transition-opacity`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 ${themeStyles.textSecondary}`} size={20}/>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPassword}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all font-medium shadow-sm ${themeStyles.inputBg}`}
                />
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${themeStyles.buttonPrimary}`}
            >
              {isLogin ? t.login : t.register}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            <span className={`text-xs ${themeStyles.textSecondary}`}>{t.orContinueWith}</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${
              isDark 
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            } ${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {!isGoogleLoading ? (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{t.googleSignIn}</span>
              </>
            ) : (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className={`text-sm ${themeStyles.textSecondary}`}>
              {isLogin ? t.noAccount : t.haveAccount}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className={`font-bold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-teal-600 hover:text-teal-700'} transition-colors`}
              >
                {isLogin ? t.register : t.login}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};