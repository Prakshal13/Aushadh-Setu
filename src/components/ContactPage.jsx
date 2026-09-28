import React, { useState } from 'react';

export default function ContactPage({ setActiveTab }) {
  const [activeTabSection, setActiveTabSection] = useState('HOTLINE');
  const [pilotFormSubmitted, setPilotFormSubmitted] = useState(false);
  const [emergencyAlertSubmitted, setEmergencyAlertSubmitted] = useState(false);
  const [citizenGrievanceSubmitted, setCitizenGrievanceSubmitted] = useState(false);

  // Pilot form state
  const [pilotData, setPilotData] = useState({
    officerName: 'Dr. Neha Kulkarni',
    designation: 'Chief Medical Officer (CMO)',
    state: 'Maharashtra',
    district: 'Pune District',
    email: 'cmo.pune@gov.in',
    phone: '+91 98221 44321',
    vulnerabilityFocus: 'Dengue & Acute Viral Fevers (Monsoon Surge)',
  });

  // Emergency SOS state
  const [emergencyData, setEmergencyData] = useState({
    facilityName: 'PHC Paud (Mulshi Taluk)',
    medicineNeeded: 'Ringer Lactate (RL) 500ml IV Infusion',
    stockRemainingUnits: '15 units (Depletion in <12 hours)',
    urgency: 'CRITICAL_IMMEDIATE',
  });

  // Citizen grievance state
  const [grievanceData, setGrievanceData] = useState({
    patientName: 'Ramesh Jadhav',
    phone: '+91 94231 10293',
    district: 'Pune',
    facilityVisited: 'PHC Shirur',
    medicineUnavailable: 'Metformin 500mg',
  });

  return (
    <div className="space-y-10 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary max-w-5xl mx-auto">
      {/* 1. Hero */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5 relative overflow-hidden">

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>24/7 Nodal Epidemic Dispatch &amp; State Liaison</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-obsidian tracking-tight leading-tight">
            Institutional Liaison &amp; Nodal Contact Desk
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Direct institutional channels for State Health Mission Directors, District Health Officers, hospital administrators, and citizens reporting frontline medicine deficits.
          </p>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTabSection('HOTLINE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'HOTLINE'
                ? 'bg-[#181511] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-text-muted hover:text-text-obsidian border border-[#EBE4D8]'
            }`}
          >
            <span>📞</span>
            <span>24/7 Emergency Crisis Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('PILOT_REQUEST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'PILOT_REQUEST'
                ? 'bg-[#181511] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-text-muted hover:text-text-obsidian border border-[#EBE4D8]'
            }`}
          >
            <span>🏛️</span>
            <span>Request 48-Hour District Pilot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('CITIZEN_GRIEVANCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'CITIZEN_GRIEVANCE'
                ? 'bg-[#181511] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-text-muted hover:text-text-obsidian border border-[#EBE4D8]'
            }`}
          >
            <span>👤</span>
            <span>Citizen Medicine Unavailability</span>
          </button>
        </div>
      </section>

      {/* 2. Dynamic Content Panel */}

      {/* Tab A: 24/7 Hotline & Emergency SOS */}
      {activeTabSection === 'HOTLINE' && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Direct Phone and Email Access */}
          <div className="md:col-span-5 bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block">
                Priority Dispatch Channel
              </span>
              <h2 className="font-display font-bold text-xl text-text-obsidian mt-2">
                Emergency Supply Hotline
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Direct hotline for Chief Medical Officers, Taluk Health Officers, and PHC in-charges facing catastrophic zero-stock cliffs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>National Toll-Free SOS:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active 24x7
                </span>
              </div>
              <div className="font-mono font-extrabold text-2xl text-text-obsidian tracking-tight">
                1800-AUSHADH
              </div>
              <div className="text-[11px] text-text-muted font-mono">
                Direct Dial: 1800-287-4234 (Toll-Free All Telecoms)
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="material-symbols-outlined text-primary-rich text-[20px] mt-0.5">mail</span>
                <div>
                  <strong className="block text-text-obsidian">Emergency Consignment Dispatch</strong>
                  <span className="font-mono text-text-muted text-[11px]">nodal.sos@aushadhsetu.gov.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="material-symbols-outlined text-primary-rich text-[20px] mt-0.5">hub</span>
                <div>
                  <strong className="block text-text-obsidian">NIC Gateway Operations</strong>
                  <span className="font-mono text-text-muted text-[11px]">gateway.ops@nic.gov.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Emergency Stockout Alert Form */}
          <div className="md:col-span-7 bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-text-obsidian">
                Broadcast Zero-Stock SOS Alert
              </h2>
              <p className="text-xs text-text-muted">
                Hospital and PHC administrators can broadcast a critical stockout alert directly to the District Health Officer command deck.
              </p>
            </div>

            {emergencyAlertSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 className="font-display font-bold text-base text-emerald-900">
                  Emergency Redistribution Alert Transmitted!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Alert dispatched to DHO Pune District Command. Autonomous FEFO pairing is calculating the nearest surplus donor depot. Tracking Manifest Ref: <strong className="font-mono">SOS-2026-9812</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setEmergencyAlertSubmitted(false)}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold transition hover:bg-emerald-900 cursor-pointer"
                >
                  Broadcast Another Alert
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmergencyAlertSubmitted(true);
                }}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Reporting Health Facility:</label>
                  <input
                    type="text"
                    required
                    value={emergencyData.facilityName}
                    onChange={(e) => setEmergencyData({ ...emergencyData, facilityName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Critical Medicine Required:</label>
                  <input
                    type="text"
                    required
                    value={emergencyData.medicineNeeded}
                    onChange={(e) => setEmergencyData({ ...emergencyData, medicineNeeded: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-obsidian block">Current Shelf Stock Remaining:</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.stockRemainingUnits}
                      onChange={(e) => setEmergencyData({ ...emergencyData, stockRemainingUnits: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-obsidian block">Urgency Level:</label>
                    <select
                      value={emergencyData.urgency}
                      onChange={(e) => setEmergencyData({ ...emergencyData, urgency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-bold text-rose-700 focus:outline-none focus:border-amber-brand"
                    >
                      <option value="CRITICAL_IMMEDIATE">Critical: Depletion in &lt; 24 Hours</option>
                      <option value="HIGH_URGENCY">High: Depletion in 24 to 48 Hours</option>
                      <option value="PREDICTIVE_BUFFER">Elevated: 14-Day Advance Surge Buffer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">emergency_share</span>
                  <span>Transmit Priority SOS to District Command Deck</span>
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Tab B: Institutional Pilot Deployment Request */}
      {activeTabSection === 'PILOT_REQUEST' && (
        <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-2.5 py-0.5 rounded-full border border-amber-brand/20 inline-block">
              Government Deployment Liaison
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1.5">
              Request a 48-Hour Autonomous Pilot Corridor
            </h2>
            <p className="text-xs text-text-muted leading-relaxed max-w-3xl">
              For State National Health Mission Directors, District Collectors, and Chief Medical Officers. We conduct a rapid 48-hour baseline vulnerability audit, configure 15 prioritized NLEM medicines, and deploy digital gate-pass routing across your district.
            </p>
          </div>

          {pilotFormSubmitted ? (
            <div className="p-8 rounded-3xl bg-amber-soft/40 border border-amber-brand/30 text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-soft text-primary-rich border border-amber-brand/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="font-display font-bold text-lg text-text-obsidian">
                Pilot Deployment Request Logged!
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                Our State Health Technical Team will contact you within 4 business hours to initiate the 48-hour baseline audit for <strong className="text-text-obsidian">{pilotData.district} ({pilotData.state})</strong>.
              </p>
              <div className="font-mono text-xs text-primary-rich font-bold">
                Application Ref: SETU-PILOT-2026-MH482
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPilotFormSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Officer Full Name:</label>
                  <input
                    type="text"
                    required
                    value={pilotData.officerName}
                    onChange={(e) => setPilotData({ ...pilotData, officerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Official Designation:</label>
                  <input
                    type="text"
                    required
                    value={pilotData.designation}
                    onChange={(e) => setPilotData({ ...pilotData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Official Government Email (.gov.in / .nic.in):</label>
                  <input
                    type="email"
                    required
                    value={pilotData.email}
                    onChange={(e) => setPilotData({ ...pilotData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold font-mono focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Official Phone / Mobile Number:</label>
                  <input
                    type="text"
                    required
                    value={pilotData.phone}
                    onChange={(e) => setPilotData({ ...pilotData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold font-mono focus:outline-none focus:border-amber-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Jurisdiction State &amp; District:</label>
                  <input
                    type="text"
                    required
                    value={`${pilotData.district}, ${pilotData.state}`}
                    onChange={(e) => setPilotData({ ...pilotData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Priority Vulnerability / Outbreak Focus:</label>
                  <select
                    value={pilotData.vulnerabilityFocus}
                    onChange={(e) => setPilotData({ ...pilotData, vulnerabilityFocus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  >
                    <option value="Dengue & Acute Viral Fevers">Dengue, Chikungunya &amp; Vector Fevers</option>
                    <option value="Acute Diarrhoea & Enteric Surges">Acute Diarrhoeal Diseases (Monsoon Inundation)</option>
                    <option value="Snake Venom & Anti-Rabies Hotspots">Snakebite &amp; Anti-Rabies Critical Cold-Chain</option>
                    <option value="Comprehensive 15-Drug NLEM Audit">Comprehensive 15-Drug NLEM Baseline Audit</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#181511] hover:bg-neutral-800 text-white font-display font-bold text-xs sm:text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-brand">send</span>
                <span>Submit Official District Pilot Request</span>
              </button>
            </form>
          )}
        </section>
      )}

      {/* Tab C: Citizen Medicine Grievance Redressal */}
      {activeTabSection === 'CITIZEN_GRIEVANCE' && (
        <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
              Citizen Public Help Desk
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1.5">
              Report Missing Medicine at Your Local Clinic
            </h2>
            <p className="text-xs text-text-muted leading-relaxed max-w-3xl">
              Under Ayushman Bharat guidelines, government Primary Health Centers must supply essential medicines free of charge. If you visited a clinic and were told medicine is out of stock, file a report directly with the District Health Officer.
            </p>
          </div>

          {citizenGrievanceSubmitted ? (
            <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">task_alt</span>
              </div>
              <h3 className="font-display font-bold text-lg text-emerald-900">
                Grievance Form Transmitted to District Officer
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you, {grievanceData.patientName}. Your report has been routed to DHO Pune. The automated supply mesh has flagged {grievanceData.facilityVisited} for immediate stock inspection.
              </p>
              <div className="font-mono text-xs text-emerald-900 font-bold">
                Ticket Reference: CITIZEN-SOS-8821
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCitizenGrievanceSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Your Name:</label>
                  <input
                    type="text"
                    required
                    value={grievanceData.patientName}
                    onChange={(e) => setGrievanceData({ ...grievanceData, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Mobile Number:</label>
                  <input
                    type="text"
                    required
                    value={grievanceData.phone}
                    onChange={(e) => setGrievanceData({ ...grievanceData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold font-mono focus:outline-none focus:border-amber-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Clinic / PHC Visited:</label>
                  <input
                    type="text"
                    required
                    value={grievanceData.facilityVisited}
                    onChange={(e) => setGrievanceData({ ...grievanceData, facilityVisited: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">Medicine That Was Out of Stock:</label>
                  <input
                    type="text"
                    required
                    value={grievanceData.medicineUnavailable}
                    onChange={(e) => setGrievanceData({ ...grievanceData, medicineUnavailable: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs font-semibold focus:outline-none focus:border-amber-brand"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#181511] hover:bg-neutral-800 text-white font-display font-bold text-xs sm:text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400">report</span>
                <span>Submit Grievance to District Health Office</span>
              </button>
            </form>
          )}
        </section>
      )}

      {/* 3. Physical Secretariat & Technical Core Coordinates */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-4">
        <h2 className="font-display font-bold text-lg text-text-obsidian">
          National Command &amp; Technology Headquarters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-text-obsidian block text-sm">National Health Grid Command</strong>
            <p>Ministry of Health &amp; Family Welfare (MoHFW)</p>
            <p>Nirman Bhawan, Maulana Azad Road</p>
            <p>New Delhi – 110011, India</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-text-obsidian block text-sm">Technology Innovation &amp; Dispatch Core</strong>
            <p>Centre for Development of Advanced Computing (C-DAC)</p>
            <p>Pune Innovation Park, Pashan Road</p>
            <p>Pune, Maharashtra – 411007, India</p>
          </div>
        </div>
      </section>
    </div>
  );
}
