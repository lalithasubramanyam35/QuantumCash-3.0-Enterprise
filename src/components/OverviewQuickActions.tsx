import React, { useState } from 'react';
import { Send, FileText, Zap, Receipt } from 'lucide-react';
import { SendMoneyModal } from './QuickActions/SendMoneyModal';
import { PayBillsModal } from './QuickActions/PayBillsModal';
import { TransactionStatementModal } from './Transactions/TransactionStatementModal';

export const OverviewQuickActions: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'send' | 'bills' | 'statement' | null>(null);

  const actions = [
    {
      id: 'send',
      label: 'Send Money',
      subtext: 'IMPS, UPI & Transfers',
      icon: Send,
      color: 'bg-icici-orange text-white hover:bg-icici-orange-hover'
    },
    {
      id: 'statement',
      label: 'View Statement',
      subtext: 'July 2026 Passbook & Export',
      icon: FileText,
      color: 'bg-icici-blue-dark text-white hover:bg-icici-blue-light'
    },
    {
      id: 'bills',
      label: 'Pay Bills',
      subtext: 'Electricity, Mobile & Fastag',
      icon: Zap,
      color: 'bg-emerald-700 text-white hover:bg-emerald-800'
    },
    {
      id: 'recent',
      label: 'Recent Transactions',
      subtext: 'Full Audit & Receipts',
      icon: Receipt,
      color: 'bg-slate-900 text-white hover:bg-slate-800'
    }
  ];

  const handleActionClick = (id: string) => {
    if (id === 'send') setActiveModal('send');
    else if (id === 'bills') setActiveModal('bills');
    else if (id === 'statement' || id === 'recent') setActiveModal('statement');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Quick Banking Actions</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ONE-CLICK WORKFLOWS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`p-4 rounded-2xl text-left transition transform hover:-translate-y-0.5 shadow-2xs space-y-2.5 ${action.color}`}
            >
              <div className="p-2 bg-white/15 rounded-xl w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm">{action.label}</h4>
                <p className="text-[10px] text-white/80 font-medium mt-0.5 truncate">{action.subtext}</p>
              </div>
            </button>
          );
        })}
      </div>

      {activeModal === 'send' && <SendMoneyModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'bills' && <PayBillsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'statement' && <TransactionStatementModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};
