import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Download, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const TrackServiceRequestsModal: React.FC<Props> = ({ onClose }) => {
  const { serviceRequests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingSrn, setDownloadingSrn] = useState<string | null>(null);

  const filteredRequests = serviceRequests.filter(req =>
    req.srn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (srn: string) => {
    setDownloadingSrn(srn);
    setTimeout(() => {
      setDownloadingSrn(null);
      // Simulate file download
      const element = document.createElement('a');
      const file = new Blob([`QuantumCash Service Request Confirmation\n\nSRN: ${srn}\nCategory: Service Confirmation\nDate: ${new Date().toLocaleDateString()}\nStatus: Verified`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${srn}_confirmation.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Action Required':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Action Required':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Track Service Requests</h2>
        <p className="text-xs text-slate-500 mt-1">Real-time status updates and receipts for your query request tickets.</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Search by SRN or category (e.g. SRN-98231)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
        />
      </div>

      {/* List of service requests */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(req => (
            <div key={req.srn} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs tracking-tight">{req.category}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">SRN: {req.srn}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Requested: {req.dateRequested}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeClass(req.status)}`}>
                  {getStatusIcon(req.status)}
                  {req.status}
                </span>

                <button
                  onClick={() => handleDownload(req.srn)}
                  disabled={downloadingSrn !== null}
                  className="p-2 text-slate-400 hover:text-icici-blue-light hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  title="Download Receipt"
                >
                  {downloadingSrn === req.srn ? (
                    <div className="w-4 h-4 border-2 border-icici-blue-light border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No active or historical service requests match your search.
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
