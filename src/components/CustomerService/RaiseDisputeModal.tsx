import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const RaiseDisputeModal: React.FC<Props> = ({ onClose }) => {
  const { activeAccountKey, transactions, raiseDisputeTicket } = useApp();

  const [queryType, setQueryType] = useState('Transaction Dispute');
  const [accountKey, setAccountKey] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [selectedTxnId, setSelectedTxnId] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a description of your issue.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const generatedId = raiseDisputeTicket({
        queryType,
        accountKey,
        transactionId: selectedTxnId || undefined,
        description,
        attachmentName: fileName || undefined
      });
      setTicketId(generatedId);
      setStep(2);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative select-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Raise Ticket / Dispute Form</h2>
              <p className="text-xs text-slate-500 mt-1">Submit formal service disputes or technical queries to our operations desk.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Query Type</label>
                  <select
                    value={queryType}
                    onChange={e => setQueryType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                  >
                    <option value="Transaction Dispute">Transaction Dispute</option>
                    <option value="Service Delay">Service Delay</option>
                    <option value="Fee Reversal Request">Fee Reversal Request</option>
                    <option value="Technical Glitch">Technical Glitch</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Account Selector</label>
                  <select
                    value={accountKey}
                    onChange={e => setAccountKey(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                  >
                    <option value="stable">Stable Growth Account</option>
                    <option value="crunch">Cash Crunch Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Map Disputed Transaction (Optional)</label>
                <select
                  value={selectedTxnId}
                  onChange={e => setSelectedTxnId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                >
                  <option value="">-- No specific transaction linked --</option>
                  {transactions.slice(0, 10).map(t => (
                    <option key={t.transaction_id} value={t.transaction_id}>
                      {t.date} | {t.description} (₹{t.amount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue or dispute rationale in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Attach Supporting Document / Screenshot</label>
                <div className="border border-dashed border-slate-200 hover:border-icici-blue-light bg-slate-50 hover:bg-white rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition select-none">
                  <input
                    type="file"
                    id="dispute-attachment-file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 text-slate-400" />
                  <label htmlFor="dispute-attachment-file" className="cursor-pointer text-xs font-bold text-slate-600 block truncate max-w-[200px]">
                    {fileName ? fileName : 'Upload Receipt / Proof (Opt)'}
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Dispute Ticket Raised Successfully</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Your ticket has been logged into our support database and logged in your Service Requests tracking dashboard.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-xs mx-auto text-xs font-bold font-mono text-slate-800 tracking-wider">
              🏷️ TICKET ID: {ticketId}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
