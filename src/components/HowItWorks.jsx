import React, { useState } from 'react';

export default function HowItWorks({ setActiveTab }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: '48-Hour Baseline Vulnerability Audit',
      subtitle: 'Nodal Ingestion & Health Facility Mapping',
      description:
        'We rapidly ingest historical epidemiological curves and physical warehouse counts from district stores to map vulnerability vectors before seasonal disease transmission accelerates.',
      points: [
        'Syncs with IDSP Form S (syndromic), Form P (presumptive), and Form L (lab-confirmed)',
        'Audits physical stock across CHCs, PHCs, and Sub-Centers in under 48 hours',
        'Flags vulnerable peripheral clinics with less than 3 days of critical buffer stock',
      ],
      tag: 'Phase 1: Ingestion',
    },
    {
      num: 2,
      title: '90-Day Predictive Surge Plan (SEIR Math Core)',
      subtitle: 'Dynamic Burn-Rate Modeling & 14-Day Advance Window',
      description:
        'Automated mathematical burn-rate formulation calculates outpatient surge multipliers, establishing buffer reserves across peripheral healthcare facilities with zero manual stock sheets.',
      points: [
        'SEIR epidemic modeling correlates monsoon rainfall anomalies with disease velocity',
        'Calculates Days of Stock Remaining (DSR) in real time down to individual clinic shelves',
        'Generates 14-day advance rebalancing recommendations before stockouts occur',
      ],
      tag: 'Phase 2: Prediction',
    },
    {
      num: 3,
      title: 'Execution, Automated FEFO Matching & Cold-Chain IoT',
      subtitle: 'Logistical Highway Corridors & Real-Time Fleet Telemetry',
      description:
        'First-Expiry-First-Out automated algorithms pair clinics facing stockouts with depots holding near-expiry surplus. Designated refrigerated vans maintain strict 2°C–8°C thermal logs in transit.',
      points: [
        'FEFO pairing eliminates expired medicine dumping while averting clinical stockouts',
        'Automates highway dispatch routes with live distance and transit time calculations',
        'IoT cold-chain telemetry monitors temperature continuously, preventing potency loss',
      ],
      tag: 'Phase 3: Rebalancing',
    },
    {
      num: 4,
      title: 'Scale, Continuous Governance & Statutory Form 18-B Sign-Off',
      subtitle: 'Human-in-the-Loop Approval & Tamper-Evident State Audit',
      description:
        'Seamless state-wide expansion with continuous compliance logs aligned to General Financial Rules (GFR 2017). District Health Officers hold mandatory statutory sign-off before vehicle release.',
      points: [
        'Generates official MoHFW Emergency Drug Transit Manifests (Form 18-B)',
        'Digital CMO cryptographic signature stamp guarantees legal transport validity',
        'Immutable audit ledger saves crores in CAG write-offs and out-of-pocket medical debt',
      ],
      tag: 'Phase 4: Governance',
    },
  ];

  return (
    <div className="space-y-12 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary">
      {/* 1. Hero Section */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-soft/60 to-transparent pointer-events-none rounded-full blur-2xl"></div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>A Proven, 4-Stage Sovereign Framework</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-obsidian tracking-tight leading-tight">
            How Aushadh Setu Deploys Across Districts
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            A clear, auditable operational model—so your district health mission prevents drug stock-outs and expiry losses rapidly, without bureaucratic paralysis.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab && setActiveTab('dho')}
              className="px-5 py-2.5 rounded-full bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Explore DHO Command Deck</span>
              <span className="material-symbols-outlined text-[16px] text-amber-accent">arrow_forward</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('pharmacist')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-text-obsidian text-xs font-bold border border-[#EBE4D8] shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>Inspect Pharmacist Intake</span>
              <span className="material-symbols-outlined text-[16px] text-primary-rich">qr_code_scanner</span>
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('citizen')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-text-obsidian text-xs font-bold border border-[#EBE4D8] shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>Citizen Medicine Finder</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">travel_explore</span>
            </button>
          </div>
        </div>

        {/* 3 Core Highlight Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-stone-100 relative z-10">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span className="text-xs font-bold uppercase tracking-wider">10+ State Seasons</span>
            </div>
            <p className="font-display font-bold text-base text-text-obsidian">Epidemic Patterns Modeled</p>
            <p className="text-[11px] text-text-muted">
              Vector surge curves calibrated across Maharashtra, Tamil Nadu, Rajasthan, Uttarakhand, and Delhi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">timelapse</span>
              <span className="text-xs font-bold uppercase tracking-wider">14-Day Advance Window</span>
            </div>
            <p className="font-display font-bold text-base text-text-obsidian">Buffer Stock Positioning</p>
            <p className="text-[11px] text-text-muted">
              Pre-allocates oral rehydration salts and antipyretics before secondary outpatient hospitalizations peak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <div className="flex items-center gap-2 text-primary-rich">
              <span className="material-symbols-outlined text-[20px]">auto_delete</span>
              <span className="text-xs font-bold uppercase tracking-wider">Zero-Waste FEFO</span>
            </div>
            <p className="font-display font-bold text-base text-text-obsidian">&lt;0.02% Audit Write-Offs</p>
            <p className="text-[11px] text-text-muted">
              Diverts near-expiry batches from warehouse landfill dumping directly into high-consumption emergency wards.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Strategic Clarity Banner */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            Architectural Principle
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            What you’re really deploying: predictive certainty + audit clarity
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Frontline healthcare centers do not suffer from medicine shortages because factories stop producing; stockouts occur because consumption signals lag behind disease velocity. Aushadh Setu collapses the 21-day bureaucratic requisition cycle into a real-time, algorithmic redistribution mesh—ensuring essential antimicrobials and antipyretics physically move before emergency wards peak.
          </p>
        </div>

        <div className="w-full lg:w-80 p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-3 shrink-0 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-soft text-primary-rich flex items-center justify-center font-bold text-base border border-amber-brand/20">
              📊
            </div>
            <div>
              <div className="font-display font-bold text-sm text-text-obsidian">IDSP Live Sentinel Ingestion</div>
              <div className="text-[10.5px] text-text-muted">740+ District Surveillance Vectors</div>
            </div>
          </div>
          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-rich rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Surge Burn-Rate Confidence:</span>
            <strong className="text-primary-rich font-mono">98.4%</strong>
          </div>
        </div>
      </section>

      {/* 3. The 4-Step Interactive Deployment Model */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
              Systemic Operational Architecture
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1">
              The 4-Step Deployment Model
            </h2>
            <p className="text-xs text-text-muted">
              Select any step to inspect frontline workflows, automated telemetry, and verification artifacts.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-soft text-primary-rich border border-amber-brand/20 shrink-0">
            Step {activeStep} of 4 Active
          </span>
        </div>

        {/* Step Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveStep(s.num)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeStep === s.num
                  ? 'bg-[#FAF8F5] border-amber-brand/60 shadow-md ring-2 ring-amber-brand/20'
                  : 'bg-white border-[#EBE4D8] hover:border-amber-brand/30'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      activeStep === s.num
                        ? 'bg-[#181511] text-white'
                        : 'bg-stone-100 text-text-obsidian'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="text-[9.5px] font-mono uppercase font-bold text-text-subtle">
                    {s.tag}
                  </span>
                </div>
                <div className="font-display font-bold text-sm text-text-obsidian mt-2 leading-tight">
                  {s.title}
                </div>
              </div>
              <span className="text-[10.5px] text-primary-rich font-semibold mt-3 flex items-center gap-1">
                <span>Inspect Step</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Detailed Canvas */}
        {(() => {
          const cur = steps.find((s) => s.num === activeStep) || steps[0];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-3xl bg-[#FAF8F5] border border-[#EBE4D8] items-stretch">
              {/* Left Column: Visual Operational Canvas (Col 6) */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-[#EBE4D8] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="font-display font-bold text-xs text-text-obsidian">
                      {cur.subtitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-soft text-primary-rich px-2 py-0.5 rounded-md border border-amber-brand/20">
                    LIVE WORKFLOW
                  </span>
                </div>

                {/* Step Specific Visual Simulation HUD */}
                {activeStep === 1 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">Facilities Surveyed</span>
                        <span className="font-display font-bold text-xl text-text-obsidian">50 Centers</span>
                        <span className="text-[10px] text-emerald-700 block mt-0.5">✓ GPS Verified</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">IDSP Ingestion Lag</span>
                        <span className="font-display font-bold text-xl text-primary-rich">&lt; 30 Minutes</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">Automated Monday Cron</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-soft/40 border border-amber-brand/20 text-xs text-text-obsidian flex items-start gap-2.5">
                      <span className="text-base">📢</span>
                      <div>
                        <strong>CMO Outbreak Audit:</strong> Vulnerability scan completed for Western Ghats monsoon corridor. 8 peripheral sub-centers flagged with &lt;3.5 days DSR.
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-text-obsidian">
                        <span>14-Day Advance Buffer Allocation</span>
                        <span className="text-primary-rich font-mono">PHC Paud • 350 Units</span>
                      </div>
                      <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-rich rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-text-obsidian">
                        <span>IV Fluid &amp; PCM Formulary Influx</span>
                        <span className="text-emerald-800 font-mono">Depot Surplus Matched</span>
                      </div>
                      <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>SEIR Consumption Curve Synced</span>
                      </span>
                      <span>Zero Shortage Drift</span>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-amber-brand/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🚚</span>
                        <div>
                          <div className="font-mono font-bold text-xs text-text-obsidian">
                            MH-12-RN-8842 (Cold-Chain Van)
                          </div>
                          <div className="text-[10px] text-text-muted">
                            Corridor: Central Depot ➔ PHC Paud (24 km • 42 mins)
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200">
                        3.8°C Safe
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">Donor Expiry</span>
                        <strong className="text-amber-800 font-mono">40 Days (FEFO Priority)</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">Recipient Buffer</span>
                        <strong className="text-emerald-800 font-mono">▲ +18.9 Days Restocked</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Statutory Manifest Form 18-B</span>
                        <span className="font-mono">MH-DISP-2026-9481</span>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Countersigned by District Health Officer (DHO), Pune District.
                      </div>
                      <div className="font-mono text-[9.5px] text-emerald-700">
                        SHA256: 8f4b1092a7e93c12...49e1 • GFR 2017 Audit Cleared
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">CAG Loss Averted</span>
                        <strong className="text-primary-rich font-mono">₹1,09,200</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8]">
                        <span className="text-[10px] text-text-muted block">Expiry Write-Offs</span>
                        <strong className="text-emerald-800 font-mono">0.00% Zero-Loss</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-stone-100">
                  <span>Standardized under MoHFW National Health Mission Protocol</span>
                  <span className="text-emerald-700 font-bold">✓ C-DAC Compliant</span>
                </div>
              </div>

              {/* Right Column: Narrative & Key Deliverables (Col 6) */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-rich">
                      Operational Workflow
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-text-obsidian">
                      {cur.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {cur.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block">
                      Core Institutional Capabilities:
                    </span>
                    {cur.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-text-obsidian">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-tight">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep < 4 ? activeStep + 1 : 1)}
                    className="px-4 py-2 rounded-xl bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{activeStep < 4 ? `Proceed to Step ${activeStep + 1}` : 'Restart Deployment Tour'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('dho')}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-text-obsidian text-xs font-bold border border-[#EBE4D8] transition cursor-pointer"
                  >
                    Test Live in DHO Dashboard
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 4. Ways to Deploy (3 Engagement Tiers) */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            Institutional Modalities
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1">
            Ways to Deploy Aushadh Setu
          </h2>
          <p className="text-xs text-text-muted">
            Tailored for high-vulnerability seasonal outbreaks, district-wide emergency stabilization, or sovereign state health systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] hover:border-amber-brand/40 transition flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-subtle">
                Option 01
              </span>
              <h3 className="font-display font-bold text-base text-text-obsidian">Single District Pilot</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Best for verifying predictive rebalancing in one high-transmission corridor before state-wide adoption.
              </p>
              <div className="pt-2 border-t border-stone-200/60 space-y-1.5 text-xs text-text-obsidian">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>48-hour baseline audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>15 prioritized NLEM epidemic drugs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Digital gate-pass dispatch app</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('dho')}
              className="w-full py-2 bg-white hover:bg-stone-50 border border-[#EBE4D8] text-text-obsidian text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Launch Pilot Corridor
            </button>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="p-5 rounded-2xl bg-amber-soft/40 border-2 border-primary-rich shadow-md flex flex-col justify-between space-y-4 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary-rich text-white font-mono text-[9px] font-bold uppercase">
              Most Deployed
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-rich">
                Option 02
              </span>
              <h3 className="font-display font-bold text-base text-text-obsidian">90-Day Seasonal Surge Sprint</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Comprehensive multi-district rebalancing and automated FEFO redistribution during peak transmission seasons.
              </p>
              <div className="pt-2 border-t border-amber-brand/20 space-y-1.5 text-xs text-text-obsidian">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Inter-facility dynamic stock swaps</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>IoT cold-chain telemetry across vans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Gemini Vision carton scanner rollout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Zero-waste expiry avoidance guarantee</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('forecast')}
              className="w-full py-2 bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              Deploy 90-Day Sprint
            </button>
          </div>

          {/* Tier 3 */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] hover:border-amber-brand/40 transition flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-subtle">
                Option 03
              </span>
              <h3 className="font-display font-bold text-base text-text-obsidian">State Mission Grid</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                For State National Health Missions needing federated, perpetual integration with e-Aushadhi, DVDMS, and sovereign public infrastructure.
              </p>
              <div className="pt-2 border-t border-stone-200/60 space-y-1.5 text-xs text-text-obsidian">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Full State e-Aushadhi bidirectional sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Dedicated State Command Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>C-DAC encrypted audit export schemas</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('dho')}
              className="w-full py-2 bg-white hover:bg-stone-50 border border-[#EBE4D8] text-text-obsidian text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Consult Mission Architect
            </button>
          </div>
        </div>
      </section>

      {/* 5. Operational Responsibility Matrix */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-primary-rich">
            Clear Operational Boundaries
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1">
            How Work Gets Executed (Zero Friction for Doctors)
          </h2>
          <p className="text-xs text-text-muted">
            Clear institutional division between algorithmic automation and district constitutional authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aushadh Setu Automates */}
          <div className="p-5 rounded-2xl bg-amber-soft/40 border border-amber-brand/30 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-amber-brand/30 flex items-center justify-center font-bold text-base">
                🤖
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-text-obsidian">Aushadh Setu Grid Automates</h3>
                <p className="text-[10.5px] text-text-muted">Zero administrative burden on medical officers</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-amber-brand/20 space-y-0.5">
                <strong className="text-text-obsidian block">Predictive Burn-Rate Modeling:</strong>
                <p className="text-text-muted">Synthesizes weather shifts, historical dengue surges, and outpatient admissions to forecast 14 days ahead.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-brand/20 space-y-0.5">
                <strong className="text-text-obsidian block">Algorithmic FEFO Rebalancing:</strong>
                <p className="text-text-muted">Matches expiring batches in low-demand centers to high-surge PHCs before spoilage occurs.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-brand/20 space-y-0.5">
                <strong className="text-text-obsidian block">Continuous Cold-Chain Telemetry:</strong>
                <p className="text-text-muted">Automated alert triggers whenever temperature-sensitive drugs cross 2°C–8°C thermal thresholds.</p>
              </div>
            </div>
          </div>

          {/* District Leadership Retains */}
          <div className="p-5 rounded-2xl bg-white border border-[#EBE4D8] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-base">
                🏛️
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-text-obsidian">District Leadership Retains</h3>
                <p className="text-[10.5px] text-text-muted">Statutory constitutional authority &amp; sign-off</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-0.5">
                <strong className="text-text-obsidian block">Mandatory Statutory Sign-Off:</strong>
                <p className="text-text-muted">District Health Officer or CMO must review and digitally countersign every dispatch manifest.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-0.5">
                <strong className="text-text-obsidian block">Clinical Priority Allocation:</strong>
                <p className="text-text-muted">Chief Medical Officers can tune dispatch quantities or reprioritize vulnerable tribal sub-centers.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-0.5">
                <strong className="text-text-obsidian block">Physical Vehicle Release:</strong>
                <p className="text-text-muted">District transport depot retains mechanical custody and physical dispatch of cold-chain medical vans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
