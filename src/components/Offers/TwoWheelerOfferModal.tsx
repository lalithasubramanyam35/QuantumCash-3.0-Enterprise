import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { calculateEMI } from '../../utils/mathUtils';
import { Bike, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const TwoWheelerOfferModal: React.FC<Props> = ({ onClose }) => {
  const { disburseTwoWheelerLoan } = useApp();

  const [amount, setAmount] = useState<number>(150000); // 1.5 Lakhs
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [onRoadFunding, setOnRoadFunding] = useState<boolean>(true);
  const [disbursalResult, setDisbursalResult] = useState<{ refNo: string; emi: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentEMI = Math.round(calculateEMI(amount, 9.5, tenureMonths));

  const handleDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = disburseTwoWheelerLoan(amount, tenureMonths);
      setDisbursalResult(res);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!disbursalResult ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700 text-white rounded-2xl shadow">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">EXPRESS FINANCING</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Two-Wheeler Instant Loan</h3>
              </div>
            </div>

            <form onSubmit={handleDisburse} className="space-y-4">
              <div className="space-y-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Funding Amount</span>
                  <span className="text-icici-blue-dark font-mono text-base font-extrabold">{formatCurrency(amount, false)}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={250000}
                  step={10000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹20,000</span>
                  <span>₹1,50,000</span>
                  <span>₹2,50,000</span>
                </div>
              </div>

              {/* 100% On-Road Funding Toggle */}
              <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50">
                <span className="text-xs font-bold text-slate-700">100% On-Road Funding Cover</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onRoadFunding}
                    onChange={e => setOnRoadFunding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Tenure Buttons */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tenure (Months)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 36].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        tenureMonths === m
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m} m
                    </button>
                  ))}
                </div>
              </div>

              {/* EMI Box */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Monthly EMI (9.5% p.a.)</span>
                  <span className="text-base font-black text-slate-800">{formatCurrency(currentEMI, false)} / mo</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">Instant Approval</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1.5 min-w-[150px]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    '⚡ Get Instant Loan'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <div>
              <h4 className="font-black text-slate-800 text-lg">Loan Approved Instantly!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {formatCurrency(amount, false)} approved with 100% on-road funding. Reference: **{disbursalResult.refNo}**.
              </p>
            </div>

            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};
