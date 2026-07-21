import React, { useState } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { SystemArchitectureModal } from './SystemArchitectureModal';

export const SystemBlueprintSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="pt-4 select-none">
        <div 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-slate-900 via-[#003366] to-indigo-950 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-icici-orange border border-white/10 group-hover:scale-105 transition transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold bg-icici-orange/20 text-icici-orange px-2.5 py-0.5 rounded uppercase tracking-wider border border-icici-orange/30 inline-block mb-1">
                Enterprise Blueprint & Specs
              </span>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                📐 View System Architecture & Technical Blueprint
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Explore 5-layer reactive state pipeline, T+7 ML predictive cash-flow engine & vitest verification suite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-black bg-white/10 group-hover:bg-icici-orange group-hover:text-white text-slate-200 px-5 py-2.5 rounded-xl border border-white/15 transition shadow-sm shrink-0">
            <span>Explore Architecture</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {showModal && (
        <SystemArchitectureModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
