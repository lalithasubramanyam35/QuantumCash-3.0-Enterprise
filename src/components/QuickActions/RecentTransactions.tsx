import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { getFormattedStatementData } from '../../utils/transactionData';
import { TransactionStatementModal } from '../Transactions/TransactionStatementModal';
import { TransactionReceiptModal } from '../Transactions/TransactionReceiptModal';
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';
import type { TransactionRecord } from '../../types';

export const RecentTransactions: React.FC = () => {
  const { transactions, activeAccountKey, eyeHidden } = useApp();

  const [showFullStatement, setShowFullStatement] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);

  const statementRecords = useMemo(() => {
    return getFormattedStatementData(transactions, activeAccountKey);
  }, [transactions, activeAccountKey]);

  // First 7 transactions for Overview view
  const recentSeven = useMemo(() => {
    return statementRecords.slice(0, 7);
  }, [statementRecords]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Recent Activity & Ledger Log</h3>
          <p className="text-xs text-slate-500">Live credit & debit transactions ending 20 JUL 2026.</p>
        </div>

        <button
          onClick={() => setShowFullStatement(true)}
          className="text-xs font-bold text-icici-orange hover:text-icici-orange-hover flex items-center gap-1 transition"
        >
          <span>See All Transactions</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7 Recent Rows */}
      <div className="divide-y divide-slate-100">
        {recentSeven.map(rec => (
          <div
            key={rec.id}
            onClick={() => setSelectedTxn(rec)}
            className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-full ${
                  rec.type === 'CREDIT'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                {rec.type === 'CREDIT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-icici-blue-dark transition">
                  {rec.payeeName}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.dayNumber} {rec.monthShort} 2026 | {rec.category}</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`font-black text-xs sm:text-sm block ${
                  rec.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {rec.type === 'CREDIT' ? '+' : '-'} {formatCurrency(rec.amount, eyeHidden)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">SUCCESS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Statement Pop-up Modal */}
      {showFullStatement && (
        <TransactionStatementModal onClose={() => setShowFullStatement(false)} />
      )}

      {/* Single Receipt Inspection Drawer */}
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
