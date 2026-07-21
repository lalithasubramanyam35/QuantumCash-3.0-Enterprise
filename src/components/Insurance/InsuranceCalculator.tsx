import React, { useState } from 'react';
import { Calculator, Shield, Activity, Car, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../../utils';

export const InsuranceCalculator: React.FC = () => {
  const [category, setCategory] = useState<'Life' | 'Health' | 'Motor'>('Life');
  const [age, setAge] = useState<number>(30);
  const [coverage, setCoverage] = useState<number>(10000000); // 1 Crore default

  // Add-ons
  const [criticalIllness, setCriticalIllness] = useState(true);
  const [accidentalDeath, setAccidentalDeath] = useState(true);
  const [hospitalCash, setHospitalCash] = useState(false);

  // Dynamic Calculation Logic
  const calculatePremium = () => {
    let baseRate = 0.001; // 0.1% base rate of coverage for Life

    if (category === 'Health') {
      baseRate = 0.012; // 1.2% rate for health
    } else if (category === 'Motor') {
      baseRate = 0.025; // 2.5% rate for motor
    }

    // Age multiplier
    const ageMultiplier = 1 + (age - 18) * 0.025;

    let totalAnnual = coverage * baseRate * ageMultiplier;

    // Add-ons
    if (criticalIllness) totalAnnual += 1800;
    if (accidentalDeath) totalAnnual += 950;
    if (hospitalCash) totalAnnual += 1200;

    const monthly = totalAnnual / 12;

    return {
      annual: Math.round(totalAnnual),
      monthly: Math.round(monthly)
    };
  };

  const quote = calculatePremium();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
            <Calculator className="w-5 h-5 text-icici-orange" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Interactive Premium Calculator</h3>
            <p className="text-xs text-slate-500">Instant real-time quote generation based on age, coverage level & riders.</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-icici-orange hidden sm:block" />
      </div>

      {/* Category Tabs */}
      <div className="flex border border-slate-200 bg-slate-50 p-1 rounded-xl w-fit">
        {[
          { id: 'Life', label: 'Term Life', icon: Shield },
          { id: 'Health', label: 'Health Shield', icon: Activity },
          { id: 'Motor', label: 'Motor Guard', icon: Car }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-icici-blue-dark text-white shadow'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-icici-orange' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Sliders Area */}
        <div className="md:col-span-7 space-y-4">
          {/* Age Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">Insured Person Age</span>
              <span className="text-icici-blue-dark font-mono text-sm">{age} Years</span>
            </div>
            <input
              type="range"
              min={18}
              max={65}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full accent-icici-orange cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>18 yrs</span>
              <span>40 yrs</span>
              <span>65 yrs</span>
            </div>
          </div>

          {/* Coverage Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">Coverage Sum Assured</span>
              <span className="text-icici-blue-dark font-mono text-sm">{formatCurrency(coverage, false)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={20000000}
              step={500000}
              value={coverage}
              onChange={e => setCoverage(Number(e.target.value))}
              className="w-full accent-icici-orange cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹5 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹2 Crores</span>
            </div>
          </div>

          {/* Add-on Rider Checkboxes */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Add-on Riders</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className={`border rounded-xl p-2.5 flex items-center gap-2 cursor-pointer transition select-none ${criticalIllness ? 'border-icici-orange bg-amber-50/50' : 'border-slate-200'}`}>
                <input
                  type="checkbox"
                  checked={criticalIllness}
                  onChange={e => setCriticalIllness(e.target.checked)}
                  className="w-3.5 h-3.5 text-icici-orange rounded"
                />
                <span className="text-[10px] font-bold text-slate-700">Critical Illness (+₹1,800)</span>
              </label>

              <label className={`border rounded-xl p-2.5 flex items-center gap-2 cursor-pointer transition select-none ${accidentalDeath ? 'border-icici-orange bg-amber-50/50' : 'border-slate-200'}`}>
                <input
                  type="checkbox"
                  checked={accidentalDeath}
                  onChange={e => setAccidentalDeath(e.target.checked)}
                  className="w-3.5 h-3.5 text-icici-orange rounded"
                />
                <span className="text-[10px] font-bold text-slate-700">Accidental Death (+₹950)</span>
              </label>

              <label className={`border rounded-xl p-2.5 flex items-center gap-2 cursor-pointer transition select-none ${hospitalCash ? 'border-icici-orange bg-amber-50/50' : 'border-slate-200'}`}>
                <input
                  type="checkbox"
                  checked={hospitalCash}
                  onChange={e => setHospitalCash(e.target.checked)}
                  className="w-3.5 h-3.5 text-icici-orange rounded"
                />
                <span className="text-[10px] font-bold text-slate-700">Hospital Cash (+₹1,200)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Calculated Quote Display Box */}
        <div className="md:col-span-5 bg-gradient-to-br from-icici-blue-dark to-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between h-full">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-icici-orange">ESTIMATED PREMIUM QUOTE</span>
            <h4 className="font-extrabold text-sm text-slate-200">{category} Protection Plan</h4>
          </div>

          <div className="py-3 border-y border-white/10 space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Monthly Estimated Premium</span>
              <p className="text-2xl font-black text-white">{formatCurrency(quote.monthly, false)} <span className="text-xs font-normal text-slate-400">/ mo</span></p>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-300">Annual Premium:</span>
              <span className="font-mono font-bold text-amber-300">{formatCurrency(quote.annual, false)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <ul className="text-[10px] text-slate-300 space-y-1">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Tax Exemption up to ₹1,50,000 u/s {category === 'Health' ? '80D' : '80C'}</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Instant online policy issuance without medical checkup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
