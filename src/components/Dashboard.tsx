import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';
import { AccountsView } from './AccountsView';
import { DepositsView } from './DepositsView';
import { InvestmentsView } from './InvestmentsView';
import { WhatIOweView } from './WhatIOweView';
import { AccountPredictiveDetail } from './AccountPredictiveDetail';
import { CustomerServiceView } from './CustomerServiceView';
import { InsuranceView } from './InsuranceView';
import { OffersSection } from './OffersSection';
import { SystemBlueprintSection } from './Architecture/SystemBlueprintSection';
import { UpcomingPaymentsPill } from './UpcomingPayments/UpcomingPaymentsPill';
import { DemoMenuDropdown } from './DemoSystem/DemoMenuDropdown';
import { OverviewQuickActions } from './OverviewQuickActions';
import { RecentTransactions } from './QuickActions/RecentTransactions';
import { OverviewPortfolioTabs } from './OverviewPortfolioTabs';
import { PaymentTransferView } from './Views/PaymentTransferView';
import { CardsView } from './Views/CardsView';
import { LoansView } from './Views/LoansView';
import { 
  Eye, 
  EyeOff, 
  Phone, 
  User as UserIcon, 
  LogOut, 
  TrendingUp, 
  Building, 
  Landmark, 
  CreditCard,
  Layers,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  LifeBuoy,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    logoutUser,
    currentTab,
    setCurrentTab,
    eyeHidden,
    setEyeHidden,
    setActiveAccountKey,
    deepDiveAccountKey,
    setDeepDiveAccountKey,
    getAccountBalances
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'have' | 'owe'>('have');
  const balances = getAccountBalances();

  // Mathematical aggregates for What I Have and What I Owe
  const totalAccounts = balances.total;
  const totalDeposits = 620000; // Fixed + Recurring
  const totalInvestments = 1000000; // Equity + SSY + PPF + Demat
  const totalHave = totalAccounts + totalDeposits + totalInvestments;

  const totalLoans = 2100000; // Home + Personal + Car
  const totalCreditCards = 122184.31; // Signature + Corporate
  const totalOwe = totalLoans + totalCreditCards;

  const handleAccountClick = (key: 'stable' | 'crunch') => {
    setActiveAccountKey(key);
    setDeepDiveAccountKey(key);
    setCurrentTab('Accounts');
  };

  const handleSegmentChange = (segment: 'have' | 'owe') => {
    setActiveSegment(segment);
    setDeepDiveAccountKey(null); // clear deep dive on segment change
    if (segment === 'have') {
      setCurrentTab('Overview');
    } else {
      setCurrentTab('Loans');
    }
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Accounts', icon: Wallet },
    { name: 'Payment & Transfer', icon: RefreshCw },
    { name: 'Deposits', icon: Building },
    { name: 'Cards', icon: CreditCard },
    { name: 'Loans', icon: Landmark },
    { name: 'Investments', icon: TrendingUp },
    { name: 'Insurance', icon: Layers },
    { name: 'Customer Service', icon: LifeBuoy }
  ];

  return (
    <div className="min-h-screen bg-icici-ice flex flex-col font-sans select-none">
      
      {/* 1. TOP HEADER BAR */}
      <header className="bg-gradient-to-r from-icici-blue-dark to-icici-blue-light text-white shadow-md relative z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Slogan */}
          <div 
            onClick={() => {
              setDeepDiveAccountKey(null);
              setActiveSegment('have');
              setCurrentTab('Overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition"
            title="Go to Overview Home"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-icici-blue-dark flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-105 transition transform">
              Q
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block leading-none">QuantumCash</span>
              <span className="text-[9px] text-slate-300 tracking-wider font-semibold block uppercase mt-0.5">QuantumCash Enterprise Portal</span>
            </div>
          </div>

          {/* Right Menu (Call Us, Demo, Profile, Notifications) */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Call Us */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-full border border-white/15">
              <Phone className="w-3.5 h-3.5 text-icici-orange" />
              <span>Call Us +91 0123456789</span>
            </div>

            {/* View Demo / Reset Demo Options */}
            <DemoMenuDropdown />

            {/* Notification Pill */}
            <UpcomingPaymentsPill />

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 bg-white text-icici-blue-dark hover:bg-slate-50 px-4 py-2 rounded-full transition shadow-sm"
              >
                <UserIcon className="w-4 h-4 text-icici-orange" />
                <span className="uppercase max-w-[120px] truncate">{user?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 text-slate-700 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-slate-400 mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={logoutUser}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10 min-h-0">
        
        {/* SIDEBAR NAVIGATION (LEFT) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col py-6 select-none shrink-0">
          <nav className="space-y-1 px-4 flex-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.name && !deepDiveAccountKey;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setDeepDiveAccountKey(null);
                    setCurrentTab(item.name as any);
                    
                    // Automatically toggle have/owe segment based on tab click
                    if (['Loans', 'Cards'].includes(item.name)) {
                      setActiveSegment('owe');
                    } else if (['Overview', 'Accounts', 'Deposits', 'Investments'].includes(item.name)) {
                      setActiveSegment('have');
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                    isActive 
                      ? 'bg-icici-blue-dark text-white shadow-md shadow-icici-blue-dark/15' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-icici-blue-light'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-icici-orange' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="px-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
            Secure Session active. ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </aside>

        {/* CONTENT WINDOW AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col justify-start">
          
          {/* SEGMENT TOGGLE & TOTAL HEADER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 shrink-0">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              {/* WHAT I HAVE vs WHAT I OWE Toggle */}
              <div className="flex border border-slate-200 bg-slate-50 p-1 rounded-xl w-fit">
                <button
                  onClick={() => handleSegmentChange('have')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition ${
                    activeSegment === 'have' 
                      ? 'bg-icici-blue-dark text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  What I Have
                </button>
                <button
                  onClick={() => handleSegmentChange('owe')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition ${
                    activeSegment === 'owe' 
                      ? 'bg-icici-blue-dark text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  What I Owe
                </button>
              </div>

              {/* Eye Toggle Visibility Icon */}
              <button 
                onClick={() => setEyeHidden(!eyeHidden)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition ml-auto sm:ml-0"
              >
                {eyeHidden ? <Eye className="w-4 h-4 text-icici-orange" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                <span>{eyeHidden ? 'Show Values' : 'Mask Values'}</span>
              </button>
            </div>

            {/* Total Balance / Portfolio Header */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {activeSegment === 'have' ? 'Combined Portfolio Value' : 'Total Debt Liabilities'}
              </span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {formatCurrency(activeSegment === 'have' ? totalHave : totalOwe, eyeHidden)}
              </h2>
            </div>
          </div>

          {/* DYNAMIC SCREEN ROUTING */}
          <div className="flex-1">
            {deepDiveAccountKey ? (
              <AccountPredictiveDetail />
            ) : currentTab === 'Customer Service' ? (
              <CustomerServiceView />
            ) : currentTab === 'Insurance' ? (
              <InsuranceView />
            ) : currentTab === 'Payment & Transfer' ? (
              <PaymentTransferView />
            ) : currentTab === 'Cards' ? (
              <CardsView />
            ) : currentTab === 'Loans' ? (
              <LoansView />
            ) : (
              <>
                {/* Active Segment screens routing */}
                {activeSegment === 'have' ? (
                  <>
                    {/* Render specific views based on Sidebar tabs */}
                    {currentTab === 'Overview' && (
                      <div className="space-y-6">
                        {/* Interactive Overview Portfolio Tabs Card */}
                        <OverviewPortfolioTabs />

                        {/* Quick Banking Actions Bar */}
                        <OverviewQuickActions />

                        {/* accounts picker summary dashboard row */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-3">Available Operating Accounts</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div 
                              onClick={() => handleAccountClick('stable')}
                              className="border border-slate-100 p-4 rounded-xl hover:border-emerald-500 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition"
                            >
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Stable Growth Account</span>
                              <p className="font-mono text-[10px] text-slate-400 mt-2">••••••••</p>
                              <p className="text-lg font-black text-slate-800 mt-0.5">
                                {formatCurrency(balances.stable, eyeHidden)}
                              </p>
                            </div>
                            
                            <div 
                              onClick={() => handleAccountClick('crunch')}
                              className="border border-slate-100 p-4 rounded-xl hover:border-red-500 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition"
                            >
                              <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded">Cash Crunch Account</span>
                              <p className="font-mono text-[10px] text-slate-400 mt-2">••••••••</p>
                              <p className="text-lg font-black text-slate-800 mt-0.5">
                                {formatCurrency(balances.crunch, eyeHidden)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Recent Transactions Component */}
                        <RecentTransactions />

                        {/* Offers For You Widget */}
                        <OffersSection />

                        {/* System Architecture & Technical Blueprint Section */}
                        <SystemBlueprintSection />
                      </div>
                    )}
                    {currentTab === 'Accounts' && <AccountsView />}
                    {currentTab === 'Deposits' && <DepositsView />}
                    {currentTab === 'Investments' && <InvestmentsView />}
                  </>
                ) : (
                  <>
                    {/* Render What I Owe views */}
                    <WhatIOweView />
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
