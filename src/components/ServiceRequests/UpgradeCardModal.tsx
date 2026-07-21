import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, MapPin } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const UpgradeCardModal: React.FC<Props> = ({ onClose }) => {
  const { cards, user, upgradeCard } = useApp();
  
  // Find debit card (we assume debit-card-1)
  const debitCard = cards.find(c => c.type === 'Debit') || cards[0];
  const currentTier = debitCard?.tier || 'Silver';

  const [selectedTier, setSelectedTier] = useState<'Silver' | 'Coral Platinum' | 'Sapphire World'>(currentTier);
  const [confirmAddress, setConfirmAddress] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const tiers = [
    {
      id: 'Silver' as const,
      name: 'Quantum Silver Debit',
      price: 'Free',
      features: ['Standard Rewards points', 'ATM limits up to ₹50,000/day', 'Standard customer service access'],
      bgClass: 'from-slate-300 to-slate-400',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'Coral Platinum' as const,
      name: 'Quantum Coral Platinum',
      price: '₹500 / year',
      features: ['2x Rewards points multiplier', 'Airport lounge access (1/quarter)', 'Higher limits: ATM ₹1L, POS ₹2L/day'],
      bgClass: 'from-cyan-700 to-slate-800',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'Sapphire World' as const,
      name: 'Quantum Sapphire World',
      price: '₹1,999 / year',
      features: ['5x Rewards points multiplier', 'Unlimited global airport lounge access', 'Highest limits: ATM ₹1.5L, POS ₹3L/day', 'Access to elite domestic Golf sessions'],
      bgClass: 'from-blue-900 via-indigo-955 to-slate-900',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitCard) return;
    if (selectedTier === currentTier) {
      alert('Please select a card tier that is different from your current card tier.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      upgradeCard(debitCard.id, selectedTier);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Upgrade Debit Card</h2>
        <p className="text-xs text-slate-500 mt-1">Upgrade account debit cards tier values and unlock premium privileges.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          {/* Tiers Carousel/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 select-none">
            {tiers.map(t => {
              const isCurrent = currentTier === t.id;
              const isSelected = selectedTier === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => !isCurrent && setSelectedTier(t.id)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition relative overflow-hidden h-64 ${
                    isCurrent 
                      ? 'border-slate-200 bg-slate-50/50 opacity-70 cursor-not-allowed'
                      : isSelected
                        ? 'border-icici-orange ring-1 ring-icici-orange shadow-md bg-white'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Visual card header */}
                  <div className={`h-24 w-full bg-gradient-to-br ${t.bgClass} rounded-xl p-3 text-white flex flex-col justify-between relative`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-bold tracking-widest uppercase">QUANTUM DEBIT</span>
                      {isCurrent && (
                        <span className="text-[7px] font-bold bg-slate-900/60 text-white px-1.5 py-0.5 rounded">CURRENT ACTIVE</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black block tracking-tight">{t.name}</span>
                      <span className="text-[8px] font-mono tracking-widest block text-slate-300 mt-1">•••• •••• •••• {debitCard?.lastFour || '8390'}</span>
                    </div>
                  </div>

                  {/* Price info */}
                  <div className="mt-3 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">{t.price}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${t.badgeColor}`}>{t.id.split(' ')[0]}</span>
                  </div>

                  {/* Features list */}
                  <ul className="mt-2 text-[9px] text-slate-500 space-y-1 pl-1">
                    {t.features.slice(0, 3).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <Check className="w-2.5 h-2.5 text-icici-orange shrink-0 mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Delivery Confirmation */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-3.5">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-icici-blue-light shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-700">Delivery Confirmation Address</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.address || 'Not Registered'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm-address-checkbox"
                checked={confirmAddress}
                onChange={e => setConfirmAddress(e.target.checked)}
                className="w-4 h-4 text-icici-blue-light focus:ring-icici-blue-light border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="confirm-address-checkbox" className="text-[10px] text-slate-500 select-none cursor-pointer">
                Deliver to the current registered address. (Estimated dispatch: 3 working days).
              </label>
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
              disabled={loading || selectedTier === currentTier || !confirmAddress}
              className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-50"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Upgrade & Order Card'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">New Card Ordered Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Your card upgrade request for **{selectedTier}** was successfully processed. A notification and tracking ID will be delivered to your registered mobile shortly.
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
