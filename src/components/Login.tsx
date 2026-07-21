import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, User as UserIcon, RefreshCw, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginUser } = useApp();
  
  // Login flow states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('treasury@quantumcash.com');
  const [phone, setPhone] = useState('+91 6303490644');
  const [name, setName] = useState('Gandikota Lalitha Subramanyam');
  
  // Captcha states
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptchaChallenge, setShowCaptchaChallenge] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showOtpNotification, setShowOtpNotification] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [authError, setAuthError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 6-character captcha text
  const generateCaptchaText = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  // Draw captcha on canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background
    ctx.fillStyle = '#0f172a'; // dark slate
    ctx.fillRect(0, 0, width, height);

    // Draw noise points
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#334155' : '#475569';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw letters
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 25 + i * 22;
      const y = height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 0.4) - 0.2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Draw lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = Math.random() > 0.5 ? '#f37021' : '#0f4c81'; // orange or blue
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
  };

  // Generate and draw new captcha
  const resetCaptcha = () => {
    const text = generateCaptchaText();
    setCaptchaText(text);
    setCaptchaInput('');
    setCaptchaError(false);
    // Draw canvas in a short timeout to make sure ref is bound
    setTimeout(() => drawCaptcha(text), 50);
  };

  useEffect(() => {
    if (showCaptchaChallenge) {
      resetCaptcha();
    }
  }, [showCaptchaChallenge]);

  // Handle reCAPTCHA initial click
  const handleCaptchaBoxClick = () => {
    if (captchaVerified) return;
    setShowCaptchaChallenge(true);
  };

  // Verify captcha input
  const handleVerifyCaptcha = () => {
    if (captchaInput.toUpperCase() === captchaText) {
      setCaptchaVerified(true);
      setShowCaptchaChallenge(false);
      setCaptchaError(false);
    } else {
      setCaptchaError(true);
      resetCaptcha();
    }
  };

  // Generate 6-digit OTP
  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setShowOtpNotification(true);
  };

  // Form submission
  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!captchaVerified) {
      setAuthError('Please complete the reCAPTCHA security verification.');
      return;
    }

    if (!email || !phone || (isRegisterMode && !name)) {
      setAuthError('Please fill in all the required fields.');
      return;
    }

    // Check user info inside localStorage
    if (isRegisterMode) {
      localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, phone }));
    } else {
      const stored = localStorage.getItem(`user_${email}`);
      if (!stored) {
        setAuthError('Account not found. Please register first.');
        return;
      }
      const parsed = JSON.parse(stored);
      if (parsed.phone !== phone) {
        setAuthError('Verification failed. The phone number does not match our records.');
        return;
      }
    }

    // Trigger OTP send
    sendOtp();
  };

  // Verify OTP submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otpCode === generatedOtp) {
      // Login successful
      const finalName = isRegisterMode ? name : JSON.parse(localStorage.getItem(`user_${email}`) || '{}').name || 'Valued Customer';
      loginUser(finalName, email, phone);
    } else {
      setOtpError('Invalid OTP code. Please check the notification banner and try again.');
    }
  };

  // Auto-fill OTP on simulator click
  const handleAutoFillOtp = () => {
    setOtpCode(generatedOtp);
    setOtpError('');
  };

  return (
    <div className="min-h-screen flex items-stretch bg-icici-ice font-sans">
      {/* Dynamic OTP Notification Simulator */}
      {showOtpNotification && (
        <div 
          onClick={handleAutoFillOtp}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full bg-slate-900 border border-icici-orange/50 text-white rounded-xl shadow-2xl p-4 cursor-pointer hover:bg-slate-800 transition transform animate-fade-in-up duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-icici-orange/20 text-icici-orange rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">QuantumCash Secure SMS</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Just now</span>
              </div>
              <p className="text-sm font-medium mt-1 text-slate-200">
                OTP code for login: <span className="text-icici-orange font-bold text-base tracking-wider">{generatedOtp}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">💡 Click this banner to auto-fill code</p>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Professional Branding Graphic (ICICI-themed) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-icici-blue-dark via-icici-blue-light to-slate-900 relative items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(243,112,33,0.15),transparent_60%)]"></div>
        <div className="max-w-md relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-icici-orange" /> Corporate Banking Suite
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              QuantumCash <span className="text-icici-orange">3.0</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience the next generation of predictive corporate banking. Take absolute command of your cash flows, treasury forecasting, and working capital buffers under a secure corporate design ecosystem.
            </p>
          </div>

          {/* Graphical Cards showcasing features */}
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm flex items-start gap-4 hover:bg-white/10 transition duration-300">
              <div className="p-2 bg-icici-orange/20 text-icici-orange rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Strict Masked Data Privacy</h3>
                <p className="text-xs text-slate-400 mt-1">One-click toggles hide balances across accounts, deposits, and investments instantly.</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm flex items-start gap-4 hover:bg-white/10 transition duration-300">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">7-Day Predictive Cash Flow</h3>
                <p className="text-xs text-slate-400 mt-1">AI-driven cash run rate simulations forecast crunches and generate dynamic micro-loan requests.</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-6">
            © 2026 QuantumCash Corporate Registry. Authorized under security standard ISO 27001.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Secure Authentication Interface */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-icici-blue-dark flex items-center justify-center font-extrabold text-white text-lg">Q</div>
              <span className="text-xl font-bold tracking-tight text-icici-blue-dark">QuantumCash</span>
            </div>
            
            {!otpSent ? (
              <>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isRegisterMode ? 'Create Banking Identity' : 'Secure Vault Access'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRegisterMode 
                    ? 'Register a new secure digital wallet for QuantumCash' 
                    : 'Enter your credentials to access your corporate treasury'}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-800">OTP Verification</h2>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit verification code sent to your registered mobile phone.
                </p>
              </>
            )}
          </div>

          {/* Form */}
          {!otpSent ? (
            <form onSubmit={handleSubmitAuth} className="space-y-6">
              {authError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-4">
                {isRegisterMode && (
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold text-slate-600 block">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Gandikota Lalitha Subramanyam"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-600 block">Corporate Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="treasury@quantumcash.com"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-600 block">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 6303490644"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                {/* reCAPTCHA Mockup */}
                <div className="pt-2">
                  {!captchaVerified ? (
                    <div className="space-y-3">
                      <div 
                        onClick={handleCaptchaBoxClick}
                        className="border border-slate-200 rounded-lg p-3 flex items-center justify-between bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition"
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={captchaVerified}
                            readOnly
                            className="w-5 h-5 border-slate-300 rounded text-icici-blue-light focus:ring-icici-blue-light cursor-pointer" 
                          />
                          <span className="text-xs font-medium text-slate-600">I am not a robot</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-7 h-7" alt="reCAPTCHA" />
                          <span className="text-[7px] text-slate-400 font-bold tracking-tighter uppercase mt-0.5">reCAPTCHA</span>
                        </div>
                      </div>

                      {showCaptchaChallenge && (
                        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white animate-fade-in-up">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enter the text below</span>
                            <button 
                              type="button" 
                              onClick={resetCaptcha}
                              className="text-slate-400 hover:text-icici-blue-light transition p-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <canvas 
                              ref={canvasRef} 
                              width={180} 
                              height={55} 
                              className="border border-slate-700/50 rounded-lg shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                              <input 
                                type="text"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Verification code"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                              />
                              <button 
                                type="button" 
                                onClick={handleVerifyCaptcha}
                                className="w-full bg-icici-blue-light hover:bg-icici-blue-hover text-white text-[11px] font-bold py-2 rounded-lg transition"
                              >
                                Verify Captcha
                              </button>
                            </div>
                          </div>
                          {captchaError && (
                            <p className="text-[10px] text-red-500 font-semibold animate-pulse">Incorrect code. Captcha reset. Please try again.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-emerald-100 rounded-lg p-3 flex items-center justify-between bg-emerald-50/50 border-l-4 border-l-emerald-500">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
                        <span className="text-xs font-semibold text-emerald-700">reCAPTCHA Verified Successfully</span>
                      </div>
                      <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-6 h-6 grayscale opacity-40" alt="reCAPTCHA" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-semibold py-3.5 rounded-lg transition shadow-md hover:shadow-lg focus:outline-none font-bold uppercase tracking-wider"
              >
                {isRegisterMode ? 'Generate OTP and Register' : 'Generate OTP and Sign In'}
              </button>

              <div className="text-center pt-2">
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegisterMode(!isRegisterMode);
                    setAuthError('');
                    setCaptchaVerified(false);
                    setShowCaptchaChallenge(false);
                  }}
                  className="text-xs text-icici-blue-light hover:text-icici-orange hover:underline font-semibold"
                >
                  {isRegisterMode ? 'Already have an account? Sign In' : 'New to QuantumCash? Register Account'}
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {otpError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="otp" className="text-xs font-semibold text-slate-600 block">One-Time Password (OTP)</label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base text-center tracking-widest font-mono font-bold rounded-lg py-3 focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-xs text-slate-500 hover:text-icici-blue-light transition font-medium"
                >
                  Resend OTP Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                  }}
                  className="text-xs text-slate-500 hover:text-red-500 transition font-medium"
                >
                  Go Back
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-icici-blue-dark hover:bg-icici-blue-light text-white text-xs font-semibold py-3.5 rounded-lg transition shadow-md hover:shadow-lg focus:outline-none font-bold uppercase tracking-wider"
              >
                Verify & Unlock Dashboard
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
