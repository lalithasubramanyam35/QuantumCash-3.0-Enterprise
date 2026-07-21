import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { Building, Calendar, Info, HelpCircle, Plus } from 'lucide-react';
import { OpenDepositModal } from './Deposits/OpenDepositModal';

export const DepositsView: React.FC = () => {
  const { eyeHidden } = useApp();

  const [deposits, setDeposits] = useState([
    {
      id: 'dep_1',
      name: 'Fixed Deposit (FD) - Standard',
      type: 'FD' as const,
      principal: 500000,
      interestRate: 7.15,
      maturityDate: '2027-06-15',
      maturityAmount: 535750,
      details: 'Quarterly payout options, auto-renewal active.'
    },
    {
      id: 'dep_2',
      name: 'Recurring Deposit (RD) - Treasury Support',
      type: 'RD' as const,
      principal: 120000,
      interestRate: 6.85,
      maturityDate: '2026-12-10',
      maturityAmount: 124450,
      monthlyInstallment: 10000,
      details: 'Debits automatically on the 10th of every month.'
    }
  ]);

  const [showOpenModal, setShowOpenModal] = useState(false);

  const handleDepositCreated = (newDep: any) => {
    setDeposits(prev => [newDep, ...prev]);
  };

  const totalPrincipal = deposits.reduce((sum, d) => sum + d.principal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-icici-blue-dark">My Fixed & Recurring Deposits</h2>
          <span className="text-xs text-slate-500 font-medium">{deposits.length} Active Deposits Held</span>
        </div>

        <button
          onClick={() => setShowOpenModal(true)}
          className="px-4 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition flex items-center justify-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" /> Open New Deposit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deposits.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-icici-blue-light/10 text-icici-blue-light rounded-lg">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">{d.name}</h3>
                </div>
                <span className="text-[10px] font-bold bg-icici-orange-light text-icici-orange px-2.5 py-0.5 rounded">
                  {d.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Principal Amount</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">
                    {formatCurrency(d.principal, eyeHidden)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Interest Rate (p.a.)</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{d.interestRate}%</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Maturity Date</span>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {d.maturityDate}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Maturity Value</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">
                    {formatCurrency(d.maturityAmount, eyeHidden)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-start gap-1.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {d.monthlyInstallment && (
                  <strong>Monthly Installment: {formatCurrency(d.monthlyInstallment, eyeHidden)}. </strong>
                )}
                {d.details}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-icici-blue-dark/5 flex items-center justify-center font-bold text-icici-blue-dark">₹</div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Investment in Deposits</span>
            <p className="text-xl font-extrabold text-slate-800">
              {formatCurrency(totalPrincipal, eyeHidden)}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Deposit accounts are fully collateral-eligible for business overdraft limits up to 90%.
        </div>
      </div>

      {showOpenModal && (
        <OpenDepositModal
          onClose={() => setShowOpenModal(false)}
          onDepositCreated={handleDepositCreated}
        />
      )}
    </div>
  );
};
