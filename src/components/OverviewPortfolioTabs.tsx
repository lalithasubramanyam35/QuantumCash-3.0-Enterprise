import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { Wallet, Building, ArrowRight, ShieldCheck, PieChart, Lock, Calendar, AlertTriangle } from 'lucide-react';

export const OverviewPortfolioTabs: React.FC = () => {
  const { getAccountBalances, eyeHidden, setDeepDiveAccountKey } = useApp();
  const balances = getAccountBalances();

  const [activeSegmentTab, setActiveSegmentTab] = useState<'ACCOUNTS' | 'DEPOSITS' | 'INVESTMENTS'>('ACCOUNTS');

  // Segment totals
  const accountsTotal = balances.stable + balances.crunch;
  const depositsTotal = 250000 + 155261; // FD (2.5L) + RD (1.55L) = 4,05,261
  const investmentsTotal = 863035 + 470946 + 200000; // SSY (8.63L) + PPF (4.70L) + Demat (2L) = 15,33,981

  const getActiveTotal = () => {
    switch (activeSegmentTab) {
      case 'ACCOUNTS': return accountsTotal;
      case 'DEPOSITS': return depositsTotal;
      case 'INVESTMENTS': return investmentsTotal;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/50 transition-all">
      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
            {activeSegmentTab} PORTFOLIO SUMMARY
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(getActiveTotal(), eyeHidden)}
          </h3>
        </div>

        {/* Segment Selector Capsule */}
        <div className="bg-slate-100/80 p-1.5 rounded-full flex gap-1 border border-slate-200/60 shadow-2xs">
          {(['ACCOUNTS', 'DEPOSITS', 'INVESTMENTS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSegmentTab(tab)}
              className={
                activeSegmentTab === tab
                  ? 'bg-[#003366] text-white font-bold px-5 py-2 rounded-full shadow-sm text-xs tracking-wide transition-all duration-200'
                  : 'text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 text-xs tracking-wide transition-all duration-200'
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Sub-View Grid Layout */}

      {/* 1. ACCOUNTS VIEW */}
      {activeSegmentTab === 'ACCOUNTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 animate-fade-in">
          {/* Stable Growth Card */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => setDeepDiveAccountKey('stable')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDeepDiveAccountKey('stable')}
            className="bg-gradient-to-br from-emerald-50/30 to-white border border-emerald-100 rounded-xl p-5 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/50">
                  Stable Growth Operating Account
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">QC-SG-882190</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(balances.stable, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
              <span>Click to view T+7 AI Predictive Cash-Flow Models</span>
              <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>

          {/* Cash Crunch Card */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => setDeepDiveAccountKey('crunch')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDeepDiveAccountKey('crunch')}
            className="bg-gradient-to-br from-rose-50/30 to-white border border-rose-100 rounded-xl p-5 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100/80 text-rose-800 border border-rose-200/50">
                  Cash Crunch Liquidity Buffer Account
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">QC-CC-401928</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(balances.crunch, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-rose-700 group-hover:text-rose-800">
              <span>Click to view Stress Test & Resolution Letters</span>
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPOSITS VIEW */}
      {activeSegmentTab === 'DEPOSITS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-50/50 to-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#003366] text-white">
                  Fixed Deposit (FD)
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  7.25% p.a.
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">FD-882910</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(250000, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Maturity: 15 Oct 2027</span>
              <Building className="w-4 h-4 text-[#003366]" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50/50 to-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#003366] text-white">
                  Recurring Deposit (RD)
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  6.80% p.a.
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">RD-109283</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(155261, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Maturity: 10 Jan 2028</span>
              <Building className="w-4 h-4 text-[#003366]" />
            </div>
          </div>
        </div>
      )}

      {/* 3. INVESTMENTS VIEW */}
      {activeSegmentTab === 'INVESTMENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 animate-fade-in">
          <div className="bg-gradient-to-br from-emerald-50/20 to-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white">
                  SSY (Sukanya)
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  8.2% Tax Free
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">SSY-482019</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(863035, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Govt Backed Scheme</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50/20 to-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-700 text-white">
                  PPF (Provident Fund)
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                  7.1% p.a.
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">PPF-774019</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(470946, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>15-Year Lock-in</span>
              <Lock className="w-4 h-4 text-teal-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50/20 to-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-icici-orange text-white">
                  Demat Portfolio
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200/60">
                  Direct Equity
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-3 font-mono">DEMAT-99201</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1 mb-4 tracking-tight">
                {formatCurrency(200000, eyeHidden)}
              </p>
            </div>

            <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Quantum Direct Stocks</span>
              <PieChart className="w-4 h-4 text-icici-orange" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
