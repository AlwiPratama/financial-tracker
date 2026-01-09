import { Transaction } from '../types';
import { getMonthYearKey } from './formatters';

export const getAvailableMonths = (transactions: Transaction[]) => {
  const months = new Set<string>();
  // Always include current month
  months.add(getMonthYearKey(new Date().toISOString()));
  transactions.forEach(t => months.add(getMonthYearKey(t.date)));
  return Array.from(months).sort().reverse();
};
