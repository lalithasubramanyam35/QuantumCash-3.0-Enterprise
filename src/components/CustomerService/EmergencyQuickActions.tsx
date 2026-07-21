import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const EmergencyQuickActions: React.FC = () => {
  const { cards, transactions, blockCard, stopChequePayment, addServiceRequest } = useApp();

  const [activeModal, setActiveModal] = useState<'block' | 'fraud' | 'cheque' | null>(null);

  // Block Card State
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [blockReason, setBlockReason] = useState('Lost Card');
  const [blockSuccess, setBlockSuccess] = useState(false);

  // Cyber Fraud State
  const [fraudTxnId, setFraudTxnId] = useState('');
  const [fraudDescription, setFraudDescription] = useState('');
  const [autoLockCard, setAutoLockCard] = useState(true);
  const [fraudSuccess, setFraudSuccess] = useState('');

  // Stop Cheque State
  const [chequeNo, setChequeNo] = useState('');
  const [chequeReason, setChequeReason] = useState('Cheque Lost / Stolen');
  const [stopChequeRef, setStopChequeRef] = useState('');

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId) return;
    blockCard(selectedCardId);
    setBlockSuccess(true);
  };

  const handleFraudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (autoLockCard && cards[0]) {
      blockCard(cards[0].id);
    }
    const srn = addServiceRequest('Cyber Fraud Report', 'In Progress');
    setFraudSuccess(srn);
  };

  const handleStopChequeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chequeNo || chequeNo.length !== 6) {
      alert('Cheque number must be 6 digits');
      return;
    }
    const ref = stopChequePayment(chequeNo, 'stable');
    setStopChequeRef(ref);
  };

  const closeModal = () => {
    setActiveModal(null);
    setBlockSuccess(false);
    setFraudSuccess('');
    setStopChequeRef('');
    setChequeNo('');
    setFraudDescription('');
  };

  return (
    <div className="bg-gradient-to-r from-red-700 via-rose-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm animate-pulse">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight">Emergency Assistance & Fraud Response</h3>
            <p className="text-[11px] text-red-100">Instant security tools to freeze assets, flag unauthorized transactions & stop payment orders.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Button 1: Block Card */}
        <button
          onClick={() => setActiveModal('block')}
          className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-left transition backdrop-blur-sm flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
              🚨 Block Card Immediately
            </span>
            <p className="text-[10px] text-red-200">Freeze lost/stolen debit & credit cards</p>
          </div>
          <Lock className="w-4 h-4 text-white/70 group-hover:scale-110 transition shrink-0 ml-2" />
        </button>

        {/* Button 2: Report Cyber Fraud */}
        <button
          onClick={() => setActiveModal('fraud')}
          className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-left transition backdrop-blur-sm flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
              🛡️ Report Cyber Fraud
            </span>
            <p className="text-[10px] text-red-200">Flag unauthorized transaction draws</p>
          </div>
          <AlertTriangle className="w-4 h-4 text-white/70 group-hover:scale-110 transition shrink-0 ml-2" />
        </button>

        {/* Button 3: Stop Cheque Payment */}
        <button
          onClick={() => setActiveModal('cheque')}
          className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-left transition backdrop-blur-sm flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-300">
              📄 Stop Cheque Payment
            </span>
            <p className="text-[10px] text-red-200">Instant clearance revocation order</p>
          </div>
          <FileText className="w-4 h-4 text-white/70 group-hover:scale-110 transition shrink-0 ml-2" />
        </button>
      </div>

      {/* OVERLAY MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* MODAL 1: BLOCK CARD */}
            {activeModal === 'block' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <Lock className="w-5 h-5" />
                  <h3 className="text-base font-bold">Instant Card Block</h3>
                </div>

                {!blockSuccess ? (
                  <form onSubmit={handleBlockSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500">Freezing your card prevents all ATM cash withdrawals, POS swipes, and Online transactions immediately.</p>
                    
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Card to Freeze</label>
                      <select
                        value={selectedCardId}
                        onChange={e => setSelectedCardId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                      >
                        {cards.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} (•••• {c.lastFour}) {c.isBlocked ? '[ALREADY BLOCKED]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Reason for Blocking</label>
                      <select
                        value={blockReason}
                        onChange={e => setBlockReason(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Lost Card">Lost Card / Wallet Stolen</option>
                        <option value="Unrecognised Charges">Unrecognised Charges Detected</option>
                        <option value="Damaged Card">Physical Damage</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow">Confirm & Block Card</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Card Blocked Successfully</h4>
                    <p className="text-xs text-slate-500">Your card has been set to inactive status in system records. A replacement request can be raised from Service Requests.</p>
                    <button onClick={closeModal} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Close</button>
                  </div>
                )}
              </div>
            )}

            {/* MODAL 2: REPORT CYBER FRAUD */}
            {activeModal === 'fraud' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-base font-bold">Report Unauthorized Transaction</h3>
                </div>

                {!fraudSuccess ? (
                  <form onSubmit={handleFraudSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500">Cyber security incident tickets get priority processing. Zero-liability claims are logged immediately.</p>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Disputed Transaction (Optional)</label>
                      <select
                        value={fraudTxnId}
                        onChange={e => setFraudTxnId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="">-- Choose suspicious transaction --</option>
                        {transactions.slice(0, 8).map(t => (
                          <option key={t.transaction_id} value={t.transaction_id}>
                            {t.date} - {t.description} (₹{t.amount.toLocaleString('en-IN')})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Incident Description</label>
                      <textarea
                        rows={3}
                        placeholder="Provide details about unauthorized SMS alerts, OTP phishing, or suspicious online draws..."
                        value={fraudDescription}
                        onChange={e => setFraudDescription(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      <input
                        type="checkbox"
                        id="auto-lock-chk"
                        checked={autoLockCard}
                        onChange={e => setAutoLockCard(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded cursor-pointer"
                      />
                      <label htmlFor="auto-lock-chk" className="text-[10px] text-red-700 font-bold cursor-pointer">
                        Automatically lock debit card as a protective safety measure.
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow">Submit Cyber Fraud Incident</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Fraud Report Registered</h4>
                    <p className="text-xs text-slate-500">Incident logged under Service Reference **{fraudSuccess}**. Cyber response team will audit transaction traces.</p>
                    <button onClick={closeModal} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Close</button>
                  </div>
                )}
              </div>
            )}

            {/* MODAL 3: STOP CHEQUE */}
            {activeModal === 'cheque' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-base font-bold">Stop Cheque Payment Order</h3>
                </div>

                {!stopChequeRef ? (
                  <form onSubmit={handleStopChequeSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500">Place an immediate hold on issued physical cheques before commercial clearing.</p>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">6-Digit Cheque Number</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 409210"
                        value={chequeNo}
                        onChange={e => setChequeNo(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-center tracking-widest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Reason for Revocation</label>
                      <select
                        value={chequeReason}
                        onChange={e => setChequeReason(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Cheque Lost / Stolen">Cheque Lost / Stolen</option>
                        <option value="Incorrect Amount Written">Incorrect Amount Written</option>
                        <option value="Commercial Dispute">Commercial Vendor Dispute</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow">Place Stop Payment</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Stop Payment Placed</h4>
                    <p className="text-xs text-slate-500">Cheque #{chequeNo} is revoked. Reference Number: **{stopChequeRef}**</p>
                    <button onClick={closeModal} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Close</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
