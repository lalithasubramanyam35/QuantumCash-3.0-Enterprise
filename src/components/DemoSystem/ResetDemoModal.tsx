import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ResetDemoModal: React.FC<Props> = ({ onClose }) => {
  const { resetData } = useApp();
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleConfirmReset = () => {
    resetData();
    setResetCompleted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
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

        {!resetCompleted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow">
                <RefreshCw className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Reset QuantumCash Demo Data</h3>
                <p className="text-xs text-slate-500">Restore factory baseline state for hackathon evaluation.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>This action will reset:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-950 font-medium pl-1">
                <li>Operating account balances back to baseline (Stable: ₹1.5L, Crunch: ₹12k)</li>
                <li>Clear custom loan disbursals, virtual cards & insurance purchases</li>
                <li>Restore default upcoming payment reminders & transaction ledgers</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-extrabold rounded-xl shadow transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Confirm Factory Reset
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-slate-800 text-base">Demo State Reset Successfully!</h4>
            <p className="text-xs text-slate-500">All balances, ledgers, and models restored to baseline values.</p>
          </div>
        )}
      </div>
    </div>
  );
};
