import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { ShieldCheck, Download, FileCheck2, CreditCard, CheckCircle2, X } from 'lucide-react';
import type { InsurancePolicy } from '../../types';

export const ActivePoliciesList: React.FC = () => {
  const { policies, eyeHidden, activeAccountKey, getAccountBalances, payPolicyPremium } = useApp();
  const balances = getAccountBalances();

  const [payingPolicy, setPayingPolicy] = useState<InsurancePolicy | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPolicy) return;

    const res = payPolicyPremium(payingPolicy.id, selectedAccount);
    if (res.success) {
      setPaymentSuccess(true);
    } else {
      alert(res.error || 'Failed to process premium payment');
    }
  };

  const handleDownloadDoc = (policy: InsurancePolicy) => {
    setDownloadNotice(`Downloading Policy Schedule & Coverage Terms for ${policy.policyNo}...`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDownloadTaxCert = (policy: InsurancePolicy) => {
    setDownloadNotice(`Generating Section ${policy.taxExemptionType || '80C'} Tax Certificate for ${policy.policyNo}...`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
            <ShieldCheck className="w-5 h-5 text-icici-orange" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Active Policies ("My Holdings")</h3>
            <p className="text-xs text-slate-500">View coverage details, pay upcoming premiums, and download tax receipts.</p>
          </div>
        </div>
        <span className="text-xs font-extrabold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
          {policies.length} Active Shield{policies.length !== 1 ? 's' : ''}
        </span>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-icici-blue-dark text-white rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>📄 {downloadNotice}</span>
          <span className="text-[10px] text-icici-orange font-bold uppercase">Downloaded</span>
        </div>
      )}

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map(policy => (
          <div
            key={policy.id}
            className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-icici-blue-light/50 transition shadow-2xs space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-icici-blue-light/10 text-icici-blue-light px-2 py-0.5 rounded">
                  {policy.category} Cover
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm mt-1">{policy.title}</h4>
                <p className="font-mono text-[10px] text-slate-400">Policy No: {policy.policyNo}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● {policy.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-200/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Sum Assured / Coverage</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {formatCurrency(policy.sumAssured, eyeHidden)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Premium ({policy.paymentFrequency})</span>
                <span className="font-extrabold text-icici-orange text-sm">
                  {formatCurrency(policy.premiumAmount, eyeHidden)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Next Renewal: <strong className="text-slate-700">{policy.nextDueDate}</strong></span>
              {policy.nomineeName && <span>Nominee: <strong className="text-slate-700">{policy.nomineeName}</strong></span>}
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setPayingPolicy(policy);
                  setPaymentSuccess(false);
                }}
                className="flex-1 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <CreditCard className="w-3.5 h-3.5" /> Pay Premium
              </button>
              <button
                onClick={() => handleDownloadDoc(policy)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1"
                title="Download Policy Document"
              >
                <Download className="w-3.5 h-3.5" /> Doc
              </button>
              {policy.taxExemptionType && (
                <button
                  onClick={() => handleDownloadTaxCert(policy)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1"
                  title={`Sec ${policy.taxExemptionType} Tax Exemption Certificate`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> {policy.taxExemptionType} Cert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pay Premium Modal */}
      {payingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setPayingPolicy(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            {!paymentSuccess ? (
              <form onSubmit={handlePaySubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-icici-orange" />
                  <h3 className="text-base font-bold">Pay Insurance Premium</h3>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Policy Details</span>
                  <p className="font-bold text-slate-800">{payingPolicy.title} ({payingPolicy.policyNo})</p>
                  <div className="flex justify-between items-center text-sm font-black text-icici-orange pt-1">
                    <span>Amount Due:</span>
                    <span>{formatCurrency(payingPolicy.premiumAmount, false)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Debit Account</label>
                  <select
                    value={selectedAccount}
                    onChange={e => setSelectedAccount(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                    <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPayingPolicy(null)}
                    className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow"
                  >
                    Confirm & Pay {formatCurrency(payingPolicy.premiumAmount, false)}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-800 text-sm">Premium Paid Successfully</h4>
                <p className="text-xs text-slate-500">Transaction debited from account. Policy renewal date updated in central records.</p>
                <button
                  onClick={() => setPayingPolicy(null)}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
