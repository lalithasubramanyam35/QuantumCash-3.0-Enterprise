import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { Landmark, Award, Plus } from 'lucide-react';
import { AddInvestmentModal } from './Investments/AddInvestmentModal';

export const InvestmentsView: React.FC = () => {
  const { eyeHidden } = useApp();

  const [investments, setInvestments] = useState([
    {
      id: 'inv_1',
      name: 'Corporate Equity Portfolios',
      category: 'Equity' as const,
      amount: 450000,
      returnsPercent: 14.2,
      desc: 'Broad-market mutual fund and active direct equities holding.'
    },
    {
      id: 'inv_2',
      name: 'Sukanya Samriddhi Yojana (SSY)',
      category: 'SSY' as const,
      amount: 150000,
      returnsPercent: 8.2,
      desc: 'Long-term government-backed tax exemption account.'
    },
    {
      id: 'inv_3',
      name: 'Public Provident Fund (PPF)',
      category: 'PPF' as const,
      amount: 150000,
      returnsPercent: 7.1,
      desc: 'Risk-free sovereign savings scheme with 15-year maturity lock.'
    },
    {
      id: 'inv_4',
      name: 'Treasury Demat Securities Account',
      category: 'Demat' as const,
      amount: 250000,
      returnsPercent: 11.8,
      desc: 'Government bonds, debentures, and commercial paper holdings.'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleInvestmentAdded = (cat: string, topUpAmount: number) => {
    setInvestments(prev =>
      prev.map(inv => (inv.category === cat ? { ...inv, amount: inv.amount + topUpAmount } : inv))
    );
  };

  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-icici-blue-dark">My Investments Portfolio</h2>
          <span className="text-xs text-slate-500 font-medium">Market Valued Summary</span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition flex items-center justify-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" /> + Add Investment / Top-Up
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map(i => (
          <div key={i.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{i.category}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {i.returnsPercent > 9 ? `+${i.returnsPercent}% CAGR` : `${i.returnsPercent}% Return`}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-base">{i.name}</h3>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(i.amount, eyeHidden)}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{i.desc}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Landmark className="w-3.5 h-3.5" /> Locked Asset</span>
              <span className="text-icici-blue-light font-semibold hover:underline cursor-pointer">View Holdings</span>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate card */}
      <div className="bg-gradient-to-r from-icici-blue-dark to-icici-blue-light text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs text-slate-300 font-medium uppercase tracking-wider">Total Investment Asset Value</span>
          <p className="text-3xl font-black mt-1">
            {formatCurrency(totalInvested, eyeHidden)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-200 max-w-xs">
          <Award className="w-8 h-8 text-icici-orange shrink-0" />
          <span>Your investment portfolio is currently outperforming default savings yields by <strong>4.82%</strong>.</span>
        </div>
      </div>

      {showAddModal && (
        <AddInvestmentModal
          onClose={() => setShowAddModal(false)}
          onInvestmentAdded={handleInvestmentAdded}
        />
      )}
    </div>
  );
};
