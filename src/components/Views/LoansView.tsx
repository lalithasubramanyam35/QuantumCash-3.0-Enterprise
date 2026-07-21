import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Landmark, Calendar, Download, CheckCircle2, FileText, Percent } from 'lucide-react';
import type { LoanAccount } from '../../types';

export const LoansView: React.FC = () => {
  const { eyeHidden, addTransaction, getAccountBalances } = useApp();
  const balances = getAccountBalances();

  const [loans, setLoans] = useState<LoanAccount[]>([
    {
      id: 'l1',
      accountNo: 'QC-LN-771029',
      loanType: 'Home Loan',
      outstandingAmount: 2250000,
      interestRate: 8.5,
      monthlyEmi: 18500,
      nextDueDate: '10 AUG 2026',
      tenureMonthsRemaining: 180
    },
    {
      id: 'l2',
      accountNo: 'QC-LN-330192',
      loanType: 'Personal Loan',
      outstandingAmount: 120000,
      interestRate: 11.2,
      monthlyEmi: 7800,
      nextDueDate: '05 AUG 2026',
      tenureMonthsRemaining: 18
    },
    {
      id: 'l3',
      accountNo: 'QC-LN-884011',
      loanType: 'Car Loan',
      outstandingAmount: 450000,
      interestRate: 9.0,
      monthlyEmi: 9200,
      nextDueDate: '15 AUG 2026',
      tenureMonthsRemaining: 48
    }
  ]);

  const [emiNotice, setEmiNotice] = useState<string | null>(null);

  const handlePayEmi = (loan: LoanAccount) => {
    if (balances.stable < loan.monthlyEmi) {
      alert(`Insufficient balance in Stable Growth account to pay EMI of ${formatCurrency(loan.monthlyEmi, false)}.`);
      return;
    }

    addTransaction('OUTFLOW', 'Transfer', loan.monthlyEmi, `Loan EMI Auto-Debit: ${loan.loanType} (${loan.accountNo})`);
    setLoans(prev =>
      prev.map(l => (l.id === loan.id ? { ...l, outstandingAmount: Math.max(0, l.outstandingAmount - loan.monthlyEmi) } : l))
    );
    setEmiNotice(`EMI payment of ${formatCurrency(loan.monthlyEmi, false)} for ${loan.loanType} processed successfully!`);
    setTimeout(() => setEmiNotice(null), 4000);
  };

  const handleDownloadDoc = (docType: string, accountNo: string) => {
    alert(`Generating & downloading ${docType} for Loan Account ${accountNo}... Download complete!`);
  };

  const totalOutstanding = loans.reduce((acc, l) => acc + l.outstandingAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 select-text">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-icici-orange tracking-wider">LOANS & BORROWINGS HUB</span>
          <h2 className="text-xl font-extrabold text-slate-800">Active Borrowings & EMI Center</h2>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-right">
          <span className="text-[10px] font-bold text-rose-700 uppercase block">Total Active Liability</span>
          <span className="text-lg font-black text-rose-950">{formatCurrency(totalOutstanding, eyeHidden)}</span>
        </div>
      </div>

      {emiNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{emiNotice}</span>
        </div>
      )}

      {/* Active Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loans.map(loan => (
          <div key={loan.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#003366] text-white">
                  {loan.loanType}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{loan.accountNo}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Balance</span>
                <p className="text-2xl font-black text-slate-900">{formatCurrency(loan.outstandingAmount, eyeHidden)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Interest Rate</span>
                  <span className="font-bold text-slate-700 flex items-center gap-0.5"><Percent className="w-3 h-3 text-amber-600" /> {loan.interestRate}% p.a.</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Monthly EMI</span>
                  <span className="font-extrabold text-[#003366]">{formatCurrency(loan.monthlyEmi, eyeHidden)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-icici-orange" /> Next Due: {loan.nextDueDate}</span>
                <span className="font-bold">{loan.tenureMonthsRemaining} mos left</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => handlePayEmi(loan)}
                className="w-full py-2 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                Pay EMI Now ({formatCurrency(loan.monthlyEmi, false)})
              </button>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  onClick={() => handleDownloadDoc('Amortization Schedule', loan.accountNo)}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3 text-slate-500" /> Schedule
                </button>
                <button
                  onClick={() => handleDownloadDoc('Tax Interest Certificate', loan.accountNo)}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3 text-slate-500" /> Tax Cert
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Loan Services & Foreclosure Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#003366]" /> Borrower Services & Tax Exemption Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Section 24 Interest Certificate</h4>
            <p className="text-[10px] text-slate-500">Download IT Return deduction certificate for Home Loan interest paid.</p>
            <button
              onClick={() => handleDownloadDoc('IT Return Certificate', 'QC-LN-771029')}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
            >
              Download Certificate
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Loan Foreclosure Request</h4>
            <p className="text-[10px] text-slate-500">Preclose personal or car loan early with 0% foreclosure penalties.</p>
            <button
              onClick={() => alert('Foreclosure application initiated! Our underwriter team will contact you within 24 hours.')}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
            >
              Apply Foreclosure
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Top-Up Loan Eligibility</h4>
            <p className="text-[10px] text-slate-500">Instant pre-approved top-up loan up to ₹5,00,000 at 8.5% p.a.</p>
            <button
              onClick={() => alert('Pre-approved Top-Up Loan offer of ₹5,00,000 unlocked!')}
              className="px-3 py-1.5 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-icici-blue-light transition"
            >
              Claim Top-Up Loan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
