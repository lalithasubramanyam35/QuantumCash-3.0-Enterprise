import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { RefreshCw, Send, Zap, Users, CheckCircle2, Plus } from 'lucide-react';
import type { Payee } from '../../types';

export const PaymentTransferView: React.FC = () => {
  const { getAccountBalances, eyeHidden, activeAccountKey, addTransaction } = useApp();
  const balances = getAccountBalances();

  const [activeSubTab, setActiveSubTab] = useState<'TRANSFER' | 'UPI' | 'BBPS' | 'PAYEES'>('TRANSFER');

  // Transfer Form State
  const [selectedAccount, setSelectedAccount] = useState<'stable' | 'crunch'>(activeAccountKey);
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'OWN'>('IMPS');
  const [selectedPayeeId, setSelectedPayeeId] = useState('p1');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRemarks, setTransferRemarks] = useState('');
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiSuccess, setUpiSuccess] = useState<string | null>(null);

  // Payees Directory State
  const [payees, setPayees] = useState<Payee[]>([
    { id: 'p1', name: 'Lalitha Subramanyam', accountNo: '065801928301', ifsc: 'ICIC0000109', bankName: 'ICICI Bank Hitech City', dailyLimit: 100000 },
    { id: 'p2', name: 'Vivish Tech Solutions', accountNo: '482019283019', ifsc: 'HDFC0000482', bankName: 'HDFC Bank Gachibowli', dailyLimit: 500000 },
    { id: 'p3', name: 'Srinivas Gandikota', accountNo: '882019283711', ifsc: 'SBIN0008920', bankName: 'SBI Jubilee Hills', dailyLimit: 200000 }
  ]);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('ICIC0000109');
  const [payeeAddedNotice, setPayeeAddedNotice] = useState<string | null>(null);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(transferAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }
    const currentBal = selectedAccount === 'stable' ? balances.stable : balances.crunch;
    if (numAmt > currentBal) {
      alert('Insufficient funds in selected account.');
      return;
    }

    const payee = payees.find(p => p.id === selectedPayeeId);
    const payeeName = payee ? payee.name : 'Beneficiary';
    const utr = `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    addTransaction('OUTFLOW', 'Transfer', numAmt, `${transferMode} Transfer to ${payeeName}`);
    setTransferSuccess(`Transfer of ${formatCurrency(numAmt, false)} successful! UTR: ${utr}`);
    setTransferAmount('');
    setTimeout(() => setTransferSuccess(null), 4000);
  };

  const handleExecuteUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(upiAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const utr = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    addTransaction('OUTFLOW', 'UPI', numAmt, `UPI Payment to ${upiId}`);
    setUpiSuccess(`UPI Transfer of ${formatCurrency(numAmt, false)} to ${upiId} complete! Ref: ${utr}`);
    setUpiAmount('');
    setTimeout(() => setUpiSuccess(null), 4000);
  };

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName || !newPayeeAcc) {
      alert('Please fill in beneficiary name and account number.');
      return;
    }

    const newP: Payee = {
      id: `p-${Date.now()}`,
      name: newPayeeName,
      accountNo: newPayeeAcc,
      ifsc: newPayeeIfsc,
      bankName: 'ICICI Bank India',
      dailyLimit: 200000
    };

    setPayees(prev => [newP, ...prev]);
    setPayeeAddedNotice(`Beneficiary ${newPayeeName} added successfully!`);
    setNewPayeeName('');
    setNewPayeeAcc('');
    setTimeout(() => setPayeeAddedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 select-text">
      
      {/* Quick Stats Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-icici-orange tracking-wider">PAYMENTS & TRANSFERS HUB</span>
            <h2 className="text-xl font-extrabold text-slate-800">Funds Transfer & Bill Payment Center</h2>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            Available Total: {formatCurrency(balances.total, eyeHidden)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Stable Growth Account</span>
              <span className="text-sm font-extrabold text-slate-800">{formatCurrency(balances.stable, eyeHidden)}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">QC-SG-882190</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Cash Crunch Account</span>
              <span className="text-sm font-extrabold text-slate-800">{formatCurrency(balances.crunch, eyeHidden)}</span>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">QC-CC-401928</span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interface Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-6">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 gap-1 overflow-x-auto">
          {[
            { id: 'TRANSFER', label: 'Transfer Money', icon: Send },
            { id: 'UPI', label: 'UPI Quick Pay', icon: RefreshCw },
            { id: 'BBPS', label: 'Bill Payments (BBPS)', icon: Zap },
            { id: 'PAYEES', label: 'Manage Payees', icon: Users }
          ].map(t => {
            const Icon = t.icon;
            const isSelected = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex-1 min-w-[130px] py-2 px-4 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                  isSelected ? 'bg-[#003366] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TRANSFER MONEY */}
        {activeSubTab === 'TRANSFER' && (
          <form onSubmit={handleExecuteTransfer} className="space-y-4 max-w-2xl animate-fade-in">
            {transferSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{transferSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Debiting Account</label>
                <select
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="stable">Stable Growth ({formatCurrency(balances.stable, eyeHidden)})</option>
                  <option value="crunch">Cash Crunch ({formatCurrency(balances.crunch, eyeHidden)})</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Payment Mode</label>
                <select
                  value={transferMode}
                  onChange={e => setTransferMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="IMPS">IMPS (Instant 24x7)</option>
                  <option value="NEFT">NEFT (Batch Transfer)</option>
                  <option value="RTGS">RTGS (Large Value &gt; ₹2 Lakhs)</option>
                  <option value="OWN">Own Account Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Select Beneficiary</label>
              <select
                value={selectedPayeeId}
                onChange={e => setSelectedPayeeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
              >
                {payees.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - Acc: •••• {p.accountNo.slice(-4)} ({p.bankName})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Amount (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 15000"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none text-[#003366]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Remarks / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Vendor Invoice Payment"
                  value={transferRemarks}
                  onChange={e => setTransferRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#003366] hover:bg-icici-blue-light text-white text-xs font-black rounded-xl shadow transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Transfer Now
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: UPI QUICK PAY */}
        {activeSubTab === 'UPI' && (
          <form onSubmit={handleExecuteUpi} className="space-y-4 max-w-2xl animate-fade-in">
            {upiSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{upiSuccess}</span>
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">UPI VPA Handle or Mobile No</label>
              <input
                type="text"
                placeholder="e.g. lalitha@okicici or swiggy@paytm"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Quick Contact Chips */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Frequent Merchant Contacts:</span>
              <div className="flex flex-wrap gap-2">
                {['swiggy@paytm', 'zomato@icici', 'airtel@axisb', 'uber@okaxis'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setUpiId(chip)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-mono text-slate-700 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Transfer Amount (₹)</label>
              <input
                type="text"
                placeholder="e.g. 2500"
                value={upiAmount}
                onChange={e => setUpiAmount(e.target.value.replace(/[^0-9]/g, ''))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none text-[#003366]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition"
            >
              Pay via UPI
            </button>
          </form>
        )}

        {/* TAB 3: BILL PAYMENTS (BBPS) */}
        {activeSubTab === 'BBPS' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-extrabold text-slate-800 text-sm">Bharat Bill Payment System (BBPS) Operators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Electricity Bill', provider: 'TSSPDCL Telangana', amount: 2840 },
                { name: 'Water Board', provider: 'HMWS&SB Hyderabad', amount: 850 },
                { name: 'Mobile Postpaid', provider: 'Airtel India', amount: 999 },
                { name: 'Broadband Fiber', provider: 'ACT Fibernet', amount: 1250 }
              ].map(b => (
                <div key={b.name} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">DUE</span>
                  <h4 className="font-bold text-slate-800 text-xs">{b.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{b.provider}</p>
                  <p className="text-base font-black text-slate-900">{formatCurrency(b.amount, eyeHidden)}</p>
                  <button
                    onClick={() => {
                      addTransaction('OUTFLOW', 'Utility', b.amount, `BBPS Bill: ${b.name}`);
                      alert(`${b.name} of ${formatCurrency(b.amount, false)} paid successfully!`);
                    }}
                    className="w-full py-1.5 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-icici-blue-light transition"
                  >
                    Pay Bill Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE PAYEES */}
        {activeSubTab === 'PAYEES' && (
          <div className="space-y-6 animate-fade-in">
            {payeeAddedNotice && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{payeeAddedNotice}</span>
              </div>
            )}

            {/* Add Payee Form */}
            <form onSubmit={handleAddPayee} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Plus className="w-4 h-4 text-icici-orange" /> Add New Beneficiary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  value={newPayeeName}
                  onChange={e => setNewPayeeName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={newPayeeAcc}
                  onChange={e => setNewPayeeAcc(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="IFSC Code (e.g. ICIC0000109)"
                  value={newPayeeIfsc}
                  onChange={e => setNewPayeeIfsc(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
              >
                Save Beneficiary
              </button>
            </form>

            {/* Payee Table Directory */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <th className="py-2.5 px-4">Payee Name</th>
                    <th className="py-2.5 px-4">Account Number</th>
                    <th className="py-2.5 px-4">IFSC / Bank</th>
                    <th className="py-2.5 px-4 text-right">Daily Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payees.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-4 font-bold text-slate-800">{p.name}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">•••• {p.accountNo.slice(-4)}</td>
                      <td className="py-2.5 px-4 text-slate-500">{p.ifsc} ({p.bankName})</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-800">{formatCurrency(p.dailyLimit, eyeHidden)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
