import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { TrendingUp, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onInvestmentAdded: (category: string, amount: number) => void;
}

export const AddInvestmentModal: React.FC<Props> = ({ onClose, onInvestmentAdded }) => {
  const { getAccountBalances, eyeHidden, addTransaction } = useApp();
  const balances = getAccountBalances();

  const [category, setCategory] = useState<'Equity' | 'PPF' | 'SSY' | 'Demat'>('Equity');
  const [sourceAccount, setSourceAccount] = useState<'stable' | 'crunch'>('stable');
  const [amount, setAmount] = useState('10000');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    const numAmt = Number(amount) || 0;
    if (isNaN(numAmt) || numAmt <= 0) {
      setErrorNotice('Please enter a valid investment amount.');
      return;
    }

    const availableBal = sourceAccount === 'stable' ? balances.stable : balances.crunch;
    if (numAmt > availableBal) {
      setErrorNotice(`Insufficient funds in selected account. Available: ${formatCurrency(availableBal, false)}`);
      return;
    }

    const categoryNames = {
      Equity: 'Corporate Equity Portfolios',
      PPF: 'Public Provident Fund (PPF)',
      SSY: 'Sukanya Samriddhi Yojana (SSY)',
      Demat: 'Treasury Demat Securities Account'
    };

    const res = addTransaction('OUTFLOW', 'Investments', numAmt, `Investment Top-Up: ${categoryNames[category]}`, sourceAccount);
    if (!res.success) {
      setErrorNotice(res.error || 'Failed to process investment top-up.');
      return;
    }

    onInvestmentAdded(category, numAmt);
    setSuccessNotice(`Top-Up of ${formatCurrency(numAmt, false)} into ${categoryNames[category]} processed successfully!`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800 select-text">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative select-text border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-icici-orange text-white rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Add Investment / Top-Up</h3>
              <p className="text-xs text-slate-400">Increase asset portfolio holdings & wealth</p>
            </div>
          </div>

          {errorNotice && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Investment Category */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Target Asset Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold focus:outline-none"
              >
                <option value="Equity">Equity / Mutual Funds (14.2% CAGR)</option>
                <option value="SSY">Sukanya Samriddhi Yojana - SSY (8.2% Tax Free)</option>
                <option value="PPF">Public Provident Fund - PPF (7.1% p.a.)</option>
                <option value="Demat">Treasury Demat Securities (11.8% Return)</option>
              </select>
            </div>

            {/* Source Account */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Funding Operating Account</label>
              <select
                value={sourceAccount}
                onChange={e => setSourceAccount(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold focus:outline-none"
              >
                <option value="stable">Stable Growth Account ({formatCurrency(balances.stable, eyeHidden)})</option>
                <option value="crunch">Cash Crunch Account ({formatCurrency(balances.crunch, eyeHidden)})</option>
              </select>
            </div>

            {/* Investment Amount */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Top-Up Amount (₹)</label>
              <input
                type="text"
                placeholder="e.g. 10000"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono font-bold text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003366] hover:bg-icici-blue-light text-white text-xs font-black rounded-xl shadow transition"
            >
              Confirm Investment Top-Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
