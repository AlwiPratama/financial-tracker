import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'finary_transactions';

export const useTransactions = () => {
  const { currentAccount } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage
  useEffect(() => {
    if (!currentAccount) return;

    const allTransactions = localStorage.getItem(STORAGE_KEY);
    if (allTransactions) {
      try {
        const parsed = JSON.parse(allTransactions);
        // Filter transactions for current account
        const accountTransactions = parsed.filter((t: Transaction) => t.accountId === currentAccount.id);
        setTransactions(accountTransactions);
      } catch (e) {
        console.error('Failed to load transactions:', e);
      }
    }
  }, [currentAccount]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!currentAccount) return;

    const allTransactions = localStorage.getItem(STORAGE_KEY);
    let allData: Transaction[] = [];
    
    if (allTransactions) {
      try {
        allData = JSON.parse(allTransactions);
        // Remove old transactions for this account
        allData = allData.filter(t => t.accountId !== currentAccount.id);
      } catch (e) {
        console.error(e);
      }
    }

    // Add current account's transactions
    allData.push(...transactions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [transactions, currentAccount]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'accountId'>) => {
    if (!currentAccount) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      accountId: currentAccount.id
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction
  };
};
