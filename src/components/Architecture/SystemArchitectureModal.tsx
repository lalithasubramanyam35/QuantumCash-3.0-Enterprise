import React, { useState, useEffect } from 'react';
import { X, Layers, Cpu, ArrowDown, ShieldCheck, Sparkles, Database, Cloud, Activity, CheckCircle2, Calculator, Landmark } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export interface ArchitectureNode {
  id: string;
  tier: number;
  tierTitle: string;
  title: string;
  shape: 'Process Block' | 'Decision Diamond' | 'Database Cylinder' | 'Hexagon Engine' | 'Cloud Endpoint';
  componentName: string;
  icon: any;
  color: string;
  badge: string;
  whatItDoes: string;
  formulaAndLogic: string;
}

export const SystemArchitectureModal: React.FC<Props> = ({ onClose }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('3.1');

  const nodes: ArchitectureNode[] = [
    {
      id: '1.1',
      tier: 1,
      tierTitle: 'TIER 1: PRESENTATION & CLIENT LAYER (React 18, Tailwind CSS, Semantic HTML)',
      title: '1.1 SPA View Router',
      shape: 'Process Block',
      componentName: 'App.tsx & Sidebar.tsx',
      icon: Layers,
      color: 'from-blue-600 to-indigo-700',
      badge: 'View Router',
      whatItDoes: 'Handles client-side view switching across OVERVIEW, ACCOUNTS, PAYMENT_TRANSFER, CARDS, LOANS, INVESTMENTS, DEPOSITS, INSURANCE, and CUSTOMER_SERVICE.',
      formulaAndLogic: 'Guarantees instant tab navigation without full page reloads while highlighting active sidebar items and managing state isolation.'
    },
    {
      id: '1.2',
      tier: 1,
      tierTitle: 'TIER 1: PRESENTATION & CLIENT LAYER (React 18, Tailwind CSS, Semantic HTML)',
      title: '1.2 Eye Masking Privacy Controller',
      shape: 'Process Block',
      componentName: 'AppContext.tsx (eyeHidden state)',
      icon: Activity,
      color: 'from-sky-600 to-blue-700',
      badge: 'Privacy Toggle',
      whatItDoes: 'Controls global visibility for financial values across all account headers, transactions, and portfolio cards.',
      formulaAndLogic: 'Defaults to ₹•••••• until clicked. Toggling updates typography dynamically across subscribers without mutating underlying numbers in memory.'
    },
    {
      id: '2.1',
      tier: 2,
      tierTitle: 'TIER 2: REAL-TIME REACTION & EVENT INTERCEPTOR LAYER',
      title: '2.1 Unified Event Interceptor',
      shape: 'Decision Diamond',
      componentName: 'AppContext.tsx (addTransaction() method)',
      icon: Cpu,
      color: 'from-amber-500 to-orange-600',
      badge: 'Event Interceptor',
      whatItDoes: 'Listens for financial actions across all views (Send Money, Bill Pay, Loan Disbursal, Insurance Purchase, Deposit Creation, Card Fees).',
      formulaAndLogic: 'Calculates balance mutations, auto-generates reference strings (UPI/TXN_20260720_XXXX), injects current timestamp (20 JUL 2026), and prepends the record to index 0 of the statement.'
    },
    {
      id: '2.2',
      tier: 2,
      tierTitle: 'TIER 2: REAL-TIME REACTION & EVENT INTERCEPTOR LAYER',
      title: '2.2 Central Ledger State Container',
      shape: 'Database Cylinder',
      componentName: 'AppContext.tsx (stableTxns & crunchTxns)',
      icon: Database,
      color: 'from-orange-600 to-amber-700',
      badge: 'Ledger State',
      whatItDoes: 'Maintains real-time ledger state arrays for Stable Growth (QC-SG-882190) and Cash Crunch (QC-CC-401928) operating accounts.',
      formulaAndLogic: 'Reactively calculates running balances and provides synchronized ledger data to all components across the platform.'
    },
    {
      id: '3.1',
      tier: 3,
      tierTitle: 'TIER 3: CORE MATHEMATICAL & RECONCILIATION ENGINE (mathUtils.ts)',
      title: '3.1 2-Decimal Currency Precision Engine',
      shape: 'Hexagon Engine',
      componentName: 'mathUtils.ts (roundCurrency())',
      icon: Calculator,
      color: 'from-emerald-600 to-teal-700 ring-2 ring-emerald-400/50',
      badge: 'Math Precision',
      whatItDoes: 'Eliminates IEEE 754 floating-point drift errors (e.g. 0.1 + 0.2 = 0.30000000000000004) across all transactions, statements, and cards.',
      formulaAndLogic: 'Formula: roundCurrency(x) = Math.round((x + EPSILON) * 100) / 100. Guarantees every currency operation evaluates to exact 2-decimal paise precision.'
    },
    {
      id: '3.2',
      tier: 3,
      tierTitle: 'TIER 3: CORE MATHEMATICAL & RECONCILIATION ENGINE (mathUtils.ts)',
      title: '3.2 Dynamic Portfolio Reconciliation Engine',
      shape: 'Hexagon Engine',
      componentName: 'OverviewPortfolioTabs.tsx & AppContext.tsx',
      icon: Landmark,
      color: 'from-teal-600 to-emerald-800 ring-2 ring-teal-400/50',
      badge: 'Portfolio Sync',
      whatItDoes: 'Enforces 100% mathematical sum equality across Overview segment tabs (Accounts, Deposits, Investments) and global net worth.',
      formulaAndLogic: 'Formula: Total Accounts Portfolio = Stable Growth Balance + Cash Crunch Balance. Recalculates instantly upon any debit/credit action with zero latency.'
    },
    {
      id: '3.3',
      tier: 3,
      tierTitle: 'TIER 3: CORE MATHEMATICAL & RECONCILIATION ENGINE (mathUtils.ts)',
      title: '3.3 Amortization & EMI Calculation Engine',
      shape: 'Hexagon Engine',
      componentName: 'mathUtils.ts (calculateEMI()) & LoansView.tsx',
      icon: Calculator,
      color: 'from-amber-600 to-orange-700 ring-2 ring-amber-400/50',
      badge: 'EMI Amortization',
      whatItDoes: 'Calculates monthly loan installments and interest schedules for Personal, Car, and Home loans.',
      formulaAndLogic: 'Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1), where P = Principal, r = Monthly Interest Rate, n = Tenure in Months. Guarantees EMI * n = Principal + Total Interest.'
    },
    {
      id: '4.1',
      tier: 4,
      tierTitle: 'TIER 4: PREDICTIVE SIMULATION & ML ENGINE',
      title: '4.1 T+7 Forward Cash Flow Continuity Engine',
      shape: 'Process Block',
      componentName: 'useSimulation.ts & calculateForecast()',
      icon: Sparkles,
      color: 'from-indigo-600 to-blue-800',
      badge: 'Forecast ML',
      whatItDoes: 'Models forward cash flows over 7 days for Stable Growth and Cash Crunch scenarios.',
      formulaAndLogic: 'Formula: End Balance (T+i) = Start Balance (T+i) + Inflows (T+i) - Outflows (T+i). Enforces chain-rule continuity where Start Balance (T+i) = End Balance (T+i-1).'
    },
    {
      id: '4.2',
      tier: 4,
      tierTitle: 'TIER 4: PREDICTIVE SIMULATION & ML ENGINE',
      title: '4.2 Liquidity Deficit & Stress Test Engine',
      shape: 'Process Block',
      componentName: 'AccountPredictiveDetail.tsx',
      icon: Sparkles,
      color: 'from-[#003366] to-slate-900',
      badge: 'Stress Test',
      whatItDoes: 'Evaluates Debt Service Coverage Ratio (DSCR) and runway metrics to flag liquidity shortfalls.',
      formulaAndLogic: 'Triggers automated overdraft requests and liquidity transfers when forward balances drop below zero.'
    },
    {
      id: '5.1',
      tier: 5,
      tierTitle: 'TIER 5: AUTOMATED MAKER-CHECKER TEST LOOP',
      title: '5.1 Math Equality & Reconciliation Test Suite',
      shape: 'Process Block',
      componentName: 'src/App.test.tsx',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Testing Suite',
      whatItDoes: 'Runs automated Vitest checks verifying zero paise drift, exact portfolio tallies, and 100% mathematical equality across all 7 forward days.',
      formulaAndLogic: 'Fails build pipeline if any floating-point mismatch or unhandled rounding error occurs.'
    },
    {
      id: '6.1',
      tier: 6,
      tierTitle: 'TIER 6: SECURITY & NETLIFY DEPLOYMENT TARGET',
      title: '6.1 Netlify Hosting & Security Target',
      shape: 'Cloud Endpoint',
      componentName: '/netlify.toml',
      icon: Cloud,
      color: 'from-slate-700 to-slate-900',
      badge: 'Cloud Host',
      whatItDoes: 'Configures single-page application routing and enterprise HTTP security response headers.',
      formulaAndLogic: 'Redirects all /* requests to /index.html (status 200) and sets X-Frame-Options: DENY and Content-Security-Policy.'
    }
  ];

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const tiers = [1, 2, 3, 4, 5, 6];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in text-slate-800 select-text">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl relative border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#0f4c81] text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg text-icici-orange">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
                📐 QuantumCash 3.0 System Architecture & Execution Flowchart
              </h3>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Click on any system block or data pathway to inspect component implementation details, file locations, and underlying business logic.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Flowchart Canvas + Inspector Drawer */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Visual System Flowchart Canvas */}
          <div className="lg:col-span-2 space-y-6 min-h-[500px]">
            {tiers.map(tNum => {
              const tierNodes = nodes.filter(n => n.tier === tNum);
              const tierTitle = tierNodes[0]?.tierTitle;

              return (
                <div key={tNum} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tNum === 3 ? 'bg-emerald-500 animate-pulse' : 'bg-icici-orange'}`}></span>
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {tierTitle}
                    </span>
                  </div>

                  <div className={`grid grid-cols-1 ${tierNodes.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                    {tierNodes.map(node => {
                      const IconComp = node.icon;
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xl border-slate-900 ring-2 ring-icici-orange/60 scale-[1.01]'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-2">
                            <div className={`p-2 rounded-xl bg-gradient-to-r ${node.color} text-white shadow-sm shrink-0`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded truncate ${
                              isSelected ? 'bg-white/15 text-slate-200' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {node.shape}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-xs leading-snug">{node.title}</h4>
                            <p className={`text-[9px] font-mono mt-1 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              {node.componentName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Directional Connector Arrow */}
                  {tNum < 6 && (
                    <div className="flex justify-center py-1">
                      <div className="flex items-center gap-1 text-slate-300">
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Inspector Drawer Popover */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-sm lg:sticky lg:top-0 h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-icici-orange/10 text-icici-orange px-3 py-1 rounded-full border border-icici-orange/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-icici-orange" /> Flowchart Node Inspector
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Node ID: {currentNode.id}</span>
                <h4 className="font-black text-slate-900 text-base">{currentNode.title}</h4>
                <span className="text-xs text-slate-500 font-semibold">{currentNode.badge} Layer</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Component File Path</span>
                  <p className="text-slate-800 font-mono text-[11px] font-bold">{currentNode.componentName}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">What It Does</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{currentNode.whatItDoes}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Formula & Mathematical Logic</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{currentNode.formulaAndLogic}</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-200">
              Click any flowchart block on the left to switch active node popover inspection. Press ESC to close modal.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
