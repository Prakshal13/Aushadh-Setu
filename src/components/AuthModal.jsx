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
  const { currentUser, authenticate, logout, authModalOpen, setAuthModalOpen } = useAuth();

  // Active form tab: 'DHO' | 'PHARMACIST' | 'CITIZEN'
  const [selectedRoleTab, setSelectedRoleTab] = useState('DHO');
  const [email, setEmail] = useState('dho.pune@nic.gov.in');
  const [password, setPassword] = useState('NIC@Gov#2026');
  const [captchaInput, setCaptchaInput] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState(() => generateCaptcha());
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Sync default fields when tab switches
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setCaptchaInput('');
    setExpectedCaptcha(generateCaptcha());

    if (selectedRoleTab === 'DHO') {
      setEmail('dho.pune@nic.gov.in');
      setPassword('NIC@Gov#2026');
    } else if (selectedRoleTab === 'PHARMACIST') {
      setEmail('phc.paud@nhm.gov.in');
      setPassword('NHM@Pharma#2026');
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

  const handleFillDemo = () => {
    setErrorMsg('');
    setCaptchaInput(expectedCaptcha);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedRoleTab === 'CITIZEN') {
      logout();
      setSuccessMsg('Switched to Citizen Public Access.');
      setTimeout(() => setAuthModalOpen(false), 600);
      return;
    }

    setAuthenticating(true);

    setTimeout(() => {
      const result = authenticate({
        email,
        password,
        captchaInput,
        expectedCaptcha,
      });

      setAuthenticating(false);

      if (result.success) {
        setSuccessMsg(`✓ Authentication Successful! Clearance Level: ${result.user.role}`);
        setTimeout(() => setAuthModalOpen(false), 900);
      } else {
        setErrorMsg(result.error);
        setExpectedCaptcha(generateCaptcha());
        setCaptchaInput('');
      }
    }, 600);
  };

  const isAlreadyLoggedIn = currentUser.role !== USER_ROLES.CITIZEN;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EBE4D8] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
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
        <div className="space-y-1.5 pr-8">
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
            District command and pharmacy inventory records require verified government credentials.
          </p>
        </div>

        {/* Active Session Card (If Logged In) */}
        {isAlreadyLoggedIn && (
          <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div>
                <div className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted font-mono">{currentUser.email}</div>
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
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-text-subtle uppercase tracking-wider">
            Select Clearance Portal:
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

        {/* Real Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedRoleTab !== 'CITIZEN' ? (
            <>
              {/* Officer Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-obsidian block">
                  Official Email / Officer ID:
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                    badge
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRoleTab === 'DHO' ? 'dho.pune@nic.gov.in' : 'phc.paud@nhm.gov.in'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EBE4D8] text-xs font-semibold text-text-obsidian focus:outline-none focus:border-amber-brand shadow-inner font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-obsidian">
                    Government Security Password:
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] font-bold text-amber-brand hover:underline cursor-pointer"
                  >
                    Auto-Fill Captcha
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#EBE4D8] text-xs font-semibold text-text-obsidian focus:outline-none focus:border-amber-brand shadow-inner font-mono"
                  />
                </div>
              </div>

              {/* Security Captcha */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-obsidian block">
                  Security Captcha Verification:
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between bg-stone-200 px-3.5 py-2 rounded-xl border border-stone-300 select-none tracking-widest font-mono font-extrabold text-sm text-stone-800 line-through">
                    {expectedCaptcha}
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EBE4D8] text-text-muted hover:text-text-obsidian transition cursor-pointer"
                    title="Refresh Captcha"
                  >
                    <span className="material-symbols-outlined text-[18px]">cached</span>
                  </button>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    placeholder="Enter 4-char code"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#EBE4D8] text-xs font-mono font-bold text-text-obsidian uppercase focus:outline-none focus:border-amber-brand shadow-inner"
                  />
                </div>
              </div>
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
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={authenticating}
            className="w-full py-3 bg-[#181511] hover:bg-neutral-800 text-white font-display font-bold text-xs sm:text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {authenticating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Verifying Security Protocol...</span>
              </>
            ) : selectedRoleTab === 'CITIZEN' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">public</span>
                <span>Continue as Citizen (Public Access)</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] text-amber-brand">verified_user</span>
                <span>Verify Credentials &amp; Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
