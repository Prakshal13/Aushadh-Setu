import React, { useState, useEffect } from 'react';
import { useAuth, USER_ROLES } from '../context/AuthContext';

function generateCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function AuthModal() {
  const {
    currentUser,
    authenticate,
    sendOtp,
    verifyOtp,
    logout,
    authModalOpen,
    setAuthModalOpen,
    modalInitialRole,
  } = useAuth();

  // Active role tab: 'DHO' | 'PHARMACIST' | 'CITIZEN'
  const [selectedRoleTab, setSelectedRoleTab] = useState('DHO');
  // Auth method: 'PASSWORD' | 'OTP'
  const [authMethod, setAuthMethod] = useState('PASSWORD');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState(() => generateCaptcha());

  // 2FA OTP state
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpHint, setOtpHint] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [showCredDirectory, setShowCredDirectory] = useState(false);

  // Sync initial role when opened
  useEffect(() => {
    if (authModalOpen) {
      setSelectedRoleTab(modalInitialRole || 'DHO');
      setErrorMsg('');
      setSuccessMsg('');
      setOtpSent(false);
      setOtpInput('');
      setCaptchaInput('');
      setExpectedCaptcha(generateCaptcha());
    }
  }, [authModalOpen, modalInitialRole]);

  // Update default email when role changes
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setCaptchaInput('');
    setExpectedCaptcha(generateCaptcha());
    setOtpSent(false);
    setOtpInput('');

    if (selectedRoleTab === 'DHO') {
      setEmail('dho.pune@nic.gov.in');
      setPassword('');
    } else if (selectedRoleTab === 'PHARMACIST') {
      setEmail('phc.paud@nhm.gov.in');
      setPassword('');
    } else {
      setEmail('citizen.access@public.gov.in');
      setPassword('');
    }
  }, [selectedRoleTab]);

  if (!authModalOpen) return null;

  const handleRefreshCaptcha = () => {
    setExpectedCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSendingOtp(true);

    try {
      const res = await sendOtp(email);
      setSendingOtp(false);
      if (res.success) {
        setOtpSent(true);
        setOtpHint(res.demoOtpHint || '');
        setSuccessMsg(res.message || 'OTP dispatched to registered mobile.');
      } else {
        setErrorMsg(res.error || 'Failed to dispatch OTP.');
      }
    } catch (e) {
      setSendingOtp(false);
      setErrorMsg('Failed to reach SMS gateway.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedRoleTab === 'CITIZEN') {
      logout();
      setSuccessMsg('Switched to Citizen Public Access.');
      setTimeout(() => setAuthModalOpen(false), 500);
      return;
    }

    setAuthenticating(true);

    if (authMethod === 'OTP') {
      // 2FA OTP verification
      const res = await verifyOtp(email, otpInput);
      setAuthenticating(false);
      if (res.success) {
        setSuccessMsg(`✓ 2FA Verified! Clearance Level: ${res.user.role}`);
        setTimeout(() => setAuthModalOpen(false), 800);
      } else {
        setErrorMsg(res.error || 'Invalid 2FA OTP.');
      }
    } else {
      // Password + Captcha verification
      const res = await authenticate({
        email,
        password,
        captchaInput,
        expectedCaptcha,
      });

      setAuthenticating(false);

      if (res.success) {
        setSuccessMsg(`✓ Authentication Successful! Clearance Level: ${res.user.role}`);
        setTimeout(() => setAuthModalOpen(false), 800);
      } else {
        setErrorMsg(res.error || 'Authentication rejected by security gateway.');
        setExpectedCaptcha(generateCaptcha());
        setCaptchaInput('');
      }
    }
  };

  const isAlreadyLoggedIn = currentUser.role !== USER_ROLES.CITIZEN;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EBE4D8] shadow-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-[#EBE4D8] text-text-subtle hover:text-text-obsidian flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-2.5 py-0.5 rounded-full border border-amber-brand/20">
              DISHA / MoHFW Access Gateway
            </span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            Official Health Portal Authentication
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            District command and pharmacy inventory records strictly require verified government credentials.
          </p>
        </div>

        {/* Current Active Session Status */}
        {isAlreadyLoggedIn && (
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div>
                <div className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10.5px] text-text-muted font-mono">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                setSuccessMsg('Session terminated. Switched to Citizen mode.');
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-700 text-xs font-bold border border-stone-200 hover:border-rose-200 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Clearance Role Selector Tabs */}
        <div className="space-y-1.5">
          <div className="text-[10.5px] font-bold text-text-subtle uppercase tracking-wider">
            Target Official Clearance:
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#F2EDE4] p-1.5 rounded-2xl border border-[#EBE4D8]">
            <button
              type="button"
              onClick={() => setSelectedRoleTab('DHO')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRoleTab === 'DHO'
                  ? 'bg-white text-text-obsidian shadow-xs border border-[#EBE4D8]'
                  : 'text-text-muted hover:text-text-obsidian'
              }`}
            >
              <span>🏛️</span>
              <span>DHO Office</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleTab('PHARMACIST')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRoleTab === 'PHARMACIST'
                  ? 'bg-white text-text-obsidian shadow-xs border border-[#EBE4D8]'
                  : 'text-text-muted hover:text-text-obsidian'
              }`}
            >
              <span>💊</span>
              <span>Pharmacist</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleTab('CITIZEN')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRoleTab === 'CITIZEN'
                  ? 'bg-white text-text-obsidian shadow-xs border border-[#EBE4D8]'
                  : 'text-text-muted hover:text-text-obsidian'
              }`}
            >
              <span>👤</span>
              <span>Citizen</span>
            </button>
          </div>
        </div>

        {/* Authentication Mode Switcher (Password vs 2FA Mobile OTP) */}
        {selectedRoleTab !== 'CITIZEN' && (
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-[11px] font-bold text-text-muted">Verification Method:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthMethod('PASSWORD')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  authMethod === 'PASSWORD'
                    ? 'bg-[#181511] text-white shadow-xs'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                Password + Captcha
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('OTP')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  authMethod === 'OTP'
                    ? 'bg-[#181511] text-white shadow-xs'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                2FA Mobile OTP
              </button>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {selectedRoleTab !== 'CITIZEN' ? (
            <>
              {/* Officer Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-obsidian block">
                  Official Email / Officer ID:
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
                    badge
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRoleTab === 'DHO' ? 'dho.pune@nic.gov.in' : 'phc.paud@nhm.gov.in'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#EBE4D8] text-xs font-semibold text-text-obsidian focus:outline-none focus:border-amber-brand shadow-inner font-mono"
                  />
                </div>
              </div>

              {authMethod === 'PASSWORD' ? (
                <>
                  {/* Password Field */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-text-obsidian block">
                        Government Security Password:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const demoPass = selectedRoleTab === 'DHO' ? 'NIC@Gov#2026' : 'NHM@Pharma#2026';
                          setPassword(demoPass);
                          setCaptchaInput(expectedCaptcha);
                        }}
                        className="text-[10.5px] font-bold text-amber-brand hover:text-amber-800 transition cursor-pointer flex items-center gap-1 bg-amber-soft/60 px-2 py-0.5 rounded-md border border-amber-brand/20 hover:bg-amber-soft"
                        title="Click to auto-fill official evaluation password"
                      >
                        <span>⚡ Auto-fill: <code className="font-mono">{selectedRoleTab === 'DHO' ? 'NIC@Gov#2026' : 'NHM@Pharma#2026'}</code></span>
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
                        lock
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter official password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#EBE4D8] text-xs font-semibold text-text-obsidian focus:outline-none focus:border-amber-brand shadow-inner font-mono"
                      />
                    </div>
                  </div>

                  {/* Security Captcha */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-obsidian block">
                      Security Captcha Verification:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-between bg-stone-200 px-3.5 py-1.5 rounded-xl border border-stone-300 select-none tracking-widest font-mono font-extrabold text-sm text-stone-800 line-through">
                        {expectedCaptcha}
                      </div>
                      <button
                        type="button"
                        onClick={handleRefreshCaptcha}
                        className="p-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#EBE4D8] text-text-muted hover:text-text-obsidian transition cursor-pointer"
                        title="Refresh Captcha"
                      >
                        <span className="material-symbols-outlined text-[17px]">cached</span>
                      </button>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        placeholder="Enter 4-character code"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#EBE4D8] text-xs font-mono font-bold text-text-obsidian uppercase focus:outline-none focus:border-amber-brand shadow-inner"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* 2FA OTP Method */
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EBE4D8] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-text-obsidian block">
                        NIC SMS Gateway (Mobile OTP)
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Registered Mobile: <strong className="text-text-obsidian font-mono">{selectedRoleTab === 'DHO' ? '+91 98230 •••••' : '+91 97654 •••••'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp || !email}
                        className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-text-obsidian text-[11px] font-bold border border-stone-300 transition cursor-pointer disabled:opacity-60 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">sms</span>
                        <span>{sendingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Send SMS'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const demoCode = otpHint || '448278';
                          setOtpInput(demoCode);
                          setOtpSent(true);
                          setSuccessMsg(`Auto-filled 6-digit OTP (${demoCode})`);
                        }}
                        className="px-3 py-1 rounded-full bg-amber-soft hover:bg-amber-100 text-primary-rich text-[11px] font-bold border border-amber-brand/30 transition cursor-pointer flex items-center gap-1"
                        title="Click to instantly auto-fill demo OTP code"
                      >
                        <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                        <span>Auto-Fill (448278)</span>
                      </button>
                    </div>
                  </div>

                  {/* Always Visible 6-Digit OTP Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-text-subtle uppercase tracking-wider block">
                      Enter 6-Digit Verification Code:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        autoFocus
                        value={otpInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpInput(val);
                        }}
                        placeholder="448278"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border-2 border-stone-300 focus:border-amber-brand text-center font-mono text-xl tracking-[0.35em] font-extrabold text-text-obsidian shadow-inner focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-[10.5px] text-text-muted flex items-center justify-between">
                      <span>Official test OTP: <strong className="font-mono text-emerald-800">448278</strong></span>
                      <span className="text-[10px] text-stone-400">{otpInput.length} / 6 digits</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-2">
              <div className="text-xs font-bold text-text-obsidian flex items-center gap-2">
                <span>👤 Public Beneficiary Mode</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  Open Access
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Citizens do not need government credentials. You have unrestricted access to real-time medicine availability, PHC distance sorting, and clinic hours.
              </p>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-[17px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              authenticating ||
              (selectedRoleTab !== 'CITIZEN' && authMethod === 'PASSWORD' && (!password || !captchaInput)) ||
              (selectedRoleTab !== 'CITIZEN' && authMethod === 'OTP' && otpInput.length < 6)
            }
            className="w-full py-3 bg-[#181511] hover:bg-neutral-800 text-white font-display font-bold text-xs sm:text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {authenticating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Verifying Security Gateway...</span>
              </>
            ) : selectedRoleTab === 'CITIZEN' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">public</span>
                <span>Continue as Citizen (Public Access)</span>
              </>
            ) : authMethod === 'OTP' ? (
              <>
                <span className="material-symbols-outlined text-[18px] text-amber-brand">lock_open</span>
                <span>Verify OTP &amp; Unlock Clearance</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] text-amber-brand">verified_user</span>
                <span>Authenticate &amp; Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Official Credentials Directory Helper (Collapsible) */}
        {selectedRoleTab !== 'CITIZEN' && (
          <div className="pt-2 border-t border-stone-200/80">
            <button
              type="button"
              onClick={() => setShowCredDirectory(!showCredDirectory)}
              className="text-[11px] font-bold text-text-muted hover:text-text-obsidian flex items-center gap-1 cursor-pointer"
            >
              <span>{showCredDirectory ? '▲ Hide' : '▼ View'} Official Evaluation Credentials Reference</span>
            </button>

            {showCredDirectory && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-[#EBE4D8] text-[11px] space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-stone-100 font-mono">
                  <div>
                    <span className="font-bold text-text-obsidian">🏛️ DHO Office:</span>
                    <span className="text-text-muted ml-1">dho.pune@nic.gov.in</span>
                  </div>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-text-obsidian font-bold">NIC@Gov#2026</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-text-obsidian">💊 Pharmacist:</span>
                    <span className="text-text-muted ml-1">phc.paud@nhm.gov.in</span>
                  </div>
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-text-obsidian font-bold">NHM@Pharma#2026</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
