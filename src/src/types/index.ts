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
}

export interface UserSettings {
  name: string;
  theme: ThemeType;
  language: LanguageType;
  greetingLight: string;
  greetingDark: string;
}
