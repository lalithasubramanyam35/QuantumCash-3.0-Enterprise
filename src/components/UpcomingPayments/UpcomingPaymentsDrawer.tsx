import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Calendar, CreditCard, Zap, Home, Shield, TrendingUp, PlusCircle, CheckCircle2, X } from 'lucide-react';
import { AddReminderModal } from './AddReminderModal';
import type { UpcomingPayment, BillerCategory } from '../../types';

interface Props {
  onClose: () => void;
}

export const UpcomingPaymentsDrawer: React.FC<Props> = ({ onClose }) => {
  const {
    upcomingPayments,
    eyeHidden,
    activeAccountKey,
    getAccountBalances,
    payUpcomingPayment,
    toggleAutopay
  } = useApp();

  const balances = getAccountBalances();

  const [payingItem, setPayingItem] = useState<UpcomingPayment | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getCategoryIcon = (category: BillerCategory) => {
    switch (category) {
      case 'Credit Card': return CreditCard;
      case 'Utility': return Zap;
      case 'Rent': return Home;
      case 'Insurance Premium': return Shield;
      case 'Loan EMI': return Home;
      case 'Investment SIP': return TrendingUp;
      default: return Calendar;
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingItem) return;

    const res = payUpcomingPayment(payingItem.id, selectedAccount);
    if (res.success) {
      setPaymentSuccess(true);
    } else {
      alert(res.error || 'Payment failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25 backdrop-blur-md transition-all duration-300 animate-fade-in text-slate-800">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 relative overflow-y-auto select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 bg-icici-orange text-white rounded-xl shadow">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Upcoming Payments Hub</h3>
              <p className="text-xs text-slate-500">{upcomingPayments.length} dues pending for settlement.</p>
            </div>
          </div>

          {/* Dues List */}
          <div className="space-y-3">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map(item => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white transition space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-icici-blue-dark text-white rounded-xl shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-icici-orange" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm mt-1">{item.payeeName}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{item.dueDaysLabel} ({item.dueDate})</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Amount</span>
                        <span className="text-sm font-black text-slate-800">
                          {formatCurrency(item.amount, eyeHidden)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      {/* Autopay Toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-600 select-none">
                        <input
                          type="checkbox"
                          checked={item.isAutopayEnabled}
                          onChange={() => toggleAutopay(item.id)}
                          className="w-3.5 h-3.5 text-icici-orange rounded"
                        />
                        <span>Autopay {item.isAutopayEnabled ? 'ON' : 'OFF'}</span>
                      </label>

                      <button
                        onClick={() => {
                          setPayingItem(item);
                          setPaymentSuccess(false);
                        }}
                        className="bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold py-1.5 px-4 rounded-xl transition shadow flex items-center gap-1"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">All Payments Settled!</h4>
                <p className="text-xs text-slate-400">You have zero upcoming dues pending.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Add Biller Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-2xl transition shadow flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-icici-orange" /> + Add New Biller / Payment
          </button>
        </div>

        {/* Pay Now Confirmation Modal */}
        {payingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setPayingItem(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>

              {!paymentSuccess ? (
                <form onSubmit={handlePaySubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-icici-orange" />
                    <h3 className="text-base font-bold">Settle Upcoming Bill</h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Biller Details</span>
                    <p className="font-bold text-slate-800">{payingItem.payeeName}</p>
                    <div className="flex justify-between items-center text-sm font-black text-icici-orange pt-1">
                      <span>Amount:</span>
                      <span>{formatCurrency(payingItem.amount, false)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Debit Account</label>
                    <select
                      value={selectedAccount}
                      onChange={e => setSelectedAccount(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                      <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPayingItem(null)}
                      className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow"
                    >
                      Confirm & Pay {formatCurrency(payingItem.amount, false)}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-extrabold text-slate-800 text-sm">Payment Settled Successfully</h4>
                  <p className="text-xs text-slate-500">Bill debited from account and removed from your upcoming reminders.</p>
                  <button
                    onClick={() => setPayingItem(null)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Biller Modal */}
        {showAddModal && <AddReminderModal onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
};
