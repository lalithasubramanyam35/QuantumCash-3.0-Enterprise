import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Upload, HelpCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PositivePayModal: React.FC<Props> = ({ onClose }) => {
  const { activeAccountKey, getAccountBalances, addServiceRequest } = useApp();
  const balances = getAccountBalances();

  const [accountType, setAccountType] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [chequeNo, setChequeNo] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChequeNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setChequeNo(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!chequeNo || chequeNo.length !== 6) {
      newErrors.chequeNo = 'Cheque number must be exactly 6 digits';
    }

    if (!payeeName.trim()) {
      newErrors.payeeName = 'Payee name is required';
    }

    const amtNum = Number(amount);
    if (!amount || isNaN(amtNum) || amtNum <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amtNum < 50000) {
      newErrors.amount = 'Positive Pay registration is only mandatory/permitted for high-value cheques above ₹50,000.';
    }

    if (!chequeDate) {
      newErrors.chequeDate = 'Cheque date is required';
    } else {
      const selectedDate = new Date(chequeDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const threeMonthsHence = new Date();
      threeMonthsHence.setMonth(threeMonthsHence.getMonth() + 3);

      if (selectedDate < threeMonthsAgo) {
        newErrors.chequeDate = 'Cheques older than 3 months are stale/expired';
      } else if (selectedDate > threeMonthsHence) {
        newErrors.chequeDate = 'Cheque date cannot be more than 3 months in the future';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Generate unique positive pay reference
      const randomRef = `PPRN-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceNumber(randomRef);
      addServiceRequest(`Positive Pay (${chequeNo})`, 'Completed');
      setStep(2);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Positive Pay Cheque Verification</h2>
        <p className="text-xs text-slate-500 mt-1">Register high-value cheques above ₹50,000 in accordance with security policies.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 flex gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[10px]">
              <span className="font-bold block uppercase tracking-wider mb-0.5">RBI Positive Pay Mandate</span>
              <span>Registering cheque credentials ensures verification checking before commercial clearing, preventing fraudulent draws.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Debit Account</label>
              <select
                value={accountType}
                onChange={e => setAccountType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              >
                <option value="stable">Stable Growth (Balance: {formatCurrency(balances.stable, false)})</option>
                <option value="crunch">Cash Crunch (Balance: {formatCurrency(balances.crunch, false)})</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">6-Digit Cheque Number</label>
              <input
                type="text"
                placeholder="e.g. 123456"
                maxLength={6}
                value={chequeNo}
                onChange={handleChequeNoChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition text-center font-mono"
              />
              {errors.chequeNo && <p className="text-[10px] text-rose-500 mt-0.5">{errors.chequeNo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Payee Name</label>
              <input
                type="text"
                placeholder="Enter payee full name"
                value={payeeName}
                onChange={e => setPayeeName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.payeeName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.payeeName}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Cheque Amount (₹)</label>
              <input
                type="text"
                placeholder="Cheque Amount (Must be > ₹50,000)"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.amount && <p className="text-[10px] text-rose-500 mt-0.5 leading-normal">{errors.amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Cheque Date</label>
              <input
                type="date"
                value={chequeDate}
                onChange={e => setChequeDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.chequeDate && <p className="text-[10px] text-rose-500 mt-0.5 leading-normal">{errors.chequeDate}</p>}
            </div>

            <div className="border border-dashed border-slate-200 hover:border-icici-blue-light bg-slate-50 hover:bg-white rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition select-none">
              <input
                type="file"
                id="cheque-image-file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <Upload className="w-4 h-4 text-slate-400" />
              <label htmlFor="cheque-image-file" className="cursor-pointer text-[10px] font-bold text-slate-600 block truncate max-w-[150px]">
                {fileName ? fileName : 'Upload Cheque Slip (Opt)'}
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
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
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Register Cheque'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Cheque Registered Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Positive Pay verification credentials are submitted. Your cheque is safe for clearance validation.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-xs mx-auto text-xs font-bold font-mono text-slate-700 tracking-tight text-center">
            📄 REFERENCE NO: {referenceNumber}
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
  );
};
