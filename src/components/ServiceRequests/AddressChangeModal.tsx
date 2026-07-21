import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Upload, MapPin } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AddressChangeModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateAddress } = useApp();
  const [step, setStep] = useState(1);
  
  // Form states
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [proofType, setProofType] = useState('Aadhaar');
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // OTP states
  const [otpInput, setOtpInput] = useState('');
  const [otpSentCode] = useState('839201'); // simulated OTP code
  const [otpTimer, setOtpTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const startOtpTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!flatNo.trim()) newErrors.flatNo = 'Flat/House No is required';
    if (!street.trim()) newErrors.street = 'Street is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!pincode.trim() || pincode.length !== 6 || isNaN(Number(pincode))) newErrors.pincode = 'Valid 6-digit Pincode is required';
    if (!stateName.trim()) newErrors.stateName = 'State is required';
    if (!fileName) newErrors.proof = 'Please upload a copy of address proof';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
    startOtpTimer();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== otpSentCode) {
      setErrors({ otp: 'Invalid OTP code. Please enter 839201 for test validation.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const fullAddress = `${flatNo}, ${street}, ${city}, ${stateName} - ${pincode}`;
      updateAddress(fullAddress);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Update Address Details</h2>
        <p className="text-xs text-slate-500 mt-1">Submit permanent address update requests with verified documentation.</p>
      </div>

      {/* Steps bar */}
      <div className="flex items-center gap-3 border-y border-slate-100 py-3 text-xs select-none">
        <span className={`font-bold transition ${step === 1 ? 'text-icici-blue-dark' : 'text-slate-400'}`}>1. Input Address</span>
        <span className="text-slate-300">/</span>
        <span className={`font-bold transition ${step === 2 ? 'text-icici-blue-dark' : 'text-slate-400'}`}>2. Verification OTP</span>
        <span className="text-slate-300">/</span>
        <span className={`font-bold transition ${step === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>3. Success Status</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-icici-blue-light" />
            <div className="text-[10px]">
              <span className="text-slate-400 font-bold block uppercase tracking-wide">Current Address</span>
              <span className="text-slate-700 font-medium">{user?.address || 'Not Registered'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Flat / House No</label>
              <input
                type="text"
                value={flatNo}
                onChange={e => setFlatNo(e.target.value)}
                placeholder="e.g. Flat 402, Block C"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.flatNo && <p className="text-[10px] text-rose-500 mt-0.5">{errors.flatNo}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Street / Locality</label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="e.g. Hitech City Road"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.street && <p className="text-[10px] text-rose-500 mt-0.5">{errors.street}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              />
              {errors.city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.city}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="6-digit PIN"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition text-center font-mono"
              />
              {errors.pincode && <p className="text-[10px] text-rose-500 mt-0.5">{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">State</label>
            <input
              type="text"
              value={stateName}
              onChange={e => setStateName(e.target.value)}
              placeholder="e.g. Telangana"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
            />
            {errors.stateName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.stateName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Address Proof Type</label>
              <select
                value={proofType}
                onChange={e => setProofType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 hover:border-icici-blue-light rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition select-none bg-slate-50 hover:bg-white"
            >
              <input
                type="file"
                id="address-proof-file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="address-proof-file" className="cursor-pointer flex flex-col items-center text-center">
                <Upload className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-600 block">
                  {fileName ? fileName : 'Upload Proof Document'}
                </span>
                <span className="text-[8px] text-slate-400">Drag & drop PDF or Image</span>
              </label>
            </div>
          </div>
          {errors.proof && <p className="text-[10px] text-rose-500 text-right">{errors.proof}</p>}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md"
            >
              Proceed to Verification
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Enter 6-Digit OTP Code</h3>
            <p className="text-[11px] text-slate-400 mt-1">A verification code has been dispatched to {user?.phone}.</p>
          </div>

          <div className="p-3 bg-slate-900 border border-icici-orange/50 text-white rounded-xl max-w-xs mx-auto text-xs font-semibold select-none flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition"
               onClick={() => setOtpInput(otpSentCode)}>
            💡 Verification Code: <span className="text-icici-orange font-black tracking-wider text-sm">{otpSentCode}</span> (Click to Auto-fill)
          </div>

          <div className="max-w-[200px] mx-auto">
            <input
              type="text"
              maxLength={6}
              placeholder="••••••"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg text-center tracking-widest font-mono font-bold rounded-xl py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
            />
            {errors.otp && <p className="text-[10px] text-rose-500 mt-1.5">{errors.otp}</p>}
          </div>

          <div className="text-[10px] text-slate-400">
            {otpTimer > 0 ? (
              <span>Resend code in {otpTimer} seconds</span>
            ) : (
              <button type="button" onClick={startOtpTimer} className="text-icici-blue-light hover:underline font-bold">Resend OTP Code</button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-icici-orange hover:bg-icici-orange-hover text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 min-w-[100px]"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm & Save'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-200 animate-bounce">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Address Updated Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Your permanent contact details are successfully synchronized. A confirmation Service RequestSRN has been logged in your dashboard.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-bold rounded-xl transition shadow-md"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
