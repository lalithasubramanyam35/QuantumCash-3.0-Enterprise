import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { Lock, Unlock, Sparkles, Zap, Car, CreditCard, Bike } from 'lucide-react';
import { UnlockOffersModal } from './Offers/UnlockOffersModal';
import { PersonalLoanOfferModal } from './Offers/PersonalLoanOfferModal';
import { CarLoanOfferModal } from './Offers/CarLoanOfferModal';
import { CreditCardOfferModal } from './Offers/CreditCardOfferModal';
import { TwoWheelerOfferModal } from './Offers/TwoWheelerOfferModal';
import type { PreApprovedOffer } from '../types';

export const OffersSection: React.FC = () => {
  const { offers, offersUnlocked, eyeHidden } = useApp();

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [activeModalOffer, setActiveModalOffer] = useState<PreApprovedOffer | null>(null);

  const getOfferIcon = (type: PreApprovedOffer['type']) => {
    switch (type) {
      case 'Personal Loan': return Zap;
      case 'Car Loan': return Car;
      case 'Credit Card': return CreditCard;
      case 'Two-Wheeler Loan': return Bike;
      default: return Zap;
    }
  };

  const handleCardClick = (offer: PreApprovedOffer) => {
    if (!offersUnlocked) {
      setShowUnlockModal(true);
    } else {
      setActiveModalOffer(offer);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
            <Sparkles className="w-5 h-5 text-icici-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">OFFERS FOR YOU</h3>
              {offersUnlocked && (
                <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  UNLOCKED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Pre-approved instant liquidity lines & credit cards matching your financial profile.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!offersUnlocked ? (
            <button
              onClick={() => setShowUnlockModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-icici-orange to-amber-600 hover:from-icici-orange-hover hover:to-amber-700 text-white text-xs font-black rounded-full shadow-md transition flex items-center gap-1.5 animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" /> UNLOCK INSTANT OFFERS
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" /> ALL OFFERS READY
            </span>
          )}
        </div>
      </div>

      {/* Grid of 4 Pre-Approved Offer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map(offer => {
          const Icon = getOfferIcon(offer.type);
          const isUnlocked = offer.isUnlocked || offersUnlocked;

          return (
            <div
              key={offer.id}
              onClick={() => handleCardClick(offer)}
              className={`border rounded-2xl p-4 transition cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                isUnlocked
                  ? 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-icici-orange shadow-2xs hover:shadow-md'
                  : 'border-slate-200 bg-slate-100/60 opacity-90 hover:border-slate-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-icici-blue-dark text-white' : 'bg-slate-300 text-slate-600'}`}>
                    <Icon className={`w-4 h-4 ${isUnlocked ? 'text-icici-orange' : 'text-slate-500'}`} />
                  </div>

                  {isUnlocked ? (
                    <span className="text-[8px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      PRE-APPROVED | ZERO DOCS
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-icici-blue-dark transition">
                  {offer.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Interest: {offer.interestRate}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 space-y-2">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Pre-approved Limit</span>
                  <span className="text-sm font-black text-slate-800 block">
                    {formatCurrency(offer.maxLimit, eyeHidden)}
                  </span>
                </div>

                <button
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isUnlocked
                      ? 'bg-icici-orange hover:bg-icici-orange-hover text-white shadow'
                      : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                  }`}
                >
                  {isUnlocked ? 'Avail Offer →' : 'Unlock Offer 🔒'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Verification Unlock Modal */}
      {showUnlockModal && <UnlockOffersModal onClose={() => setShowUnlockModal(false)} />}

      {/* Individual Offer Modals */}
      {activeModalOffer?.type === 'Personal Loan' && (
        <PersonalLoanOfferModal onClose={() => setActiveModalOffer(null)} />
      )}
      {activeModalOffer?.type === 'Car Loan' && (
        <CarLoanOfferModal onClose={() => setActiveModalOffer(null)} />
      )}
      {activeModalOffer?.type === 'Credit Card' && (
        <CreditCardOfferModal onClose={() => setActiveModalOffer(null)} />
      )}
      {activeModalOffer?.type === 'Two-Wheeler Loan' && (
        <TwoWheelerOfferModal onClose={() => setActiveModalOffer(null)} />
      )}
    </div>
  );
};
