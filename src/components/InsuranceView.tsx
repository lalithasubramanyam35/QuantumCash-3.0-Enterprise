import React from 'react';
import { ActivePoliciesList } from './Insurance/ActivePoliciesList';
import { InsuranceCalculator } from './Insurance/InsuranceCalculator';
import { BuyInsuranceModal } from './Insurance/BuyInsuranceModal';
import { InitiateClaimModal } from './Insurance/InitiateClaimModal';
import { Shield, Award, HeartPulse } from 'lucide-react';

export const InsuranceView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Insurance Hub Header Banner */}
      <div className="bg-gradient-to-r from-icici-blue-dark via-slate-900 to-icici-blue-light text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15 shadow-inner">
            <Shield className="w-7 h-7 text-icici-orange" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">QuantumCash Protection Suite</span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Insurance & Wealth Security Hub</h1>
            <p className="text-xs text-slate-300 mt-0.5">Comprehensive Health, Term Life, Motor & Cyber Protections with Instant Cashless Settlements.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-5">
          <div className="flex items-center gap-2 text-xs">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold block text-amber-300">10,000+ Hospitals</span>
              <span className="text-[9px] text-slate-300">Cashless Network</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-extrabold block text-rose-300">99.2% Ratio</span>
              <span className="text-[9px] text-slate-300">Claim Settlement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section A: Active Policies ("My Holdings") */}
      <ActivePoliciesList />

      {/* Section B: Dynamic Premium Calculator */}
      <InsuranceCalculator />

      {/* Section C: Insurance Marketplace & Purchase */}
      <BuyInsuranceModal />

      {/* Section D: Claims Management Center */}
      <InitiateClaimModal />
    </div>
  );
};
