import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldAlert } from 'lucide-react';
import type { Nominee } from '../../types';

interface Props {
  onClose: () => void;
}

export const NomineeManagementModal: React.FC<Props> = ({ onClose }) => {
  const { nominee, updateNominee } = useApp();
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');

  // Edit form states
  const [name, setName] = useState(nominee?.name || '');
  const [relationship, setRelationship] = useState<Nominee['relationship']>(nominee?.relationship || 'Spouse');
  const [dob, setDob] = useState(nominee?.dob || '');
  const [allocation, setAllocation] = useState(nominee?.allocationPercentage || 100);
  const [guardianName, setGuardianName] = useState(nominee?.guardianName || '');
  const [guardianAddress, setGuardianAddress] = useState(nominee?.guardianAddress || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if minor based on DOB
  const isMinor = () => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nominee Name is required';
    if (!dob) {
      newErrors.dob = 'Nominee Date of Birth is required';
    } else {
      const birth = new Date(dob);
      if (birth > new Date()) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    if (isNaN(allocation) || allocation <= 0 || allocation > 100) {
      newErrors.allocation = 'Allocation percentage must be between 1% and 100%';
    }

    if (isMinor()) {
      if (!guardianName.trim()) newErrors.guardianName = 'Guardian name is required for minor nominee';
      if (!guardianAddress.trim()) newErrors.guardianAddress = 'Guardian address is required for minor nominee';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateNominee({
        name,
        relationship,
        dob,
        allocationPercentage: Number(allocation),
        ...(isMinor() ? { guardianName, guardianAddress } : {})
      });
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Nominee Registration & Allocation</h2>
        <p className="text-xs text-slate-500 mt-1">Manage legal beneficiary entitlements and safety deposits shares allocations.</p>
      </div>

      {!success ? (
        <>
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 select-none">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 pb-2.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'view'
                  ? 'border-icici-orange text-icici-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              View Active Nominee
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 pb-2.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'edit'
                  ? 'border-icici-orange text-icici-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Modify Beneficiary Allocation
            </button>
          </div>

          {activeTab === 'view' ? (
            <div className="space-y-4">
              {nominee ? (
                <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-icici-blue-dark/5 text-icici-blue-dark rounded-xl shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">{nominee.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Beneficiary relationship: {nominee.relationship}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100/70 pt-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Date of Birth</span>
                      <span className="text-slate-700 font-semibold mt-0.5 block">{nominee.dob}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Allocation Share</span>
                      <span className="text-emerald-600 font-black text-sm mt-0.5 block">{nominee.allocationPercentage}% Entitled</span>
                    </div>
                  </div>

                  {nominee.guardianName && (
                    <div className="border-t border-slate-100/70 pt-4 space-y-2.5">
                      <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Minor Nominee Registered
                      </span>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Guardian Name</span>
                          <span className="text-slate-700 font-semibold mt-0.5 block">{nominee.guardianName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Guardian Address</span>
                          <span className="text-slate-700 font-semibold mt-0.5 block">{nominee.guardianAddress}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No nominee registered for this account portfolio. Click modify tab to register.
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Nominee Full Name</label>
                <input
                  type="text"
                  placeholder="Enter nominee name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={e => setRelationship(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                  />
                  {errors.dob && <p className="text-[10px] text-rose-500 mt-0.5">{errors.dob}</p>}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Allocation Share (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="100"
                  value={allocation}
                  onChange={e => setAllocation(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                />
                {errors.allocation && <p className="text-[10px] text-rose-500 mt-0.5">{errors.allocation}</p>}
              </div>

              {isMinor() && (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 space-y-3.5">
                  <div className="flex gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800">Minor Guardian Assignment Required</h4>
                      <p className="text-[10px] text-amber-700 mt-0.5">As the beneficiary is under 18 years of age, legal guardian credentials must be declared.</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Guardian Name</label>
                    <input
                      type="text"
                      placeholder="Enter legal guardian full name"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 transition"
                    />
                    {errors.guardianName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.guardianName}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Guardian Permanent Address</label>
                    <input
                      type="text"
                      placeholder="Enter guardian address"
                      value={guardianAddress}
                      onChange={e => setGuardianAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 transition"
                    />
                    {errors.guardianAddress && <p className="text-[10px] text-rose-500 mt-0.5">{errors.guardianAddress}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Nominee'}
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Nominee Profile Synced Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Your beneficiary updates are processed on core records. Entitlements are successfully updated.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold rounded-xl transition shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
