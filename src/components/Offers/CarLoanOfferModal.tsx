import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { calculateEMI } from '../../utils/mathUtils';
import { Car, FileCheck2, Download, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CarLoanOfferModal: React.FC<Props> = ({ onClose }) => {
  const { user, disburseCarLoan } = useApp();

  const [vehicleCategory, setVehicleCategory] = useState<'Sedan' | 'SUV' | 'EV'>('SUV');
  const [amount, setAmount] = useState<number>(1200000); // 12 Lakhs default
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [sanctionedRef, setSanctionedRef] = useState<{ refNo: string; emi: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(false);

  const currentEMI = Math.round(calculateEMI(amount, 8.75, tenureYears * 12));

  const handleSanctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = disburseCarLoan(vehicleCategory, amount, tenureYears);
      setSanctionedRef(res);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 3000);
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

        {!sanctionedRef ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-icici-blue-dark text-white rounded-2xl shadow">
                <Car className="w-6 h-6 text-icici-orange" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PRE-APPROVED | DIGITAL SANCTION</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Car Loan Digital Approval</h3>
              </div>
            </div>

            <form onSubmit={handleSanctionSubmit} className="space-y-4">
              {/* Vehicle Category Selector */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Vehicle Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sedan', 'SUV', 'EV'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVehicleCategory(cat)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        vehicleCategory === cat
                          ? 'border-icici-blue-dark bg-icici-blue-dark text-white shadow'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'EV' ? '⚡ Electric Vehicle' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Slider */}
              <div className="space-y-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Sanction Limit Requested</span>
                  <span className="text-icici-blue-dark font-mono text-base font-extrabold">{formatCurrency(amount, false)}</span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={2000000}
                  step={50000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full accent-icici-orange cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹2,00,000</span>
                  <span>₹12,00,000</span>
                  <span>₹20,00,000</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Loan Tenure</span>
                  <span className="text-icici-blue-dark font-mono text-xs">{tenureYears} Years ({tenureYears * 12} mos)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={tenureYears}
                  onChange={e => setTenureYears(Number(e.target.value))}
                  className="w-full accent-icici-orange cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 Yr</span>
                  <span>4 Yrs</span>
                  <span>7 Yrs</span>
                </div>
              </div>

              {/* EMI Box */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated EMI (8.75% p.a.)</span>
                  <span className="text-lg font-black text-slate-800">{formatCurrency(currentEMI, false)} / mo</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  On-road Funding Available
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 min-w-[170px]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Generate Sanction Letter'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <FileCheck2 className="w-6 h-6" />
              <h3 className="text-base font-extrabold">In-Principle Sanction Certificate</h3>
            </div>

            {/* Certificate Box */}
            <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-icici-blue-dark">QUANTUMCASH AUTO LOAN</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">Sanction Letter: {sanctionedRef.refNo}</p>
                </div>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">APPROVED</span>
              </div>

              <div className="space-y-1 text-slate-700 text-[11px]">
                <p>Applicant: <strong>{user?.name || 'Gandikota Subbarao'}</strong></p>
                <p>Vehicle Category: <strong>{vehicleCategory}</strong></p>
                <p>Sanctioned Amount: <strong className="text-icici-blue-dark">{formatCurrency(amount, false)}</strong></p>
                <p>Monthly EMI: <strong>{formatCurrency(sanctionedRef.emi, false)} / mo ({tenureYears} Years)</strong></p>
              </div>
            </div>

            {downloadMsg && (
              <div className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
                <span>📄 Downloading Sanction_Letter_{sanctionedRef.refNo}.pdf...</span>
                <span className="text-emerald-400 font-bold text-[10px]">SUCCESS</span>
              </div>
            )}

            <div className="pt-2 flex justify-between gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-icici-blue-dark text-white text-xs font-bold rounded-xl shadow"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
