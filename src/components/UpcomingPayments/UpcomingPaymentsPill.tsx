import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';
import { UpcomingPaymentsDrawer } from './UpcomingPaymentsDrawer';

export const UpcomingPaymentsPill: React.FC = () => {
  const { upcomingPayments } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const count = upcomingPayments.length;
  const hasPayments = count > 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm border transition ${
          hasPayments
            ? 'bg-icici-orange/20 border-icici-orange/50 text-white hover:bg-icici-orange/30 animate-pulse'
            : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
        }`}
        title="View Upcoming Dues & Billers"
      >
        <Bell className={`w-3.5 h-3.5 ${hasPayments ? 'text-icici-orange fill-current' : 'text-slate-300'}`} />
        <span className={`font-extrabold text-[10px] ${hasPayments ? 'text-icici-orange' : 'text-slate-300'}`}>
          {count} UPCOMING PAYMENT{count !== 1 ? 'S' : ''}
        </span>
      </button>

      {isOpen && <UpcomingPaymentsDrawer onClose={() => setIsOpen(false)} />}
    </>
  );
};
