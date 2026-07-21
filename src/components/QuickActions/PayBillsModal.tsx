import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Zap, Smartphone, Flame, Tv, Droplets, Car, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PayBillsModal: React.FC<Props> = ({ onClose }) => {
  const { activeAccountKey, getAccountBalances, addTransaction, payUpcomingPayment, upcomingPayments } = useApp();
  const balances = getAccountBalances();

  const [billerType, setBillerType] = useState<'Electricity' | 'Mobile' | 'Gas' | 'DTH' | 'Water' | 'Fastag'>('Electricity');
  const [consumerId, setConsumerId] = useState('');
  const [billerName, setBillerName] = useState('TSSPDCL Electricity Telangana');
  const [amount, setAmount] = useState('2840');
  const [selectedAccount, setSelectedAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const billerCategories = [
    { id: 'Electricity', label: 'Electricity', icon: Zap, defaultBiller: 'TSSPDCL Electricity Telangana' },
    { id: 'Mobile', label: 'Mobile Prepaid', icon: Smartphone, defaultBiller: 'Airtel Postpaid / Prepaid' },
    { id: 'Gas', label: 'Gas Cylinder', icon: Flame, defaultBiller: 'Indane Cooking Gas' },
    { id: 'DTH', label: 'DTH TV', icon: Tv, defaultBiller: 'Tata Play DTH' },
    { id: 'Water', label: 'Water Tax', icon: Droplets, defaultBiller: 'HMWS&SB Water Board' },
    { id: 'Fastag', label: 'NETC Fastag', icon: Car, defaultBiller: 'ICICI Bank Fastag Recharge' }
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Deduct balance and add transaction
      addTransaction('OUTFLOW', 'Utility', numAmt, `BBPS Bill Payment: ${billerName}`);

      // Check if matches any item in upcomingPayments and auto-clear it
      const match = upcomingPayments.find(p => p.payeeName.toLowerCase().includes(billerType.toLowerCase()));
      if (match) {
        payUpcomingPayment(match.id, selectedAccount);
      }

      setSuccess(true);
    }, 1200);
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

        {!success ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-icici-orange text-white rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">BBPS Bill Payment Hub</h3>
                <p className="text-xs text-slate-500">Pay utility bills, mobile recharges & Fastag instantly.</p>
              </div>
            </div>

            {/* Biller Grid Icons */}
            <div className="grid grid-cols-3 gap-2">
              {billerCategories.map(cat => {
                const Icon = cat.icon;
                const isSelected = billerType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setBillerType(cat.id as any);
                      setBillerName(cat.defaultBiller);
                    }}
                    className={`p-2.5 rounded-xl border transition text-center space-y-1 ${
                      isSelected
                        ? 'border-icici-orange bg-icici-orange/10 text-icici-orange font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                    <span className="text-[10px] block truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handlePay} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Biller Operator</label>
                <input
                  type="text"
                  value={billerName}
                  onChange={e => setBillerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Consumer ID / Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. 1092830192"
                    value={consumerId}
                    onChange={e => setConsumerId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Bill Amount (₹)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Debit Account</label>
                <select
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                  <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : `Pay ${formatCurrency(Number(amount), false)}`}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-slate-800 text-base">Bill Paid Successfully!</h4>
            <p className="text-xs text-slate-500">Receipt generated via BBPS. {formatCurrency(Number(amount), false)} debited from your account.</p>
            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};
