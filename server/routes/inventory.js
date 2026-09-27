import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/district_data.json');

// Helper to read and write database
function getDb() {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

function saveDb(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// 0. Get All States
router.get('/states', (req, res) => {
  const db = getDb();
  res.json({ success: true, states: db.states || [] });
});

// 0.1 Get Districts (optionally filtered by state_id)
router.get('/districts', (req, res) => {
  const db = getDb();
  const stateId = req.query.state_id;
  let districts = db.districts || [];
  if (stateId) {
    districts = districts.filter(d => d.state_id === stateId);
  }
  res.json({ success: true, districts });
});

// 1. Get Facilities (optionally filtered by district_id or state_id)
router.get('/facilities', (req, res) => {
  const db = getDb();
  const districtId = req.query.district_id;
  const stateId = req.query.state_id;

  let facilities = db.facilities || [];
  if (districtId) {
    facilities = facilities.filter(f => f.district_id === districtId);
  } else if (stateId) {
    facilities = facilities.filter(f => f.state_id === stateId);
  }

  res.json({ success: true, facilities });
});

// 2. Get All Medicines
router.get('/medicines', (req, res) => {
  const db = getDb();
  res.json({ success: true, medicines: db.medicines });
});

// 3. Get All Batches with computed DSR & FEFO risk status
router.get('/batches', (req, res) => {
  const db = getDb();
  const facilityFilter = req.query.facility_id;

  let batches = db.batches.map(batch => {
    const med = db.medicines.find(m => m.id === batch.medicine_id);
    const facility = db.facilities.find(f => f.id === batch.facility_id);
    const dailyRate = med ? med.standard_daily_baseline : 30;
    const dsr = (batch.quantity / dailyRate).toFixed(1);

    return {
      ...batch,
      medicine_name: med ? med.generic_name : 'Unknown Medicine',
      category: med ? med.category : 'General',
      facility_name: facility ? facility.name : 'Unknown Facility',
      facility_type: facility ? facility.type : 'PHC',
      days_of_stock_remaining: parseFloat(dsr),
      is_cold_chain: med ? med.is_cold_chain : false,
    };
  });

  if (facilityFilter) {
    batches = batches.filter(b => b.facility_id === facilityFilter);
  }

  res.json({ success: true, batches });
});

// 4. Record Daily Dispensing (Deduct stock)
router.post('/dispense', (req, res) => {
  const { batch_no, facility_id, quantity_dispensed, notes } = req.body;
  if (!batch_no || !quantity_dispensed || quantity_dispensed <= 0) {
    return res.status(400).json({ success: false, error: 'Valid batch_no and quantity_dispensed are required.' });
  }

  const db = getDb();
  const batchIndex = db.batches.findIndex(b => b.batch_no === batch_no && (!facility_id || b.facility_id === facility_id));

  if (batchIndex === -1) {
    return res.status(404).json({ success: false, error: 'Batch not found at specified facility.' });
  }

  const batch = db.batches[batchIndex];
  if (batch.quantity < quantity_dispensed) {
    return res.status(400).json({
      success: false,
      error: `Insufficient stock! Only ${batch.quantity} units available.`,
    });
  }

  batch.quantity -= Number(quantity_dispensed);
  saveDb(db);

  res.json({
    success: true,
    message: `Successfully dispensed ${quantity_dispensed} units. Remaining stock: ${batch.quantity}`,
    updated_batch: batch,
  });
});

// 5. Add / Intake Batch from Gemini Vision Scanner
router.post('/add-batch', (req, res) => {
  const {
    generic_name,
    brand_name,
    batch_no,
    mfd,
    expiry_date,
    quantity,
    facility_id,
  } = req.body;

  if (!batch_no || !quantity || !facility_id) {
    return res.status(400).json({ success: false, error: 'Batch number, quantity, and facility_id are required.' });
  }

  const db = getDb();

  // Match or create medicine
  let med = db.medicines.find(
    m => m.generic_name.toLowerCase().includes((generic_name || '').toLowerCase()) ||
         (generic_name || '').toLowerCase().includes(m.generic_name.toLowerCase())
  );

  if (!med) {
    med = {
      id: `MED-${String(db.medicines.length + 1).padStart(2, '0')}`,
      generic_name: generic_name || 'Generic Medicine',
      brand_name: brand_name || 'Govt Supply',
      category: 'General Supply',
      unit: 'Standard Pack',
      is_cold_chain: false,
      standard_daily_baseline: 40,
      diseases_linked: ['General Care']
    };
    db.medicines.push(med);
  }

  // Calculate days to expiry
  const expDate = new Date(expiry_date || '2027-01-01');
  const today = new Date('2026-09-26');
  const diffTime = expDate - today;
  const daysToExpiry = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const newBatch = {
    batch_no,
    medicine_id: med.id,
    facility_id,
    quantity: Number(quantity),
    mfd: mfd || '2025-01-01',
    expiry: expiry_date || '2027-01-01',
    days_to_expiry: daysToExpiry,
    status: daysToExpiry < 60 ? 'IMMINENT_EXPIRY_RISK' : 'HEALTHY',
    unit_cost_inr: 25,
  };

  db.batches.push(newBatch);
  saveDb(db);

  res.json({
    success: true,
    message: `Batch ${batch_no} successfully logged into inventory.`,
    batch: newBatch,
  });
});

// 6. Public Citizen Search Endpoint (Medicine Finder)
router.get('/citizen-search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const districtId = req.query.district_id;
  const db = getDb();

  let matchedMeds = db.medicines;

  if (query) {
    matchedMeds = db.medicines.filter(m =>
      m.generic_name.toLowerCase().includes(query) ||
      m.brand_name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.diseases_linked.some(d => d.toLowerCase().includes(query))
    );
  }

  // Build facility availability cards
  const results = matchedMeds.map(med => {
    let facilitiesList = db.facilities.filter(f => f.type === 'PHC');
    if (districtId) {
      facilitiesList = facilitiesList.filter(f => f.district_id === districtId);
    }

    const facilityAvailability = facilitiesList
      .map(fac => {
        const facBatches = db.batches.filter(b => b.facility_id === fac.id && b.medicine_id === med.id);
        const totalStock = facBatches.reduce((sum, b) => sum + b.quantity, 0);

        let availabilityStatus = 'OUT_OF_STOCK';
        let badgeColor = 'red';

        if (totalStock >= med.standard_daily_baseline * 3) {
          availabilityStatus = 'AVAILABLE';
          badgeColor = 'green';
        } else if (totalStock > 0) {
          availabilityStatus = 'LIMITED_STOCK';
          badgeColor = 'amber';
        }

        return {
          facility_id: fac.id,
          facility_name: fac.name,
          taluk: fac.taluk,
          contact: fac.contact,
          timing: fac.timing,
          distance_km: fac.distance_from_wh_km,
          stock_status: availabilityStatus,
          badge_color: badgeColor,
          total_stock_units: totalStock,
          lat: fac.lat,
          lng: fac.lng,
        };
      })
      .sort((a, b) => a.distance_km - b.distance_km);

    return {
      medicine_id: med.id,
      medicine_name: med.generic_name,
      category: med.category,
      unit: med.unit,
      diseases_linked: med.diseases_linked,
      facilities: facilityAvailability,
    };
  });

  res.json({ success: true, count: results.length, results });
});

export default router;
