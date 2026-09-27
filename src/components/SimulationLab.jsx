import React, { useState } from 'react';
import axios from 'axios';
import { initialDistrictData } from '../data/mockDistrictData';

export default function SimulationLab({
  selectedState = 'ST-MH',
  setSelectedState,
  selectedDistrict = 'DIST-MH-PUNE',
  setSelectedDistrict,
  selectedFacility = 'PHC-01',
  setSelectedFacility,
}) {
  const [selectedDisease, setSelectedDisease] = useState('DENGUE');
  const [surgePercent, setSurgePercent] = useState(60);
  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState(null);

  const currentDistrictObj = initialDistrictData.districts.find((d) => d.id === selectedDistrict);
  const currentStateObj = initialDistrictData.states.find((s) => s.id === selectedState);
  const districtFacilities = initialDistrictData.facilities.filter((f) => f.district_id === selectedDistrict);
  const warehouse = districtFacilities.find((f) => f.type === 'WAREHOUSE') || districtFacilities[0];
  const phcList = districtFacilities.filter((f) => f.type === 'PHC');
  const targetPhc = districtFacilities.find((f) => f.id === selectedFacility) || phcList[0] || districtFacilities[1] || warehouse;
  const phc1 = targetPhc;
  const phc2 = phcList.find((f) => f.id !== phc1.id) || districtFacilities.find((f) => f.id !== phc1.id) || phc1;

  const handleRunSimulation = async () => {
    setSimulating(true);

    const multiplier = (1 + surgePercent / 100).toFixed(2);

    setTimeout(async () => {
      const isDengue = selectedDisease === 'DENGUE';
      const logData = {
        timestamp: new Date().toLocaleTimeString(),
        disease: selectedDisease,
        surge: surgePercent,
        multiplier: multiplier,
        summary: `Epidemiological alert: ${isDengue ? 'Vector-borne Dengue' : 'Water-borne Acute Diarrhoea'} cases surged by +${surgePercent}% in ${currentDistrictObj?.name} (${phc1.name}, ${phc2.name}).`,
        impacted_commodities: isDengue
          ? [
              { name: 'Ringer Lactate (RL) 500ml IV', normal: '35 bottles/day', surged: `${Math.round(35 * multiplier)} bottles/day`, status: 'CRITICAL_DEPLETION' },
              { name: 'Paracetamol 500mg Tablets', normal: '120 strips/day', surged: `${Math.round(120 * multiplier)} strips/day`, status: 'HIGH_DEMAND' },
              { name: 'Normal Saline (0.9% NaCl) 500ml IV', normal: '45 bottles/day', surged: `${Math.round(45 * multiplier)} bottles/day`, status: 'ELEVATED' },
            ]
          : [
              { name: 'Oral Rehydration Salts (ORS) IP 21.8g', normal: '85 pkts/day', surged: `${Math.round(85 * multiplier)} pkts/day`, status: 'CRITICAL_DEPLETION' },
              { name: 'Zinc Sulfate 20mg Tablets', normal: '40 strips/day', surged: `${Math.round(40 * multiplier)} strips/day`, status: 'HIGH_DEMAND' },
              { name: 'Ciprofloxacin 500mg Tablets', normal: '30 strips/day', surged: `${Math.round(30 * multiplier)} strips/day`, status: 'ELEVATED' },
            ],
        facility_impacts: [
          {
            facility: `${phc1.name} (${phc1.taluk})`,
            stock_before: '2.1 days of stock remaining',
            stock_after: `${(2.1 / multiplier).toFixed(1)} days (STOCK-OUT IN 22 HOURS)`,
            alert_level: 'CRITICAL',
            action: `Urgent transfer dispatch from ${warehouse.name}`,
          },
          {
            facility: `${phc2.name} (${phc2.taluk})`,
            stock_before: '2.7 days of stock remaining',
            stock_after: `${(2.7 / multiplier).toFixed(1)} days (DEPLETION IN 36 HOURS)`,
            alert_level: 'WARNING',
            action: `Reallocate near-expiry stock from neighboring block`,
          },
        ],
        automated_mitigation: {
          transfer_id: `SIM-TR-${Date.now().toString().slice(-4)}`,
          donor: warehouse.name,
          recipient: phc1.name,
          recommended_units: isDengue ? '350 Units RL IV Infusion' : '600 Packets ORS',
          averted_stockout_hours: 48,
          financial_expiry_saved: '₹22,400',
          route: `${currentDistrictObj?.name} Corridor (~${phc1.distance_from_wh_km || 18} km • ~${Math.round((phc1.distance_from_wh_km || 18) * 1.8)} mins)`,
        },
      };

      setSimulationLog(logData);
      setSimulating(false);

      try {
        await axios.post('/api/surveillance/simulate-spike', {
          disease: selectedDisease,
          surge_percent: surgePercent,
        });
      } catch (err) {
        console.warn('Backend sync deferred:', err.message);
      }
    }, 450);
  };

  return (
    <div className="space-y-8 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary max-w-4xl mx-auto">
      {/* Simulation Header */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Stress-Testing Sandbox
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-text-muted font-medium">Evaluator Simulator</span>
              </div>
              <h1 className="font-display font-bold text-2xl text-text-obsidian mt-1 flex items-center gap-2">
                <span>Outbreak Simulation Lab</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
                  {currentStateObj?.name || 'Maharashtra'}
                </span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#FAF8F5] rounded-2xl border border-[#EBE4D8] text-xs text-text-muted shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Simulated Epicenter: <strong className="text-text-obsidian">{phc1.name}</strong></span>
          </div>
        </div>

        {/* 3-Tier Jurisdiction Cascade */}
        <div className="bg-[#FAF8F5] border border-[#EBE4D8] rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-[#EBE4D8] min-w-0 overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Step 1: State
            </span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState && setSelectedState(e.target.value)}
              className="w-full text-xs font-bold text-text-obsidian bg-transparent focus:outline-none cursor-pointer truncate block"
            >
              {initialDistrictData.states.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-[#EBE4D8] min-w-0 overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Step 2: District
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="w-full text-xs font-bold text-text-obsidian bg-transparent focus:outline-none cursor-pointer truncate block"
            >
              {initialDistrictData.districts
                .filter((d) => d.state_id === selectedState)
                .map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-[#EBE4D8] min-w-0 overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Step 3: Facility / PHC Node (Epicenter)
            </span>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility && setSelectedFacility(e.target.value)}
              className="w-full text-xs font-bold text-primary-rich bg-transparent focus:outline-none cursor-pointer truncate block"
            >
              {districtFacilities.map((f) => (
                <option key={f.id} value={f.id}>{f.type === 'WAREHOUSE' ? `🏢 ${f.name}` : `🏥 ${f.name}`}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          Stress-test rural primary care supply chains against synthetic and historical epidemic surges. Watch Aushadh Setu's automated corridor engine trigger inter-PHC rebalancing in real time.
        </p>
      </section>

      {/* Outbreak Parameters Card */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base sm:text-lg text-text-obsidian flex items-center gap-2">
            <span>Configure Epidemic Surge Shock</span>
          </h2>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
            Synthetic Outbreak Injector
          </span>
        </div>

        {/* Disease Selection Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-subtle uppercase tracking-wider block">
            Select Disease Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedDisease('DENGUE')}
              className={`p-3.5 rounded-2xl text-left transition border cursor-pointer ${
                selectedDisease === 'DENGUE'
                  ? 'bg-amber-soft/70 border-amber-brand text-text-obsidian shadow-xs font-bold'
                  : 'bg-[#FAF8F5] hover:bg-stone-100 border-[#EBE4D8] text-text-muted'
              }`}
            >
              <div className="text-base">🦟 Dengue Outbreak</div>
              <div className="text-[11px] text-text-muted mt-0.5">Spikes RL IV & Paracetamol</div>
            </button>

            <button
              onClick={() => setSelectedDisease('DIARRHOEA')}
              className={`p-3.5 rounded-2xl text-left transition border cursor-pointer ${
                selectedDisease === 'DIARRHOEA'
                  ? 'bg-amber-soft/70 border-amber-brand text-text-obsidian shadow-xs font-bold'
                  : 'bg-[#FAF8F5] hover:bg-stone-100 border-[#EBE4D8] text-text-muted'
              }`}
            >
              <div className="text-base">💧 Diarrhoeal (ADD) Surge</div>
              <div className="text-[11px] text-text-muted mt-0.5">Spikes ORS & Zinc</div>
            </button>

            <button
              onClick={() => setSelectedDisease('SNAKEBITE')}
              className={`p-3.5 rounded-2xl text-left transition border cursor-pointer ${
                selectedDisease === 'SNAKEBITE'
                  ? 'bg-amber-soft/70 border-amber-brand text-text-obsidian shadow-xs font-bold'
                  : 'bg-[#FAF8F5] hover:bg-stone-100 border-[#EBE4D8] text-text-muted'
              }`}
            >
              <div className="text-base">🐍 Snakebite Emergency</div>
              <div className="text-[11px] text-text-muted mt-0.5">Cold-chain ASV Depletion</div>
            </button>
          </div>
        </div>

        {/* Surge Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-text-obsidian">Epidemic Caseload Multiplier:</span>
            <span className="font-display font-bold text-base text-primary-rich">+{surgePercent}% Case Influx</span>
          </div>
          <input
            type="range"
            min="20"
            max="150"
            step="10"
            value={surgePercent}
            onChange={(e) => setSurgePercent(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
          />
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={simulating}
          className="w-full py-3 rounded-full bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] text-amber-accent ${simulating ? 'animate-spin' : ''}`}>
            {simulating ? 'refresh' : 'play_arrow'}
          </span>
          <span>{simulating ? 'Simulating Dynamic Grid Rebalancing...' : 'Inject Epidemic Shock & Test Auto-Redistribution'}</span>
        </button>
      </section>

      {/* Simulation Results Deck */}
      {simulationLog && (
        <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="font-display font-bold text-lg text-text-obsidian">Simulation Telemetry & Grid Response</h2>
            </div>
            <span className="text-xs text-text-subtle">Timestamp: {simulationLog.timestamp}</span>
          </div>

          <p className="text-xs text-text-muted bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D8]">
            {simulationLog.summary}
          </p>

          {/* Impacted Commodities Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
              Surged Commodity Depletion Rates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {simulationLog.impacted_commodities.map((item, idx) => (
                <div key={idx} className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EBE4D8] space-y-1">
                  <div className="font-bold text-xs text-text-obsidian">{item.name}</div>
                  <div className="text-[11px] text-text-muted">Baseline: {item.normal}</div>
                  <div className="text-xs font-bold text-rose-700">Surged: {item.surged}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Corridor Mitigation Card */}
          <div className="bg-gradient-to-br from-amber-soft/70 via-white to-amber-soft/30 rounded-2xl p-5 border border-amber-brand/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-rich flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                Autonomous Mitigation Corridor Triggered
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Averted: {simulationLog.automated_mitigation.averted_stockout_hours}h to zero-stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[9px] uppercase font-bold text-text-subtle block">Donor Dispatch</span>
                <span className="font-bold text-text-obsidian">{simulationLog.automated_mitigation.donor}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[9px] uppercase font-bold text-text-subtle block">Emergency Transfer</span>
                <span className="font-bold text-primary-rich">{simulationLog.automated_mitigation.recommended_units}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#EBE4D8]">
                <span className="text-[9px] uppercase font-bold text-text-subtle block">Recipient</span>
                <span className="font-bold text-text-obsidian">{simulationLog.automated_mitigation.recipient}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-text-muted text-[11px]">
                Corridor: {simulationLog.automated_mitigation.route}
              </span>
              <span className="font-bold text-emerald-800">
                CAG Expiry Saved: {simulationLog.automated_mitigation.financial_expiry_saved}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
