import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { CreditCard, Landmark, Calendar, Percent, ShieldAlert } from 'lucide-react';

export const WhatIOweView: React.FC = () => {
  const { eyeHidden, loans } = useApp();

  const creditCards = [
    {
      id: 'cc_1',
      name: 'Quantum Signature Card',
      outstanding: 45670,
      dueDate: '2026-07-28',
      limit: 500000
    },
    {
      id: 'cc_2',
      name: 'Quantum Corporate Credit Card',
      outstanding: 76514.31,
      dueDate: '2026-08-02',
      limit: 1000000
    }
  ];

  const totalLoans = loans.reduce((sum, l) => sum + l.outstanding, 0);
  const totalCreditCards = creditCards.reduce((sum, c) => sum + c.outstanding, 0);
  const totalOwe = totalLoans + totalCreditCards;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-icici-blue-dark">My Debt Liabilities (What I Owe)</h2>
        <span className="text-xs text-slate-500 font-semibold bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full">
          Total Liabilities: {formatCurrency(totalOwe, eyeHidden)}
        </span>
      </div>

      {/* Credit Cards Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-icici-orange" /> Credit Cards Outstanding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creditCards.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{c.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">Card limit: {formatCurrency(c.limit, eyeHidden)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Outstanding Amount</span>
                  <span className="text-xl font-black text-rose-600 block mt-1">
                    {formatCurrency(c.outstanding, eyeHidden)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Payment Due Date: <strong>{c.dueDate}</strong>
                </span>
                <button className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition">
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loans Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          <Landmark className="w-4 h-4 text-icici-blue-dark" /> Active Term Loans
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loans.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{l.name}</h4>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Principal Outstanding</span>
                  <span className="text-lg font-bold text-rose-600 mt-1 block">
                    {formatCurrency(l.outstanding, eyeHidden)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600">
                  <div>
                    <span>EMI Amount</span>
                    <p className="font-bold text-slate-800">{formatCurrency(l.monthlyEMI, eyeHidden)}/mo</p>
                  </div>
                  <div>
                    <span>Interest Rate</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-0.5">
                      <Percent className="w-3 h-3 text-slate-400" /> {l.interestRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Remaining Tenure: <strong>{l.tenureYearsRemaining} years</strong></span>
                <span className="text-icici-blue-light hover:underline font-medium cursor-pointer">EMI History</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-rose-800 text-sm">Debt Overdraft & Compliance Note</h4>
          <p className="text-xs text-rose-600 leading-relaxed">
            All liabilities display total outstanding amounts including accrued interest. Payments default to the registered primary operating account. Ensure sufficient liquidity checks before the respective due dates.
          </p>
        </div>
      </div>
    </div>
  );
};
