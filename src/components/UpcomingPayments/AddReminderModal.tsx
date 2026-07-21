import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, PlusCircle, X } from 'lucide-react';
import type { BillerCategory } from '../../types';

interface Props {
  onClose: () => void;
}

export const AddReminderModal: React.FC<Props> = ({ onClose }) => {
  const { addUpcomingPayment } = useApp();

  const [category, setCategory] = useState<BillerCategory>('Utility');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'One-time' | 'Monthly' | 'Quarterly'>('Monthly');
  const [isAutopayEnabled, setIsAutopayEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!payeeName.trim()) {
      alert('Please enter a payee/biller name.');
      return;
    }
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!dueDate) {
      alert('Please select a due date.');
      return;
    }

    addUpcomingPayment({
      payeeName,
      category,
      amount: numAmt,
      dueDate,
      isAutopayEnabled,
      frequency
    });
    onClose();
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

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-icici-orange text-white rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Add New Payment Reminder</h3>
              <p className="text-xs text-slate-500">Track upcoming utility bills, SIPs, or rent dues in your header hub.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Biller Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as BillerCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
              >
                <option value="Utility">Utility (Electricity / Water / Wi-Fi)</option>
                <option value="Credit Card">Credit Card Bill</option>
                <option value="Rent">Rent Payment</option>
                <option value="Insurance Premium">Insurance Premium</option>
                <option value="Loan EMI">Loan EMI</option>
                <option value="Investment SIP">Investment SIP</option>
                <option value="Custom Transfer">Custom Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Payee / Biller Name</label>
              <input
                type="text"
                placeholder="e.g. TSSPDCL Electricity / Apartment Rent"
                value={payeeName}
                onChange={e => setPayeeName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Amount (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 3500"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="reminder-due-date" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Due Date</label>
                <input
                  id="reminder-due-date"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autopay-check"
                  checked={isAutopayEnabled}
                  onChange={e => setIsAutopayEnabled(e.target.checked)}
                  className="w-4 h-4 text-icici-orange rounded cursor-pointer"
                />
                <label htmlFor="autopay-check" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Enable Autopay
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
              <button
                type="submit"
                className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Save Reminder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
