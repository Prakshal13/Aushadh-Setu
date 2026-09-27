import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialDistrictData } from '../data/mockDistrictData';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenLocationModal,
  selectedDistrict = 'DIST-MH-PUNE',
  selectedState = 'ST-MH',
}) {
  const { currentUser, setAuthModalOpen, logout, isAuthenticated } = useAuth();
  const currentDistObj = initialDistrictData.districts.find((d) => d.id === selectedDistrict);
  const currentStateObj = initialDistrictData.states.find((s) => s.id === selectedState);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToSection = (sectionId) => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectService = (tabId) => {
    setActiveTab(tabId);
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const serviceName =
    activeTab === 'citizen'
      ? 'Services (Citizen)'
      : activeTab === 'pharmacist'
      ? 'Services (Pharmacy)'
      : activeTab === 'dho'
      ? 'Services (Command)'
      : activeTab === 'forecast'
      ? 'Services (Predictive AI)'
      : activeTab === 'simulation'
      ? 'Services (Sim Lab)'
      : 'Services';

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 pointer-events-none">
      <div className="w-full max-w-[1240px] mx-auto h-16 px-4 sm:px-6 lg:px-7 rounded-full bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_4px_24px_rgba(26,22,20,0.06)] flex items-center justify-between pointer-events-auto transition-all duration-300">
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-soft to-[#F7DFC5] flex items-center justify-center text-primary-rich border border-amber-brand/20 group-hover:scale-105 transition-transform duration-200 shadow-2xs shrink-0">
            <span className="material-symbols-outlined text-[19px]">emergency</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-[15px] sm:text-[16px] tracking-tight text-text-obsidian group-hover:text-primary-rich transition whitespace-nowrap">
                Aushadh Setu
              </span>
              <span className="text-[11px] font-medium tracking-tight text-amber-brand/90 opacity-90 hidden sm:inline whitespace-nowrap">
                (औषध सेतु)
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10px] tracking-widest uppercase font-medium text-text-subtle whitespace-nowrap">
              Supply Grid
            </span>
          </div>
        </div>

        {/* Center: Navigation Links with strict whitespace-nowrap and unified baseline */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-[13.5px] font-medium text-text-muted shrink-0">
          {/* Services Dropdown */}
          <div
            className="relative flex items-center py-2"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className={`flex items-center gap-1 transition-colors text-[13.5px] font-medium cursor-pointer whitespace-nowrap ${
                activeTab !== 'landing'
                  ? 'text-primary-rich font-bold'
                  : 'hover:text-text-obsidian'
              }`}
            >
              <span>{serviceName}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesDropdownOpen ? 'rotate-180 text-amber-brand' : 'text-text-muted'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_40px_rgba(26,22,20,0.12)] border border-[#EBE4D8] z-50">
                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-text-subtle">
                  Operational Services & Portals
                </div>

                <a
                  href="#citizen"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectService('citizen');
                  }}
                  className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors rounded-xl mx-1.5 group/item cursor-pointer text-left ${
                    activeTab === 'citizen'
                      ? 'bg-amber-soft border border-amber-brand/30'
                      : 'hover:bg-amber-soft/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-soft text-primary-rich flex items-center justify-center shrink-0 mt-0.5 border border-amber-brand/20 group-hover/item:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">search</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-text-obsidian group-hover/item:text-primary-rich flex items-center gap-1.5">
                      <span>Citizen Medicine Availability</span>
                      {activeTab === 'citizen' && <span className="text-[10px] text-amber-brand">●</span>}
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                      Live PHC stock, GPS directions & zero out-of-pocket
                    </div>
                  </div>
                </a>

                <a
                  href="#pharmacist"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectService('pharmacist');
                  }}
                  className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors rounded-xl mx-1.5 group/item cursor-pointer text-left ${
                    activeTab === 'pharmacist'
                      ? 'bg-amber-soft border border-amber-brand/30'
                      : 'hover:bg-amber-soft/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-soft text-primary-rich flex items-center justify-center shrink-0 mt-0.5 border border-amber-brand/20 group-hover/item:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">inventory_2</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-text-obsidian group-hover/item:text-primary-rich flex items-center gap-1.5">
                      <span>Pharmacist Smart Desk</span>
                      {activeTab === 'pharmacist' && <span className="text-[10px] text-amber-brand">●</span>}
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                      Vision OCR carton scan, dispense log & FEFO runway
                    </div>
                  </div>
                </a>

                <a
                  href="#dho"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectService('dho');
                  }}
                  className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors rounded-xl mx-1.5 group/item cursor-pointer text-left ${
                    activeTab === 'dho'
                      ? 'bg-amber-soft border border-amber-brand/30'
                      : 'hover:bg-amber-soft/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-soft text-primary-rich flex items-center justify-center shrink-0 mt-0.5 border border-amber-brand/20 group-hover/item:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">shield</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-text-obsidian group-hover/item:text-primary-rich flex items-center gap-1.5">
                      <span>District Command Console (DHO)</span>
                      {activeTab === 'dho' && <span className="text-[10px] text-amber-brand">●</span>}
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                      Epidemic matching, P2P transfers & audit protection
                    </div>
                  </div>
                </a>

                <a
                  href="#forecast"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectService('forecast');
                  }}
                  className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors rounded-xl mx-1.5 group/item cursor-pointer text-left ${
                    activeTab === 'forecast'
                      ? 'bg-amber-soft border border-amber-brand/30'
                      : 'hover:bg-amber-soft/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-soft text-primary-rich flex items-center justify-center shrink-0 mt-0.5 border border-amber-brand/20 group-hover/item:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">monitoring</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-text-obsidian group-hover/item:text-primary-rich flex items-center gap-1.5">
                      <span>Predictive AI Studio</span>
                      {activeTab === 'forecast' && <span className="text-[10px] text-amber-brand">●</span>}
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                      14-day Vertex AI dual-risk forecaster & R₀ curves
                    </div>
                  </div>
                </a>

                <a
                  href="#simulation"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectService('simulation');
                  }}
                  className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors rounded-xl mx-1.5 group/item cursor-pointer text-left ${
                    activeTab === 'simulation'
                      ? 'bg-amber-soft border border-amber-brand/30'
                      : 'hover:bg-amber-soft/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-soft text-primary-rich flex items-center justify-center shrink-0 mt-0.5 border border-amber-brand/20 group-hover/item:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">bolt</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-text-obsidian group-hover/item:text-primary-rich flex items-center gap-1.5">
                      <span>Outbreak Simulation Lab</span>
                      {activeTab === 'simulation' && <span className="text-[10px] text-amber-brand">●</span>}
                    </div>
                    <div className="text-[11px] text-text-muted leading-tight mt-0.5">
                      Interactive epidemic sandbox & live courier corridors
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateToSection('how-it-works')}
            className="hover:text-text-obsidian transition-colors cursor-pointer whitespace-nowrap flex items-center"
          >
            How it works
          </button>
          <button
            onClick={() => navigateToSection('start-where-you-are')}
            className="hover:text-text-obsidian transition-colors cursor-pointer whitespace-nowrap flex items-center"
          >
            About
          </button>
          <button
            onClick={() => navigateToSection('impact')}
            className="hover:text-text-obsidian transition-colors cursor-pointer whitespace-nowrap flex items-center"
          >
            Blog
          </button>
          <button
            onClick={() => navigateToSection('request-access')}
            className="hover:text-text-obsidian transition-colors cursor-pointer whitespace-nowrap flex items-center"
          >
            Contact
          </button>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Location / District Auto-Detect & Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-amber-soft/60 border border-[#EBE4D8] hover:border-amber-brand/40 text-xs font-semibold text-text-obsidian transition shadow-2xs cursor-pointer group shrink-0 whitespace-nowrap"
            title="Auto-Detect GPS or Switch District"
          >
            <span className="text-amber-brand flex items-center justify-center text-xs">📍</span>
            <span className="max-w-[85px] sm:max-w-[125px] truncate text-text-obsidian group-hover:text-primary-rich">
              {currentDistObj ? currentDistObj.name : 'Location'}
              {currentStateObj ? `, ${currentStateObj.code}` : ''}
            </span>
            <span className="text-[9px] text-text-muted group-hover:text-text-obsidian">▼</span>
          </button>

          {/* User Authentication Pill: Shows Officer Clearance + Sign Out when logged in; Shows "Sign In" when logged out */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-soft/70 hover:bg-amber-soft border border-amber-brand/30 text-xs font-bold text-primary-rich transition shadow-2xs cursor-pointer group whitespace-nowrap"
                title="Account Clearance"
              >
                <span className="text-xs">{currentUser.avatar}</span>
                <span>{currentUser.role === 'DHO' ? 'DHO' : 'Pharmacist'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              </button>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100 hover:bg-rose-50 text-text-muted hover:text-rose-700 text-xs font-semibold transition border border-stone-200 hover:border-rose-200 cursor-pointer whitespace-nowrap"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-stone-100 border border-[#EBE4D8] hover:border-amber-brand/40 text-xs font-semibold text-text-obsidian hover:text-primary-rich transition shadow-2xs cursor-pointer group shrink-0 whitespace-nowrap"
              title="Official Sign In"
            >
              <span className="material-symbols-outlined text-[15px] text-text-muted group-hover:text-primary-rich">login</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Conditional Right Action: Request Pilot on landing for unauthenticated visitors */}
          {!isAuthenticated && activeTab === 'landing' && (
            <button
              onClick={() => handleSelectService('dho')}
              className="inline-flex items-center gap-2 pl-3.5 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-[#181511] text-white text-[12.5px] sm:text-[13px] font-medium hover:bg-neutral-800 transition-all duration-200 shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap hidden sm:inline">Request Pilot</span>
              <span className="whitespace-nowrap sm:hidden">Pilot</span>
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A66E2E] to-[#F1B96B] flex items-center justify-center text-text-obsidian text-[11px] font-bold shrink-0">
                &gt;
              </span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-text-obsidian transition"
            aria-label="Toggle menu"
          >
            <span className="text-xs font-bold">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-sm mx-auto mt-2 p-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_16px_40px_rgba(26,22,20,0.12)] border border-[#EBE4D8] pointer-events-auto space-y-3">
          {/* Mobile Location Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLocationModal?.();
            }}
            className="w-full text-left p-2.5 rounded-xl bg-amber-soft/40 hover:bg-amber-soft text-xs font-semibold text-text-obsidian flex items-center justify-between border border-amber-brand/20 transition"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-brand text-sm">📍</span>
              <span className="truncate">
                {currentDistObj ? currentDistObj.name : 'Select Location'}, {currentStateObj ? currentStateObj.name : ''}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20 shrink-0">
              Change (GPS)
            </span>
          </button>

          {/* Mobile Sign In / User Status */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currentUser.avatar}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-obsidian">{currentUser.name}</span>
                    <span className="text-[10px] text-text-muted">{currentUser.designation}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-stone-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full text-center py-2 rounded-xl bg-[#181511] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Sign In (Officer Access)</span>
              </button>
            )}
          </div>

          <div className="text-[10px] uppercase font-bold tracking-wider text-text-subtle px-1">
            Navigation & Portals
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleSelectService('citizen')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-soft text-xs font-bold text-text-obsidian flex items-center justify-between"
            >
              <span>🔍 Citizen Medicine Availability</span>
              {activeTab === 'citizen' && <span className="text-amber-brand">●</span>}
            </button>
            <button
              onClick={() => handleSelectService('pharmacist')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-soft text-xs font-bold text-text-obsidian flex items-center justify-between"
            >
              <span>📦 Pharmacist Smart Desk</span>
              {activeTab === 'pharmacist' && <span className="text-amber-brand">●</span>}
            </button>
            <button
              onClick={() => handleSelectService('dho')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-soft text-xs font-bold text-text-obsidian flex items-center justify-between"
            >
              <span>🛡️ District Command Console (DHO)</span>
              {activeTab === 'dho' && <span className="text-amber-brand">●</span>}
            </button>
            <button
              onClick={() => handleSelectService('forecast')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-soft text-xs font-bold text-text-obsidian flex items-center justify-between"
            >
              <span>📈 Predictive AI Studio</span>
              {activeTab === 'forecast' && <span className="text-amber-brand">●</span>}
            </button>
            <button
              onClick={() => handleSelectService('simulation')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-amber-soft text-xs font-bold text-text-obsidian flex items-center justify-between"
            >
              <span>⚡ Outbreak Simulation Lab</span>
              {activeTab === 'simulation' && <span className="text-amber-brand">●</span>}
            </button>
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-around text-xs font-medium text-text-muted">
            <button onClick={() => navigateToSection('how-it-works')} className="hover:text-text-obsidian">
              How it works
            </button>
            <button onClick={() => navigateToSection('start-where-you-are')} className="hover:text-text-obsidian">
              About
            </button>
            <button onClick={() => navigateToSection('impact')} className="hover:text-text-obsidian">
              Blog
            </button>
            <button onClick={() => navigateToSection('request-access')} className="hover:text-text-obsidian">
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
