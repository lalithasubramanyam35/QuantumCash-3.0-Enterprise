import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { CreditCard, CheckCircle2, Award, Sparkles, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CreditCardOfferModal: React.FC<Props> = ({ onClose }) => {
  const { activateVirtualCreditCard } = useApp();

  const [cardName] = useState('Quantum Sapphire Dual Credit Card');
  const [limit] = useState(250000);
  const [activatedLastFour, setActivatedLastFour] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const last4 = activateVirtualCreditCard(cardName, limit);
      setActivatedLastFour(last4);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!activatedLastFour ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-900 text-white rounded-2xl shadow">
                <CreditCard className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">PRE-APPROVED | ZERO ANNUAL FEE</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Instant Virtual Credit Card</h3>
              </div>
            </div>

            {/* High-Res Premium Card Graphic Widget */}
            <div className="h-44 w-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-blue-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block">QUANTUM SAPPHIRE WORLD</span>
                  <span className="text-[8px] text-slate-400 font-mono tracking-wider block mt-0.5">DUAL ENGINE CREDIT</span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>

              <div>
                <span className="text-sm font-mono tracking-widest block text-slate-200 font-bold">4312 •••• •••• {Math.floor(1000 + Math.random() * 9000)}</span>
                <div className="flex justify-between items-end mt-2 text-[10px]">
                  <span className="font-semibold text-slate-300">PRE-APPROVED LIMIT: {formatCurrency(limit, false)}</span>
                  <span className="font-mono text-slate-400 uppercase">EXP 12/30</span>
                </div>
              </div>
            </div>

            {/* Reward Points & Features */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Exclusive Privileges</span>
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" /> 5x Reward Points on online travel & dining spends
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" /> Complimentary Airport Lounge access (2/quarter)
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" /> Lifetime free card (Zero joining & annual fees)
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
              <button
                onClick={handleActivate}
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 min-w-[170px]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Accept & Activate Card'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <div>
              <h4 className="font-black text-slate-800 text-lg">Virtual Card Activated!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Your new Quantum Sapphire Credit Card ending in **•••• {activatedLastFour}** is live and added to your Cards dashboard.
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-4 max-w-xs mx-auto text-xs font-mono font-bold space-y-1">
              <p className="text-amber-400">💳 CARD NO: 4312 •••• •••• {activatedLastFour}</p>
              <p className="text-[10px] text-slate-400">STATUS: ACTIVE & VIRTUAL READY</p>
            </div>

            <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};
