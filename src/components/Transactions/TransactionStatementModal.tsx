import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { getFormattedStatementData } from '../../utils/transactionData';
import { filterTransactionsByDateRange } from '../../utils/transactionFilters';
import type { DateRangeFilter } from '../../utils/transactionFilters';
import { TransactionReceiptModal } from './TransactionReceiptModal';
import { FileText, Download, Filter, ArrowUpRight, ArrowDownLeft, X, ChevronLeft, ChevronRight, Inbox, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { TransactionRecord } from '../../types';

interface Props {
  onClose: () => void;
}

export const TransactionStatementModal: React.FC<Props> = ({ onClose }) => {
  const { transactions, activeAccountKey, eyeHidden } = useApp();

  const [dateFilter, setDateFilter] = useState<DateRangeFilter>('Last 7 Days');
  const [legendFilter, setLegendFilter] = useState<'ALL' | 'BBPS' | 'UPI' | 'IMPS'>('ALL');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'XLS'>('PDF');
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dynamic statement records combining AppContext live txns + July 2026 mock data
  const baseRecords = useMemo(() => {
    return getFormattedStatementData(transactions, activeAccountKey);
  }, [transactions, activeAccountKey]);

  // Apply Date Range Filter & calculate Summary Metrics
  const { filteredRecords, summaryMetrics } = useMemo(() => {
    const dateFiltered = filterTransactionsByDateRange(baseRecords, dateFilter, activeAccountKey);
    const legendFiltered = dateFiltered.filteredRecords.filter(rec => {
      if (legendFilter !== 'ALL' && rec.category !== legendFilter) {
        return false;
      }
      return true;
    });

    return {
      filteredRecords: legendFiltered,
      summaryMetrics: dateFiltered.summaryMetrics
    };
  }, [baseRecords, dateFilter, legendFilter, activeAccountKey]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleDateFilterChange = (f: DateRangeFilter) => {
    setDateFilter(f);
    setCurrentPage(1);
  };

  const handleLegendFilterChange = (category: 'ALL' | 'BBPS' | 'UPI' | 'IMPS') => {
    setLegendFilter(category);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    if (exportFormat === 'XLS') {
      const headers = ['Date,Payee Name,Category,Reference,Credit Amount,Debit Amount,Type\n'];
      const rows = filteredRecords.map(r => 
        `"${r.date}","${r.payeeName}","${r.category}","${r.referenceString}","${r.type === 'CREDIT' ? r.amount : ''}","${r.type === 'DEBIT' ? r.amount : ''}","${r.type}"`
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `QuantumCash_Statement_July2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadNotice('QuantumCash_Statement_July2026.csv generated successfully!');
      setTimeout(() => setDownloadNotice(null), 3000);
    } else {
      if (typeof window.print === 'function') {
        window.print();
      }
      setDownloadNotice('Opening PDF print window for QuantumCash Account Statement...');
      setTimeout(() => setDownloadNotice(null), 3000);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'UPI': return 'bg-icici-blue-dark text-white';
      case 'IMPS':
      case 'NEFT': return 'bg-teal-700 text-white';
      case 'BBPS': return 'bg-icici-orange text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-3 sm:p-6 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200 select-text">
        
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-icici-blue-dark via-slate-900 to-icici-blue-dark text-white flex justify-between items-center shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileText className="w-5 h-5 text-icici-orange" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Detailed Account Statement</h3>
              <p className="text-xs text-slate-300 font-mono">
                Account: {activeAccountKey === 'stable' ? 'Stable Growth (QC-SG-882190)' : 'Cash Crunch (QC-CC-401928)'} | Ending 20 JUL 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-600">Period:</span>
            <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-2xs">
              {(['Last 7 Days', 'Last 30 Days', 'Financial Year'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => handleDateFilterChange(f)}
                  className={`px-3 py-1 rounded-full font-bold transition text-xs ${
                    dateFilter === f ? 'bg-icici-blue-dark text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredRecords.length}</strong> transactions
          </div>
        </div>

        {/* Financial Year Summary Banner */}
        {dateFilter === 'Financial Year' && (
          <div className="px-5 py-3 bg-slate-900 text-white grid grid-cols-3 gap-4 border-b border-slate-800 text-xs shadow-inner">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Inflow (Credits)</span>
                <span className="font-black text-emerald-400 text-sm">
                  + {formatCurrency(summaryMetrics.totalInflow, eyeHidden)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Outflow (Debits)</span>
                <span className="font-black text-rose-400 text-sm">
                  - {formatCurrency(summaryMetrics.totalOutflow, eyeHidden)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-icici-orange/20 text-icici-orange rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Cash Flow</span>
                <span className={`font-black text-sm ${summaryMetrics.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {summaryMetrics.netCashFlow >= 0 ? '+' : ''} {formatCurrency(summaryMetrics.netCashFlow, eyeHidden)}
                </span>
              </div>
            </div>
          </div>
        )}

        {downloadNotice && (
          <div className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between animate-fade-in">
            <span>📄 {downloadNotice}</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px]">READY</span>
          </div>
        )}

        {/* Statement Table View / Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {pagedRecords.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[10px] uppercase font-extrabold text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-4 w-24">Date</th>
                    <th className="py-3 px-4">Payee / Remarks</th>
                    <th className="py-3 px-4 text-right w-36">Credit (₹)</th>
                    <th className="py-3 px-4 text-right w-36">Debit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {pagedRecords.map(row => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedTxn(row)}
                      className="hover:bg-slate-50 transition cursor-pointer group"
                    >
                      {/* Date Badge */}
                      <td className="py-3 px-4 align-top">
                        <div className="bg-slate-100 group-hover:bg-icici-blue-dark group-hover:text-white transition rounded-xl p-2 text-center w-12 border border-slate-200">
                          <span className="text-base font-black leading-none block">{row.dayNumber}</span>
                          <span className="text-[9px] font-bold tracking-wider uppercase block mt-0.5">{row.monthShort}</span>
                        </div>
                      </td>

                      {/* Payee / Remarks */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-full shrink-0 ${getCategoryBadgeClass(row.category)}`}>
                            {row.type === 'CREDIT' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 group-hover:text-icici-blue-dark transition text-xs sm:text-sm">
                              {row.payeeName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{row.referenceString}</p>
                          </div>
                        </div>
                      </td>

                      {/* Credit Amount */}
                      <td className="py-3 px-4 text-right align-top font-extrabold">
                        {row.type === 'CREDIT' ? (
                          <span className="text-emerald-600 text-sm">
                            + {formatCurrency(row.amount, eyeHidden)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-normal">---</span>
                        )}
                      </td>

                      {/* Debit Amount */}
                      <td className="py-3 px-4 text-right align-top font-extrabold">
                        {row.type === 'DEBIT' ? (
                          <span className="text-rose-600 text-sm">
                            - {formatCurrency(row.amount, eyeHidden)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-normal">---</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No transactions found for the selected period.</h4>
              <p className="text-xs text-slate-400">Try switching date range or category filter.</p>
            </div>
          )}
        </div>

        {/* Footer Bar Controls (Matching Screenshot Bottom Right) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Legends & Pagination */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={legendFilter}
              onChange={e => handleLegendFilterChange(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none shadow-2xs"
            >
              <option value="ALL">Legends: All Categories</option>
              <option value="BBPS">BBPS - Bharat Bill Payment System</option>
              <option value="UPI">UPI - Unified Payments Interface</option>
              <option value="IMPS">IMPS - Immediate Payment Service</option>
            </select>

            {totalPages > 1 && (
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-slate-100 disabled:opacity-40 rounded transition"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:bg-slate-100 disabled:opacity-40 rounded transition"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>

          {/* Export Toolbar (Bottom Right) */}
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-200 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setExportFormat('PDF')}
                className={`px-3 py-1 rounded-lg transition ${exportFormat === 'PDF' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('XLS')}
                className={`px-3 py-1 rounded-lg transition ${exportFormat === 'XLS' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}
              >
                XLS
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> DOWNLOAD
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <TransactionReceiptModal
          transaction={selectedTxn}
          eyeHidden={eyeHidden}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
};
