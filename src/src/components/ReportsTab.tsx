import React, { useMemo, useState } from 'react';
import { Calendar, FileText, FolderOpen, ArrowLeft, Download, Cloud } from 'lucide-react';
import { Transaction, LanguageType } from '../types';
import { formatRupiah, getMonthYearKey, getMonthName } from '../utils/formatters';
import { getAvailableMonths } from '../utils/transactions';
import { downloadPDF, uploadToGoogleDrive } from '../utils/reportExport';
import { toast } from 'sonner@2.0.3';

interface ReportsTabProps {
  transactions: Transaction[];
  language: LanguageType;
  translations: any;
  isDark: boolean;
  selectedReportKey: string | null;
  setSelectedReportKey: (key: string | null) => void;
  accountName: string;
}

export const ReportsTab = ({ 
  transactions, 
  language, 
  translations: t, 
  isDark, 
  selectedReportKey, 
  setSelectedReportKey,
  accountName
}: ReportsTabProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const themeStyles = {
    cardGlass: isDark ? 'bg-[#151623]/60 border-white/5 shadow-xl' : 'bg-white/70 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur-xl',
    textPrimary: isDark ? 'text-white' : 'text-slate-800',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
  };

  const availableReportMonths = useMemo(() => getAvailableMonths(transactions), [transactions]);

  const handleDownloadPDF = async () => {
    if (!selectedReportKey) return;
    
    setIsExporting(true);
    try {
      await downloadPDF({
        transactions,
        selectedReportKey,
        language,
        translations: t,
        accountName
      });
      toast.success(t.pdfSuccess);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!selectedReportKey) return;
    
    setIsUploading(true);
    try {
      await uploadToGoogleDrive({
        transactions,
        selectedReportKey,
        language,
        translations: t,
        accountName
      });
      toast.success(t.driveSuccess);
    } catch (error: any) {
      console.error('Google Drive upload error:', error);
      
      // Provide specific error messages based on the error type
      if (error.message === 'No active session') {
        toast.error(language === 'id' 
          ? 'Tidak ada sesi aktif. Silakan login dengan Google untuk menggunakan fitur Google Drive.' 
          : 'No active session. Please login with Google to use Google Drive feature.');
      } else if (error.message === 'Not logged in with Google') {
        toast.error(language === 'id' 
          ? 'Anda harus login dengan Google untuk menyimpan ke Google Drive. Logout dan login kembali menggunakan Google.' 
          : 'You must login with Google to save to Google Drive. Logout and login again using Google.');
      } else if (error.message === 'No Google access token available') {
        toast.error(language === 'id' 
          ? 'Token akses Google tidak tersedia. Silakan login ulang dengan Google.' 
          : 'Google access token not available. Please re-login with Google.');
      } else {
        toast.error(t.driveError || (language === 'id' ? 'Gagal upload ke Google Drive' : 'Failed to upload to Google Drive'));
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (selectedReportKey) {
    // Calculate Opening Balance
    const openingBalance = transactions
      .filter(t => getMonthYearKey(t.date) < selectedReportKey)
      .reduce((acc, t) => acc + (t.type === 'pemasukan' ? t.amount : -t.amount), 0);

    let runningBal = openingBalance;
    
    const filtered = transactions
      .filter(t => getMonthYearKey(t.date) === selectedReportKey)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const totalDebit = filtered.filter(t => t.type === 'pemasukan').reduce((acc, curr) => acc + curr.amount, 0);
    const totalCredit = filtered.filter(t => t.type === 'pengeluaran').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-8">
          <button 
            onClick={() => setSelectedReportKey(null)} 
            className={`flex items-center gap-3 font-bold transition-all px-6 py-3 rounded-2xl w-fit group hover:pl-4 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-white/80 text-slate-600 shadow-sm'}`}
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1"/> {t.backToFolder}
          </button>

          <div className={`${themeStyles.cardGlass} backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border-0`}>
            <div className={`p-10 flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-gradient-to-r from-teal-50/50 to-blue-50/50'}`}>
              <div>
                <h2 className={`text-3xl font-black ${themeStyles.textPrimary}`}>{t.accountingLedger}</h2>
                <p className={`${themeStyles.textSecondary} font-medium mt-2 flex items-center gap-2`}>
                  <Calendar size={16}/> {t.period} <span className="font-bold">{getMonthName(selectedReportKey, language)}</span>
                </p>
              </div>
              <div className={`p-5 rounded-3xl shadow-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-blue-600'}`}>
                <FileText size={32}/>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/30'}`}>
                  <tr>
                    <th className={`px-4 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>No.</th>
                    <th className={`px-8 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.date}</th>
                    <th className={`px-8 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.category}</th>
                    <th className={`px-8 py-6 text-left font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.note}</th>
                    <th className={`px-8 py-6 text-right font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.in}</th>
                    <th className={`px-8 py-6 text-right font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.out}</th>
                    <th className={`px-8 py-6 text-right font-black text-[10px] uppercase tracking-widest ${themeStyles.textSecondary}`}>{t.balance}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                  {/* Opening Balance Row */}
                  <tr className={`font-bold italic ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
                    <td colSpan={6} className="px-8 py-4 text-right opacity-70">{t.openingBalance}</td>
                    <td className={`px-8 py-4 text-right font-black whitespace-nowrap min-w-[150px] ${themeStyles.textPrimary}`}>
                      {formatRupiah(openingBalance)}
                    </td>
                  </tr>
                  
                  {/* Transaction Rows */}
                  {filtered.map((tItem, idx) => {
                    const isDebit = tItem.type === 'pemasukan';
                    runningBal += isDebit ? tItem.amount : -tItem.amount;
                    return (
                      <tr key={tItem.id} className={`transition-colors hover:bg-black/5`}>
                        <td className={`px-4 py-5 font-medium ${themeStyles.textSecondary}`}>{idx + 1}</td>
                        <td className={`px-8 py-5 font-medium ${themeStyles.textSecondary}`}>{new Date(tItem.date).getDate()}</td>
                        <td className={`px-8 py-5 font-bold ${themeStyles.textPrimary}`}>{tItem.category}</td>
                        <td className="px-8 py-5 text-slate-400 italic max-w-[200px] truncate">{tItem.description || '-'}</td>
                        <td className="px-8 py-5 text-right font-bold text-emerald-500 whitespace-nowrap min-w-[150px]">
                          {isDebit ? formatRupiah(tItem.amount) : ''}
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-rose-500 whitespace-nowrap min-w-[150px]">
                          {!isDebit ? formatRupiah(tItem.amount) : ''}
                        </td>
                        <td className={`px-8 py-5 text-right font-black whitespace-nowrap min-w-[150px] ${themeStyles.textPrimary}`}>
                          {formatRupiah(runningBal)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Row */}
                  <tr className={`font-black text-sm ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
                    <td colSpan={4} className="px-8 py-6 text-right uppercase tracking-widest text-xs opacity-50">{t.totalFinal}</td>
                    <td className="px-8 py-6 text-right text-emerald-500 whitespace-nowrap min-w-[150px]">{formatRupiah(totalDebit)}</td>
                    <td className="px-8 py-6 text-right text-rose-500 whitespace-nowrap min-w-[150px]">{formatRupiah(totalCredit)}</td>
                    <td className={`px-8 py-6 text-right whitespace-nowrap min-w-[150px] ${isDark ? 'text-indigo-400' : 'text-blue-600'}`}>
                      {formatRupiah(openingBalance + totalDebit - totalCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm'} disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1`}
            >
              {isExporting ? (
                <div className="animate-spin">
                  <Download size={18} />
                </div>
              ) : (
                <Download size={18} />
              )}
              {isExporting ? t.exportingPDF : t.downloadPDF}
            </button>
            <button
              onClick={handleSaveToDrive}
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm'} disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1`}
            >
              {isUploading ? (
                <div className="animate-spin">
                  <Cloud size={18} />
                </div>
              ) : (
                <Cloud size={18} />
              )}
              {isUploading ? t.uploadingDrive : t.saveToDrive}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Monthly Archive View
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className={`text-3xl font-black mb-8 tracking-tight ${themeStyles.textPrimary} flex items-center gap-4`}>
        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
          <FolderOpen className={isDark ? 'text-indigo-400' : 'text-blue-600'}/>
        </div>
        {t.monthlyArchive}
      </h2>
      
      {availableReportMonths.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {availableReportMonths.map(key => (
            <button 
              key={key} 
              onClick={() => setSelectedReportKey(key)} 
              className={`${themeStyles.cardGlass} p-8 rounded-[2.5rem] flex flex-col items-center group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-sm ${isDark ? 'bg-gradient-to-tr from-amber-600/20 to-orange-600/20 text-orange-400' : 'bg-gradient-to-tr from-amber-100 to-orange-100 text-orange-500'}`}>
                <Calendar size={32} strokeWidth={2.5}/>
              </div>
              <span className={`font-bold text-xl ${themeStyles.textPrimary}`}>{getMonthName(key, language)}</span>
              <span className={`text-[10px] uppercase font-black tracking-widest mt-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                {t.openData}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`py-32 text-center rounded-[3rem] border-2 border-dashed ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
          <FolderOpen size={80} className={`mx-auto mb-6 opacity-20`}/>
          <p className="font-bold text-xl opacity-50">{t.emptyArchive}</p>
          <p className="text-sm opacity-30 mt-2">{t.noDataSaved}</p>
        </div>
      )}
    </div>
  );
};