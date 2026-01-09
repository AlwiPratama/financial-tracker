import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, AuthContextType, UserSettings } from '../types';
import { supabase } from '../utils/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'finary_accounts';
const CURRENT_ACCOUNT_KEY = 'finary_current_account';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current account on mount and check Supabase session
  useEffect(() => {
    const initAuth = async () => {
      // Check if user has active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User logged in via Google OAuth
        const googleAccount = await getOrCreateGoogleAccount(session.user);
        setCurrentAccount(googleAccount);
        localStorage.setItem(CURRENT_ACCOUNT_KEY, googleAccount.id);
      } else {
        // Check localStorage for email/password login
        const currentAccountId = localStorage.getItem(CURRENT_ACCOUNT_KEY);
        if (currentAccountId) {
          const accounts = getAccountsFromStorage();
          const account = accounts.find(acc => acc.id === currentAccountId);
          if (account) {
            setCurrentAccount(account);
          } else {
            localStorage.removeItem(CURRENT_ACCOUNT_KEY);
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const googleAccount = await getOrCreateGoogleAccount(session.user);
        setCurrentAccount(googleAccount);
        localStorage.setItem(CURRENT_ACCOUNT_KEY, googleAccount.id);
      } else if (event === 'SIGNED_OUT') {
        // Don't auto-logout, user might be using email/password
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getOrCreateGoogleAccount = async (user: any): Promise<Account> => {
    const accounts = getAccountsFromStorage();
    const existingAccount = accounts.find(acc => acc.email === user.email);
    
    if (existingAccount) {
      return existingAccount;
    }

    // Create new account from Google profile
    const newAccount: Account = {
      id: user.id,
      email: user.email || '',
      password: '', // No password for OAuth users
      settings: {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        theme: 'light',
        language: 'id',
        greetingLight: "Langit cerah untuk hari yang cerah di bulan",
        greetingDark: "Malam yang tenang di bulan"
      },
      createdAt: new Date().toISOString(),
      isGoogleAuth: true
    };

    accounts.push(newAccount);
    saveAccountsToStorage(accounts);
    return newAccount;
  };

  const getAccountsFromStorage = (): Account[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };

  const saveAccountsToStorage = (accounts: Account[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  };

  const register = (email: string, password: string, name: string): boolean => {
    const accounts = getAccountsFromStorage();
    
    // Check if email already exists
    if (accounts.some(acc => acc.email === email)) {
      return false;
    }

    const newAccount: Account = {
      id: crypto.randomUUID(),
      email,
      password, // In production, hash this!
      settings: {
        name,
        theme: 'light',
        language: 'id',
        greetingLight: "Langit cerah untuk hari yang cerah di bulan",
        greetingDark: "Malam yang tenang di bulan"
      },
      createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    saveAccountsToStorage(accounts);
    
    // Auto login after register
    setCurrentAccount(newAccount);
    localStorage.setItem(CURRENT_ACCOUNT_KEY, newAccount.id);
    
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const accounts = getAccountsFromStorage();
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      setCurrentAccount(account);
      localStorage.setItem(CURRENT_ACCOUNT_KEY, account.id);
      return true;
    }
    
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        console.error('Make sure Google OAuth is configured in Supabase. Check GOOGLE_AUTH_SETUP.md for instructions.');
        return false;
      }
      
      // OAuth will redirect to Google, then back to the app
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      console.error('Make sure Google OAuth is configured in Supabase. Check GOOGLE_AUTH_SETUP.md for instructions.');
      return false;
    }
  };

  const logout = async () => {
    // Sign out from Supabase if using Google auth
    if (currentAccount?.isGoogleAuth) {
      await supabase.auth.signOut();
    }
    
    setCurrentAccount(null);
    localStorage.removeItem(CURRENT_ACCOUNT_KEY);
  };

  const switchAccount = (accountId: string) => {
    const accounts = getAccountsFromStorage();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (account) {
      setCurrentAccount(account);
      localStorage.setItem(CURRENT_ACCOUNT_KEY, account.id);
    }
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    if (!currentAccount) return;

    const updatedAccount = {
      ...currentAccount,
      settings: { ...currentAccount.settings, ...settings }
    };

    // Update in storage
    const accounts = getAccountsFromStorage();
    const index = accounts.findIndex(acc => acc.id === currentAccount.id);
    if (index !== -1) {
      accounts[index] = updatedAccount;
      saveAccountsToStorage(accounts);
      setCurrentAccount(updatedAccount);
    }
  };

  const getAllAccounts = (): Account[] => {
    return getAccountsFromStorage();
  };

  return (
    <AuthContext.Provider value={{
      currentAccount,
      login,
      logout,
      register,
      loginWithGoogle,
      switchAccount,
      updateSettings,
      getAllAccounts,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};