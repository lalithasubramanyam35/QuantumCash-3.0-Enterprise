import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Building, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onDepositCreated: (newDeposit: {
    id: string;
    name: string;
    type: 'FD' | 'RD';
    principal: number;
    interestRate: number;
    maturityDate: string;
    maturityAmount: number;
    details: string;
  }) => void;
}

export const OpenDepositModal: React.FC<Props> = ({ onClose, onDepositCreated }) => {
  const { getAccountBalances, eyeHidden, addTransaction } = useApp();
  const balances = getAccountBalances();

  const [depositType, setDepositType] = useState<'FD' | 'RD'>('FD');
  const [sourceAccount, setSourceAccount] = useState<'stable' | 'crunch'>('stable');
  const [amount, setAmount] = useState('50000');
  const [tenureYears, setTenureYears] = useState('1'); // '0.5' | '1' | '3' | '5'
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Dynamic Interest Rates & Calculations
  const getInterestRate = (type: 'FD' | 'RD', tenure: string) => {
    if (type === 'FD') {
      if (tenure === '0.5') return 6.5;
      if (tenure === '1') return 7.15;
      if (tenure === '3') return 7.25;
      return 7.5;
    } else {
      if (tenure === '0.5') return 6.25;
      if (tenure === '1') return 6.85;
      if (tenure === '3') return 7.0;
      return 7.15;
    }
  };

  const rate = getInterestRate(depositType, tenureYears);
  const numAmt = Number(amount) || 0;
  const numTenure = Number(tenureYears);
  const estimatedMaturityValue = Math.round(numAmt + (numAmt * rate * numTenure) / 100);

  const getMaturityDateString = (tenure: string) => {
    const d = new Date();
    const mos = Math.round(Number(tenure) * 12);
    d.setMonth(d.getMonth() + mos);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (isNaN(numAmt) || numAmt <= 0) {
      setErrorNotice('Please enter a valid deposit principal amount.');
      return;
    }

    const availableBal = sourceAccount === 'stable' ? balances.stable : balances.crunch;
    if (numAmt > availableBal) {
      setErrorNotice(`Insufficient funds in selected account. Available: ${formatCurrency(availableBal, false)}`);
      return;
    }

    const fdRef = `FD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const res = addTransaction('OUTFLOW', 'Deposits', numAmt, `${depositType === 'FD' ? 'Fixed' : 'Recurring'} Deposit Creation - Ref: ${fdRef}`, sourceAccount);
    if (!res.success) {
      setErrorNotice(res.error || 'Failed to create deposit.');
      return;
    }

    const created = {
      id: `dep_${Date.now()}`,
      name: `${depositType === 'FD' ? 'Fixed' : 'Recurring'} Deposit (${fdRef})`,
      type: depositType,
      principal: numAmt,
      interestRate: rate,
      maturityDate: getMaturityDateString(tenureYears),
      maturityAmount: estimatedMaturityValue,
      details: `${depositType} booked at ${rate}% p.a. for ${tenureYears} year(s).`
    };

    onDepositCreated(created);
    setSuccessNotice(`Deposit ${fdRef} created successfully! Principal ${formatCurrency(numAmt, false)} invested.`);
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
            <div className="p-2.5 bg-icici-blue-dark text-white rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Open New Deposit Account</h3>
              <p className="text-xs text-slate-400">High-yield guaranteed returns backed by ICICI</p>
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
            {/* Deposit Type Pills */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Deposit Scheme Type</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDepositType('FD')}
                  className={`py-2 rounded-lg font-bold transition ${
                    depositType === 'FD' ? 'bg-[#003366] text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fixed Deposit (FD)
                </button>
                <button
                  type="button"
                  onClick={() => setDepositType('RD')}
                  className={`py-2 rounded-lg font-bold transition ${
                    depositType === 'RD' ? 'bg-[#003366] text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recurring Deposit (RD)
                </button>
              </div>
            </div>

            {/* Source Account */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Source Operating Account</label>
              <select
                value={sourceAccount}
                onChange={e => setSourceAccount(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold focus:outline-none"
              >
                <option value="stable">Stable Growth Account ({formatCurrency(balances.stable, eyeHidden)})</option>
                <option value="crunch">Cash Crunch Account ({formatCurrency(balances.crunch, eyeHidden)})</option>
              </select>
            </div>

            {/* Deposit Amount */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Deposit Principal (₹)</label>
              <input
                type="text"
                placeholder="e.g. 50000"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono font-bold text-slate-900 text-sm focus:outline-none"
              />
            </div>

            {/* Tenure Selector */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Lock-in Tenure</label>
              <select
                value={tenureYears}
                onChange={e => setTenureYears(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold focus:outline-none"
              >
                <option value="0.5">6 Months (6.50% p.a.)</option>
                <option value="1">1 Year (7.15% p.a.)</option>
                <option value="3">3 Years (7.25% p.a.)</option>
                <option value="5">5 Years (7.50% p.a.)</option>
              </select>
            </div>

            {/* Calculated Interest Yield Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl flex justify-between items-center text-emerald-900">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Yield Rate & Maturity Value</span>
                <span className="font-extrabold text-sm text-emerald-950">{rate}% p.a.</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-bold block">Est. Maturity Amount</span>
                <span className="font-black text-sm font-mono">{formatCurrency(estimatedMaturityValue, eyeHidden)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition"
            >
              Book Deposit Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
