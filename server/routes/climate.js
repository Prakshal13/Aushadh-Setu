import express from 'express';
import { fetchDistrictClimateBackend, DISTRICT_COORDINATES } from '../services/climateService.js';

const router = express.Router();

// GET /api/climate/telemetry?district_id=...
router.get('/telemetry', async (req, res) => {
  try {
    const districtId = req.query.district_id || 'DIST-MH-PUNE';
    const telemetry = await fetchDistrictClimateBackend(districtId);
    res.json({
      success: true,
      telemetry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// GET /api/climate/districts
router.get('/districts', (req, res) => {
  res.json({
    success: true,
    districts: Object.entries(DISTRICT_COORDINATES).map(([id, info]) => ({
      id,
      ...info,
    })),
  });
});

export default router;
