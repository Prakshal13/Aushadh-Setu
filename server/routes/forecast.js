import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SYNDROMIC_DRUG_MATRIX,
  calculateDynamicDemandMultiplier,
  correctLatentDemand,
  generate14DayForecast,
  evaluateFefoExpiryRisk,
} from '../services/predictiveEngine.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/district_data.json');

function getDb() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

// 1. GET /api/forecast/matrix - Get Master Syndromic-to-Drug Matrix
router.get('/matrix', (req, res) => {
  res.json({
    success: true,
    matrix: SYNDROMIC_DRUG_MATRIX,
  });
});

// 2. GET /api/forecast/facility - 14-Day Forward Forecast & Dual-Risk for a specific Facility
router.get('/facility', (req, res) => {
  const facilityId = req.query.facility_id;
  if (!facilityId) {
    return res.status(400).json({ success: false, error: 'facility_id query parameter is required.' });
  }

  const db = getDb();
  const facility = db.facilities.find((f) => f.id === facilityId);
  if (!facility) {
    return res.status(404).json({ success: false, error: `Facility ${facilityId} not found.` });
  }

  const facilityBatches = db.batches.filter((b) => b.facility_id === facilityId);
  const surveillance = db.disease_surveillance_weekly || [];

  // Group facility stock by medicine
  const stockByMed = {};
  facilityBatches.forEach((b) => {
    stockByMed[b.medicine_id] = (stockByMed[b.medicine_id] || 0) + b.quantity;
  });

  const dailyDemandMap = {};
  const medicineForecasts = [];

  // Generate 14-day forward predictions for each medicine
  db.medicines.forEach((med) => {
    const currentStock = stockByMed[med.id] || 0;
    const { multiplier, activeDrivers } = calculateDynamicDemandMultiplier(med.id, surveillance);

    // Correct for zero-stock latent OPD dampening
    const { correctedDailyDemand, isSuppressed } = correctLatentDemand(
      med.standard_daily_baseline,
      currentStock,
      med.standard_daily_baseline,
      facility.catchment_population || 45000
    );

    dailyDemandMap[med.id] = Math.round(correctedDailyDemand * multiplier);

    const forecastObj = generate14DayForecast(
      med,
      currentStock,
      correctedDailyDemand,
      multiplier
    );

    medicineForecasts.push({
      ...forecastObj,
      category: med.category,
      unit: med.unit,
      is_cold_chain: med.is_cold_chain,
      demand_multiplier: multiplier,
      active_drivers: activeDrivers,
      latent_demand_corrected: isSuppressed,
    });
  });

  // Evaluate FEFO Expiry Risk for all batches at this facility
  const fefoBatchRisks = evaluateFefoExpiryRisk(facilityBatches, db.medicines, dailyDemandMap);

  // Aggregate metrics
  const totalFinancialExpiryRiskInr = fefoBatchRisks.reduce((sum, b) => sum + (b.financial_waste_risk_inr || 0), 0);
  const criticalStockoutCount = medicineForecasts.filter((m) => m.stockout_risk_status === 'CRITICAL_STOCKOUT_RISK').length;

  res.json({
    success: true,
    facility: {
      id: facility.id,
      name: facility.name,
      type: facility.type,
      taluk: facility.taluk,
      catchment_population: facility.catchment_population,
    },
    summary: {
      monitored_medicines: medicineForecasts.length,
      critical_stockouts: criticalStockoutCount,
      total_batches: facilityBatches.length,
      expiring_financial_risk_inr: totalFinancialExpiryRiskInr,
    },
    forecasts: medicineForecasts,
    fefo_batches: fefoBatchRisks,
  });
});

// 3. GET /api/forecast/district - District-Wide Dual-Risk Matrix (Supply-Demand Imbalances)
router.get('/district', (req, res) => {
  const districtId = req.query.district_id;
  const db = getDb();

  let targetFacilities = db.facilities;
  if (districtId) {
    targetFacilities = targetFacilities.filter((f) => f.district_id === districtId);
  }

  const facilityIds = new Set(targetFacilities.map((f) => f.id));
  const districtBatches = db.batches.filter((b) => facilityIds.has(b.facility_id));
  const surveillance = db.disease_surveillance_weekly || [];

  // Calculate high-risk stock-out clinics and surplus expiry facilities
  const stockoutClinics = [];
  const surplusDonors = [];

  targetFacilities.forEach((fac) => {
    const facBatches = districtBatches.filter((b) => b.facility_id === fac.id);

    db.medicines.forEach((med) => {
      const currentStock = facBatches
        .filter((b) => b.medicine_id === med.id)
        .reduce((sum, b) => sum + b.quantity, 0);

      const { multiplier } = calculateDynamicDemandMultiplier(med.id, surveillance);
      const effectiveDaily = Math.round(med.standard_daily_baseline * multiplier);
      const dsr = currentStock > 0 ? parseFloat((currentStock / effectiveDaily).toFixed(1)) : 0;

      if (dsr < 3.5 && fac.type === 'PHC') {
        stockoutClinics.push({
          facility_id: fac.id,
          facility_name: fac.name,
          taluk: fac.taluk,
          medicine_id: med.id,
          medicine_name: med.generic_name,
          current_stock: currentStock,
          effective_daily_burn: effectiveDaily,
          dsr_days: dsr,
          hours_to_depletion: Math.round(dsr * 24),
          urgency: dsr < 1.5 ? 'CRITICAL' : 'HIGH',
        });
      }
    });

    // Evaluate FEFO surplus
    const fefoEvaluated = evaluateFefoExpiryRisk(facBatches, db.medicines);
    fefoEvaluated.forEach((b) => {
      if (b.is_eligible_for_redistribution && b.expiring_surplus_units > 50) {
        const med = db.medicines.find((m) => m.id === b.medicine_id);
        surplusDonors.push({
          facility_id: fac.id,
          facility_name: fac.name,
          batch_no: b.batch_no,
          medicine_id: b.medicine_id,
          medicine_name: med ? med.generic_name : 'Medicine',
          quantity: b.quantity,
          expiring_surplus_units: b.expiring_surplus_units,
          days_to_expiry: b.days_to_expiry,
          expiry_date: b.expiry,
          financial_waste_risk_inr: b.financial_waste_risk_inr,
          fefo_risk_status: b.fefo_risk_status,
        });
      }
    });
  });

  const totalAtRiskValue = surplusDonors.reduce((sum, d) => sum + d.financial_waste_risk_inr, 0);

  res.json({
    success: true,
    district_id: districtId,
    facilities_analyzed: targetFacilities.length,
    dual_risk_matrix: {
      stockout_hotspots_count: stockoutClinics.length,
      stockout_hotspots: stockoutClinics,
      stockout_hazards_count: stockoutClinics.length,
      stockout_hazards: stockoutClinics,
      surplus_donors_count: surplusDonors.length,
      surplus_donors: surplusDonors,
      total_rescuable_financial_value_inr: totalAtRiskValue,
      total_rescuable_value_lakhs: parseFloat((totalAtRiskValue / 100000).toFixed(2)),
    }
  });
});

export default router;
