import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { 
  Plus, 
  FileText, 
  Copy, 
  Send, 
  X, 
  Check,
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { Transaction } from '../types';
import { ServiceRequestModalWrapper } from './ServiceRequests/ServiceRequestModalWrapper';

export const AccountPredictiveDetail: React.FC = () => {
  const {
    activeAccountKey,
    transactions,
    buckets,
    addTransaction,
    createBucket,
    moveTransaction,
    getForecast,
    getAccountBalances,
    eyeHidden
  } = useApp();

  const [forecast, setForecast] = useState(getForecast());
  const balances = getAccountBalances();
  const currentBalance = activeAccountKey === 'stable' ? balances.stable : balances.crunch;

  // Refresh forecast when transactions or active account changes
  useEffect(() => {
    setForecast(getForecast());
  }, [transactions, activeAccountKey]);

  // Modal States
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
  const [showMoveTxnModal, setShowMoveTxnModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [openRequestType, setOpenRequestType] = useState<string | null>(null);
  const [showBucketDetailsModal, setShowBucketDetailsModal] = useState(false);

  // Forms Input States
  const [newTxnType, setNewTxnType] = useState<'INFLOW' | 'OUTFLOW'>('OUTFLOW');
  const [newTxnCategory, setNewTxnCategory] = useState('');
  const [newTxnAmount, setNewTxnAmount] = useState('');
  const [newTxnDesc, setNewTxnDesc] = useState('');
  const [txnError, setTxnError] = useState('');

  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketType, setNewBucketType] = useState<'saving' | 'spending'>('spending');
  const [newBucketAllocated, setNewBucketAllocated] = useState('');
  const [newBucketGoal, setNewBucketGoal] = useState('');
  const [bucketError, setBucketError] = useState('');

  const [selectedTxnId, setSelectedTxnId] = useState('');
  const [moveCategory, setMoveCategory] = useState('');
  const [moveError, setMoveError] = useState('');

  const [selectedBucketName, setSelectedBucketName] = useState('');
  const [selectedBucketTxns, setSelectedBucketTxns] = useState<Transaction[]>([]);

  // Collapsible Recent Transactions
  const [txnsCollapsed, setTxnsCollapsed] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chatbot States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: "Hello! I am your QuantumCash Virtual Treasurer. Ask me anything about your predictive cash flows, working capital status, or dynamic loan justifications." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Chatbot scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Seeding default category option
  useEffect(() => {
    if (buckets.length > 0 && !newTxnCategory) {
      setNewTxnCategory(buckets[0].name);
    }
  }, [buckets]);

  // Handle Quick Action Clicks
  const handleQuickAction = (action: string) => {
    if (action === 'Pay Bills' || action === 'Send Money') {
      setNewTxnType('OUTFLOW');
      setShowAddTxnModal(true);
    } else {
      showToast(`${action} report has been generated in your audit logs.`);
    }
  };

  // Add Transaction Submit
  const handleAddTxnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTxnError('');

    const parsedAmount = parseFloat(newTxnAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setTxnError('Please enter a valid positive number.');
      return;
    }

    const result = addTransaction(newTxnType, newTxnCategory || 'Overhead', parsedAmount, newTxnDesc);
    if (result.success) {
      setShowAddTxnModal(false);
      setNewTxnAmount('');
      setNewTxnDesc('');
      showToast('Transaction added successfully!');
    } else {
      setTxnError(result.error || 'Failed to record transaction.');
    }
  };

  // Create Bucket Submit
  const handleCreateBucketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBucketError('');

    const parsedAllocated = parseFloat(newBucketAllocated);
    if (isNaN(parsedAllocated) || parsedAllocated <= 0) {
      setBucketError('Please enter a valid allocated amount.');
      return;
    }

    const result = createBucket(newBucketName, newBucketType, parsedAllocated, newBucketGoal);
    if (result.success) {
      setShowAddBucketModal(false);
      setNewBucketName('');
      setNewBucketAllocated('');
      setNewBucketGoal('');
      showToast(`Bucket '${newBucketName}' created successfully!`);
    } else {
      setBucketError(result.error || 'Failed to create bucket.');
    }
  };

  // Open Bucket Details (Move transaction capability here)
  const handleOpenBucketDetails = (bucketName: string) => {
    setSelectedBucketName(bucketName);
    const bucketTxns = transactions.filter(t => t.category.toLowerCase() === bucketName.toLowerCase());
    setSelectedBucketTxns(bucketTxns);
    setSelectedBucketName(bucketName);
    setShowBucketDetailsModal(true);
  };

  // Open Move Transaction Modal
  const handleOpenMoveTxn = (txnId: string, currentCategory: string) => {
    setSelectedTxnId(txnId);
    setMoveCategory(currentCategory);
    setMoveError('');
    setShowMoveTxnModal(true);
  };

  // Submit Move Transaction
  const handleMoveTxnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMoveError('');

    const result = moveTransaction(selectedTxnId, moveCategory);
    if (result.success) {
      setShowMoveTxnModal(false);
      setShowBucketDetailsModal(false); // Close details modal to refresh
      showToast('Transaction reclassified successfully!');
    } else {
      setMoveError(result.error || 'Failed to move transaction.');
    }
  };

  // Copy loan request text
  const handleCopyLetter = () => {
    navigator.clipboard.writeText(forecast.loanLetter);
    setCopiedText(true);
    showToast('Proposal text copied to clipboard!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Send request notification
  const handleSendLetter = () => {
    showToast('Proposal sent successfully to underwriting partner.');
    setShowLetterModal(false);
  };

  // Chatbot logic (Interactive Offline AI Mode)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate Network lag
    setTimeout(() => {
      setIsTyping(false);
      let reply = "";
      const lower = query.toLowerCase();

      // Rule-based interactive responses
      if (lower.includes('crunch') || lower.includes('shortfall') || lower.includes('dip')) {
        if (activeAccountKey === 'crunch') {
          reply = `My calculations show a predicted liquidity shortfall of ₹${(1897.56 * 83).toLocaleString('en-IN', {maximumFractionDigits: 2})} on 2026-07-17. This is primarily caused by bi-weekly employee payroll (₹${(2500 * 83).toLocaleString('en-IN', {maximumFractionDigits:2})}) coinciding with supplier restocking. I recommend reviewing the system-generated Micro-Loan request.`;
        } else {
          reply = "Your Stable Growth Account shows no cash crunches! Operating liquidity remains optimal over the 7-day projection horizon.";
        }
      } else if (lower.includes('loan') || lower.includes('request') || lower.includes('letter')) {
        reply = `I have drafted a dynamic request letter based on your current account status. For the ${activeAccountKey === 'crunch' ? 'Cash Crunch' : 'Stable Growth'} account, it highlights an allocation proposal for ${activeAccountKey === 'crunch' ? '₹2,49,000 working capital' : 'scaling expansion reserves'}. You can download it directly from the forecast panel.`;
      } else if (lower.includes('balance') || lower.includes('rupees') || lower.includes('portfolio')) {
        reply = `Your active account balance is ${formatCurrency(currentBalance, false)}. The combined portfolio balance of both stable and crunch accounts is ${formatCurrency(balances.total, false)}.`;
      } else if (lower.includes('bucket') || lower.includes('budget') || lower.includes('suppliers')) {
        reply = `You have ${buckets.length} active budgeting buckets. You can click on any bucket to inspect transactions, add funds, or reclassify items. Reclassifying an expense automatically updates operational runway metrics.`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('help')) {
        reply = "I can help you audit transactions, review the 7-day cash flow forecast table, analyze upcoming supplier payments, or prepare credit justification letters. Try asking: 'When will I run out of cash?' or 'What is my current balance?'";
      } else {
        reply = "Understood. As your Virtual Treasurer, I monitor all cash cycles. Daily operating overhead currently averages ₹" + (activeAccountKey === 'crunch' ? (88.11 * 83).toFixed(2) : (90.81 * 83).toFixed(2)) + "/day. Please let me know if you would like me to draft a custom ledger report.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700/50 text-white rounded-xl shadow-2xl px-5 py-3 text-xs font-semibold flex items-center gap-2 uppercase tracking-wider animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Info and Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-icici-blue-dark flex items-center gap-2">
            {activeAccountKey === 'stable' ? 'Stable Growth Account' : 'Cash Crunch Account'}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
              activeAccountKey === 'stable' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
            }`}>
              {activeAccountKey === 'stable' ? 'Stable Scenario' : 'Crunch Scenario'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Account No: ••••••••
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-2">
          {['Send Money', 'View Statement', 'Pay Bills'].map(act => (
            <button
              key={act}
              onClick={() => handleQuickAction(act)}
              className="bg-white border border-slate-200 hover:border-icici-blue-light hover:text-icici-blue-light text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Banker Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Debt Service Coverage (DSCR)</span>
          <div className="flex justify-between items-end pt-1">
            <span className="text-2xl font-black text-slate-800">
              {activeAccountKey === 'stable' ? '1.84x' : '0.72x'}
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
              activeAccountKey === 'stable' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {activeAccountKey === 'stable' ? 'Healthy' : 'Distressed'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Runway Duration</span>
          <div className="flex justify-between items-end pt-1">
            <span className="text-2xl font-black text-slate-800">
              {activeAccountKey === 'stable' ? '90+ Days' : '3 Days'}
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
              activeAccountKey === 'stable' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {activeAccountKey === 'stable' ? 'Self-Sustaining' : 'Critical Limit'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Underwriting Risk Status</span>
          <div className="flex justify-between items-end pt-1">
            <span className="text-2xl font-black text-slate-800">
              {activeAccountKey === 'stable' ? 'LOW RISK' : 'HIGH RISK'}
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
              activeAccountKey === 'stable' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white animate-pulse'
            }`}>
              {activeAccountKey === 'stable' ? 'Pre-Approved' : 'Rejected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Table & Warning Banner on Left, Buckets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Forecasting Projections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">7-Day Forward Projections</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time scheduling and flow modeling</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Model Analysis Date</span>
                <span className="text-xs font-bold text-slate-700">{forecast.analysisDate}</span>
              </div>
            </div>

            {/* Projection Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Day</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Start Bal</th>
                    <th className="py-3 px-2 text-emerald-600">Inflows</th>
                    <th className="py-3 px-2 text-rose-600">Outflows</th>
                    <th className="py-3 px-2">End Bal</th>
                    <th className="py-3 px-2">Scheduled Events</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {forecast.projection.map(row => {
                    const isEndNeg = row.end < 0;
                    const isStartNeg = row.start < 0;
                    return (
                      <tr key={row.day} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-2 font-bold text-slate-900">{row.day}</td>
                        <td className="py-3 px-2 text-slate-400">{row.date}</td>
                        <td className={`py-3 px-2 ${isStartNeg ? 'text-rose-500 font-bold' : ''}`}>
                          {formatCurrency(row.start, eyeHidden)}
                        </td>
                        <td className="py-3 px-2 text-emerald-600 font-bold">
                          +{formatCurrency(row.in, eyeHidden)}
                        </td>
                        <td className="py-3 px-2 text-rose-600">
                          -{formatCurrency(row.out, eyeHidden)}
                        </td>
                        <td className={`py-3 px-2 font-bold ${isEndNeg ? 'text-red-500' : 'text-slate-800'}`}>
                          {formatCurrency(row.end, eyeHidden)}
                        </td>
                        <td className="py-3 px-2">
                          {row.events !== 'None' ? (
                            <span className="bg-icici-blue-dark/5 text-icici-blue-dark border border-icici-blue-dark/10 px-2 py-0.5 rounded text-[10px] font-bold">
                              {row.events}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Warning Card Banners */}
            {forecast.warning || activeAccountKey === 'crunch' ? (
              <div className="bg-rose-50/80 border-l-4 border-rose-600 p-5 rounded-r-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-rose-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                    ALERT: CRITICAL LIQUIDITY DEFICIT PREDICTED
                  </h4>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                    TREASURY STANDING: DEFICIT WARNING
                  </span>
                </div>
                <div className="text-xs text-rose-800 space-y-1 font-medium">
                  <p>Predicted balance will dip into deficit on: <strong>{forecast.warning?.date || '2026-07-17'}</strong></p>
                  <p>Peak estimated shortfall: <strong>{formatCurrency(forecast.warning?.shortfall || 157497.48, eyeHidden)}</strong></p>
                  <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">Your Virtual Treasurer recommends immediate working capital credit or liquidity injection from Stable Growth Account.</p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      addTransaction('OUTFLOW', 'Liquidity Transfer', 250000, 'Liquidity Injection to Cash Crunch Account', 'stable');
                      addTransaction('INFLOW', 'Liquidity Transfer', 250000, 'Liquidity Injection from Stable Growth Account', 'crunch');
                      showToast('₹2,50,000 Liquidity Injected from Stable Growth Account!');
                    }}
                    className="bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                  >
                    ⚡ Trigger Liquidity Injection from Stable Growth Account
                  </button>
                  <button
                    onClick={() => setShowLetterModal(true)}
                    className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> Review Dynamic Loan Request Letter
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/80 border-l-4 border-emerald-500 p-5 rounded-r-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-emerald-900 font-extrabold text-xs uppercase tracking-wider">Treasury Standing: Optimal</h4>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    TREASURY STANDING: OPTIMAL
                  </span>
                </div>
                <div className="text-xs text-emerald-800 space-y-1 font-medium">
                  <p>Your forward cash flow projections demonstrate a healthy, self-sustaining operating buffer.</p>
                  <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">I have compiled a dynamic strategic scaling report and expansion proposal for credit review.</p>
                </div>
                <button
                  onClick={() => setShowLetterModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Review Treasury Report & Scaling Letter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Budgeting Buckets & Limits */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Smart Wallet Buckets</h3>
              <button
                onClick={() => setShowAddBucketModal(true)}
                className="text-icici-orange hover:text-icici-orange-hover p-1 rounded-lg hover:bg-slate-50 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {buckets.map(b => {
                const isSaving = b.type === 'saving';
                return (
                  <div 
                    key={b.id}
                    onClick={() => handleOpenBucketDetails(b.name)}
                    className="group bg-slate-50/50 hover:bg-slate-100/50 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{b.name}</span>
                        <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          isSaving ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {isSaving ? 'Saving' : 'Spending'}
                        </span>
                      </div>
                      
                      <div className="text-right text-xs">
                        {isSaving ? (
                          <>
                            <span className="font-bold text-slate-800">
                              {formatCurrency(b.currentAmount || 0, eyeHidden)}
                            </span>
                            <span className="text-slate-400"> / {formatCurrency(b.allocated, eyeHidden)} goal</span>
                          </>
                        ) : (
                          <>
                            <span className={`font-bold ${b.isAlert ? 'text-red-500' : 'text-slate-800'}`}>
                              {formatCurrency(b.remaining || 0, eyeHidden)} left
                            </span>
                            <span className="text-slate-400"> / {formatCurrency(b.allocated + (b.saved || 0), eyeHidden)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isSaving 
                            ? (b.percentage && b.percentage >= 100 ? 'bg-[#059669]' : 'bg-[#003366]') 
                            : (b.percentage && b.percentage >= 100 ? 'bg-[#10b981]' : (b.percentage && b.percentage > 70 ? 'bg-[#f59e0b]' : 'bg-[#f26522]'))
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, b.percentage || 0))}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>{b.goal}</span>
                      {isSaving ? (
                        <span>{formatCurrency(b.remaining || 0, eyeHidden)} left to save</span>
                      ) : (
                        <span>{formatCurrency(b.spent || 0, eyeHidden)} spent</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowAddTxnModal(true)}
              className="w-full bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-icici-blue-dark/10"
            >
              <Plus className="w-4 h-4" /> Add Transaction / Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Service Requests Grid Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100">Service Requests</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Track Service Requests', 'Address Change', 'Generate Card PIN', 
            'Manage Debit Card Limit', 'Update Email ID', 'View/Update Nominee', 
            'Upgrade Debit Card', 'Positive Pay'
          ].map(req => (
            <button
              key={req}
              onClick={() => setOpenRequestType(req)}
              className="bg-slate-50/50 hover:bg-icici-orange-light/30 border border-slate-100 hover:border-icici-orange/30 p-4 rounded-xl text-left text-xs font-semibold text-slate-700 transition flex flex-col justify-between h-24 hover:-translate-y-0.5 transform"
            >
              <span className="leading-snug">{req}</span>
              <span className="text-icici-orange text-[10px] font-bold group-hover:underline">Proceed →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Recent Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div 
          onClick={() => setTxnsCollapsed(!txnsCollapsed)}
          className="flex justify-between items-center pb-3 border-b border-slate-100 cursor-pointer hover:text-icici-blue-light transition"
        >
          <div>
            <h3 className="font-bold text-slate-800 text-base">Recent Transactions Ledger</h3>
            <p className="text-xs text-slate-400 mt-0.5">Interactive ledger sorting and tracking</p>
          </div>
          {txnsCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </div>

        {!txnsCollapsed && (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {transactions.slice().reverse().map(t => {
              const isOutflow = t.type === 'OUTFLOW';
              return (
                <div key={t.transaction_id} className="py-3 flex justify-between items-center text-xs hover:bg-slate-50 px-2 rounded-lg transition">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{t.description}</p>
                    <div className="flex gap-2 text-[10px] text-slate-400">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span className="font-mono">{t.transaction_id}</span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-1 rounded">{t.category}</span>
                    </div>
                  </div>
                  <span className={`font-bold ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isOutflow ? '-' : '+'}{formatCurrency(Math.abs(t.amount), eyeHidden)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Dynamic Proposal Letter View */}
      {showLetterModal && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-fade-in-up flex flex-col max-h-[85svh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Dynamic Credit Justification Letter</h3>
              <button onClick={() => setShowLetterModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
              {forecast.loanLetter}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 shrink-0">
              <button
                onClick={handleCopyLetter}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedText ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={handleSendLetter}
                className="bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold px-5 py-2.5 rounded-lg transition flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send Request to Underwriter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Transaction Form */}
      {showAddTxnModal && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTxnSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Add Ledger Transaction</h3>
              <button type="button" onClick={() => setShowAddTxnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {txnError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4" /> <span>{txnError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewTxnType('OUTFLOW')}
                  className={`py-2 rounded-lg font-bold border transition ${
                    newTxnType === 'OUTFLOW' 
                      ? 'bg-rose-50 text-rose-700 border-rose-300' 
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  Expense / Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setNewTxnType('INFLOW')}
                  className={`py-2 rounded-lg font-bold border transition ${
                    newTxnType === 'INFLOW' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  Income / Inflow
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Target Category / Budget Bucket</label>
                <select
                  value={newTxnCategory}
                  onChange={(e) => setNewTxnCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                >
                  <option value="Sales">Sales (Inflow)</option>
                  <option value="Overhead">General Overhead</option>
                  {buckets.map(b => (
                    <option key={b.id} value={b.name}>{b.name} ({b.type === 'saving' ? 'Savings Bucket' : 'Budget Bucket'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Transaction Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newTxnAmount}
                  onChange={(e) => setNewTxnAmount(e.target.value)}
                  placeholder="e.g., 25000"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newTxnDesc}
                  onChange={(e) => setNewTxnDesc(e.target.value)}
                  placeholder="e.g., Monthly inventory procurement draft"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddTxnModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
              >
                Post Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Create Bucket Form */}
      {showAddBucketModal && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBucketSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Create Budgeting Bucket</h3>
              <button type="button" onClick={() => setShowAddBucketModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bucketError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4" /> <span>{bucketError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Bucket Name</label>
                <input
                  type="text"
                  required
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="e.g., Marketing, Tax Reserves"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Bucket Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewBucketType('spending')}
                    className={`py-2 rounded-lg font-bold border transition ${
                      newBucketType === 'spending' 
                        ? 'bg-orange-50 text-orange-700 border-orange-300' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    Spending (Budget Target)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBucketType('saving')}
                    className={`py-2 rounded-lg font-bold border transition ${
                      newBucketType === 'saving' 
                        ? 'bg-blue-50 text-blue-700 border-blue-300' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    Saving (Savings Goal)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">
                  {newBucketType === 'saving' ? 'Savings Goal (₹)' : 'Allocated Budget Limit (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={newBucketAllocated}
                  onChange={(e) => setNewBucketAllocated(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">
                  {newBucketType === 'saving' ? 'What are you saving for?' : 'Goal / Memo Note'}
                </label>
                <input
                  type="text"
                  required
                  value={newBucketGoal}
                  onChange={(e) => setNewBucketGoal(e.target.value)}
                  placeholder="e.g., Office scaling project buffer"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddBucketModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
              >
                Create Bucket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Bucket Details (Lists its transactions and allows Reclassification Move) */}
      {showBucketDetailsModal && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in-up flex flex-col max-h-[80svh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">{selectedBucketName} Transactions</h3>
              <button onClick={() => setShowBucketDetailsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedBucketTxns.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No transactions recorded in this bucket yet.</div>
              ) : (
                selectedBucketTxns.map(t => {
                  const isOut = t.type === 'OUTFLOW';
                  return (
                    <div key={t.transaction_id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:border-slate-200 transition group">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-xs block">{t.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.date} • {t.transaction_id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-xs ${isOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isOut ? '-' : '+'}{formatCurrency(Math.abs(t.amount), eyeHidden)}
                        </span>
                        <button
                          onClick={() => handleOpenMoveTxn(t.transaction_id, t.category)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-900 hover:bg-icici-blue-dark text-white px-2 py-1 rounded transition font-semibold"
                        >
                          Move
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowBucketDetailsModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Move Transaction (Reclassify Category) */}
      {showMoveTxnModal && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-all duration-300 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleMoveTxnSubmit} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Reclassify Category</h3>
              <button type="button" onClick={() => setShowMoveTxnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {moveError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4" /> <span>{moveError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 leading-normal">
                Moving this transaction updates the balances of both the source and destination buckets instantly.
              </p>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Target Category / Bucket</label>
                <select
                  value={moveCategory}
                  onChange={(e) => setMoveCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:outline-none"
                >
                  <option value="Sales">Sales</option>
                  <option value="Overhead">Overhead</option>
                  {buckets.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMoveTxnModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
              >
                Reclassify
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOATING CHATBOT CONTROLS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        
        {/* Chat Window */}
        {chatOpen && (
          <div className="bg-slate-900 text-white rounded-2xl w-80 sm:w-96 shadow-2xl flex flex-col border border-slate-800 animate-fade-in-up overflow-hidden max-h-[480px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs block text-slate-100 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-icici-orange" /> Virtual Treasurer
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-none">Powered by Gemini AI (Offline Mode)</span>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] min-h-[220px]">
              {chatMessages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={index}
                    className={`flex flex-col gap-1 max-w-[85%] ${
                      isUser ? 'items-end ml-auto' : 'items-start mr-auto'
                    }`}
                  >
                    <div className={`p-3 text-xs leading-relaxed rounded-2xl ${
                      isUser 
                        ? 'bg-icici-blue-light text-white rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start gap-1 max-w-[85%] mr-auto">
                  <div className="p-3 text-xs bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-800 bg-slate-950 shrink-0 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Virtual Treasurer..."
                className="flex-1 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-500 text-white placeholder-slate-500"
              />
              <button
                type="submit"
                className="bg-icici-orange hover:bg-icici-orange-hover text-white px-3 py-2 rounded-xl transition text-xs font-bold shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-105 border border-slate-800"
        >
          {chatOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5 text-icici-orange" />}
        </button>
      </div>

      {openRequestType && (
        <ServiceRequestModalWrapper
          requestType={openRequestType}
          onClose={() => setOpenRequestType(null)}
        />
      )}
    </div>
  );
};

// Internal icon helpers to keep dependencies strict
const AlertCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-4 h-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
