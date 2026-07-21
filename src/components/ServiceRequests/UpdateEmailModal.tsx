import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const UpdateEmailModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateEmail } = useApp();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // OTP states
  const [otpInput, setOtpInput] = useState('');
  const [otpSentCode] = useState('839201');
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

  const getMaskedEmail = (emailStr: string) => {
    if (!emailStr) return 'n*****@gmail.com';
    const [name, domain] = emailStr.split('@');
    if (name.length <= 2) return `${name[0]}*****@${domain}`;
    return `${name[0]}*****${name[name.length - 1]}@${domain}`;
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      newErrors.newEmail = 'Please enter a valid email address';
    } else if (newEmail.toLowerCase() === user?.email.toLowerCase()) {
      newErrors.newEmail = 'New email cannot be the same as current email';
    }

    if (newEmail.toLowerCase() !== confirmEmail.toLowerCase()) {
      newErrors.confirmEmail = 'Email confirmation does not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
    startOtpTimer();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== otpSentCode) {
      setErrors({ otp: 'Invalid OTP code. Use 839201 for test verification.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateEmail(newEmail.toLowerCase());
      setStep(3);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Update Registered Email</h2>
        <p className="text-xs text-slate-500 mt-1">Modify registered electronic address statements delivery flags.</p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="space-y-4">
          {/* Current Masked Email */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-icici-blue-light" />
            <div className="text-[10px]">
              <span className="text-slate-400 font-bold block uppercase tracking-wide">Current Email ID</span>
              <span className="text-slate-700 font-medium font-mono">
                {user ? getMaskedEmail(user.email) : 'Not Registered'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">New Email Address</label>
            <input
              type="email"
              placeholder="e.g. support@quantumcash.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
            />
            {errors.newEmail && <p className="text-[10px] text-rose-500 mt-0.5">{errors.newEmail}</p>}
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Confirm New Email</label>
            <input
              type="email"
              placeholder="Re-enter new email address"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
            />
            {errors.confirmEmail && <p className="text-[10px] text-rose-500 mt-0.5">{errors.confirmEmail}</p>}
          </div>

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
              Get Verification OTP
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Email Update Authentication</h3>
            <p className="text-[11px] text-slate-400 mt-1">Provide the OTP verification code dispatched to {user?.phone}.</p>
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
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify & Save'}
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
            <h3 className="font-extrabold text-slate-800 text-base">Email ID Updated Successfully</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Your registered email ID is successfully updated to **{newEmail.toLowerCase()}**. Account transaction alerts will be sent here.
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
