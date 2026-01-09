export type TransactionType = 'pemasukan' | 'pengeluaran';
export type ThemeType = 'light' | 'dark';
export type LanguageType = 'id' | 'en';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description?: string;
  amount: number;
  type: TransactionType;
  accountId: string; // Link to account
}

export interface UserSettings {
  name: string;
  theme: ThemeType;
  language: LanguageType;
  greetingLight: string;
  greetingDark: string;
}

export interface Account {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  settings: UserSettings;
  createdAt: string;
  isGoogleAuth?: boolean; // Flag for Google OAuth accounts
}

export interface AuthContextType {
  currentAccount: Account | null;
  login: (email: string, password: string) => boolean;
  logout: () => Promise<void>; // Made async to support Supabase sign out
  register: (email: string, password: string, name: string) => boolean;
  loginWithGoogle: () => Promise<boolean>; // New Google login method
  switchAccount: (accountId: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  getAllAccounts: () => Account[];
  isLoading?: boolean; // Loading state for auth initialization
}

export interface TooltipState {
  show: boolean;
  text: string;
  rect: DOMRect | null;
  position: 'top' | 'bottom';
}