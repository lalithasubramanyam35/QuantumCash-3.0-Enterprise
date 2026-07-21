import React from 'react';
import { formatCurrency } from '../../utils';
import { CheckCircle2, Printer, X } from 'lucide-react';
import type { TransactionRecord } from '../../types';

interface Props {
  transaction: TransactionRecord;
  eyeHidden: boolean;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<Props> = ({ transaction, eyeHidden, onClose }) => {
  const handlePrint = () => {
    if (typeof window.print === 'function') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative select-text border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              TRANSACTION SUCCESSFUL
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-2">
              {transaction.type === 'CREDIT' ? '+' : '-'} {formatCurrency(transaction.amount, eyeHidden)}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">{transaction.payeeName}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono space-y-2 text-left">
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400">Reference / UTR:</span>
              <span className="font-bold text-slate-800">{transaction.id}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400">Date & Timestamp:</span>
              <span className="font-bold text-slate-800">{transaction.timestamp || `${transaction.dayNumber} ${transaction.monthShort} 2026`}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400">Payment Mode:</span>
              <span className="font-bold text-slate-800">{transaction.category}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400">Account Number:</span>
              <span className="font-bold text-slate-800">•••••••• 4821</span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 break-all font-sans">
              Ref String: {transaction.referenceString}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold py-2.5 rounded-xl transition shadow"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
