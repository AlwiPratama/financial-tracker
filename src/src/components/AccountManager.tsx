import React from 'react';
import { User, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageType } from '../types';

interface AccountManagerProps {
  language: LanguageType;
  translations: any;
  isDark: boolean;
}

export const AccountManager = ({ language, translations: t, isDark }: AccountManagerProps) => {
  const { currentAccount, getAllAccounts, switchAccount, logout } = useAuth();
  const allAccounts = getAllAccounts();

  const themeStyles = {
    cardGlass: isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100',
    textPrimary: isDark ? 'text-white' : 'text-slate-800',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className="space-y-6">
      <section>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          {t.accountManagement}
        </h3>

        {/* Current Account */}
        <div className={`p-6 rounded-2xl border mb-4 ${themeStyles.cardGlass}`}>
          <p className={`text-xs font-bold uppercase mb-3 ${themeStyles.textSecondary}`}>{t.currentAccount}</p>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-teal-600'} text-white font-black text-lg`}>
              {currentAccount?.settings.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className={`font-bold ${themeStyles.textPrimary}`}>{currentAccount?.settings.name}</p>
              <p className={`text-sm ${themeStyles.textSecondary}`}>{currentAccount?.email}</p>
            </div>
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
        </div>

        {/* All Accounts */}
        {allAccounts.length > 1 && (
          <>
            <p className={`text-xs font-bold uppercase mb-3 ${themeStyles.textSecondary}`}>{t.switchAccount}</p>
            <div className="space-y-2">
              {allAccounts
                .filter(acc => acc.id !== currentAccount?.id)
                .map(account => (
                  <button
                    key={account.id}
                    onClick={() => switchAccount(account.id)}
                    className={`w-full p-4 rounded-2xl border transition-all hover:scale-[1.01] flex items-center gap-3 ${themeStyles.cardGlass}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-100'} font-black`}>
                      {account.settings.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${themeStyles.textPrimary}`}>{account.settings.name}</p>
                      <p className={`text-xs ${themeStyles.textSecondary}`}>{account.email}</p>
                    </div>
                  </button>
                ))}
            </div>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className={`w-full mt-6 p-4 rounded-2xl border font-bold transition-all hover:scale-[1.01] flex items-center justify-center gap-2 ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'}`}
        >
          <LogOut size={18} />
          {t.logout}
        </button>
      </section>
    </div>
  );
};
