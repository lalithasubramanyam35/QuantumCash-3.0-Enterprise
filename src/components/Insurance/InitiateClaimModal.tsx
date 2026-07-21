import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { FileSpreadsheet, Upload, CheckCircle2, PlusCircle } from 'lucide-react';

export const InitiateClaimModal: React.FC = () => {
  const { policies, claims, initiateClaim } = useApp();

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPolicyNo, setSelectedPolicyNo] = useState(policies[0]?.policyNo || '');
  const [incidentDate, setIncidentDate] = useState('');
  const [claimType, setClaimType] = useState<'Cashless' | 'Reimbursement' | 'Accident/Loss'>('Cashless');
  const [amountClaimed, setAmountClaimed] = useState('');
  const [hospitalGarage, setHospitalGarage] = useState('');
  const [fileName, setFileName] = useState('');
  const [createdClaimId, setCreatedClaimId] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amountClaimed);
    if (!amountClaimed || isNaN(amt) || amt <= 0) {
      alert('Please enter a valid claimed amount.');
      return;
    }
    if (!incidentDate) {
      alert('Please select an incident date.');
      return;
    }

    const matchedPolicy = policies.find(p => p.policyNo === selectedPolicyNo) || policies[0];

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cId = initiateClaim({
        policyNo: matchedPolicy?.policyNo || selectedPolicyNo,
        policyTitle: matchedPolicy?.title || 'Quantum Health Shield',
        incidentDate,
        claimType,
        amountClaimed: amt,
        hospitalOrGarage: hospitalGarage || undefined
      });
      setCreatedClaimId(cId);
      setStep(2);
    }, 1200);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setStep(1);
    setCreatedClaimId('');
    setAmountClaimed('');
    setHospitalGarage('');
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Under Verification': return 2;
      case 'Approved':
      case 'Settled': return 3;
      default: return 1;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
            <FileSpreadsheet className="w-5 h-5 text-icici-orange" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Claims Management Center</h3>
            <p className="text-xs text-slate-500">File cashless hospitalization claims or track existing reimbursement settlements.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowFormModal(true);
            setStep(1);
          }}
          className="px-4 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Initiate New Claim
        </button>
      </div>

      {/* Claims List & Progress Trackers */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Track Filed Claims</h4>
        {claims.length > 0 ? (
          claims.map(claim => {
            const currentStep = getStatusStep(claim.status);
            return (
              <div key={claim.claimId} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-[9px] font-bold font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      ID: {claim.claimId}
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-sm mt-1">{claim.policyTitle} ({claim.policyNo})</h5>
                    <p className="text-[11px] text-slate-500">
                      Incident Date: {claim.incidentDate} | Type: {claim.claimType} | {claim.hospitalOrGarage || 'General Desk'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Claimed</span>
                    <span className="text-sm font-black text-slate-800">{formatCurrency(claim.amountClaimed, false)}</span>
                  </div>
                </div>

                {/* Progress Bar Stepper */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1.5">
                    <span className={currentStep >= 1 ? 'text-icici-orange' : 'text-slate-400'}>1. Submitted ({claim.dateFiled})</span>
                    <span className={currentStep >= 2 ? 'text-icici-orange' : 'text-slate-400'}>2. Under Verification</span>
                    <span className={currentStep >= 3 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>3. Approved / Settled</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${currentStep === 3 ? 'bg-emerald-500' : 'bg-icici-orange'}`}
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl">
            No active claims filed. Click "Initiate New Claim" to register a claim.
          </div>
        )}
      </div>

      {/* FORM OVERLAY MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative select-text">
            <button
              onClick={closeFormModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
            >
              ✕
            </button>

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Initiate Insurance Claim</h2>
                  <p className="text-xs text-slate-500 mt-1">Submit hospital bills or incident reports for cashless approval or reimbursement.</p>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Active Policy</label>
                      <select
                        value={selectedPolicyNo}
                        onChange={e => setSelectedPolicyNo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                      >
                        {policies.map(p => (
                          <option key={p.id} value={p.policyNo}>
                            {p.title} ({p.policyNo})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Claim Type</label>
                      <select
                        value={claimType}
                        onChange={e => setClaimType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Cashless">Cashless Approval</option>
                        <option value="Reimbursement">Reimbursement</option>
                        <option value="Accident/Loss">Accident / Total Loss</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Incident / Admission Date</label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={e => setIncidentDate(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Amount Claimed (₹)</label>
                      <input
                        type="text"
                        placeholder="e.g. 50000"
                        value={amountClaimed}
                        onChange={e => setAmountClaimed(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Hospital / Workshop Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Hospital, Jubilee Hills"
                      value={hospitalGarage}
                      onChange={e => setHospitalGarage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Upload Discharge Summary / Bills</label>
                    <div className="border border-dashed border-slate-200 hover:border-icici-blue-light bg-slate-50 hover:bg-white rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition select-none">
                      <input
                        type="file"
                        id="claim-bills-file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-slate-400" />
                      <label htmlFor="claim-bills-file" className="cursor-pointer text-xs font-bold text-slate-600 block truncate max-w-[200px]">
                        {fileName ? fileName : 'Upload Bills / Proof (Opt)'}
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={closeFormModal} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                    >
                      {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'File Claim'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-800 text-base">Claim Filed Successfully</h4>
                <p className="text-xs text-slate-500">Your claim **{createdClaimId}** has been registered. TPA audit team will verify documents within 24 hours.</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 font-bold">
                  🔖 CLAIM ID: {createdClaimId}
                </div>
                <button onClick={closeFormModal} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
