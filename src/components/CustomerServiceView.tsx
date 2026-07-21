import React, { useState } from 'react';
import { EmergencyQuickActions } from './CustomerService/EmergencyQuickActions';
import { QuantumAssistantWidget } from './CustomerService/QuantumAssistantWidget';
import { CustomerServiceFAQ } from './CustomerService/CustomerServiceFAQ';
import { RaiseDisputeModal } from './CustomerService/RaiseDisputeModal';
import { HelplinesAndBranchLocator } from './CustomerService/HelplinesAndBranchLocator';
import { LifeBuoy, PlusCircle } from 'lucide-react';

export const CustomerServiceView: React.FC = () => {
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title & Raise Ticket Header CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-icici-blue-dark text-white rounded-2xl shadow-md">
            <LifeBuoy className="w-6 h-6 text-icici-orange" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Customer Service & Help Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">24/7 Priority Resolution Desk, Cyber Fraud Response & Self-Service Knowledgebase</p>
          </div>
        </div>

        <button
          onClick={() => setShowDisputeModal(true)}
          className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Raise Ticket / Dispute
        </button>
      </div>

      {/* Section A: Emergency Quick Action Bar */}
      <EmergencyQuickActions />

      {/* Section B & C: AI Assistant Widget + Knowledgebase FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <QuantumAssistantWidget />
        </div>
        <div className="lg:col-span-7">
          <CustomerServiceFAQ />
        </div>
      </div>

      {/* Section E: Helplines & Branch Locator */}
      <HelplinesAndBranchLocator />

      {/* Raise Dispute Overlay Modal */}
      {showDisputeModal && (
        <RaiseDisputeModal onClose={() => setShowDisputeModal(false)} />
      )}
    </div>
  );
};
