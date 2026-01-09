import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  language: 'id' | 'en';
  isDark: boolean;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ language, isDark }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('install-prompt-dismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showInstallPrompt) return null;

  const text = {
    id: {
      title: 'Install FinaryApp',
      description: 'Install aplikasi untuk akses lebih cepat dan pengalaman yang lebih baik',
      install: 'Install Sekarang',
      later: 'Nanti'
    },
    en: {
      title: 'Install FinaryApp',
      description: 'Install the app for faster access and better experience',
      install: 'Install Now',
      later: 'Later'
    }
  };

  const t = text[language];

  return (
    <div className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 ${
      isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'
    } border rounded-3xl shadow-2xl p-6 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-500`}>
      <button
        onClick={handleDismiss}
        className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
        }`}
        aria-label="Close"
      >
        <X size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
      </button>

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${
          isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-teal-500 to-emerald-600'
        }`}>
          <Download size={24} className="text-white" />
        </div>
        
        <div className="flex-1 pr-6">
          <h3 className={`font-bold text-lg mb-1 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            {t.title}
          </h3>
          <p className={`text-sm mb-4 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t.description}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleInstallClick}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/30'
              }`}
            >
              {t.install}
            </button>
            <button
              onClick={handleDismiss}
              className={`px-4 py-2.5 rounded-xl font-medium transition-colors ${
                isDark 
                  ? 'hover:bg-white/10 text-slate-400' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {t.later}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
