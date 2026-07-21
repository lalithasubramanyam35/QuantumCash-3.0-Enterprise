import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TrackServiceRequestsModal } from './TrackServiceRequestsModal';
import { AddressChangeModal } from './AddressChangeModal';
import { GenerateCardPinModal } from './GenerateCardPinModal';
import { ManageCardLimitsModal } from './ManageCardLimitsModal';
import { UpdateEmailModal } from './UpdateEmailModal';
import { NomineeManagementModal } from './NomineeManagementModal';
import { UpgradeCardModal } from './UpgradeCardModal';
import { PositivePayModal } from './PositivePayModal';

interface Props {
  requestType: string;
  onClose: () => void;
}

export const ServiceRequestModalWrapper: React.FC<Props> = ({ requestType, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Close on outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (requestType) {
      case 'Track Service Requests':
        return <TrackServiceRequestsModal onClose={onClose} />;
      case 'Address Change':
        return <AddressChangeModal onClose={onClose} />;
      case 'Generate Card PIN':
        return <GenerateCardPinModal onClose={onClose} />;
      case 'Manage Debit Card Limit':
        return <ManageCardLimitsModal onClose={onClose} />;
      case 'Update Email ID':
        return <UpdateEmailModal onClose={onClose} />;
      case 'View/Update Nominee':
        return <NomineeManagementModal onClose={onClose} />;
      case 'Upgrade Debit Card':
        return <UpgradeCardModal onClose={onClose} />;
      case 'Positive Pay':
        return <PositivePayModal onClose={onClose} />;
      default:
        return (
          <div className="text-center py-8 text-xs text-slate-500">
            Invalid Service Request initiated.
          </div>
        );
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-md transition-all duration-300 p-4 animate-fade-in"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative select-text animate-scale-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal body */}
        <div className="mt-2 text-slate-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
