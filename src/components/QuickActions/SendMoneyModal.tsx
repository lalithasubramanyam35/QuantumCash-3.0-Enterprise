import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Send, CheckCircle2, Lock, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const SendMoneyModal: React.FC<Props> = ({ onClose }) => {
  const { activeAccountKey, getAccountBalances, addTransaction } = useApp();
  const balances = getAccountBalances();

  const [mode, setMode] = useState<'IMPS' | 'UPI' | 'OWN'>('IMPS');
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [payeeName, setPayeeName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [confirmAccountNo, setConfirmAccountNo] = useState('');
  const [upiId, setUpiId] = useState('');
  const [ownDestAccount, setOwnDestAccount] = useState<'stable' | 'crunch'>(activeAccountKey === 'stable' ? 'crunch' : 'stable');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(1);
  const [utrResult, setUtrResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNextToPin = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    const availableBalance = selectedSourceAccount === 'stable' ? balances.stable : balances.crunch;
    if (numAmt > availableBalance) {
      alert(`Insufficient funds in ${selectedSourceAccount === 'stable' ? 'Stable Growth' : 'Cash Crunch'} account. Available: ${formatCurrency(availableBalance, false)}`);
      return;
    }

    if (mode === 'IMPS') {
      if (!payeeName || !accountNo) {
        alert('Please enter beneficiary name and account number.');
        return;
      }
      if (accountNo !== confirmAccountNo) {
        alert('Account numbers do not match.');
        return;
      }
    } else if (mode === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g., name@upi).');
        return;
      }
    }

    setStep(2);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      alert('Please enter a 4-digit PIN.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const numAmt = Number(amount);
      const utr = `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const desc = mode === 'IMPS'
        ? `Transfer to ${payeeName} (${accountNo.slice(-4)})`
        : mode === 'UPI'
        ? `UPI Transfer to ${upiId}`
        : `Self Transfer to ${ownDestAccount === 'stable' ? 'Stable Growth' : 'Cash Crunch'}`;

      addTransaction('OUTFLOW', mode === 'UPI' ? 'UPI' : 'Transfer', numAmt, desc);
      setUtrResult(utr);
      setStep(3);
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

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-icici-orange text-white rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Send Money / Fund Transfer</h3>
                <p className="text-xs text-slate-500">Instant IMPS, UPI, or internal account transfers.</p>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex border border-slate-200 bg-slate-50 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'IMPS', label: 'IMPS / NEFT' },
                { id: 'UPI', label: 'UPI Handle' },
                { id: 'OWN', label: 'Own Accounts' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMode(t.id as any)}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    mode === t.id ? 'bg-icici-blue-dark text-white shadow' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleNextToPin} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Debiting Account</label>
                <select
                  value={selectedSourceAccount}
                  onChange={e => setSelectedSourceAccount(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                  <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
                </select>
              </div>

              {mode === 'IMPS' && (
                <>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lalitha Subramanyam"
                      value={payeeName}
                      onChange={e => setPayeeName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Account No</label>
                      <input
                        type="password"
                        placeholder="e.g. 065801928"
                        value={accountNo}
                        onChange={e => setAccountNo(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Confirm Acc No</label>
                      <input
                        type="text"
                        placeholder="Re-enter Acc No"
                        value={confirmAccountNo}
                        onChange={e => setConfirmAccountNo(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {mode === 'UPI' && (
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">UPI VPA Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. name@okicici or 9876543210@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              )}

              {mode === 'OWN' && (
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Destination Internal Account</label>
                  <select
                    value={ownDestAccount}
                    onChange={e => setOwnDestAccount(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="crunch">Cash Crunch Account</option>
                    <option value="stable">Stable Growth Account</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Transfer Amount (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-icici-blue-dark focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-icici-orange text-white text-xs font-bold rounded-xl shadow">Proceed →</button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmTransfer} className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-icici-blue-dark" />
              <h3 className="text-base font-bold">Transaction Security Authorization</h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Transfer Summary</span>
              <p className="font-bold text-slate-800">Amount: {formatCurrency(Number(amount), false)}</p>
              <p className="text-slate-500">Mode: {mode} | Debiting: {selectedSourceAccount === 'stable' ? 'Stable Growth' : 'Cash Crunch'}</p>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Enter 4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center font-mono text-lg font-bold tracking-widest focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-between gap-2">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Back</button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-icici-orange text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Authorize & Send'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-slate-800 text-base">Transfer Completed!</h4>
            <p className="text-xs text-slate-500">Your transfer of **{formatCurrency(Number(amount), false)}** has been processed instantly.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 font-bold">
              ⚡ UTR: {utrResult}
            </div>
            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};
