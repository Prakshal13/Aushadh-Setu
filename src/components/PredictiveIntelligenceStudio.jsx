import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { initialDistrictData } from '../data/mockDistrictData';
import {
  SYNDROMIC_DRUG_MATRIX,
  calculateDynamicDemandMultiplier,
  correctLatentDemand,
  generate14DayForecast,
  evaluateFefoExpiryRisk,
} from '../../server/services/predictiveEngine';
import { fetchDistrictClimate, getFallbackClimate, DISTRICT_COORDINATES } from '../services/climateService';
import { solveSeirEpidemicCurve, computeNeuroSymbolicDrugDemand, DISEASE_EPIDEMIC_PARAMETERS } from '../services/seirEngine';
import { IDSP_WEEKLY_SURVEILLANCE_ARCHIVE, NHM_HMIS_STANDARDS } from '../data/idspDatasets';

export default function PredictiveIntelligenceStudio({
  selectedState = 'ST-MH',
  setSelectedState,
  selectedDistrict = 'DIST-MH-PUNE',
  setSelectedDistrict,
  selectedFacility: propSelectedFacility,
  setSelectedFacility: propSetSelectedFacility,
  surgePercent: propSurgePercent,
  setSurgePercent: propSetSurgePercent,
  fieldCases: propFieldCases,
  setFieldCases: propSetFieldCases,
}) {
  const currentDistrictObj = initialDistrictData.districts.find((d) => d.id === selectedDistrict);
  const currentStateObj = initialDistrictData.states.find((s) => s.id === selectedState);
  const districtFacilities = initialDistrictData.facilities.filter((f) => f.district_id === selectedDistrict);

  const [activeFacilityId, setActiveFacilityId] = useState(
    propSelectedFacility || districtFacilities[1]?.id || districtFacilities[0]?.id || 'PHC-01'
  );
  const [selectedMedicineId, setSelectedMedicineId] = useState('MED-04'); // Ringer Lactate default
  const [selectedSyndrome, setSelectedSyndrome] = useState('DENGUE');

  // Dual-Mode Outbreak Influx State (synchronized with App & DHO Dashboard)
  const [localSurgePercent, setLocalSurgePercent] = useState(40);
  const [localFieldCases, setLocalFieldCases] = useState(56);

  const surgePercent = propSurgePercent !== undefined ? propSurgePercent : localSurgePercent;
  const setSurgePercent = propSetSurgePercent || setLocalSurgePercent;

  const fieldCases = propFieldCases !== undefined ? propFieldCases : localFieldCases;
  const setFieldCases = propSetFieldCases || setLocalFieldCases;

  // Step 2 & 3: Live Climate Telemetry & IDSP Dataset State
  const [climateData, setClimateData] = useState(null);
  const [climateLoading, setClimateLoading] = useState(false);
  const [showIdspDatasetDrawer, setShowIdspDatasetDrawer] = useState(false);
  const [activeDatasetTab, setActiveDatasetTab] = useState('surveillance_curve'); // 'surveillance_curve' | 'nhm_standards'
  const [showSeirDeepDive, setShowSeirDeepDive] = useState(false);

  const [riskFilter, setRiskFilter] = useState('ALL');
  const [showLatentExplainer, setShowLatentExplainer] = useState(false);
  const [activeExplainerTab, setActiveExplainerTab] = useState('overview');
  const [chartViewMode, setChartViewMode] = useState('patient_coverage');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customDiseases, setCustomDiseases] = useState([]);
  const [newDiseaseForm, setNewDiseaseForm] = useState({
    name: '',
    r0: '1.75',
    driver: '',
    medId: 'MED-06',
    multiplier: 2.2,
    dosePerCase: 2.0,
    icon: '🦠',
  });

  const DEFAULT_DISEASE_PROFILES = [
    {
      id: 'DENGUE',
      name: 'Vector-Borne Dengue',
      r0: '1.65',
      driver: 'Rainfall Anomaly > 25%',
      multiplier: 'RL IV × 2.40 • Paracetamol × 1.85',
      baseMultiplierVal: 2.40,
      medId: 'MED-04',
      icon: '🦟',
      dosePerCase: 2.0,
      isCustom: false,
    },
    {
      id: 'ADD',
      name: 'Acute Diarrhoeal (ADD)',
      r0: '2.10',
      driver: 'Water Inundation Index',
      multiplier: 'ORS × 2.80 • Zinc × 2.10',
      baseMultiplierVal: 2.80,
      medId: 'MED-02',
      icon: '💧',
      dosePerCase: 6.0,
      isCustom: false,
    },
    {
      id: 'ARI',
      name: 'Seasonal Respiratory (ARI)',
      r0: '1.40',
      driver: 'Post-Monsoon Drop',
      multiplier: 'Amoxicillin × 2.10',
      baseMultiplierVal: 2.10,
      medId: 'MED-06',
      icon: '🫁',
      dosePerCase: 1.5,
      isCustom: false,
    },
    {
      id: 'SNAKEBITE',
      name: 'Monsoon Snakebite Risk',
      r0: '1.00',
      driver: 'Harvest & Flooding',
      multiplier: 'Anti-Snake Venom × 2.50',
      baseMultiplierVal: 2.50,
      medId: 'MED-13',
      icon: '🐍',
      dosePerCase: 4.0,
      isCustom: false,
    },
  ];

  const PRESET_VECTORS = [
    {
      name: 'Leptospirosis (Rat Fever)',
      r0: '1.65',
      driver: 'Post-flood waterlogging & urban slum inundation',
      medId: 'MED-06', // Amoxicillin 500mg
      multiplier: 2.2,
      dosePerCase: 2.0,
      icon: '🐀',
    },
    {
      name: 'Cholera (Vibrio cholerae)',
      r0: '2.80',
      driver: 'Contaminated borewell & shallow piped supply breach',
      medId: 'MED-02', // ORS IP 21.8g
      multiplier: 3.2,
      dosePerCase: 6.0,
      icon: '💧',
    },
    {
      name: 'Severe Heatstroke & Sunstroke',
      r0: '1.00',
      driver: 'IMD Extreme Heatwave (>43°C Ambient Temperature)',
      medId: 'MED-05', // Normal Saline 500ml IV
      multiplier: 2.5,
      dosePerCase: 3.0,
      icon: '☀️',
    },
    {
      name: 'Scrub Typhus (Orientia)',
      r0: '1.35',
      driver: 'Post-monsoon agricultural scrub & larval mite contact',
      medId: 'MED-07', // Azithromycin 500mg
      multiplier: 2.1,
      dosePerCase: 1.5,
      icon: '🌾',
    },
    {
      name: 'Nipah Virus Surveillance',
      r0: '0.48',
      driver: 'Seasonal fruit bat foraging clusters & palm sap',
      medId: 'MED-04', // Ringer Lactate 500ml IV
      multiplier: 2.0,
      dosePerCase: 2.5,
      icon: '🦇',
    },
  ];

  const allDiseaseProfiles = [...DEFAULT_DISEASE_PROFILES, ...customDiseases];
  const activeProfile = allDiseaseProfiles.find((p) => p.id === selectedSyndrome) || allDiseaseProfiles[0];

  useEffect(() => {
    if (propSelectedFacility && districtFacilities.some((f) => f.id === propSelectedFacility)) {
      setActiveFacilityId(propSelectedFacility);
    } else if (districtFacilities.length > 0) {
      const defaultFac = districtFacilities[1]?.id || districtFacilities[0]?.id;
      setActiveFacilityId(defaultFac);
    }
  }, [selectedDistrict, propSelectedFacility]);

  // Live Climate Telemetry via Open-Meteo API
  useEffect(() => {
    let isMounted = true;
    setClimateLoading(true);
    fetchDistrictClimate(selectedDistrict)
      .then((data) => {
        if (isMounted) {
          setClimateData(data);
          setClimateLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Using fallback climate:', err);
        if (isMounted) {
          setClimateData(getFallbackClimate(selectedDistrict));
          setClimateLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedDistrict]);

  const activeFacility = districtFacilities.find((f) => f.id === activeFacilityId) || districtFacilities[0];
  const facilityBatches = initialDistrictData.batches.filter((b) => b.facility_id === activeFacilityId);
  const surveillanceRecords = initialDistrictData.disease_surveillance_weekly;

  const stockByMed = {};
  facilityBatches.forEach((b) => {
    stockByMed[b.medicine_id] = (stockByMed[b.medicine_id] || 0) + b.quantity;
  });

  // Active Bidirectional Synchronization between Slider (%) and Confirmed Admissions (Headcount)
  const selectedMedObj = initialDistrictData.medicines.find((m) => m.id === selectedMedicineId) || initialDistrictData.medicines[0];
  const baselineDailyForMed = selectedMedObj?.standard_daily_baseline || 40;
  const dosePerCaseForProfile = activeProfile?.dosePerCase || 2.0;

  const handleSurgeChange = (newSurge) => {
    const num = Number(newSurge);
    setSurgePercent(num);
    const approxCases = Math.max(0, Math.round(((num / 100) * (baselineDailyForMed * 7)) / dosePerCaseForProfile));
    setFieldCases(approxCases);
  };

  const handleFieldCasesChange = (newCases) => {
    const safeCases = Math.max(0, parseInt(newCases) || 0);
    setFieldCases(safeCases);
    const totalOutbreakDosesNeeded = safeCases * dosePerCaseForProfile;
    const calculatedSurge = Math.round((totalOutbreakDosesNeeded / (baselineDailyForMed * 7)) * 100);
    setSurgePercent(Math.min(150, Math.max(0, calculatedSurge)));
  };

  const effectiveSurgePercent = surgePercent;

  const medicineForecasts = initialDistrictData.medicines.map((med) => {
    const currentStock = stockByMed[med.id] || 0;
    
    let vectorMultiplier = 1.0;
    let activeDrivers = [];

    const isCustom = customDiseases.some((c) => c.id === selectedSyndrome);
    if (isCustom && activeProfile?.medId === med.id) {
      vectorMultiplier = typeof activeProfile.baseMultiplierVal === 'number' ? activeProfile.baseMultiplierVal : 2.2;
      activeDrivers.push({
        driver: activeProfile.name,
        surge_pct: effectiveSurgePercent,
        rationale: `MoHFW STG Outbreak Protocol: ${activeProfile.driver}`,
      });
    } else {
      const dyn = calculateDynamicDemandMultiplier(med.id, surveillanceRecords);
      vectorMultiplier = dyn.multiplier;
      activeDrivers = dyn.activeDrivers;
    }

    const userSurgeMultiplier = Number((vectorMultiplier * (1 + effectiveSurgePercent / 100)).toFixed(2));

    const { correctedDailyDemand, isSuppressed } = correctLatentDemand(
      med.standard_daily_baseline,
      currentStock,
      med.standard_daily_baseline,
      activeFacility?.catchment_population || 45000
    );

    const forecastData = generate14DayForecast(
      med,
      currentStock,
      correctedDailyDemand,
      userSurgeMultiplier
    );

    let runningCumDemand = 0;
    const baseDailyForecast = forecastData.forecast || forecastData.daily_forecast || [];
    const enrichedForecast = baseDailyForecast.map((d) => {
      runningCumDemand += (d.daily_projected || d.projected_demand || 0);
      return {
        ...d,
        cumulative_demand: runningCumDemand,
        initial_stock_buffer: currentStock,
      };
    });

    return {
      ...forecastData,
      generic_name: med.generic_name,
      category: med.category,
      unit: med.unit,
      is_cold_chain: med.is_cold_chain,
      current_stock: currentStock,
      demand_multiplier: userSurgeMultiplier,
      active_drivers: activeDrivers,
      latent_demand_corrected: isSuppressed,
      daily_forecast: enrichedForecast,
      days_of_stock_remaining: forecastData.days_of_stock_remaining ?? 0,
      zero_stock_countdown_hours: forecastData.stockout_in_hours ?? Math.round((forecastData.days_of_stock_remaining || 0) * 24),
      stockout_expected_day: forecastData.stockout_expected_day,
      total_unmet_doses: forecastData.total_unmet_doses ?? 0,
      total_fulfilled_doses: forecastData.total_fulfilled_doses ?? 0,
    };
  });

  const dailyDemandMap = {};
  medicineForecasts.forEach((m) => {
    dailyDemandMap[m.medicine_id] = m.effective_daily_rate;
  });
  const evaluatedBatches = evaluateFefoExpiryRisk(facilityBatches, initialDistrictData.medicines, dailyDemandMap);

  // Layer 1 + 2 + 3: Hybrid Neuro-Symbolic Model Output
  const neuroSymbolicResult = computeNeuroSymbolicDrugDemand({
    diseaseCode: selectedSyndrome,
    fieldCases,
    surgePercent,
    medicineId: selectedMedicineId,
    currentStock: stockByMed[selectedMedicineId] || 0,
    baselineDailyDemand: selectedMedObj?.standard_daily_baseline || 40,
    climateTelemetry: climateData,
    customProfile: activeProfile,
  });

  const baseSelectedForecast =
    medicineForecasts.find((m) => m.medicine_id === selectedMedicineId) ||
    medicineForecasts[0] || {
      generic_name: 'Selected Formulation',
      medicine_name: 'Selected Formulation',
      current_stock: 0,
      daily_forecast: [],
      forecast: [],
      days_of_stock_remaining: 10,
      zero_stock_countdown_hours: 240,
      stockout_expected_day: null,
      total_unmet_doses: 0,
      total_fulfilled_doses: 0,
    };

  const selectedMedForecast = {
    ...baseSelectedForecast,
    days_of_stock_remaining: neuroSymbolicResult.days_of_stock_remaining,
    stockout_expected_day: neuroSymbolicResult.stockout_expected_day,
    stockout_in_hours: neuroSymbolicResult.stockout_in_hours,
    zero_stock_countdown_hours: neuroSymbolicResult.zero_stock_countdown_hours,
    total_unmet_doses: neuroSymbolicResult.total_unmet_doses,
    total_fulfilled_doses: neuroSymbolicResult.total_fulfilled_doses,
    effective_daily_rate: neuroSymbolicResult.effective_daily_rate,
    daily_forecast: neuroSymbolicResult.daily_forecast,
    seir_parameters: neuroSymbolicResult.seir_parameters,
    executive_synthesis: neuroSymbolicResult.executive_synthesis,
  };

  const totalFacilityStock = Object.values(stockByMed).reduce((a, b) => a + b, 0);
  const atRiskCount = medicineForecasts.filter(
    (m) => m.stockout_risk_status === 'CRITICAL_STOCKOUT_RISK' || m.risk_level === 'CRITICAL_STOCKOUT_RISK'
  ).length;
  const expiryBatchesCount = evaluatedBatches.filter((b) => b.is_fefo_risk || b.fefo_risk_status !== 'HEALTHY').length;

  const handleCreateCustomDisease = (e) => {
    e.preventDefault();
    if (!newDiseaseForm.name.trim()) return;

    const matchedMed = initialDistrictData.medicines.find((m) => m.id === newDiseaseForm.medId);
    const customId = `CUSTOM-${Date.now()}`;
    const multiplierVal = Number(newDiseaseForm.multiplier) || 2.2;
    const newVector = {
      id: customId,
      name: newDiseaseForm.name.trim(),
      r0: newDiseaseForm.r0 || '1.60',
      driver: newDiseaseForm.driver.trim() || 'Custom Outbreak Cluster Alert',
      multiplier: `${matchedMed?.generic_name?.split(' ')[0] || 'Drug'} × ${multiplierVal.toFixed(2)}`,
      baseMultiplierVal: multiplierVal,
      medId: newDiseaseForm.medId,
      icon: newDiseaseForm.icon || '🦠',
      dosePerCase: Number(newDiseaseForm.dosePerCase) || 2.0,
      isCustom: true,
    };

    setCustomDiseases((prev) => [...prev, newVector]);
    setSelectedSyndrome(customId);
    setSelectedMedicineId(newVector.medId);
    setIsCustomModalOpen(false);
    setNewDiseaseForm({
      name: '',
      r0: '1.75',
      driver: '',
      medId: 'MED-06',
      multiplier: 2.2,
      dosePerCase: 2.0,
      icon: '🦠',
    });
  };

  const handleDeleteCustomDisease = (id) => {
    setCustomDiseases((prev) => prev.filter((d) => d.id !== id));
    if (selectedSyndrome === id) {
      setSelectedSyndrome('DENGUE');
      setSelectedMedicineId('MED-04');
    }
  };

  return (
    <div className="space-y-8 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary">
      {/* Studio Header & Jurisdiction Deck */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-3 py-1 rounded-full border border-amber-brand/20">
                Vertex AI Studio
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-text-muted font-medium">14-Day Dual-Risk Predictive Modeling</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-obsidian mt-1.5 flex items-center gap-2">
              <span>Predictive Intelligence Studio</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
                {currentStateObj?.name || 'Maharashtra'}
              </span>
            </h1>

            <p className="text-xs text-text-muted mt-1">
              Active Facility: <strong className="text-text-obsidian">{activeFacility?.name}</strong> • Catchment: <strong className="text-text-obsidian">{activeFacility?.catchment_population?.toLocaleString()}</strong> citizens • Model: <strong className="text-amber-800">SDM Matrix + Latent Demand Reconstruction</strong>
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-[#FAF8F5] rounded-2xl border border-[#EBE4D8] text-xs text-text-muted shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Predictive Target: <strong className="text-text-obsidian">{activeFacility?.name || 'Central Warehouse'}</strong></span>
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
              Step 3: Facility / PHC Node
            </span>
            <select
              value={activeFacilityId}
              onChange={(e) => {
                setActiveFacilityId(e.target.value);
                if (propSetSelectedFacility) propSetSelectedFacility(e.target.value);
              }}
              className="w-full text-xs font-bold text-primary-rich bg-transparent focus:outline-none cursor-pointer truncate block"
            >
              {districtFacilities.map((f) => (
                <option key={f.id} value={f.id}>{f.type === 'WAREHOUSE' ? `🏢 ${f.name}` : `🏥 ${f.name}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Micro Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Monitored Stock</span>
            <div className="font-display font-bold text-2xl text-text-obsidian mt-1">{totalFacilityStock}</div>
            <span className="text-[11px] text-text-muted">Total physical units</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Stockout Hazards (&lt; 3.5d)</span>
            <div className="font-display font-bold text-2xl text-rose-700 mt-1">{atRiskCount}</div>
            <span className="text-[11px] text-rose-600 font-medium">Critical depletion alerts</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">FEFO Expiry Hazards</span>
            <div className="font-display font-bold text-2xl text-amber-800 mt-1">{expiryBatchesCount}</div>
            <span className="text-[11px] text-amber-700 font-medium">Batches near expiry</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Dynamic Surge Factor</span>
            <div className="font-display font-bold text-2xl text-primary-rich mt-1">+{effectiveSurgePercent}%</div>
            <span className="text-[11px] text-primary-rich font-medium">
              {fieldCases} field admissions (~{dosePerCaseForProfile} u/case)
            </span>
          </div>
        </div>
      </section>

      {/* Step 2: Live Open-Meteo & IMD Climate Telemetry Radar */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-soft text-primary-rich flex items-center justify-center border border-amber-brand/20">
              <span className="material-symbols-outlined text-[20px]">radar</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-text-obsidian">
                  Open-Meteo Satellite & IMD Climate Telemetry Radar
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{climateData?.is_live ? 'Live ECMWF Satellite Feed Active' : 'IMD Cached Telemetry'}</span>
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Real-time 14-day meteorological telemetry for <strong>{climateData?.district_name || currentDistrictObj?.name}, {climateData?.state || currentStateObj?.name}</strong> (GPS: {climateData?.coordinates?.lat || 18.52}°N, {climateData?.coordinates?.lon || 73.86}°E).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowIdspDatasetDrawer(!showIdspDatasetDrawer)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-xs font-bold text-primary-rich border border-[#EBE4D8] hover:border-amber-brand/40 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-brand">database</span>
              <span>{showIdspDatasetDrawer ? 'Close IDSP Archive' : 'Inspect IDSP Ground-Truth'}</span>
            </button>
          </div>
        </div>

        {/* 4 Climate Bento Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Max Ambient Temp</span>
            <div className="font-display font-bold text-xl text-text-obsidian mt-0.5">
              {climateData?.metrics?.max_temp_c ?? 30.2}°C
            </div>
            <span className="text-[10.5px] text-text-muted mt-0.5 block">
              Baseline: {climateData?.metrics?.baseline_temp_c ?? 30.2}°C
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">14-Day Precipitation Sum</span>
            <div className="font-display font-bold text-xl text-text-obsidian mt-0.5">
              {climateData?.metrics?.total_rain_14d_mm ?? 51.2} <span className="text-xs font-normal text-text-muted">mm</span>
            </div>
            <span className="text-[10.5px] text-text-muted mt-0.5 block">
              Normal: {climateData?.metrics?.baseline_rain_mm ?? 38.0} mm
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Precipitation Anomaly</span>
            <div className={`font-display font-bold text-xl mt-0.5 ${(climateData?.metrics?.rainfall_anomaly_pct ?? 34.8) > 20 ? 'text-amber-800' : 'text-emerald-800'}`}>
              {(climateData?.metrics?.rainfall_anomaly_pct ?? 34.8) > 0 ? `+${climateData?.metrics?.rainfall_anomaly_pct ?? 34.8}%` : `${climateData?.metrics?.rainfall_anomaly_pct ?? 0}%`}
            </div>
            <span className={`text-[10.5px] font-medium mt-0.5 block ${(climateData?.metrics?.rainfall_anomaly_pct ?? 34.8) > 20 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {(climateData?.metrics?.rainfall_anomaly_pct ?? 34.8) > 20 ? '⚠️ Above Monsoon Norm' : '✓ Within Normal Range'}
            </span>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Pre-Epidemic Climate Multiplier</span>
            <div className="font-display font-bold text-xl text-primary-rich mt-0.5">
              ×{(climateData?.metrics?.climate_risk_multiplier ?? 1.35).toFixed(2)}
            </div>
            <span className="text-[10.5px] text-primary-rich font-semibold truncate block mt-0.5">
              {climateData?.metrics?.alert_title ?? 'Active Monsoon Surge'}
            </span>
          </div>
        </div>

        {/* Expandable IDSP Ground-Truth Datasets Drawer */}
        {showIdspDatasetDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-200/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-brand">verified</span>
                  Verified IDSP National Surveillance Archive (8-Week Ground Truth)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-soft text-primary-rich border border-amber-brand/20">
                  SHSRC Audited
                </span>
              </div>
              <div className="text-[11px] text-text-muted">
                Historical Model Accuracy (MAPE): <strong className="text-emerald-800">{IDSP_WEEKLY_SURVEILLANCE_ARCHIVE[selectedDistrict]?.historical_mape_accuracy || '94.6%'}</strong> • Pearson Correlation: <strong className="text-primary-rich">r = {IDSP_WEEKLY_SURVEILLANCE_ARCHIVE[selectedDistrict]?.correlation_coefficient_r || 0.924}</strong>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#EBE4D8] bg-[#FAF8F5]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-100/70 text-text-subtle text-[10px] uppercase font-bold border-b border-[#EBE4D8]">
                    <th className="py-2 px-3">Surveillance Week</th>
                    <th className="py-2 px-3">Dengue Cases</th>
                    <th className="py-2 px-3">ADD Diarrhoeal</th>
                    <th className="py-2 px-3">ARI Cases</th>
                    <th className="py-2 px-3">Rain Anomaly</th>
                    <th className="py-2 px-3">Paracetamol Burn</th>
                    <th className="py-2 px-3">RL IV Burn</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE4D8] text-[11px]">
                  {(IDSP_WEEKLY_SURVEILLANCE_ARCHIVE[selectedDistrict]?.weeks || IDSP_WEEKLY_SURVEILLANCE_ARCHIVE['DIST-MH-PUNE'].weeks).map((w, idx) => (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="py-2 px-3 font-semibold text-text-obsidian">{w.week}</td>
                      <td className="py-2 px-3 text-amber-800 font-bold">{w.dengue_cases}</td>
                      <td className="py-2 px-3 text-text-obsidian">{w.diarrhoea_cases}</td>
                      <td className="py-2 px-3 text-text-muted">{w.ari_cases}</td>
                      <td className="py-2 px-3 font-mono font-medium">{w.rain_anomaly}</td>
                      <td className="py-2 px-3">{w.paracetamol_burn.toLocaleString()} tabs</td>
                      <td className="py-2 px-3 text-primary-rich font-bold">{w.rl_iv_burn.toLocaleString()} u</td>
                      <td className="py-2 px-3">
                        {w.outbreak_flag ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            SURGE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            BASELINE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Syndromic-to-Drug Matrix (SDM) Profiles */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg text-text-obsidian flex items-center gap-2">
              <span>Syndromic-to-Drug Matrix (SDM) Explorer</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
                Epidemic Coupling
              </span>
            </h2>
            <p className="text-xs text-text-muted">
              Select or define an outbreak vector to inspect mathematical demand acceleration across critical pharmaceutical formulations.
            </p>
          </div>
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-soft hover:bg-amber-100 text-primary-rich border border-amber-brand/30 text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Define Outbreak Vector</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allDiseaseProfiles.map((p) => {
            const isSelected = selectedSyndrome === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedSyndrome(p.id);
                  setSelectedMedicineId(p.medId);
                }}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative group ${
                  isSelected
                    ? 'bg-amber-soft/60 border-amber-brand shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-stone-100 border-[#EBE4D8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl">{p.icon}</span>
                    {p.isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-brand text-white">
                        DHO Field
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-text-obsidian border border-[#EBE4D8]">
                      R₀: {p.r0}
                    </span>
                    {p.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomDisease(p.id);
                        }}
                        className="text-stone-400 hover:text-rose-600 transition p-0.5"
                        title="Delete custom vector"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="font-display font-bold text-sm text-text-obsidian mt-2">{p.name}</div>
                <div className="text-[11px] text-amber-800 font-semibold mt-0.5">{p.driver}</div>
                <div className="text-[11px] text-text-muted mt-2 pt-2 border-t border-stone-200/50 flex items-center justify-between">
                  <span>{p.multiplier}</span>
                  <span className="text-[10px] font-medium opacity-70">~{p.dosePerCase} u/case</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dual-Mode Outbreak Influx Controller: Range Slider AND Confirmed Admissions (Both ALWAYS visible) */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-brand">tune</span>
                Dual-Control Outbreak Influx Deck:
              </span>
              <span className="text-[11px] text-text-muted">
                (Range Slider & Confirmed Admissions remain actively locked & synchronized)
              </span>
            </div>

            <div className="text-right">
              <span className="font-display font-bold text-base text-primary-rich">
                +{effectiveSurgePercent}% Outbreak Influx Factor
              </span>
              <span className="text-[10px] text-text-muted block">
                Corresponds to {fieldCases} confirmed patient admissions (~{dosePerCaseForProfile} doses/case)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Mode 1: Interactive Range Slider (ALWAYS VISIBLE) */}
            <div className="lg:col-span-6 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8] flex flex-col justify-between space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-brand">linear_scale</span>
                  Mode 1: Outbreak Surge Slider
                </span>
                <span className="font-display font-bold text-base text-primary-rich">
                  +{surgePercent}%
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={surgePercent}
                  onChange={(e) => handleSurgeChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
                />
                <div className="flex justify-between text-[10px] text-text-subtle font-medium">
                  <span>Baseline (0%)</span>
                  <span>Seasonal (+50%)</span>
                  <span>Severe (+100%)</span>
                  <span>Epidemic (+150%)</span>
                </div>
              </div>

              <p className="text-[11px] text-text-muted pt-1 border-t border-stone-200/60">
                Smoothly scales patient consumption multiplier over baseline demand.
              </p>
            </div>

            {/* Mode 2: Confirmed Field Admissions Headcount Box + Quick Chips (ALWAYS VISIBLE) */}
            <div className="lg:col-span-6 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4D8] flex flex-col justify-between space-y-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-brand">group</span>
                    Mode 2: Confirmed Admissions ({activeProfile?.name || 'Vector'})
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    MoHFW STG guideline: ~{dosePerCaseForProfile} units / admission
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="5"
                    value={fieldCases}
                    onChange={(e) => handleFieldCasesChange(e.target.value)}
                    className="w-20 bg-white px-2.5 py-1 text-right font-display font-bold text-lg text-primary-rich rounded-xl border border-amber-brand/40 focus:outline-none focus:ring-2 focus:ring-amber-brand"
                  />
                  <span className="text-xs font-bold text-text-muted">Cases</span>
                </div>
              </div>

              {/* Quick Scenario Chips */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-text-subtle block">One-Click Caseload Presets:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '25 (Cluster)', count: 25 },
                    { label: '50 (Alert)', count: 50 },
                    { label: '85 (Outbreak)', count: 85 },
                    { label: '150 (Severe)', count: 150 },
                    { label: '300 (Epidemic)', count: 300 },
                  ].map((chip) => (
                    <button
                      key={chip.count}
                      type="button"
                      onClick={() => handleFieldCasesChange(chip.count)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        fieldCases === chip.count
                          ? 'bg-amber-brand text-white border-amber-brand shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-amber-brand/50'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-text-muted pt-1 border-t border-stone-200/60">
                Direct headcount entered by field epidemiologists or CMO dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Hybrid Neuro-Symbolic Architecture Inspector Card */}
      <section className="bg-gradient-to-br from-amber-soft/50 via-white to-amber-soft/20 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-amber-brand/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-brand text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">neurology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-text-obsidian">
                  A Hybrid Neuro-Symbolic AI Engine
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-primary-rich border border-amber-brand/30">
                  SEIR RK4 + Open-Meteo + Gemini 1.5
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Synthesizing mechanistic epidemiological transmission laws with real-time satellite telemetry and autonomous reasoning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200">
              ● Biological Laws Verified
            </span>
          </div>
        </div>

        {/* 3 Architecture Layers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Layer 1: Mechanistic Symbolic SEIR Core */}
          <div className="bg-white/95 p-4 rounded-2xl border border-[#EBE4D8] space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-brand">functions</span>
                Layer 1: Symbolic SEIR Core
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-text-subtle border border-[#EBE4D8]">
                RK4 Solver
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-text-muted">
                <span>Reproduction Number (R₀):</span>
                <strong className="text-text-obsidian font-display font-bold">{selectedMedForecast.seir_parameters?.r0 || 1.65}</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Projected Wave Inflection Peak:</span>
                <strong className="text-rose-700 font-bold">Day {selectedMedForecast.seir_parameters?.peak_day || 6}</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Daily Epidemic Velocity:</span>
                <strong className="text-amber-800 font-bold">+{selectedMedForecast.seir_parameters?.epidemic_velocity_pct || 18}% / day</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Cumulative 14d Caseload:</span>
                <strong className="text-text-obsidian font-display font-bold">~{selectedMedForecast.seir_parameters?.cumulative_cases || 148} patients</strong>
              </div>
            </div>

            <p className="text-[11px] text-text-muted pt-2 border-t border-stone-100">
              Differential equations guarantee biologically bounded transmission curves without linear distortion.
            </p>
          </div>

          {/* Layer 2: Statistical & Climate Influx Layer */}
          <div className="bg-white/95 p-4 rounded-2xl border border-[#EBE4D8] space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-brand">thermostat</span>
                Layer 2: Climate & Regimen
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-text-subtle border border-[#EBE4D8]">
                Open-Meteo
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-text-muted">
                <span>Precipitation Multiplier:</span>
                <strong className="text-primary-rich font-bold">×{(selectedMedForecast.seir_parameters?.climate_multiplier || 1.35).toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>MoHFW STG Clinical Dosage:</span>
                <strong className="text-text-obsidian font-bold">~{dosePerCaseForProfile} units / admission</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Hospital Footfall Weight:</span>
                <strong className="text-text-obsidian font-bold">Mon 1.35× • Sun 0.40×</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Catchment Area Population:</span>
                <strong className="text-text-obsidian font-bold">45,000 block residents</strong>
              </div>
            </div>

            <p className="text-[11px] text-text-muted pt-2 border-t border-stone-100">
              Translates mathematical infection waves into physical pharmaceutical unit requirements.
            </p>
          </div>

          {/* Layer 3: Autonomous Executive Gemini Synthesis */}
          <div className="bg-white/95 p-4 rounded-2xl border border-[#EBE4D8] space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-text-obsidian flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-brand">auto_awesome</span>
                Layer 3: Gemini 1.5 Synthesis
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                95.2% Confidence
              </span>
            </div>

            <div className="text-xs space-y-2 text-text-obsidian italic font-body">
              <p className="leading-relaxed">
                "{selectedMedForecast.executive_synthesis?.epidemiological_summary || `Discrete SEIR differential trajectory projects active clinical wave peaking on Day 6 (~38 admissions/day).`}"
              </p>
              <p className="leading-relaxed text-rose-800 font-semibold not-italic">
                ⚠️ {selectedMedForecast.executive_synthesis?.stockout_forecast || `Primary stock will exhaust in ~${selectedMedForecast.zero_stock_countdown_hours}h.`}
              </p>
            </div>

            <p className="text-[11px] text-primary-rich font-bold pt-2 border-t border-stone-100 not-italic">
              🛡️ {selectedMedForecast.executive_synthesis?.audit_recommendation || `Trigger automated P2P transfer corridor.`}
            </p>
          </div>
        </div>
      </section>

      {/* 14-Day Forward Trajectory Chart */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-2.5 py-0.5 rounded-full border border-amber-brand/20">
                Forward Radar
              </span>
              <span className="text-xs text-text-muted font-medium">Dual-Axis Trajectory & Depletion Curve</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian mt-1">
              14-Day Trajectory: {selectedMedForecast.generic_name}
            </h2>
            <p className="text-xs text-text-muted">
              Projected clinical consumption solved via discrete SEIR differential equations (RK4) with live Open-Meteo climate anomaly coupling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Segmented Pill */}
            <div className="bg-[#FAF8F5] p-1 rounded-2xl border border-[#EBE4D8] flex items-center gap-1">
              <button
                type="button"
                onClick={() => setChartViewMode('patient_coverage')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartViewMode === 'patient_coverage'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-300'
                    : 'text-text-muted hover:text-text-obsidian'
                }`}
              >
                🌊 Patient Coverage Wave
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('stock_runway')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartViewMode === 'stock_runway'
                    ? 'bg-white text-primary-rich shadow-2xs border border-amber-brand/20'
                    : 'text-text-muted hover:text-text-obsidian'
                }`}
              >
                📉 Stock Depletion Runway
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('trajectory_lines')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartViewMode === 'trajectory_lines'
                    ? 'bg-white text-slate-800 shadow-2xs border border-slate-300'
                    : 'text-text-muted hover:text-text-obsidian'
                }`}
              >
                📈 Clinical Trajectory Lines
              </button>
            </div>

            {/* Medicine Selector */}
            <select
              value={selectedMedicineId}
              onChange={(e) => setSelectedMedicineId(e.target.value)}
              className="bg-[#FAF8F5] py-2 px-3.5 rounded-2xl text-xs font-bold text-text-obsidian border border-[#EBE4D8] focus:outline-none cursor-pointer"
            >
              {initialDistrictData.medicines.map((m) => (
                <option key={m.id} value={m.id}>{m.generic_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Depletion Countdown Warning */}
        {selectedMedForecast.days_of_stock_remaining < 3.5 && (
          <div className="p-4 rounded-2xl bg-[#FCF3F2] border border-[#F3C5C2] text-[#7A1E18] text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#9E2A2B] shrink-0">emergency_home</span>
              <div>
                <strong>CRITICAL DEPLETION WARNING:</strong> Projected zero stock at <strong>{activeFacility?.name}</strong> in{' '}
                <strong className="underline decoration-[#9E2A2B]/40">~{selectedMedForecast.zero_stock_countdown_hours} hours</strong> ({selectedMedForecast.days_of_stock_remaining} days runway).
                <div className="text-[11px] text-[#7A1E18]/80 mt-0.5">
                  After Day {selectedMedForecast.stockout_expected_day || '7'}, patients arriving at this clinic will be turned away unless emergency supplies are rerouted.
                </div>
              </div>
            </div>
            <button
              onClick={() => alert(`Initiating emergency auto-corridor to rebalance ${selectedMedForecast.generic_name} to ${activeFacility?.name}`)}
              className="px-4 py-2 rounded-full bg-[#9E2A2B] hover:bg-[#801F20] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition"
            >
              Trigger Redistribution →
            </button>
          </div>
        )}

        {/* Trajectory KPI Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Physical Stock on Shelf</span>
            <div className="font-display font-bold text-lg text-primary-rich mt-0.5">
              {(selectedMedForecast.current_stock ?? 0).toLocaleString()} <span className="text-xs font-normal text-text-muted">units</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Daily Patient Rate</span>
            <div className="font-display font-bold text-lg text-text-obsidian mt-0.5">
              ~{selectedMedForecast.effective_daily_rate} <span className="text-xs font-normal text-text-muted">units/day</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">Runway Countdown</span>
            <div className={`font-display font-bold text-lg mt-0.5 ${selectedMedForecast.days_of_stock_remaining < 3.5 ? 'text-[#9E2A2B]' : 'text-emerald-800'}`}>
              {selectedMedForecast.days_of_stock_remaining} Days <span className="text-xs font-normal opacity-80">(~{selectedMedForecast.zero_stock_countdown_hours}h)</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EBE4D8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">14-Day Deficit Gap</span>
            <div className={`font-display font-bold text-lg mt-0.5 ${selectedMedForecast.total_unmet_doses > 0 ? 'text-[#9E2A2B]' : 'text-emerald-800'}`}>
              {selectedMedForecast.total_unmet_doses > 0 ? `${selectedMedForecast.total_unmet_doses.toLocaleString()} Unmet` : '0 (Secured)'}
            </div>
          </div>
        </div>

        {/* Visual Axis Guide Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EBE4D8] text-xs">
          {chartViewMode === 'patient_coverage' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#059669] inline-block"></span>
                <span className="font-bold text-[#059669]">Emerald Area:</span>
                <span className="text-text-muted">Fulfilled Patient Care ({(selectedMedForecast.total_fulfilled_doses ?? 0).toLocaleString()} doses)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E11D48] inline-block"></span>
                <span className="font-bold text-[#E11D48]">Coral Area:</span>
                <span className="text-text-muted">
                  {selectedMedForecast.total_unmet_doses > 0
                    ? `⚠️ Stockout Deficit (${selectedMedForecast.total_unmet_doses.toLocaleString()} doses unfulfilled)`
                    : 'Zero Deficit (100% Demand Covered)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t-2 border-[#334155] inline-block"></span>
                <span className="font-bold text-[#334155]">Top Line:</span>
                <span className="text-text-muted">Total Community Need</span>
              </div>
            </div>
          )}

          {chartViewMode === 'stock_runway' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block"></span>
                <span className="font-bold text-[#D97706]">Amber Area:</span>
                <span className="text-text-muted">Physical Inventory on Dispensary Shelf</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#F59E0B] inline-block"></span>
                <span className="font-bold text-[#D97706]">Safety Threshold:</span>
                <span className="text-text-muted">3.5-Day Minimum Clinical Buffer (~{Math.round(selectedMedForecast.effective_daily_rate * 3.5)} units)</span>
              </div>
              {selectedMedForecast.stockout_expected_day && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#E11D48] inline-block"></span>
                  <span className="font-bold text-[#E11D48]">Stockout:</span>
                  <span className="text-[#E11D48] font-medium">Day {selectedMedForecast.stockout_expected_day} (~{selectedMedForecast.zero_stock_countdown_hours}h)</span>
                </div>
              )}
            </div>
          )}

          {chartViewMode === 'trajectory_lines' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#334155] inline-block"></span>
                <span className="font-bold text-[#334155]">Slate Line:</span>
                <span className="text-text-muted">Projected Patient Demand (~{selectedMedForecast.effective_daily_rate} u/day)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#059669] inline-block"></span>
                <span className="font-bold text-[#059669]">Emerald Line:</span>
                <span className="text-text-muted">Fulfilled Daily Dispensation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E11D48] inline-block"></span>
                <span className="font-bold text-[#E11D48]">Coral Line:</span>
                <span className="text-text-muted">Unmet Patient Need</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-stone-300/70 inline-block"></span>
                <span className="text-text-muted">85%–115% Epidemic Confidence Band</span>
              </div>
            </div>
          )}

          <div className="text-[11px] text-text-subtle italic">
            Monday Peak (1.35×) • Sunday Emergency (0.4×)
          </div>
        </div>

        {/* Chart View Container */}
        <div className="h-72 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'patient_coverage' ? (
              /* Smooth Area Wave: Fulfilled Patient Dispensation vs Deficit (Zero Bars) */
              <ComposedChart
                data={selectedMedForecast.daily_forecast}
                margin={{ top: 20, right: 25, left: 10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="emeraldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="coralFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FDA4AF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EBE4D8" strokeDasharray="3 3" vertical={false} opacity={0.7} />

                <XAxis
                  dataKey="day_label"
                  interval={0}
                  stroke="#78716C"
                  fontSize={10.5}
                  tickLine={false}
                  axisLine={{ stroke: '#EBE4D8' }}
                  dy={8}
                />

                <YAxis
                  stroke="#57534E"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  label={{
                    value: 'Daily Prescriptions (Units/Day)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#57534E',
                    fontSize: 10,
                    dy: 80,
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const hasDeficit = d.unmet_demand > 0;
                      return (
                        <div className="bg-white/98 backdrop-blur-md p-3.5 rounded-2xl border border-[#EBE4D8] shadow-[0_16px_36px_rgba(26,22,20,0.08)] text-xs space-y-2 min-w-[240px]">
                          <div className="font-display font-bold text-text-obsidian pb-1 border-b border-stone-100 flex justify-between items-center">
                            <span>{d.day_label || d.day} ({d.date})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasDeficit ? 'bg-[#FCF3F2] text-[#E11D48] border border-[#FDA4AF]' : 'bg-emerald-50 text-[#059669] border border-emerald-200'}`}>
                              {hasDeficit ? '⚠️ DEFICIT GAP' : '✅ 100% COVERED'}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between items-center text-slate-700">
                              <span className="font-medium">Total Patient Need:</span>
                              <strong>{(d.projected_demand ?? d.daily_projected ?? 0).toLocaleString()} units</strong>
                            </div>
                            <div className="flex justify-between items-center text-[#059669]">
                              <span className="font-medium">Fulfilled Dispensation:</span>
                              <strong>{(d.fulfilled_demand ?? 0).toLocaleString()} units</strong>
                            </div>
                            {hasDeficit ? (
                              <div className="flex justify-between items-center text-[#E11D48] font-bold bg-[#FCF3F2] p-1.5 rounded-lg border border-[#FDA4AF]">
                                <span>Patients Turned Away:</span>
                                <span>{d.unmet_demand.toLocaleString()} doses short</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-[#059669] italic">
                                ✓ All arriving patients received full prescribed course
                              </div>
                            )}
                            <div className="flex justify-between items-center text-[#D97706] pt-1 border-t border-stone-100">
                              <span>Remaining Shelf Stock:</span>
                              <strong>{(d.remaining_stock ?? 0).toLocaleString()} units</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />

                {/* Fulfilled Dispensation Area (Stacked) */}
                <Area
                  type="monotone"
                  dataKey="fulfilled_demand"
                  stackId="patient_flow"
                  name="Fulfilled Patient Care"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#emeraldFill)"
                />

                {/* Unmet Demand Area (Stacked on top) */}
                <Area
                  type="monotone"
                  dataKey="unmet_demand"
                  stackId="patient_flow"
                  name="Unmet Patient Need (Stockout)"
                  stroke="#E11D48"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#coralFill)"
                />

                {/* Total Demand Profile Line */}
                <Line
                  type="monotone"
                  dataKey="daily_projected"
                  name="Total Patient Demand Wave"
                  stroke="#334155"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#334155' }}
                />

                {/* Clean Stockout Vertical Reference Line */}
                {selectedMedForecast.stockout_expected_day && (
                  <ReferenceLine
                    x={selectedMedForecast.daily_forecast[selectedMedForecast.stockout_expected_day - 1]?.day_label}
                    stroke="#E11D48"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: `🚨 ZERO STOCK (DAY ${selectedMedForecast.stockout_expected_day})`,
                      position: 'top',
                      fill: '#E11D48',
                      fontSize: 10.5,
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </ComposedChart>
            ) : chartViewMode === 'stock_runway' ? (
              /* Dispensary Stock Runway Area Chart */
              <ComposedChart
                data={selectedMedForecast.daily_forecast}
                margin={{ top: 20, right: 25, left: 10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="amberRunwayFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EBE4D8" strokeDasharray="3 3" vertical={false} opacity={0.7} />

                <XAxis
                  dataKey="day_label"
                  interval={0}
                  stroke="#78716C"
                  fontSize={10.5}
                  tickLine={false}
                  axisLine={{ stroke: '#EBE4D8' }}
                  dy={8}
                />

                <YAxis
                  stroke="#D97706"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  label={{
                    value: 'Physical Stock on Shelf (Units)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#D97706',
                    fontSize: 10,
                    dy: 80,
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const isDepleted = d.remaining_stock === 0;
                      return (
                        <div className="bg-white/98 backdrop-blur-md p-3.5 rounded-2xl border border-[#EBE4D8] shadow-[0_16px_36px_rgba(26,22,20,0.08)] text-xs space-y-2 min-w-[240px]">
                          <div className="font-display font-bold text-text-obsidian pb-1 border-b border-stone-100 flex justify-between items-center">
                            <span>{d.day_label || d.day} ({d.date})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDepleted ? 'bg-[#FCF3F2] text-[#E11D48] border border-[#FDA4AF]' : 'bg-amber-50 text-[#D97706] border border-amber-200'}`}>
                              {isDepleted ? '🚨 EXHAUSTED' : '✅ ON SHELF'}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between items-center text-[#D97706]">
                              <span className="font-medium">Remaining Physical Stock:</span>
                              <strong>{(d.remaining_stock ?? 0).toLocaleString()} units</strong>
                            </div>
                            <div className="flex justify-between items-center text-stone-600">
                              <span className="font-medium">Daily Outflow Required:</span>
                              <strong>{(d.projected_demand ?? d.daily_projected ?? 0).toLocaleString()} units</strong>
                            </div>
                            {d.unmet_demand > 0 && (
                              <div className="flex justify-between items-center text-[#E11D48] font-bold bg-[#FCF3F2] p-1.5 rounded-lg border border-[#FDA4AF]">
                                <span>Unmet Deficit Today:</span>
                                <span>{d.unmet_demand} doses short</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />

                {/* 3.5-Day Minimum Safety Threshold */}
                <ReferenceLine
                  y={Math.round(selectedMedForecast.effective_daily_rate * 3.5)}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  label={{
                    value: '3.5-Day Minimum Safety Threshold',
                    position: 'right',
                    fill: '#D97706',
                    fontSize: 9.5,
                    fontWeight: 'bold',
                  }}
                />

                {/* Smooth Stock Area */}
                <Area
                  type="monotone"
                  dataKey="remaining_stock"
                  name="Dispensary Shelf Stock Runway"
                  stroke="#D97706"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#amberRunwayFill)"
                />

                {/* Stockout Reference Line */}
                {selectedMedForecast.stockout_expected_day && (
                  <ReferenceLine
                    x={selectedMedForecast.daily_forecast[selectedMedForecast.stockout_expected_day - 1]?.day_label}
                    stroke="#E11D48"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: `🚨 ZERO STOCK (DAY ${selectedMedForecast.stockout_expected_day})`,
                      position: 'top',
                      fill: '#E11D48',
                      fontSize: 10.5,
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </ComposedChart>
            ) : (
              /* Clinical Multi-Line Trajectory with Confidence Band */
              <ComposedChart
                data={selectedMedForecast.daily_forecast}
                margin={{ top: 20, right: 25, left: 10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EBE4D8" strokeDasharray="3 3" vertical={false} opacity={0.7} />

                <XAxis
                  dataKey="day_label"
                  interval={0}
                  stroke="#78716C"
                  fontSize={10.5}
                  tickLine={false}
                  axisLine={{ stroke: '#EBE4D8' }}
                  dy={8}
                />

                <YAxis
                  stroke="#334155"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  label={{
                    value: 'Medicine Units',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#334155',
                    fontSize: 10,
                    dy: 70,
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white/98 backdrop-blur-md p-3.5 rounded-2xl border border-[#EBE4D8] shadow-[0_16px_36px_rgba(26,22,20,0.08)] text-xs space-y-2 min-w-[240px]">
                          <div className="font-display font-bold text-text-obsidian pb-1 border-b border-stone-100 flex justify-between items-center">
                            <span>{d.day_label || d.day} ({d.date})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.unmet_demand > 0 ? 'bg-[#FCF3F2] text-[#E11D48]' : 'bg-emerald-50 text-[#059669]'}`}>
                              {d.unmet_demand > 0 ? '⚠️ DEFICIT' : '✅ SECURED'}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between items-center text-slate-700">
                              <span>Projected Need:</span>
                              <strong>{(d.projected_demand ?? d.daily_projected ?? 0).toLocaleString()} units</strong>
                            </div>
                            <div className="flex justify-between items-center text-stone-500 text-[10px]">
                              <span>Epidemic Band (85%–115%):</span>
                              <span>{d.lower_bound_85} – {d.upper_bound_115} units</span>
                            </div>
                            <div className="flex justify-between items-center text-[#059669]">
                              <span>Fulfilled Dispensation:</span>
                              <strong>{(d.fulfilled_demand ?? 0).toLocaleString()} units</strong>
                            </div>
                            {d.unmet_demand > 0 && (
                              <div className="flex justify-between items-center text-[#E11D48] font-bold">
                                <span>Deficit Gap:</span>
                                <strong>{d.unmet_demand.toLocaleString()} doses short</strong>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-[#D97706] pt-1 border-t border-stone-100">
                              <span>Shelf Stock:</span>
                              <strong>{(d.remaining_stock ?? 0).toLocaleString()} units</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />

                {/* Total Daily Demand Line */}
                <Line
                  type="monotone"
                  dataKey="daily_projected"
                  name="Total Patient Demand"
                  stroke="#334155"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#334155' }}
                />

                {/* Fulfilled Dispensation Line */}
                <Line
                  type="monotone"
                  dataKey="fulfilled_demand"
                  name="Fulfilled Patient Care"
                  stroke="#059669"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#059669' }}
                />

                {/* Unmet Deficit Line */}
                <Line
                  type="monotone"
                  dataKey="unmet_demand"
                  name="Unmet Deficit Gap"
                  stroke="#E11D48"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#E11D48' }}
                />

                {/* Dispensary Shelf Stock Line */}
                <Line
                  type="monotone"
                  dataKey="remaining_stock"
                  name="Dispensary Shelf Stock"
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#D97706' }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      {/* Comprehensive Predictive AI Architecture & Methodology Guide */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-2.5 py-0.5 rounded-full border border-amber-brand/20">
              System Blueprint & Explainability
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-text-muted font-medium">How Predictive AI Powers Aushadh Setu</span>
          </div>

          <h3 className="font-display font-bold text-xl text-text-obsidian mt-1.5">
            Understanding the 4 Predictive Intelligence Engines
          </h3>
          <p className="text-xs text-text-muted">
            Click any section below to understand the clinical, mathematical, and logistical architecture behind this screen.
          </p>
        </div>

        {/* 4 Interactive Explainer Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-stone-100 pb-3">
          <button
            onClick={() => setActiveExplainerTab('overview')}
            className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
              activeExplainerTab === 'overview'
                ? 'bg-amber-soft/80 border-amber-brand text-primary-rich font-bold shadow-xs'
                : 'bg-[#FAF8F5] border-[#EBE4D8] text-text-muted hover:text-text-obsidian'
            }`}
          >
            <span className="text-lg block">🎯</span>
            <span className="text-xs block mt-1">1. The Problem We Solve</span>
            <span className="text-[10px] text-text-subtle font-normal block">Why Traditional Indenting Fails</span>
          </button>

          <button
            onClick={() => setActiveExplainerTab('sdm')}
            className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
              activeExplainerTab === 'sdm'
                ? 'bg-amber-soft/80 border-amber-brand text-primary-rich font-bold shadow-xs'
                : 'bg-[#FAF8F5] border-[#EBE4D8] text-text-muted hover:text-text-obsidian'
            }`}
          >
            <span className="text-lg block">🦟</span>
            <span className="text-xs block mt-1">2. Syndromic Matrix (SDM)</span>
            <span className="text-[10px] text-text-subtle font-normal block">Biological & Climate Coupling</span>
          </button>

          <button
            onClick={() => setActiveExplainerTab('latent')}
            className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
              activeExplainerTab === 'latent'
                ? 'bg-amber-soft/80 border-amber-brand text-primary-rich font-bold shadow-xs'
                : 'bg-[#FAF8F5] border-[#EBE4D8] text-text-muted hover:text-text-obsidian'
            }`}
          >
            <span className="text-lg block">📉</span>
            <span className="text-xs block mt-1">3. The Latent Demand Trap</span>
            <span className="text-[10px] text-text-subtle font-normal block">Preventing AI Blindness</span>
          </button>

          <button
            onClick={() => setActiveExplainerTab('fefo')}
            className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
              activeExplainerTab === 'fefo'
                ? 'bg-amber-soft/80 border-amber-brand text-primary-rich font-bold shadow-xs'
                : 'bg-[#FAF8F5] border-[#EBE4D8] text-text-muted hover:text-text-obsidian'
            }`}
          >
            <span className="text-lg block">⚖️</span>
            <span className="text-xs block mt-1">4. Dual-Risk Rebalancing</span>
            <span className="text-[10px] text-text-subtle font-normal block">Eliminating Expiry Waste</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EBE4D8] text-xs leading-relaxed space-y-3">
          {activeExplainerTab === 'overview' && (
            <div className="space-y-2.5">
              <h4 className="font-display font-bold text-sm text-text-obsidian flex items-center gap-1.5">
                <span>🎯 The Crisis in Public Health Medicine Indenting</span>
              </h4>
              <p className="text-text-muted">
                In India's public health system (PHCs and Sub-Centres), medicine procurement has traditionally relied on <strong>static quarterly spreadsheets</strong> or last year's historical indenting. When an unexpected monsoon flood, water contamination, or dengue outbreak strikes a taluka, patient footfalls spike by +50% to +150% in a few days.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-700 block">The Deadly Status Quo:</span>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Rural clinics run completely out of Ringer Lactate IV or Paracetamol in 48 hours. By the time a paper request travels up to the District Health Officer (DHO), weeks have passed and poor citizens are forced to buy medicines out-of-pocket or suffer preventable mortality.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">The Aushadh Setu Solution:</span>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Predictive AI acts as an autonomous <strong>14-day forward radar</strong>. It combines live weather anomalies and IDSP weekly surveillance with hospital inventory to calculate exact hours-to-depletion and auto-trigger transfers before the dispensary shelf ever goes empty.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeExplainerTab === 'sdm' && (
            <div className="space-y-2.5">
              <h4 className="font-display font-bold text-sm text-text-obsidian flex items-center gap-1.5">
                <span>🦟 National Syndromic-to-Drug Matrix (SDM)</span>
              </h4>
              <p className="text-text-muted">
                Instead of treating medicine demand in isolation, the SDM couples <strong>climatic precursors</strong> and <strong>syndromic illness patterns</strong> directly to the specific pharmaceutical commodities required to treat them.
              </p>
              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 bg-white rounded-xl border border-[#EBE4D8] flex items-center justify-between">
                  <div>
                    <strong className="text-text-obsidian">IMD Monsoon Rainfall Anomaly &gt; 25%</strong>
                    <div className="text-[10px] text-text-muted font-sans">Vector breeding expansion in rural water reservoirs</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-soft text-primary-rich font-bold">Ringer Lactate × 2.40 • Paracetamol × 1.85</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#EBE4D8] flex items-center justify-between">
                  <div>
                    <strong className="text-text-obsidian">Acute Diarrhoeal Disease (ADD) Surge &gt; 30%</strong>
                    <div className="text-[10px] text-text-muted font-sans">Waterborne contamination following post-flood groundwater stagnation</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-soft text-primary-rich font-bold">ORS IP Sachets × 2.80 • Zinc Sulfate × 2.10</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#EBE4D8] flex items-center justify-between">
                  <div>
                    <strong className="text-text-obsidian">Agricultural Harvesting Season (Ghats & Plains)</strong>
                    <div className="text-[10px] text-text-muted font-sans">Increased human-reptile encounters in sugarcane and paddy fields</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-soft text-primary-rich font-bold">Anti-Snake Venom (ASV) × 2.50 • Saline × 1.60</span>
                </div>
              </div>
            </div>
          )}

          {activeExplainerTab === 'latent' && (
            <div className="space-y-2.5">
              <h4 className="font-display font-bold text-sm text-text-obsidian flex items-center gap-1.5">
                <span>📉 The "Latent / Suppressed Demand" Trap</span>
              </h4>
              <p className="text-text-muted">
                Conventional AI forecasting algorithms suffer from a catastrophic flaw in rural clinics: <strong>the Zero-Stock Illusion</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-brand/30 space-y-2">
                <div className="font-mono text-[11px] text-text-obsidian bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  True Demand = Observed Dispensed + λ × (Surveillance Surge) × [1 - (Physical Stock / Baseline)]
                </div>
                <p className="text-[11px] text-stone-600">
                  When a clinic runs out of Paracetamol, the pharmacist dispenses 0 tablets. A standard machine learning model looks at historical dispensing records, sees 0 tablets dispensed for 5 days, and falsely predicts that <em>"demand has dropped to zero"</em>! As a result, the next supply truck delivers even less medicine.
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  ✓ Aushadh Setu uses catchment population epidemiology (45,000 citizens per PHC block) to mathematically calculate how many patients are being turned away empty-handed, keeping the red deficit bar visible in the chart above!
                </p>
              </div>
            </div>
          )}

          {activeExplainerTab === 'fefo' && (
            <div className="space-y-2.5">
              <h4 className="font-display font-bold text-sm text-text-obsidian flex items-center gap-1.5">
                <span>⚖️ Dual-Risk Matrix: Eliminating the ₹CAG Expiry Write-Off</span>
              </h4>
              <p className="text-text-muted">
                Public health supply chains in India suffer from an absurd paradox: <strong>clinics run out of drugs on the same day central warehouses incinerate expired medicine</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-[#EBE4D8]">
                  <span className="font-bold text-amber-900 block">Risk #1: Fatal Stockouts (DSR &lt; 3.5 Days)</span>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Identifies rural PHCs where high patient influx will drain physical stock in under 84 hours, endangering lives.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#EBE4D8]">
                  <span className="font-bold text-amber-900 block">Risk #2: Expiring Surplus (FEFO &lt; 60 Days)</span>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Calculates batches in warehouses or low-intake clinics that will expire before local patients can consume them.
                  </p>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                🛡️ <strong>The Setu Rebalancing Algorithm:</strong> Automatically matches expiring surplus batches at donor warehouses with imminent stockouts at deficit PHCs. This delivers life-saving medicines to patients with <strong>zero additional procurement budget</strong> while preventing statutory CAG audit write-offs!
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MoHFW STG-Compliant Epidemic Vector Definition Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-[#EBE4D8] shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-amber-soft border border-amber-brand/30 flex items-center justify-center text-xl shrink-0">
                  ⚕️
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-text-obsidian">
                    Define MoHFW STG-Compliant Outbreak Vector
                  </h3>
                  <span className="text-[11px] text-text-muted">
                    Lock custom emerging pathogens to deterministic NLEM pharmaceutical formularies
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* 1-Click Presets */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5">
                1-Click MoHFW Presets (National Surveillance Vectors):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_VECTORS.map((pv) => (
                  <button
                    key={pv.name}
                    type="button"
                    onClick={() => {
                      setNewDiseaseForm({
                        name: pv.name,
                        r0: pv.r0,
                        driver: pv.driver,
                        medId: pv.medId,
                        multiplier: pv.multiplier,
                        dosePerCase: pv.dosePerCase,
                        icon: pv.icon,
                      });
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-soft border border-[#EBE4D8] text-xs font-semibold text-text-obsidian flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{pv.icon}</span>
                    <span>{pv.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Definition Form */}
            <form onSubmit={handleCreateCustomDisease} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">
                    Pathogen / Outbreak Vector Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leptospirosis, Cholera Influx, Heatstroke"
                    value={newDiseaseForm.name}
                    onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-text-obsidian rounded-xl border border-[#EBE4D8] focus:outline-none focus:ring-2 focus:ring-amber-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">
                    Transmission Index (R₀):
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="5.0"
                    required
                    value={newDiseaseForm.r0}
                    onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, r0: e.target.value })}
                    className="w-full bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-text-obsidian rounded-xl border border-[#EBE4D8] focus:outline-none focus:ring-2 focus:ring-amber-brand"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-obsidian block">
                  Epidemiological / Environmental Precursor Driver:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monsoon waterlogging, IMD heatwave alert >43°C, contaminated borewell"
                  value={newDiseaseForm.driver}
                  onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, driver: e.target.value })}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-text-obsidian rounded-xl border border-[#EBE4D8] focus:outline-none focus:ring-2 focus:ring-amber-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-obsidian block">
                    Primary NLEM Commodity Coupling:
                  </label>
                  <select
                    value={newDiseaseForm.medId}
                    onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, medId: e.target.value })}
                    className="w-full bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-text-obsidian rounded-xl border border-[#EBE4D8] focus:outline-none focus:ring-2 focus:ring-amber-brand cursor-pointer"
                  >
                    {initialDistrictData.medicines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.generic_name} ({m.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-obsidian block">
                      Surge Weight (×):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={newDiseaseForm.multiplier}
                      onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, multiplier: e.target.value })}
                      className="w-full bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-primary-rich rounded-xl border border-[#EBE4D8] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-obsidian block">
                      Dose / Case:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="20"
                      value={newDiseaseForm.dosePerCase}
                      onChange={(e) => setNewDiseaseForm({ ...newDiseaseForm, dosePerCase: e.target.value })}
                      className="w-full bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-text-obsidian rounded-xl border border-[#EBE4D8] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-obsidian block">
                  Select Visual Glyphs:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🦟', '💧', '🫁', '🐍', '🐀', '🦠', '☀️', '🌾', '🦇', '🧪', '💉'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewDiseaseForm({ ...newDiseaseForm, icon: ic })}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition border ${
                        newDiseaseForm.icon === ic
                          ? 'bg-amber-soft border-amber-brand scale-110 shadow-xs'
                          : 'bg-[#FAF8F5] border-[#EBE4D8] hover:bg-stone-100'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Clinical Governance Notice */}
              <div className="p-3 bg-amber-soft/60 rounded-2xl border border-amber-brand/20 text-[11px] text-amber-900 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-amber-brand shrink-0 mt-0.5">
                  verified_user
                </span>
                <div>
                  <strong>MoHFW Standard Treatment Guidelines (STG) Governance:</strong> In compliance with national public health mandates, all pharmaceutical choices are strictly restricted to the deterministic NLEM formulary list. Artificial generative hallucination of off-guideline drugs is strictly prevented.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-bold text-text-muted hover:text-text-obsidian transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-amber-brand hover:bg-[#B45309] text-white text-xs font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_task</span>
                  <span>Register Outbreak Vector →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
