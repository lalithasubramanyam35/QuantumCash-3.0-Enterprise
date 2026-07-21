import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export const AccountsView: React.FC = () => {
  const { 
    getAccountBalances, 
    eyeHidden, 
    setDeepDiveAccountKey,
    setActiveAccountKey 
  } = useApp();

  const balances = getAccountBalances();

  const handleAccountClick = (key: 'stable' | 'crunch') => {
    setActiveAccountKey(key);
    setDeepDiveAccountKey(key);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-icici-blue-dark">My Core Accounts</h2>
        <span className="text-xs text-slate-500">Select an account to view 7-day predictive cash flow simulations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stable Growth Account Card */}
        <div 
          onClick={() => handleAccountClick('stable')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md cursor-pointer transition transform hover:-translate-y-1 group relative overflow-hidden"
        >
          {/* Subtle decoration accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
              Low Risk
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-lg">Stable Growth Account</h3>
            <p className="text-xs text-slate-400 font-mono">Account No: ••••••••</p>
            <div className="pt-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Available Balance</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(balances.stable, eyeHidden)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold group-hover:text-emerald-700">
            <span>Open Cash Flow Forecast</span>
            <ArrowRight className="w-4 h-4 transition transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Cash Crunch Account Card */}
        <div 
          onClick={() => handleAccountClick('crunch')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md cursor-pointer transition transform hover:-translate-y-1 group relative overflow-hidden"
        >
          {/* Subtle decoration accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>

          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full uppercase">
              High Risk Alert
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-lg">Cash Crunch Account</h3>
            <p className="text-xs text-slate-400 font-mono">Account No: ••••••••</p>
            <div className="pt-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Available Balance</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(balances.crunch, eyeHidden)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-red-600 font-bold group-hover:text-red-700">
            <span>Analyze Working Capital Gaps</span>
            <ArrowRight className="w-4 h-4 transition transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(243,112,33,0.1),transparent_50%)]"></div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative z-10">
          <div>
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Total Combined Liquidity</h3>
            <p className="text-3xl font-black mt-2 tracking-tight text-white">
              {formatCurrency(balances.total, eyeHidden)}
            </p>
          </div>
          <div className="text-xs text-slate-400 max-w-sm space-y-1">
            <p className="font-semibold text-slate-200">ℹ️ Executive Portfolio Summary</p>
            <p>Calculates the exact total aggregate liquidity of your operating bank accounts before deposits and investment distributions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
