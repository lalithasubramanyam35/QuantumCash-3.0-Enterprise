import React, { useState, useRef, useEffect } from 'react';
import { Play, RefreshCw, Sparkles, ChevronDown } from 'lucide-react';
import { ResetDemoModal } from './ResetDemoModal';
import { GuidedTourModal } from './GuidedTourModal';

export const DemoMenuDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-1.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-icici-orange/15 transition select-none"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>View / Reset Demo</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 z-50 py-1.5 animate-fade-in text-slate-800">
          <button
            onClick={() => {
              setIsOpen(false);
              setShowResetModal(true);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-icici-orange" />
            <div>
              <span className="block font-bold text-slate-800">Reset Factory State</span>
              <span className="text-[10px] text-slate-400 font-normal">Restore initial balances & models</span>
            </div>
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              setIsOpen(false);
              setShowTourModal(true);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <span className="block font-bold text-slate-800">Start Guided Product Tour</span>
              <span className="text-[10px] text-slate-400 font-normal">Interactive step-by-step walkthrough</span>
            </div>
          </button>
        </div>
      )}

      {showResetModal && <ResetDemoModal onClose={() => setShowResetModal(false)} />}
      {showTourModal && <GuidedTourModal onClose={() => setShowTourModal(false)} />}
    </div>
  );
};
