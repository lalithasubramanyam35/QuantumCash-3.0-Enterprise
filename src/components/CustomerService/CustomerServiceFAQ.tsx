import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Wallet, CreditCard, Landmark, ShieldCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQDomain {
  domain: string;
  icon: React.ElementType;
  items: FAQItem[];
}

export const CustomerServiceFAQ: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqData: FAQDomain[] = [
    {
      domain: 'Accounts & Transactions',
      icon: Wallet,
      items: [
        {
          id: 'faq-1',
          question: 'Failed Transaction Refund Timelines (Auto-reversal Info)',
          answer: 'As per RBI guidelines (T+1 mandate), failed UPI or Debit Card transactions where funds were debited are automatically reversed back into your operating account within 24 to 48 hours. If auto-reversal is delayed beyond T+5 days, compensation of ₹100/day is credited automatically.'
        },
        {
          id: 'faq-2',
          question: 'How to update registered mobile number or communication address',
          answer: 'Communication addresses can be updated directly online via Service Requests -> Address Change with Aadhaar proof PDF/Image upload. Mobile number updates require biometric validation at any branch ATM or branch service desk.'
        }
      ]
    },
    {
      domain: 'Cards & NetBanking',
      icon: CreditCard,
      items: [
        {
          id: 'faq-3',
          question: 'Resetting Login Password / Transaction PIN',
          answer: 'You can generate instant 4-digit Debit Card PINs under Service Requests -> Generate Card PIN. Login passwords can be reset via the authentication portal using your registered debit card CVV & OTP validation.'
        },
        {
          id: 'faq-4',
          question: 'International usage enablement & CVV security',
          answer: 'International transaction limits and online e-commerce toggles can be managed under Service Requests -> Manage Debit Card Limits. Never share 3-digit CVV numbers or OTP passcodes with anyone.'
        }
      ]
    },
    {
      domain: 'Loans & Investments',
      icon: Landmark,
      items: [
        {
          id: 'faq-5',
          question: 'Interest certificates download for tax saving (Sec 24 / 80C)',
          answer: 'Home Loan Provisional Interest Certificates and Fixed Deposit Form 16A TDS certificates can be downloaded under Customer Service -> Tax Certificates or generated via our Virtual Assistant.'
        },
        {
          id: 'faq-6',
          question: 'Foreclosure process and NOC requests',
          answer: 'Retail loan foreclosures can be initiated after completing 6 EMI cycles. Upon full repayment, a No Objection Certificate (NOC) and physical property documents are dispatched within 10 working days.'
        }
      ]
    },
    {
      domain: 'Fraud & Cyber Security',
      icon: ShieldCheck,
      items: [
        {
          id: 'faq-7',
          question: 'Safe banking guidelines & reporting phishing emails/SMS',
          answer: 'QuantumCash never asks for passwords, CVV, or PINs over telephone calls or SMS links. Report fraudulent SMS/emails immediately to abuse@quantumcash.com or use our Emergency Quick Action bar.'
        }
      ]
    }
  ];

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <HelpCircle className="w-5 h-5 text-icici-blue-dark" />
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Self-Service FAQ & Troubleshooting Knowledgebase</h3>
          <p className="text-xs text-slate-500">Find immediate answers for common banking queries, guidelines, and compliance rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqData.map(group => {
          const Icon = group.icon;
          return (
            <div key={group.domain} className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <div className="p-1.5 bg-icici-blue-light/10 text-icici-blue-light rounded-lg">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{group.domain}</span>
              </div>

              <div className="space-y-2">
                {group.items.map(item => {
                  const isOpen = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden transition shadow-2xs"
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full text-left p-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-icici-blue-light transition"
                      >
                        <span className="pr-2">{item.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-icici-orange' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed animate-fade-in">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
