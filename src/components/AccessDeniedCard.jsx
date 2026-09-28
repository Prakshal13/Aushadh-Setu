import React from 'react';
import { useAuth, USER_ROLES } from '../context/AuthContext';

export default function AccessDeniedCard({ requiredRole = USER_ROLES.DHO, onSwitchTab }) {
  const { currentUser, openAuthForRole } = useAuth();

  const isDhoRequired = requiredRole === USER_ROLES.DHO;
  const targetTitle = isDhoRequired ? 'District Health Officer (DHO)' : 'Staff Pharmacist';
  const roleCode = isDhoRequired ? USER_ROLES.DHO : USER_ROLES.PHARMACIST;

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white border border-[#EBE4D8] shadow-lg text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-soft text-primary-rich flex items-center justify-center border border-amber-brand/30 shadow-inner">
        <span className="material-symbols-outlined text-[34px]">lock</span>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
          <span>Access Restricted • Official Clearance Required</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-text-obsidian">
          {targetTitle} Terminal Restricted
        </h2>
        <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
          You are currently viewing AushadhSetu as <strong className="text-text-obsidian font-semibold">{currentUser.name} ({currentUser.designation})</strong>. Under Ministry of Health and Family Welfare (MoHFW) guidelines and the Digital Information Security in Healthcare Act (DISHA), this terminal strictly requires verified <strong className="text-primary-rich">{targetTitle}</strong> credentials.
        </p>
      </div>

      {/* Security Protocol Notice */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8] text-xs text-text-muted space-y-1.5 max-w-md mx-auto text-left">
        <div className="font-bold text-text-obsidian flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-emerald-700">verified_user</span>
          <span>DISHA / GFR 2017 Audit Compliance</span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-muted">
          Peer-to-peer drug dispatch authorizations, epidemic surge overrides, and statutory Form 18-B manifests carry legal audit liability. Only authenticated officers may access this terminal.
        </p>
      </div>

      {/* Authentication Gateway Buttons (No Blind Bypass!) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => openAuthForRole(roleCode)}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#181511] hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-amber-brand">login</span>
          <span>Sign In with {targetTitle} Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => openAuthForRole(roleCode)}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FAF8F5] hover:bg-stone-100 text-text-obsidian font-bold text-xs border border-[#EBE4D8] transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[15px] text-primary-rich">key</span>
          <span>2FA Mobile OTP / Directory</span>
        </button>

        {onSwitchTab && (
          <button
            type="button"
            onClick={() => onSwitchTab('citizen')}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-text-muted hover:text-text-obsidian font-medium text-xs transition cursor-pointer"
          >
            ← Return to Citizen Finder
          </button>
        )}
      </div>
    </div>
  );
}
