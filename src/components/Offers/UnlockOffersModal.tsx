import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const UnlockOffersModal: React.FC<Props> = ({ onClose }) => {
  const { unlockOffers } = useApp();
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pan || pan.length !== 10) {
      alert('Please enter a valid 10-character PAN number (e.g., ABCDE1234F)');
      return;
    }
    if (!dob) {
      alert('Please enter your date of birth.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      unlockOffers(pan, dob);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
                <Lock className="w-5 h-5 text-icici-orange" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Unlock Pre-approved Offers</h3>
                <p className="text-xs text-slate-500">Security verification check via CIBIL & central credit desk.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">PAN Card Number</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
              </div>

              <div>
                <label htmlFor="dob-input" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Date of Birth</label>
                <input
                  id="dob-input"
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 flex items-start gap-2 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Soft inquiry check. Verifying pre-approved credit limits will NOT affect your CIBIL score.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Fetch Instant Offers'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-slate-800 text-base">Offers Unlocked Successfully!</h4>
            <p className="text-xs text-slate-500">Pre-approved credit limits are activated across Personal Loan, Car Loan, Credit Card & Two-Wheeler covers.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
            >
              Explore Unlocked Offers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
