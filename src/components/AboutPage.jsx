import React from 'react';

export default function AboutPage({ setActiveTab }) {
  return (
    <div className="space-y-12 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary max-w-5xl mx-auto">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6 relative overflow-hidden">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>National Public Health Supply Mesh • DISHA / MoHFW Aligned</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-obsidian tracking-tight leading-tight">
              About Aushadh Setu (औषध सेतु)
            </h1>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Aushadh Setu is India’s sovereign outbreak-aware medicine supply and autonomous redistribution grid. We collapse the 21-day bureaucratic drug procurement cycle into real-time, algorithmic peer-to-peer rebalancing so no patient dies of preventable medicine stockouts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab && setActiveTab('how-it-works')}
                className="px-5 py-2.5 rounded-full bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Explore 4-Step Deployment Framework</span>
                <span className="material-symbols-outlined text-[16px] text-amber-accent">arrow_forward</span>
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('contact')}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-text-obsidian text-xs font-bold border border-[#EBE4D8] shadow-2xs transition flex items-center gap-2 cursor-pointer"
              >
                <span>Request 48-Hour District Pilot</span>
                <span className="material-symbols-outlined text-[16px] text-primary-rich">mail</span>
              </button>
            </div>
          </div>

          {/* Official Seal Showcase */}
          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-white/80 border border-[#EBE4D8] shadow-xs shrink-0 self-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-amber-brand/20 shadow-2xs bg-[#FAF8F5]">
              <img
                src="/logo-emblem.png"
                alt="Aushadh Setu Official Seal"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-bold text-text-subtle uppercase tracking-widest mt-2.5">
              Official Grid Seal
            </span>
          </div>
        </div>

        {/* 3 Core Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-stone-100 relative z-10">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Core Mandate</span>
            <p className="font-display font-bold text-lg text-text-obsidian">Zero Stockout Mortalities</p>
            <p className="text-xs text-text-muted">
              Pre-positioning essential antimicrobials and IV fluids before outpatient hospitalizations peak.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Fiscal Recovery</span>
            <p className="font-display font-bold text-lg text-primary-rich">₹48.2 Cr Expiry Averted</p>
            <p className="text-xs text-text-muted">
              First-Expiry-First-Out (FEFO) routing transfers near-expiry depot stock directly to active clinics.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Potency Assurance</span>
            <p className="font-display font-bold text-lg text-emerald-800">2°C–8°C Cold Chain</p>
            <p className="text-xs text-text-muted">
              Continuous cellular IoT temperature telemetry for vaccines, antivenoms, and anti-rabies serums.
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Dual-Crisis Paradox */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
        <div className="space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            The Structural Challenge
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            The Dual-Crisis Paradox in Public Health Supply Chains
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Frontline healthcare centers in India do not suffer from medicine shortages because factories stop producing; stockouts occur because of a systemic mismatch between disease velocity and bureaucratic requisition cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-800">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <h3 className="font-display font-bold text-sm sm:text-base">Crisis 1: The 21-Day Bureaucratic Lag</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              During seasonal monsoon outbreaks (Dengue, Malaria, Acute Diarrhoea), outpatient clinic footfalls double within 48 hours. However, conventional government drug indenting follows monthly or quarterly bureaucratic cycles, leaving clinics running dry at the peak of transmission.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              <h3 className="font-display font-bold text-sm sm:text-base">Crisis 2: The Near-Expiry Discard Irony</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Simultaneously, district warehouses hold thousands of medicine cartons that sit untouched until their expiry date passes, leading to massive annual CAG audit write-offs and incineration. Surplus medicine expires in warehouses while patients 25 km away are forced to pay out-of-pocket at private chemist shops.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The 4 Core Architectural Innovations */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
        <div className="space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            How Setu Solves It
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            The 4 Technological Pillars of Aushadh Setu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <h3 className="font-display font-bold text-sm text-text-obsidian">1. SEIR Epidemiological Prediction</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Couples open meteorological data (monsoon rainfall anomalies, humidity) with Integrated Disease Surveillance Programme (IDSP) syndromic signals to forecast 14-day outpatient surges before clinics run dry.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">autorenew</span>
              <h3 className="font-display font-bold text-sm text-text-obsidian">2. Autonomous FEFO Redistribution</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Our First-Expiry-First-Out algorithm automatically matches depots holding near-expiry stock (e.g. 40 days shelf-life) with emergency clinics experiencing zero-stock deficits, virtually eliminating medicine waste.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">thermostat</span>
              <h3 className="font-display font-bold text-sm text-text-obsidian">3. Active Cellular IoT Cold-Chain</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Refrigerated delivery vans are equipped with real-time temperature loggers. Temperature is tracked live in transit, alerting dispatchers immediately if temperature deviates from the 2°C–8°C window.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <h3 className="font-display font-bold text-sm text-text-obsidian">4. Statutory Sign-Off (GFR 2017)</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Human-in-the-loop executive governance. District Health Officers hold mandatory statutory sign-off, generating cryptographically verified Emergency Drug Transit Manifests (Form 18-B) that clear CAG audits.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Institutional Standards & Pilot Coverage */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5">
        <div className="space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            Sovereign Coverage
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            Active Pilot States & Interoperability Standards
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { state: 'Maharashtra', code: 'MH', districts: '36 Districts', status: 'Active Grid' },
            { state: 'Rajasthan', code: 'RJ', districts: '33 Districts', status: 'Active Grid' },
            { state: 'Delhi (NCT)', code: 'DL', districts: '11 Districts', status: 'Active Grid' },
            { state: 'Uttarakhand', code: 'UK', districts: '13 Districts', status: 'Active Grid' },
            { state: 'Tamil Nadu', code: 'TN', districts: '38 Districts', status: 'Active Grid' },
          ].map((item) => (
            <div key={item.code} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] text-center space-y-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-text-obsidian border border-stone-200">
                {item.code}
              </span>
              <div className="font-display font-bold text-xs text-text-obsidian mt-1">{item.state}</div>
              <div className="text-[10px] text-text-muted">{item.districts}</div>
              <div className="text-[9.5px] font-semibold text-emerald-700">{item.status}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-text-muted space-y-1 leading-relaxed">
          <div className="font-bold text-text-obsidian flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-brand">security</span>
            <span>Compliance &amp; Operational Truthfulness Notice:</span>
          </div>
          <p>
            Aushadh Setu operates in accordance with the Digital Information Security in Healthcare Act (DISHA), Ministry of Health & Family Welfare (MoHFW) guidelines, and General Financial Rules (GFR 2017 Rules 149 & 153). Live climate telemetry is sourced in real-time from Open-Meteo ECMWF feeds, carton vision OCR is powered by Google Gemini 1.5 Flash, and healthcare facility spatial records represent authenticated district pilot data.
          </p>
        </div>
      </section>
    </div>
  );
}
