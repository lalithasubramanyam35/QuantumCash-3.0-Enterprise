import React, { useState } from 'react';
import { PhoneCall, MapPin, Search, Building2, Scale, Clock } from 'lucide-react';
import type { BranchDetails } from '../../types';

export const HelplinesAndBranchLocator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'Branch' | 'ATM'>('ALL');

  const mockBranches: BranchDetails[] = [
    {
      id: 'br-1',
      name: 'Quantum Towers Main Branch',
      type: 'Branch & ATM',
      address: 'Plot 42, Financial District, Gachibowli, Hyderabad',
      pincode: '500032',
      city: 'Hyderabad',
      ifsc: 'QCUB0000108',
      workingHours: '9:30 AM - 4:30 PM (Mon-Sat, 2nd/4th Sat Off)',
      phone: '+91 6303490644'
    },
    {
      id: 'br-2',
      name: 'Cyber City Tech Park ATM',
      type: 'ATM',
      address: 'Ground Floor, Cyber Gateway, Hitech City, Hyderabad',
      pincode: '500081',
      city: 'Hyderabad',
      workingHours: '24/7 Available'
    },
    {
      id: 'br-3',
      name: 'Bandra Kurla Complex Branch',
      type: 'Branch & ATM',
      address: 'G Block, BKC, Bandra East, Mumbai',
      pincode: '400051',
      city: 'Mumbai',
      ifsc: 'QCUB0000210',
      workingHours: '9:30 AM - 4:30 PM',
      phone: '022-67891200'
    },
    {
      id: 'br-4',
      name: 'Connaught Place Retail Hub',
      type: 'Branch',
      address: 'Inner Circle, CP, New Delhi',
      pincode: '110001',
      city: 'Delhi',
      ifsc: 'QCUB0000305',
      workingHours: '9:30 AM - 4:30 PM',
      phone: '011-45609800'
    }
  ];

  const filteredBranches = mockBranches.filter(b => {
    const matchesQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pincode.includes(searchQuery);

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'Branch' && b.type.includes('Branch')) ||
      (filterType === 'ATM' && b.type.includes('ATM'));

    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* 1. Toll Free Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-icici-blue-dark text-white rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">24/7 Domestic Helpline</span>
            <p className="text-sm font-extrabold text-slate-800">1800-108-5555</p>
            <span className="text-[9px] text-slate-400">Toll-Free All India</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-icici-orange text-white rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NRI Global Desk</span>
            <p className="text-sm font-extrabold text-slate-800">+91 6303490644</p>
            <span className="text-[9px] text-slate-400">International Priority Line</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Corporate Desk</span>
            <p className="text-sm font-extrabold text-slate-800">040-67890000</p>
            <span className="text-[9px] text-slate-400">Business Accounts Support</span>
          </div>
        </div>
      </div>

      {/* 2. Branch & ATM Search Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-icici-orange" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Branch & ATM Directory</h3>
              <p className="text-xs text-slate-500">Locate nearest physical branches, cash deposit machines, and ATMs.</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(['ALL', 'Branch', 'ATM'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filterType === t
                    ? 'bg-icici-blue-dark text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by City, Pincode (e.g. 500032, Hyderabad, CP)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBranches.map(branch => (
            <div key={branch.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 hover:border-slate-300 transition">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 text-xs">{branch.name}</h4>
                <span className="text-[9px] font-bold bg-icici-blue-light/10 text-icici-blue-light px-2 py-0.5 rounded uppercase">
                  {branch.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{branch.address}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 pt-1">
                {branch.ifsc && <span className="font-mono font-bold">IFSC: {branch.ifsc}</span>}
                {branch.workingHours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {branch.workingHours}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredBranches.length === 0 && (
            <div className="col-span-2 text-center py-6 text-xs text-slate-400">
              No branch or ATM found matching criteria.
            </div>
          )}
        </div>
      </div>

      {/* 3. Banking Ombudsman Details */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 shadow-sm space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 text-amber-400">
          <Scale className="w-4 h-4" />
          <h4 className="font-bold text-xs uppercase tracking-wider">RBI Reserve Bank Integrated Ombudsman Scheme</h4>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          For grievances remaining unaddressed after 30 days of raising a ticket, customers can escalate to the RBI Banking Ombudsman Portal (cms.rbi.org.in) or call Toll-Free Contact Center 14448. Principal Nodal Officer: Quantum Cash Towers, Financial District, Hyderabad.
        </p>
      </div>
    </div>
  );
};
