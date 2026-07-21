import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { calculateEMI } from '../../utils/mathUtils';
import { CheckCircle2, Zap, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PersonalLoanOfferModal: React.FC<Props> = ({ onClose }) => {
  const { activeAccountKey, getAccountBalances, disbursePersonalLoan } = useApp();
  const balances = getAccountBalances();

  const [amount, setAmount] = useState<number>(500000); // Default 5 Lakhs
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [accountKey, setAccountKey] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [disbursalResult, setDisbursalResult] = useState<{ refNo: string; emi: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentEMI = Math.round(calculateEMI(amount, 10.5, tenureMonths));

  const handleDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = disbursePersonalLoan(amount, tenureMonths, accountKey);
      setDisbursalResult(res);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!disbursalResult ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-icici-orange text-white rounded-2xl shadow">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">PRE-APPROVED | ZERO DOCS</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Personal Loan Instant Disbursal</h3>
              </div>
            </div>

            <form onSubmit={handleDisburse} className="space-y-4">
              {/* Loan Amount Slider */}
              <div className="space-y-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Select Loan Disbursal Amount</span>
                  <span className="text-icici-blue-dark font-mono text-base font-extrabold">{formatCurrency(amount, false)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={10000000}
                  step={50000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full accent-icici-orange cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹50,000</span>
                  <span>₹5,00,000</span>
                  <span>₹1,00,00,000</span>
                </div>
              </div>

              {/* Tenure Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Repayment Tenure (Months)</label>
                <div className="grid grid-cols-5 gap-2">
                  {[12, 24, 36, 48, 60].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        tenureMonths === m
                          ? 'border-icici-orange bg-icici-orange text-white shadow'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m} m
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated EMI Display */}
              <div className="bg-gradient-to-r from-icici-blue-dark to-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[9px] text-slate-300 uppercase font-bold block">Estimated Monthly EMI (10.5% p.a.)</span>
                  <span className="text-2xl font-black text-amber-300">{formatCurrency(currentEMI, false)}</span>
                  <span className="text-[10px] text-slate-300 block">/ month</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 block">Processing Fee</span>
                  <span className="text-xs font-bold text-emerald-400">₹0 (ZERO FEE)</span>
                </div>
              </div>

              {/* Account Selector */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Credit Funds to Operating Account</label>
                <select
                  value={accountKey}
                  onChange={e => setAccountKey(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="stable">Stable Growth Account (Current Balance: {formatCurrency(balances.stable, false)})</option>
                  <option value="crunch">Cash Crunch Account (Current Balance: {formatCurrency(balances.crunch, false)})</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 min-w-[150px]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    '⚡ Disburse Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-lg">Funds Disbursed Instantly!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                {formatCurrency(amount, false)} credited to your {accountKey === 'stable' ? 'Stable Growth' : 'Cash Crunch'} account. First EMI ({formatCurrency(disbursalResult.emi, false)}) starts next month.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs font-mono font-bold text-slate-800 space-y-1">
              <p>📄 REF NO: {disbursalResult.refNo}</p>
              <p className="text-[10px] text-emerald-600">STATUS: CREDITED TO ACCOUNT</p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
