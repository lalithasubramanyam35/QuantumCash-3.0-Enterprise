import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Shield, Lock, Car, Plane, CheckCircle2, ShoppingCart, X } from 'lucide-react';
import type { InsurancePolicy } from '../../types';

interface ProductLine {
  id: string;
  title: string;
  category: 'Life' | 'Health' | 'Motor' | 'Travel' | 'Cyber';
  sumAssured: number;
  premiumAmount: number;
  description: string;
  features: string[];
  icon: React.ElementType;
  taxType?: '80C' | '80D';
}

export const BuyInsuranceModal: React.FC = () => {
  const { user, nominee, activeAccountKey, getAccountBalances, purchasePolicy } = useApp();
  const balances = getAccountBalances();

  const [selectedProduct, setSelectedProduct] = useState<ProductLine | null>(null);
  const [step, setStep] = useState(1);
  const [nomineeName, setNomineeName] = useState(nominee?.name || user?.name || 'Gandikota Subbarao');
  const [declarationAccepted, setDeclarationAccepted] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [createdPolicyNo, setCreatedPolicyNo] = useState('');
  const [loading, setLoading] = useState(false);

  const productLines: ProductLine[] = [
    {
      id: 'prod-health',
      title: 'Quantum Term Health Care',
      category: 'Health',
      sumAssured: 1000000,
      premiumAmount: 6500,
      description: 'Cashless hospitalization in 10,000+ empaneled hospitals across India.',
      features: ['Zero copayment', 'Day care procedures covered', 'Tax savings u/s 80D'],
      icon: Shield,
      taxType: '80D'
    },
    {
      id: 'prod-cyber',
      title: 'Cyber Fraud Guard',
      category: 'Cyber',
      sumAssured: 200000,
      premiumAmount: 999,
      description: 'Protects against unauthorized online transactions, card theft & phishing.',
      features: ['Zero-liability cover', 'Identity theft legal fees', 'Instant claim settlement'],
      icon: Lock
    },
    {
      id: 'prod-motor',
      title: 'Comprehensive Motor Guard',
      category: 'Motor',
      sumAssured: 800000,
      premiumAmount: 4200,
      description: 'Zero depreciation cover + 24x7 roadside breakdown assistance.',
      features: ['Engine protector', 'Personal accident cover', 'Cashless garage network'],
      icon: Car
    },
    {
      id: 'prod-travel',
      title: 'International Travel Shield',
      category: 'Travel',
      sumAssured: 5000000,
      premiumAmount: 1500,
      description: 'Overseas emergency medical cover, baggage loss & flight cancellation.',
      features: ['COVID-19 overseas cover', 'Passport loss assistance', 'Cashless hospital admission'],
      icon: Plane
    }
  ];

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newPolicyData: Omit<InsurancePolicy, 'id' | 'policyNo' | 'status'> = {
        title: selectedProduct.title,
        category: selectedProduct.category,
        sumAssured: selectedProduct.sumAssured,
        premiumAmount: selectedProduct.premiumAmount,
        paymentFrequency: 'Annual',
        nextDueDate: '20 Jul 2027',
        nomineeName: nomineeName,
        taxExemptionType: selectedProduct.taxType
      };

      const polNo = purchasePolicy(newPolicyData, selectedAccount);
      setCreatedPolicyNo(polNo);
      setStep(3);
    }, 1200);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setStep(1);
    setCreatedPolicyNo('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Insurance Marketplace & Instant Covers</h3>
          <p className="text-xs text-slate-500">Instant policy issuance with pre-filled banking KYC & zero physical paperwork.</p>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productLines.map(prod => {
          const Icon = prod.icon;
          return (
            <div
              key={prod.id}
              className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-icici-orange/50 transition shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="p-2.5 bg-icici-blue-dark text-white rounded-xl w-fit">
                  <Icon className="w-5 h-5 text-icici-orange" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">{prod.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{prod.description}</p>
                <div className="pt-1 space-y-1">
                  {prod.features.map((f, idx) => (
                    <span key={idx} className="block text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                      <span className="text-icici-orange font-bold">✓</span> {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Cover: {formatCurrency(prod.sumAssured, false)}</span>
                  <span className="text-sm font-black text-icici-orange">₹{prod.premiumAmount.toLocaleString('en-IN')}/yr</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(prod);
                    setStep(1);
                  }}
                  className="w-full bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold py-2 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy Instantly
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3-Step Instant Purchase Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative select-text">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-icici-orange" />
                  <h3 className="text-base font-bold">Step 1: Coverage & Nominee Assignment</h3>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Product</span>
                  <p className="font-bold text-slate-800">{selectedProduct.title}</p>
                  <p className="text-slate-500">Sum Assured: <strong>{formatCurrency(selectedProduct.sumAssured, false)}</strong> | Annual Premium: <strong className="text-icici-orange">₹{selectedProduct.premiumAmount.toLocaleString('en-IN')}</strong></p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Nominee Full Name</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={e => setNomineeName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                  <button onClick={() => setStep(2)} className="px-5 py-2 bg-icici-orange text-white text-xs font-bold rounded-xl shadow">Proceed to Declaration →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-icici-blue-dark" />
                  <h3 className="text-base font-bold">Step 2: Good Health & Compliance Declaration</h3>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-2">
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    I hereby declare that the life/property to be insured is free from pre-existing undisclosed conditions or fraudulent claims history. KYC documents will be retrieved from QuantumCash central records.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={e => setDeclarationAccepted(e.target.checked)}
                      className="w-4 h-4 text-icici-orange rounded"
                    />
                    <span className="text-[11px] font-bold text-slate-800">I confirm and accept the policy terms & conditions.</span>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Payment Account</label>
                  <select
                    value={selectedAccount}
                    onChange={e => setSelectedAccount(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                    <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-between gap-2">
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Back</button>
                  <button
                    onClick={handleBuySubmit}
                    disabled={!declarationAccepted || loading}
                    className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                  >
                    {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : `Pay ₹${selectedProduct.premiumAmount.toLocaleString('en-IN')} & Issue Policy`}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-800 text-base">Policy Issued Instantly!</h4>
                <p className="text-xs text-slate-500">Your new policy **{createdPolicyNo}** is active. Premium debited from account and added to your Holdings.</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 font-bold">
                  📄 POLICY NO: {createdPolicyNo}
                </div>
                <button onClick={closeModal} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
