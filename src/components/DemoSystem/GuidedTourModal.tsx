import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ChevronLeft, ChevronRight, X, Eye, Wallet, LineChart, TrendingUp, Zap } from 'lucide-react';
import type { TourStep } from '../../types';

interface Props {
  onClose: () => void;
}

export const GuidedTourModal: React.FC<Props> = ({ onClose }) => {
  const { setCurrentTab, setDeepDiveAccountKey } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: (TourStep & { icon: React.ElementType })[] = [
    {
      stepIndex: 1,
      title: 'Step 1: Security & Header Hub',
      description: 'Global Eye Toggle masks numerical financial figures across the dashboard. Click the UPCOMING PAYMENTS bell pill to open the dues drawer.',
      targetTab: 'Overview',
      position: 'top',
      icon: Eye
    },
    {
      stepIndex: 2,
      title: 'Step 2: Accounts Overview',
      description: 'View real-time balances for Stable Growth (operating surplus) and Cash Crunch (liquidity stress testing) accounts.',
      targetTab: 'Overview',
      position: 'center',
      icon: Wallet
    },
    {
      stepIndex: 3,
      title: 'Step 3: AI Cash-Flow Predictive Models',
      description: 'Select any account to launch T+1 to T+7 predictive cash-flow forecasting engine, credit lines, and automated resolution letters.',
      targetTab: 'Accounts',
      position: 'center',
      icon: LineChart
    },
    {
      stepIndex: 4,
      title: 'Step 4: Deposits & Wealth Holdings',
      description: 'Explore Fixed Deposits, Recurring Deposits, Sukanya Samriddhi (SSY), PPF, Mutual Funds, and Demat portfolios.',
      targetTab: 'Investments',
      position: 'center',
      icon: TrendingUp
    },
    {
      stepIndex: 5,
      title: 'Step 5: Pre-Approved Offers & Instant Services',
      description: 'Avail pre-approved Personal Loans, Car Loans, Credit Cards, or request Service Requests with zero physical paperwork.',
      targetTab: 'Overview',
      position: 'bottom',
      icon: Zap
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-switch tabs to show live feature
  useEffect(() => {
    if (currentStep.targetTab) {
      setDeepDiveAccountKey(null);
      setCurrentTab(currentStep.targetTab);
    }
  }, [currentStepIndex, currentStep, setCurrentTab, setDeepDiveAccountKey]);

  // Keyboard navigation support (ESC to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, steps.length, onClose]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-2 border-icici-orange/30 animate-scale-up select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-5">
          {/* Header Stepper Pill */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-icici-orange text-white rounded-xl shadow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-icici-orange tracking-wider">INTERACTIVE PRODUCT TOUR</span>
                <h3 className="font-extrabold text-slate-800 text-base">{currentStep.title}</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          {/* Description Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2.5 bg-icici-blue-dark text-white rounded-xl shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-icici-orange" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">{currentStep.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{currentStep.description}</p>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 py-1">
            {steps.map((s, idx) => (
              <button
                key={s.stepIndex}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-6 bg-icici-orange' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
            >
              Skip Tour
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white font-extrabold rounded-xl shadow transition flex items-center gap-1"
              >
                {currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
