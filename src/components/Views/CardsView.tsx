import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Shield, RotateCw, Award, CheckCircle2, Sliders, X } from 'lucide-react';
import type { CardDetails } from '../../types';

export const CardsView: React.FC = () => {
  const { eyeHidden, addTransaction, getAccountBalances } = useApp();
  const balances = getAccountBalances();

  const [cards, setCards] = useState<CardDetails[]>([
    {
      id: 'c1',
      name: 'Quantum Sapphire Credit Card',
      type: 'Credit',
      cardNumber: '4821 0092 7742 1092',
      cvv: '742',
      expiry: '08/29',
      creditLimit: 300000,
      availableLimit: 225000,
      linkedAccount: 'Quantum Credit Limit',
      isOnlineEnabled: true,
      isAtmEnabled: true,
      isContactlessEnabled: true,
      isInternationalEnabled: true,
      dailyLimit: 150000
    },
    {
      id: 'c2',
      name: 'Quantum Coral Debit Card',
      type: 'Debit',
      cardNumber: '4821 0092 8390 4019',
      cvv: '839',
      expiry: '11/28',
      linkedAccount: 'Stable Growth (QC-SG-882190)',
      isOnlineEnabled: true,
      isAtmEnabled: true,
      isContactlessEnabled: true,
      isInternationalEnabled: false,
      dailyLimit: 100000
    }
  ]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ccBillPaid, setCcBillPaid] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(14250);

  const currentCard = cards[activeCardIndex];

  const handleToggleControl = (controlKey: keyof CardDetails) => {
    setCards(prev =>
      prev.map((c, idx) => (idx === activeCardIndex ? { ...c, [controlKey]: !c[controlKey] } : c))
    );
  };

  const handleLimitSliderChange = (newVal: number) => {
    setCards(prev =>
      prev.map((c, idx) => (idx === activeCardIndex ? { ...c, dailyLimit: newVal } : c))
    );
  };

  const handlePayCcBill = () => {
    if (balances.stable < 14250) {
      alert('Insufficient balance in Stable Growth account to pay credit card bill.');
      return;
    }

    addTransaction('OUTFLOW', 'Credit Card', 14250, 'Quantum Signature Credit Card Bill Payment');
    setCcBillPaid(true);
    setTimeout(() => setCcBillPaid(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 select-text">
      
      {/* Top Banner Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-icici-orange tracking-wider">CARDS MANAGEMENT HUB</span>
          <h2 className="text-xl font-extrabold text-slate-800">Debit & Credit Card Controls</h2>
        </div>

        {/* Card Switcher Pills */}
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCardIndex(idx);
                setIsFlipped(false);
              }}
              className={`px-4 py-1.5 rounded-full font-bold transition ${
                activeCardIndex === idx ? 'bg-[#003366] text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.type} Card
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Visual Card & Flip Widget */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* 3D Visual Card Widget */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer group perspective select-none"
            title="Click to flip card"
          >
            <div
              className={`w-full h-52 rounded-3xl p-6 text-white shadow-xl relative transition-all duration-500 transform ${
                currentCard.type === 'Credit'
                  ? 'bg-gradient-to-br from-slate-900 via-icici-blue-dark to-slate-950 border border-slate-700'
                  : 'bg-gradient-to-br from-icici-orange via-orange-600 to-amber-700 border border-orange-400'
              }`}
            >
              {!isFlipped ? (
                // FRONT SIDE
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-black tracking-widest text-sm uppercase">{currentCard.name}</span>
                    <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                      {currentCard.type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-white/70 block">Card Number</span>
                    <p className="font-mono text-lg font-bold tracking-widest">
                      {eyeHidden ? '•••• •••• •••• ' + currentCard.cardNumber.slice(-4) : currentCard.cardNumber}
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[9px] uppercase text-white/70 block">Card Holder</span>
                      <span className="font-bold">LALITHA SUBRAMANYAM</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase text-white/70 block">Expires</span>
                      <span className="font-mono font-bold">{currentCard.expiry}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // BACK SIDE
                <div className="h-full flex flex-col justify-between py-1">
                  <div className="w-full h-9 bg-slate-900 -mx-6 mt-2" />
                  <div className="bg-white/90 text-slate-900 px-3 py-1.5 rounded text-right font-mono font-bold text-sm">
                    CVV: {eyeHidden ? '•••' : currentCard.cvv}
                  </div>
                  <div className="text-[9px] text-white/70 text-center font-mono">
                    Issued by QuantumCash ICICI Enterprise • 24x7 Helpline +91 0123456789
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-center text-slate-400 font-bold mt-2 flex items-center justify-center gap-1">
              <RotateCw className="w-3 h-3 text-icici-orange" /> Click card widget to flip front/back
            </p>
          </div>

          {/* Billing Summary (For Credit Cards) */}
          {currentCard.type === 'Credit' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Credit Card Billing Summary</span>
              {ccBillPaid && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bill Paid Successfully!
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Statement Due Amount:</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(14250, eyeHidden)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Payment Due Date:</span>
                <span className="font-bold text-rose-600">23 JUL 2026</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Minimum Due:</span>
                <span className="font-bold text-slate-700">{formatCurrency(1425, eyeHidden)}</span>
              </div>

              <button
                onClick={handlePayCcBill}
                className="w-full py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow transition"
              >
                Pay Credit Card Bill (₹14,250)
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Security Controls & Rewards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Security Controls Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#003366]" /> Card Security & Usage Controls
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE PROTECTION
              </span>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'isOnlineEnabled', label: 'Online & E-Commerce Transactions', desc: 'Web purchases & app payments' },
                { key: 'isAtmEnabled', label: 'ATM Cash Withdrawals', desc: 'Physical ATM cash access' },
                { key: 'isContactlessEnabled', label: 'Contactless Tap & Pay', desc: 'NFC POS terminal tapping' },
                { key: 'isInternationalEnabled', label: 'International Usage', desc: 'Global currencies & cross-border' }
              ].map(ctrl => {
                const isChecked = currentCard[ctrl.key as keyof CardDetails] as boolean;
                return (
                  <div key={ctrl.key} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{ctrl.label}</h4>
                      <p className="text-[10px] text-slate-400">{ctrl.desc}</p>
                    </div>

                    <button
                      onClick={() => handleToggleControl(ctrl.key as keyof CardDetails)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        isChecked ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Spend Limit Slider */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-icici-orange" /> Daily Spend Limit Threshold
                </span>
                <span className="font-mono font-extrabold text-[#003366] text-sm">
                  {formatCurrency(currentCard.dailyLimit, eyeHidden)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={5000}
                value={currentCard.dailyLimit}
                onChange={e => handleLimitSliderChange(Number(e.target.value))}
                className="w-full accent-[#003366] cursor-pointer"
              />
            </div>
          </div>

          {/* Reward Points Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Quantum Rewards Balance</span>
                <h4 className="text-xl font-black text-slate-800">{rewardPoints.toLocaleString()} Points</h4>
                <p className="text-xs text-slate-500">Worth ₹3,562 in Instant Cashback or Vouchers</p>
              </div>
            </div>

            <button
              onClick={() => setShowRewardModal(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-icici-blue-light text-white text-xs font-bold rounded-xl shadow transition"
            >
              Redeem Rewards
            </button>
          </div>

        </div>
      </div>

      {/* Rewards Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 text-slate-800">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative select-text">
            <button onClick={() => setShowRewardModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <h3 className="font-extrabold text-base">Redeem Quantum Reward Points</h3>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Available Points</span>
                <p className="text-lg font-black text-slate-800">{rewardPoints.toLocaleString()} Points</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Amazon Pay ₹1,000 Gift Card', pts: 4000 },
                  { name: 'Swiggy Money ₹500 Voucher', pts: 2000 },
                  { name: 'Cashback Credit to Account (₹2,500)', pts: 10000 }
                ].map(item => (
                  <div key={item.name} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">{item.pts} Points required</span>
                    </div>
                    <button
                      onClick={() => {
                        setRewardPoints(prev => prev - item.pts);
                        alert(`Successfully redeemed ${item.name}!`);
                        setShowRewardModal(false);
                      }}
                      className="px-3 py-1 bg-icici-orange text-white text-xs font-bold rounded-lg hover:bg-icici-orange-hover"
                    >
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
