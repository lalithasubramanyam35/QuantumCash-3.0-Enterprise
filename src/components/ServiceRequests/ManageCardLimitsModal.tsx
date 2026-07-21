import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Shield } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ManageCardLimitsModal: React.FC<Props> = ({ onClose }) => {
  const { cards, updateCardLimits } = useApp();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [atmLimit, setAtmLimit] = useState(50000);
  const [posLimit, setPosLimit] = useState(100000);
  const [ecomLimit, setEcomLimit] = useState(100000);
  const [internationalEnabled, setInternationalEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sync limits when card selection changes
  useEffect(() => {
    const card = cards.find(c => c.id === selectedCardId);
    if (card) {
      setAtmLimit(card.atmLimit);
      setPosLimit(card.posLimit);
      setEcomLimit(card.ecomLimit);
      setInternationalEnabled(card.internationalEnabled);
    }
  }, [selectedCardId, cards]);

  const selectedCardObj = cards.find(c => c.id === selectedCardId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateCardLimits(selectedCardId, atmLimit, posLimit, ecomLimit, internationalEnabled);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Manage Card Limits</h2>
        <p className="text-xs text-slate-500 mt-1">Configure transaction ranges and security flags for debit and credit portfolios.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Selection */}
          <div className="grid grid-cols-3 gap-2 select-none">
            {cards.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCardId(c.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                  selectedCardId === c.id
                    ? 'border-icici-blue-dark bg-slate-50 text-icici-blue-dark font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wide">{c.type} Card</span>
                <span className="text-xs font-bold mt-1 block truncate leading-tight">{c.name.split(' ')[1]}</span>
                <span className="text-[9px] font-mono text-slate-400 mt-1 block">•••• {c.lastFour}</span>
              </button>
            ))}
          </div>

          {/* Virtual Card Graphic */}
          {selectedCardObj && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-icici-orange/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 tracking-wider font-bold block uppercase">{selectedCardObj.type} PORTFOLIO</span>
                  <span className="text-xs font-bold tracking-tight block mt-0.5">{selectedCardObj.name}</span>
                </div>
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white/50 text-lg font-black font-sans">Q</div>
              </div>

              <div>
                <span className="text-sm font-mono tracking-widest block text-slate-300">•••• •••• •••• {selectedCardObj.lastFour}</span>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-[8px] text-slate-400">
                    <span className="block font-bold uppercase">International Usage</span>
                    <span className={`font-black ${internationalEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {internationalEnabled ? 'ACTIVE / ALLOWED' : 'INACTIVE / RESTRICTED'}
                    </span>
                  </div>
                  <Shield className="w-5 h-5 text-icici-orange" />
                </div>
              </div>
            </div>
          )}

          {/* Sliders limits */}
          <div className="space-y-4 pt-2">
            {/* Limit slider 1: ATM */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-slate-500">ATM Cash Withdrawal</span>
                <span className="text-icici-blue-dark">{formatCurrency(atmLimit, false)} / day</span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={5000}
                value={atmLimit}
                onChange={e => setAtmLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-icici-orange"
              />
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>₹0</span>
                <span>₹1,00,000 Max</span>
              </div>
            </div>

            {/* Limit slider 2: POS */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-slate-500">In-Store Merchant POS Limit</span>
                <span className="text-icici-blue-dark">{formatCurrency(posLimit, false)} / day</span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={10000}
                value={posLimit}
                onChange={e => setPosLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-icici-orange"
              />
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>₹0</span>
                <span>₹2,00,000 Max</span>
              </div>
            </div>

            {/* Limit slider 3: E-com */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-slate-500">E-Commerce & Online Transactions</span>
                <span className="text-icici-blue-dark">{formatCurrency(ecomLimit, false)} / day</span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={10000}
                value={ecomLimit}
                onChange={e => setEcomLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-icici-orange"
              />
              <div className="flex justify-between text-[8px] text-slate-400">
                <span>₹0</span>
                <span>₹2,00,000 Max</span>
              </div>
            </div>

            {/* International Toggle */}
            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-700">International Usage Flag</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle global access capabilities on this card.</p>
              </div>
              <button
                type="button"
                onClick={() => setInternationalEnabled(!internationalEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  internationalEnabled ? 'bg-icici-orange' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    internationalEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
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
              className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[120px]"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Preferences'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Limits Adjusted Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Your transaction thresholds have been updated dynamically on your card network configuration. Secure limits are active immediately.
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
