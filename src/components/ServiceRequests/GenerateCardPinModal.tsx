import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Lock, Calendar, Eye, EyeOff } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const GenerateCardPinModal: React.FC<Props> = ({ onClose }) => {
  const { cards, updateCardPin } = useApp();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setCvv(value);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setter(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedCardId) newErrors.card = 'Please select a card';
    
    // Simple validation for expiry
    if (!expiry || expiry.length !== 5 || !expiry.includes('/')) {
      newErrors.expiry = 'Expiry date must be in MM/YY format';
    } else {
      const [m] = expiry.split('/').map(Number);
      if (m < 1 || m > 12) {
        newErrors.expiry = 'Month must be between 01 and 12';
      }
    }

    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    if (!newPin || newPin.length !== 4) {
      newErrors.newPin = 'PIN must be 4 digits';
    } else if (/^(.)\1{3}$/.test(newPin)) {
      newErrors.newPin = 'Simple sequences (e.g. 1111) are blocked';
    } else if (newPin === '1234' || newPin === '0000' || newPin === '2580') {
      newErrors.newPin = 'Weak PIN selection. Please choose a stronger combination.';
    }

    if (newPin !== confirmPin) {
      newErrors.confirmPin = 'Confirm PIN does not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateCardPin(selectedCardId, newPin);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Generate Card PIN</h2>
        <p className="text-xs text-slate-500 mt-1">Configure instantly secure 4-digit PIN access details for active accounts.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Debit/Credit Card</label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedCardId}
                onChange={e => setSelectedCardId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (•••• {c.lastFour}) - {c.type}
                  </option>
                ))}
              </select>
            </div>
            {errors.card && <p className="text-[10px] text-rose-500 mt-0.5">{errors.card}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Expiry Date (MM/YY)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChange={handleExpiryChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition font-mono text-center"
                />
              </div>
              {errors.expiry && <p className="text-[10px] text-rose-500 mt-0.5">{errors.expiry}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">CVV Code</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  value={cvv}
                  onChange={handleCvvChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition font-mono text-center"
                />
              </div>
              {errors.cvv && <p className="text-[10px] text-rose-500 mt-0.5">{errors.cvv}</p>}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Configure PIN Values</span>
              <button
                type="button"
                onClick={() => setShowPins(!showPins)}
                className="text-[10px] text-icici-blue-light hover:underline font-bold flex items-center gap-1"
              >
                {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPins ? 'Hide PINs' : 'Show PINs'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">New 4-digit PIN</label>
                <input
                  type={showPins ? 'text' : 'password'}
                  placeholder="••••"
                  maxLength={4}
                  value={newPin}
                  onChange={e => handlePinChange(e, setNewPin)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base text-center tracking-widest font-mono font-bold rounded-xl py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
                {errors.newPin && <p className="text-[10px] text-rose-500 mt-0.5 leading-normal">{errors.newPin}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Confirm New PIN</label>
                <input
                  type={showPins ? 'text' : 'password'}
                  placeholder="••••"
                  maxLength={4}
                  value={confirmPin}
                  onChange={e => handlePinChange(e, setConfirmPin)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base text-center tracking-widest font-mono font-bold rounded-xl py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
                {errors.confirmPin && <p className="text-[10px] text-rose-500 mt-0.5 leading-normal">{errors.confirmPin}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[100px]"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Set Card PIN'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">New PIN Generated Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Your security credentials have been updated successfully on the secure server. The new PIN is active immediately.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold rounded-xl transition shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
