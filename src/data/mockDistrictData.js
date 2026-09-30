import { ALL_STATES, ALL_DISTRICTS, getFacilitiesForDistrict, getBatchesForDistrict, getAllFacilities, getAllBatches } from './allDistrictsData.js';

export { ALL_STATES, ALL_DISTRICTS, getFacilitiesForDistrict, getBatchesForDistrict, getAllFacilities, getAllBatches };

const curatedFacilities = [
    // --- MAHARASHTRA (PUNE DISTRICT) ---
    {
      id: "WH-01",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "District Central Drug Warehouse (Aundh)",
      type: "WAREHOUSE",
      taluk: "Aundh / Pune Urban",
      lat: 18.5590,
      lng: 73.8073,
      contact: "+91 20 2727 4100",
      timing: "08:00 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0
    },
    {
      id: "PHC-01",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Paud",
      type: "PHC",
      taluk: "Mulshi",
      lat: 18.5324,
      lng: 73.6148,
      contact: "+91 20 2292 2011",
      timing: "09:00 AM - 02:00 PM (Emergency 24x7)",
      has_cold_chain: true,
      catchment_population: 42000,
      distance_from_wh_km: 24
    },
    {
      id: "PHC-02",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Shirur",
      type: "PHC",
      taluk: "Shirur",
      lat: 18.8285,
      lng: 74.3758,
      contact: "+91 2138 222105",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 58000,
      distance_from_wh_km: 65
    },
    {
      id: "PHC-03",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Junnar",
      type: "PHC",
      taluk: "Junnar",
      lat: 19.2064,
      lng: 73.8761,
      contact: "+91 2132 222040",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 51000,
      distance_from_wh_km: 82
    },
    {
      id: "PHC-04",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Chakan",
      type: "PHC",
      taluk: "Khed",
      lat: 18.7606,
      lng: 73.8567,
      contact: "+91 2135 249210",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 69000,
      distance_from_wh_km: 32
    },
    {
      id: "PHC-05",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Baramati Rural",
      type: "PHC",
      taluk: "Baramati",
      lat: 18.1517,
      lng: 74.5772,
      contact: "+91 2112 224411",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 62000,
      distance_from_wh_km: 98
    },
    {
      id: "PHC-06",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Bhor",
      type: "PHC",
      taluk: "Bhor",
      lat: 18.1492,
      lng: 73.8447,
      contact: "+91 2113 222530",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 39000,
      distance_from_wh_km: 54
    },
    {
      id: "PHC-07",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Wagholi",
      type: "PHC",
      taluk: "Haveli",
      lat: 18.5793,
      lng: 73.9806,
      contact: "+91 20 2705 1120",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 85000,
      distance_from_wh_km: 19
    },
    {
      id: "PHC-08",
      state_id: "ST-MH",
      district_id: "DIST-MH-PUNE",
      name: "PHC Daund",
      type: "PHC",
      taluk: "Daund",
      lat: 18.4651,
      lng: 74.5822,
      contact: "+91 2117 262330",
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 54000,
      distance_from_wh_km: 80
    },

    // --- RAJASTHAN (JAIPUR RURAL) ---
    {
      id: "WH-RJ-01",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "RMSCL Central Drug Warehouse (Jaipur Rural)",
      type: "WAREHOUSE",
      taluk: "Jaipur HQ",
      lat: 26.9124,
      lng: 75.7873,
      contact: "+91 141 222 3881",
      timing: "08:30 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0
    },
    {
      id: "PHC-RJ-01",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "PHC Bassi",
      type: "PHC",
      taluk: "Bassi",
      lat: 26.8324,
      lng: 76.0438,
      contact: "+91 1429 222110",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 52000,
      distance_from_wh_km: 30
    },
    {
      id: "PHC-RJ-02",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "PHC Jamwa Ramgarh",
      type: "PHC",
      taluk: "Jamwa Ramgarh",
      lat: 27.0042,
      lng: 75.9864,
      contact: "+91 1426 222301",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 46000,
      distance_from_wh_km: 35
    },
    {
      id: "PHC-RJ-03",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "PHC Chomu",
      type: "PHC",
      taluk: "Chomu",
      lat: 27.1685,
      lng: 75.7231,
      contact: "+91 1423 221045",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 64000,
      distance_from_wh_km: 33
    },
    {
      id: "PHC-RJ-04",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "PHC Chaksu",
      type: "PHC",
      taluk: "Chaksu",
      lat: 26.6025,
      lng: 75.9525,
      contact: "+91 1429 243220",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 48000,
      distance_from_wh_km: 42
    },
    {
      id: "PHC-RJ-05",
      state_id: "ST-RJ",
      district_id: "DIST-RJ-JAIPUR",
      name: "PHC Amer Rural",
      type: "PHC",
      taluk: "Amer",
      lat: 26.9855,
      lng: 75.8507,
      contact: "+91 141 253 0112",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 58000,
      distance_from_wh_km: 15
    },

    // --- DELHI (NORTH & SOUTH-WEST) ---
    {
      id: "WH-DL-01",
      state_id: "ST-DL",
      district_id: "DIST-DL-NORTH",
      name: "CMSO Central Medical Store (Dilshad Garden)",
      type: "WAREHOUSE",
      taluk: "Dilshad Garden",
      lat: 28.6756,
      lng: 77.3114,
      contact: "+91 11 2258 4110",
      timing: "08:00 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0
    },
    {
      id: "PHC-DL-01",
      state_id: "ST-DL",
      district_id: "DIST-DL-NORTH",
      name: "PUHC Alipur Primary Health Centre",
      type: "PHC",
      taluk: "Alipur / North",
      lat: 28.7981,
      lng: 77.1328,
      contact: "+91 11 2720 1880",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 92000,
      distance_from_wh_km: 26
    },
    {
      id: "PHC-DL-02",
      state_id: "ST-DL",
      district_id: "DIST-DL-NORTH",
      name: "PUHC Kanjhawala Clinic",
      type: "PHC",
      taluk: "Kanjhawala / North West",
      lat: 28.7297,
      lng: 77.0016,
      contact: "+91 11 2595 2410",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 88000,
      distance_from_wh_km: 34
    },
    {
      id: "PHC-DL-03",
      state_id: "ST-DL",
      district_id: "DIST-DL-NORTH",
      name: "PUHC Najafgarh Rural Centre",
      type: "PHC",
      taluk: "Najafgarh / South West",
      lat: 28.6092,
      lng: 76.9798,
      contact: "+91 11 2801 3211",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 110000,
      distance_from_wh_km: 38
    },
    {
      id: "PHC-DL-04",
      state_id: "ST-DL",
      district_id: "DIST-DL-NORTH",
      name: "PUHC Burari Dispensary",
      type: "PHC",
      taluk: "Burari / North",
      lat: 28.7554,
      lng: 77.1995,
      contact: "+91 11 2761 4050",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 95000,
      distance_from_wh_km: 18
    },

    // --- UTTARAKHAND (DEHRADUN & GARHWAL) ---
    {
      id: "WH-UK-01",
      state_id: "ST-UK",
      district_id: "DIST-UK-DEHRADUN",
      name: "Uttarakhand State Drug Store (Dehradun)",
      type: "WAREHOUSE",
      taluk: "Dehradun HQ",
      lat: 30.3165,
      lng: 78.0322,
      contact: "+91 135 271 2240",
      timing: "09:00 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0
    },
    {
      id: "PHC-UK-01",
      state_id: "ST-UK",
      district_id: "DIST-UK-DEHRADUN",
      name: "PHC Sahaspur",
      type: "PHC",
      taluk: "Sahaspur",
      lat: 30.3842,
      lng: 77.8081,
      contact: "+91 135 269 5110",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 34000,
      distance_from_wh_km: 26
    },
    {
      id: "PHC-UK-02",
      state_id: "ST-UK",
      district_id: "DIST-UK-DEHRADUN",
      name: "PHC Raipur",
      type: "PHC",
      taluk: "Raipur",
      lat: 30.3094,
      lng: 78.0847,
      contact: "+91 135 278 0122",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 41000,
      distance_from_wh_km: 9
    },
    {
      id: "PHC-UK-03",
      state_id: "ST-UK",
      district_id: "DIST-UK-DEHRADUN",
      name: "PHC Mussoorie Rural",
      type: "PHC",
      taluk: "Mussoorie Hills",
      lat: 30.4598,
      lng: 78.0644,
      contact: "+91 135 263 2145",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 28000,
      distance_from_wh_km: 32
    },
    {
      id: "PHC-UK-04",
      state_id: "ST-UK",
      district_id: "DIST-UK-DEHRADUN",
      name: "PHC Doiwala",
      type: "PHC",
      taluk: "Doiwala",
      lat: 30.1782,
      lng: 78.1189,
      contact: "+91 135 265 3012",
      timing: "09:00 AM - 03:00 PM",
      has_cold_chain: true,
      catchment_population: 49000,
      distance_from_wh_km: 22
    },

    // --- TAMIL NADU (KANCHIPURAM & CHENGALPATTU) ---
    {
      id: "WH-TN-01",
      state_id: "ST-TN",
      district_id: "DIST-TN-KANCHI",
      name: "TNMSC Central Drug Warehouse (Kanchipuram)",
      type: "WAREHOUSE",
      taluk: "Kanchipuram Urban",
      lat: 12.8342,
      lng: 79.7036,
      contact: "+91 44 2722 2840",
      timing: "08:00 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0
    },
    {
      id: "PHC-TN-01",
      state_id: "ST-TN",
      district_id: "DIST-TN-KANCHI",
      name: "PHC Walajabad",
      type: "PHC",
      taluk: "Walajabad",
      lat: 12.7984,
      lng: 79.8167,
      contact: "+91 44 2725 6211",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 56000,
      distance_from_wh_km: 18
    },
    {
      id: "PHC-TN-02",
      state_id: "ST-TN",
      district_id: "DIST-TN-KANCHI",
      name: "PHC Sriperumbudur",
      type: "PHC",
      taluk: "Sriperumbudur",
      lat: 12.9675,
      lng: 79.9439,
      contact: "+91 44 2716 2205",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 74000,
      distance_from_wh_km: 36
    },
    {
      id: "PHC-TN-03",
      state_id: "ST-TN",
      district_id: "DIST-TN-KANCHI",
      name: "PHC Madurantakam",
      type: "PHC",
      taluk: "Madurantakam",
      lat: 12.5086,
      lng: 79.8833,
      contact: "+91 44 2755 2410",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 62000,
      distance_from_wh_km: 45
    },
    {
      id: "PHC-TN-04",
      state_id: "ST-TN",
      district_id: "DIST-TN-KANCHI",
      name: "PHC Uthiramerur",
      type: "PHC",
      taluk: "Uthiramerur",
      lat: 12.6147,
      lng: 79.7573,
      contact: "+91 44 2727 2100",
      timing: "08:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 51000,
      distance_from_wh_km: 28
    },
  ];

  const curatedMedicines = [
    {
      id: "MED-01",
      generic_name: "Paracetamol 500mg Tablets",
      brand_name: "PCM-500 Govt Supply",
      category: "Acute & Outbreak",
      unit: "Strip of 10 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 120,
      diseases_linked: ["Dengue", "Malaria", "Viral Fever", "ARI"]
    },
    {
      id: "MED-02",
      generic_name: "Oral Rehydration Salts (ORS) IP 21.8g",
      brand_name: "ORS Sachet",
      category: "Acute & Outbreak",
      unit: "Packet",
      is_cold_chain: false,
      standard_daily_baseline: 85,
      diseases_linked: ["Acute Diarrhoeal Disease", "Cholera", "Dehydration"]
    },
    {
      id: "MED-03",
      generic_name: "Zinc Sulfate Tablets 20mg",
      brand_name: "Zinc-DT",
      category: "Pediatric & Outbreak",
      unit: "Strip of 10 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 40,
      diseases_linked: ["Acute Diarrhoeal Disease", "Malnutrition"]
    },
    {
      id: "MED-04",
      generic_name: "Ringer Lactate (RL) 500ml IV",
      brand_name: "RL Infusion IP",
      category: "Emergency & Outbreak",
      unit: "500ml Bottle",
      is_cold_chain: false,
      standard_daily_baseline: 35,
      diseases_linked: ["Dengue Shock", "Severe Dehydration", "Trauma"]
    },
    {
      id: "MED-05",
      generic_name: "Normal Saline (0.9% NaCl) 500ml IV",
      brand_name: "NS Infusion IP",
      category: "Emergency & Outbreak",
      unit: "500ml Bottle",
      is_cold_chain: false,
      standard_daily_baseline: 45,
      diseases_linked: ["Dengue", "Diarrhoea", "Emergency Resuscitation"]
    },
    {
      id: "MED-06",
      generic_name: "Amoxicillin Capsules 500mg",
      brand_name: "Mox-500",
      category: "Antibiotic",
      unit: "Strip of 10 Caps",
      is_cold_chain: false,
      standard_daily_baseline: 50,
      diseases_linked: ["ARI", "Bacterial Infections"]
    },
    {
      id: "MED-07",
      generic_name: "Azithromycin Tablets 500mg",
      brand_name: "Azi-500",
      category: "Antibiotic",
      unit: "Strip of 3 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 30,
      diseases_linked: ["Severe ARI", "Typhoid", "Pneumonia"]
    },
    {
      id: "MED-08",
      generic_name: "Metformin Hydrochloride 500mg",
      brand_name: "Glyci-500",
      category: "Chronic NCD",
      unit: "Strip of 10 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 65,
      diseases_linked: ["Type-2 Diabetes"]
    },
    {
      id: "MED-09",
      generic_name: "Amlodipine Tablets 5mg",
      brand_name: "Amlo-5",
      category: "Chronic NCD",
      unit: "Strip of 10 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 55,
      diseases_linked: ["Hypertension"]
    },
    {
      id: "MED-10",
      generic_name: "Telmisartan Tablets 40mg",
      brand_name: "Telmi-40",
      category: "Chronic NCD",
      unit: "Strip of 10 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 45,
      diseases_linked: ["Hypertension", "Cardiovascular"]
    },
    {
      id: "MED-11",
      generic_name: "Iron and Folic Acid (IFA) Tablets",
      brand_name: "IFA Red Tablets",
      category: "Maternal & Child",
      unit: "Bottle of 100 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 25,
      diseases_linked: ["Maternal Anemia", "Adolescent Health"]
    },
    {
      id: "MED-12",
      generic_name: "Calcium 500mg + Vit D3 Tablets",
      brand_name: "Cal-D3",
      category: "Maternal & Child",
      unit: "Strip of 15 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 35,
      diseases_linked: ["Pregnancy Nutrition", "Osteoporosis"]
    },
    {
      id: "MED-13",
      generic_name: "Anti-Snake Venom (ASV) Lyophilized Vial",
      brand_name: "Polyvalent ASV",
      category: "Critical Emergency",
      unit: "10ml Vial",
      is_cold_chain: true,
      standard_daily_baseline: 3,
      diseases_linked: ["Snakebite Envenomation"]
    },
    {
      id: "MED-14",
      generic_name: "Anti-Rabies Vaccine (ARV) 0.5ml Vial",
      brand_name: "Rabivax-S",
      category: "Critical Emergency",
      unit: "0.5ml Vial",
      is_cold_chain: true,
      standard_daily_baseline: 6,
      diseases_linked: ["Animal Bite / Rabies Post-Exposure"]
    },
    {
      id: "MED-15",
      generic_name: "Human Soluble Insulin 40 IU/ml Vial",
      brand_name: "Actrapid Govt",
      category: "Critical Emergency",
      unit: "10ml Vial",
      is_cold_chain: true,
      standard_daily_baseline: 5,
      diseases_linked: ["Diabetic Ketoacidosis", "Uncontrolled Diabetes"]
    },
    {
      id: "MED-16",
      generic_name: "Cefuroxime Axetil Tablets IP 500mg",
      brand_name: "Ceftum 500 Tablets",
      category: "Antibiotic",
      unit: "Strip of 4 Tabs",
      is_cold_chain: false,
      standard_daily_baseline: 20,
      diseases_linked: ["Bacterial Infections", "Bronchitis", "Severe RTI", "Pneumonia"]
    }
  ];

  const curatedBatches = [
    // Maharashtra Batches
    { batch_no: "CFT-2024-9912", medicine_id: "MED-16", facility_id: "PHC-01", quantity: 640, mfd: "2024-05-10", expiry: "2026-11-20", days_to_expiry: 51, status: "HEALTHY", unit_cost_inr: 85 },
    { batch_no: "RL-2024-8821", medicine_id: "MED-04", facility_id: "WH-01", quantity: 1400, mfd: "2024-02-15", expiry: "2026-11-05", days_to_expiry: 40, status: "IMMINENT_EXPIRY_RISK", unit_cost_inr: 48 },
    { batch_no: "RL-2024-9102", medicine_id: "MED-04", facility_id: "PHC-01", quantity: 25, mfd: "2025-01-10", expiry: "2027-01-10", days_to_expiry: 470, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 48 },
    { batch_no: "PCM-2024-7719", medicine_id: "MED-01", facility_id: "PHC-01", quantity: 1800, mfd: "2024-11-10", expiry: "2027-11-10", days_to_expiry: 775, status: "HEALTHY", unit_cost_inr: 6 },
    { batch_no: "ORS-2024-9021", medicine_id: "MED-02", facility_id: "PHC-01", quantity: 450, mfd: "2024-06-12", expiry: "2027-06-12", days_to_expiry: 620, status: "HEALTHY", unit_cost_inr: 8 },
    { batch_no: "MET-2024-4410", medicine_id: "MED-08", facility_id: "PHC-02", quantity: 3800, mfd: "2024-03-01", expiry: "2026-11-15", days_to_expiry: 50, status: "IMMINENT_EXPIRY_RISK", unit_cost_inr: 12 },
    { batch_no: "MET-2025-1022", medicine_id: "MED-08", facility_id: "PHC-07", quantity: 180, mfd: "2025-02-01", expiry: "2027-02-01", days_to_expiry: 490, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 12 },
    { batch_no: "ASV-2024-0044", medicine_id: "MED-13", facility_id: "PHC-06", quantity: 2, mfd: "2024-09-01", expiry: "2026-10-15", days_to_expiry: 19, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 450 },

    // Rajasthan Batches (Jaipur Rural)
    { batch_no: "RJ-ORS-4011", medicine_id: "MED-02", facility_id: "WH-RJ-01", quantity: 3500, mfd: "2024-04-10", expiry: "2026-11-20", days_to_expiry: 54, status: "IMMINENT_EXPIRY_RISK", unit_cost_inr: 8 },
    { batch_no: "RJ-ORS-8802", medicine_id: "MED-02", facility_id: "PHC-RJ-01", quantity: 40, mfd: "2025-01-10", expiry: "2027-06-10", days_to_expiry: 620, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 8 },
    { batch_no: "RJ-PCM-3310", medicine_id: "MED-01", facility_id: "PHC-RJ-02", quantity: 1200, mfd: "2024-10-15", expiry: "2027-10-15", days_to_expiry: 750, status: "HEALTHY", unit_cost_inr: 6 },
    { batch_no: "RJ-MET-1102", medicine_id: "MED-08", facility_id: "PHC-RJ-03", quantity: 800, mfd: "2024-09-10", expiry: "2026-12-10", days_to_expiry: 74, status: "HEALTHY", unit_cost_inr: 12 },
    { batch_no: "RJ-ASV-0012", medicine_id: "MED-13", facility_id: "PHC-RJ-04", quantity: 1, mfd: "2024-07-01", expiry: "2026-10-25", days_to_expiry: 28, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 450 },

    // Delhi Batches
    { batch_no: "DL-AMX-9901", medicine_id: "MED-06", facility_id: "WH-DL-01", quantity: 4200, mfd: "2024-05-15", expiry: "2026-11-30", days_to_expiry: 64, status: "SURPLUS_EXPIRY_RISK", unit_cost_inr: 18 },
    { batch_no: "DL-AMX-1011", medicine_id: "MED-06", facility_id: "PHC-DL-01", quantity: 60, mfd: "2025-02-10", expiry: "2027-02-10", days_to_expiry: 500, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 18 },
    { batch_no: "DL-PCM-4402", medicine_id: "MED-01", facility_id: "PHC-DL-02", quantity: 2400, mfd: "2024-11-01", expiry: "2027-11-01", days_to_expiry: 765, status: "HEALTHY", unit_cost_inr: 6 },
    { batch_no: "DL-INS-0201", medicine_id: "MED-15", facility_id: "PHC-DL-03", quantity: 18, mfd: "2024-10-10", expiry: "2026-12-25", days_to_expiry: 89, status: "LIMITED_STOCK", unit_cost_inr: 160 },

    // Uttarakhand Batches (Hilly Route Logistics)
    { batch_no: "UK-RL-2201", medicine_id: "MED-04", facility_id: "WH-UK-01", quantity: 1800, mfd: "2024-03-20", expiry: "2026-11-10", days_to_expiry: 44, status: "IMMINENT_EXPIRY_RISK", unit_cost_inr: 48 },
    { batch_no: "UK-RL-7711", medicine_id: "MED-04", facility_id: "PHC-UK-03", quantity: 15, mfd: "2025-01-05", expiry: "2027-01-05", days_to_expiry: 465, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 48 },
    { batch_no: "UK-ASV-5510", medicine_id: "MED-13", facility_id: "WH-UK-01", quantity: 45, mfd: "2024-08-10", expiry: "2026-12-15", days_to_expiry: 79, status: "HEALTHY", unit_cost_inr: 450 },
    { batch_no: "UK-ASV-9902", medicine_id: "MED-13", facility_id: "PHC-UK-01", quantity: 2, mfd: "2024-09-12", expiry: "2026-10-30", days_to_expiry: 33, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 450 },

    // Tamil Nadu Batches (TNMSC Barcoded Warehouse Supply)
    { batch_no: "TN-MET-7701", medicine_id: "MED-08", facility_id: "WH-TN-01", quantity: 5000, mfd: "2024-04-01", expiry: "2026-11-25", days_to_expiry: 59, status: "IMMINENT_EXPIRY_RISK", unit_cost_inr: 12 },
    { batch_no: "TN-MET-3320", medicine_id: "MED-08", facility_id: "PHC-TN-01", quantity: 90, mfd: "2025-02-15", expiry: "2027-02-15", days_to_expiry: 505, status: "CRITICAL_STOCKOUT_RISK", unit_cost_inr: 12 },
    { batch_no: "TN-ORS-1190", medicine_id: "MED-02", facility_id: "PHC-TN-02", quantity: 620, mfd: "2024-11-10", expiry: "2027-11-10", days_to_expiry: 775, status: "HEALTHY", unit_cost_inr: 8 },
    { batch_no: "TN-ARV-0045", medicine_id: "MED-14", facility_id: "PHC-TN-03", quantity: 8, mfd: "2024-09-20", expiry: "2026-12-10", days_to_expiry: 74, status: "LIMITED_STOCK", unit_cost_inr: 320 },
  ];

  const curatedDiseaseSurveillanceWeekly = [
    { week: "W34", dengue_cases: 45, diarrhoea_cases: 130, ari_cases: 210, rainfall_anomaly_pct: 10 },
    { week: "W35", dengue_cases: 52, diarrhoea_cases: 145, ari_cases: 205, rainfall_anomaly_pct: 18 },
    { week: "W36", dengue_cases: 78, diarrhoea_cases: 190, ari_cases: 230, rainfall_anomaly_pct: 34 },
    { week: "W37", dengue_cases: 112, diarrhoea_cases: 260, ari_cases: 240, rainfall_anomaly_pct: 45 },
    { week: "W38 (Current)", dengue_cases: 158, diarrhoea_cases: 340, ari_cases: 265, rainfall_anomaly_pct: 52 }
  ];

// Generate full national coverage: 655 facilities & 2,200+ batches across all 131 districts
const allFacilities = getAllFacilities(curatedFacilities);
const allBatches = getAllBatches(allFacilities, curatedBatches);

export const initialDistrictData = {
  states: ALL_STATES,
  districts: ALL_DISTRICTS,
  facilities: allFacilities,
  medicines: curatedMedicines,
  batches: allBatches,
  disease_surveillance_weekly: curatedDiseaseSurveillanceWeekly
};

