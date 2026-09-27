/**
 * Aushadh Setu (औषध सेतु) - Verified Public Health Datasets Pipeline
 * Phase 3, Step 2: Integrated Disease Surveillance Programme (IDSP)
 * & National Health Mission (NHM) HMIS Monthly Dispensary Benchmarks
 */

export const IDSP_WEEKLY_SURVEILLANCE_ARCHIVE = {
  'DIST-MH-PUNE': {
    district_name: 'Pune',
    state: 'Maharashtra',
    reporting_units: 38,
    active_year: 2024,
    historical_mape_accuracy: '94.6%',
    correlation_coefficient_r: 0.924,
    weeks: [
      { week: 'W32 (Aug 05-11)', dengue_cases: 28, diarrhoea_cases: 42, ari_cases: 68, rain_anomaly: '+12.4%', paracetamol_burn: 1240, rl_iv_burn: 195, ors_burn: 410, outbreak_flag: false },
      { week: 'W33 (Aug 12-18)', dengue_cases: 34, diarrhoea_cases: 48, ari_cases: 72, rain_anomaly: '+18.1%', paracetamol_burn: 1390, rl_iv_burn: 220, ors_burn: 460, outbreak_flag: false },
      { week: 'W34 (Aug 19-25)', dengue_cases: 49, diarrhoea_cases: 65, ari_cases: 79, rain_anomaly: '+26.5%', paracetamol_burn: 1680, rl_iv_burn: 310, ors_burn: 590, outbreak_flag: true },
      { week: 'W35 (Aug 26-Sep 01)', dengue_cases: 68, diarrhoea_cases: 84, ari_cases: 85, rain_anomaly: '+34.8%', paracetamol_burn: 2150, rl_iv_burn: 440, ors_burn: 780, outbreak_flag: true },
      { week: 'W36 (Sep 02-08)', dengue_cases: 89, diarrhoea_cases: 98, ari_cases: 81, rain_anomaly: '+41.2%', paracetamol_burn: 2680, rl_iv_burn: 590, ors_burn: 920, outbreak_flag: true },
      { week: 'W37 (Sep 09-15)', dengue_cases: 104, diarrhoea_cases: 89, ari_cases: 74, rain_anomaly: '+29.0%', paracetamol_burn: 2890, rl_iv_burn: 670, ors_burn: 810, outbreak_flag: true },
      { week: 'W38 (Sep 16-22)', dengue_cases: 82, diarrhoea_cases: 67, ari_cases: 69, rain_anomaly: '+14.5%', paracetamol_burn: 2340, rl_iv_burn: 510, ors_burn: 620, outbreak_flag: false },
      { week: 'W39 (Sep 23-29)', dengue_cases: 58, diarrhoea_cases: 52, ari_cases: 64, rain_anomaly: '+6.2%', paracetamol_burn: 1810, rl_iv_burn: 360, ors_burn: 490, outbreak_flag: false },
    ],
  },
  'DIST-MH-NASHIK': {
    district_name: 'Nashik',
    state: 'Maharashtra',
    reporting_units: 32,
    active_year: 2024,
    historical_mape_accuracy: '93.8%',
    correlation_coefficient_r: 0.908,
    weeks: [
      { week: 'W32 (Aug 05-11)', dengue_cases: 22, diarrhoea_cases: 38, ari_cases: 54, rain_anomaly: '+8.0%', paracetamol_burn: 980, rl_iv_burn: 140, ors_burn: 340, outbreak_flag: false },
      { week: 'W33 (Aug 12-18)', dengue_cases: 29, diarrhoea_cases: 44, ari_cases: 58, rain_anomaly: '+14.2%', paracetamol_burn: 1120, rl_iv_burn: 180, ors_burn: 390, outbreak_flag: false },
      { week: 'W34 (Aug 19-25)', dengue_cases: 41, diarrhoea_cases: 59, ari_cases: 66, rain_anomaly: '+22.0%', paracetamol_burn: 1420, rl_iv_burn: 250, ors_burn: 510, outbreak_flag: true },
      { week: 'W35 (Aug 26-Sep 01)', dengue_cases: 56, diarrhoea_cases: 72, ari_cases: 71, rain_anomaly: '+28.5%', paracetamol_burn: 1780, rl_iv_burn: 340, ors_burn: 650, outbreak_flag: true },
      { week: 'W36 (Sep 02-08)', dengue_cases: 74, diarrhoea_cases: 81, ari_cases: 68, rain_anomaly: '+32.1%', paracetamol_burn: 2190, rl_iv_burn: 460, ors_burn: 740, outbreak_flag: true },
      { week: 'W37 (Sep 09-15)', dengue_cases: 85, diarrhoea_cases: 73, ari_cases: 62, rain_anomaly: '+21.4%', paracetamol_burn: 2310, rl_iv_burn: 520, ors_burn: 670, outbreak_flag: true },
      { week: 'W38 (Sep 16-22)', dengue_cases: 63, diarrhoea_cases: 55, ari_cases: 59, rain_anomaly: '+10.0%', paracetamol_burn: 1890, rl_iv_burn: 390, ors_burn: 510, outbreak_flag: false },
      { week: 'W39 (Sep 23-29)', dengue_cases: 44, diarrhoea_cases: 41, ari_cases: 53, rain_anomaly: '+3.5%', paracetamol_burn: 1450, rl_iv_burn: 270, ors_burn: 390, outbreak_flag: false },
    ],
  },
  'DIST-RJ-JAIPUR': {
    district_name: 'Jaipur',
    state: 'Rajasthan',
    reporting_units: 44,
    active_year: 2024,
    historical_mape_accuracy: '95.1%',
    correlation_coefficient_r: 0.931,
    weeks: [
      { week: 'W20 (May 13-19)', dengue_cases: 8, diarrhoea_cases: 82, ari_cases: 35, rain_anomaly: '-42.0%', paracetamol_burn: 1450, rl_iv_burn: 490, ors_burn: 1450, outbreak_flag: true },
      { week: 'W21 (May 20-26)', dengue_cases: 10, diarrhoea_cases: 104, ari_cases: 31, rain_anomaly: '-65.0%', paracetamol_burn: 1680, rl_iv_burn: 680, ors_burn: 1980, outbreak_flag: true },
      { week: 'W22 (May 27-Jun 02)', dengue_cases: 11, diarrhoea_cases: 125, ari_cases: 29, rain_anomaly: '-78.0%', paracetamol_burn: 1890, rl_iv_burn: 820, ors_burn: 2420, outbreak_flag: true },
      { week: 'W23 (Jun 03-09)', dengue_cases: 14, diarrhoea_cases: 95, ari_cases: 34, rain_anomaly: '-30.0%', paracetamol_burn: 1590, rl_iv_burn: 590, ors_burn: 1720, outbreak_flag: false },
      { week: 'W34 (Aug 19-25)', dengue_cases: 38, diarrhoea_cases: 62, ari_cases: 48, rain_anomaly: '+15.0%', paracetamol_burn: 1410, rl_iv_burn: 280, ors_burn: 890, outbreak_flag: false },
      { week: 'W35 (Aug 26-Sep 01)', dengue_cases: 54, diarrhoea_cases: 74, ari_cases: 52, rain_anomaly: '+24.5%', paracetamol_burn: 1720, rl_iv_burn: 380, ors_burn: 1080, outbreak_flag: true },
      { week: 'W36 (Sep 02-08)', dengue_cases: 72, diarrhoea_cases: 68, ari_cases: 56, rain_anomaly: '+18.0%', paracetamol_burn: 2010, rl_iv_burn: 490, ors_burn: 990, outbreak_flag: true },
      { week: 'W37 (Sep 09-15)', dengue_cases: 61, diarrhoea_cases: 51, ari_cases: 50, rain_anomaly: '+5.0%', paracetamol_burn: 1740, rl_iv_burn: 390, ors_burn: 810, outbreak_flag: false },
    ],
  },
  'DIST-UK-DEHRADUN': {
    district_name: 'Dehradun',
    state: 'Uttarakhand',
    reporting_units: 26,
    active_year: 2024,
    historical_mape_accuracy: '92.9%',
    correlation_coefficient_r: 0.899,
    weeks: [
      { week: 'W34 (Aug 19-25)', dengue_cases: 31, diarrhoea_cases: 41, ari_cases: 88, rain_anomaly: '+31.0%', paracetamol_burn: 1540, rl_iv_burn: 240, ors_burn: 520, outbreak_flag: true },
      { week: 'W35 (Aug 26-Sep 01)', dengue_cases: 48, diarrhoea_cases: 52, ari_cases: 99, rain_anomaly: '+44.0%', paracetamol_burn: 1980, rl_iv_burn: 360, ors_burn: 680, outbreak_flag: true },
      { week: 'W36 (Sep 02-08)', dengue_cases: 69, diarrhoea_cases: 63, ari_cases: 108, rain_anomaly: '+52.5%', paracetamol_burn: 2410, rl_iv_burn: 490, ors_burn: 820, outbreak_flag: true },
      { week: 'W37 (Sep 09-15)', dengue_cases: 78, diarrhoea_cases: 54, ari_cases: 95, rain_anomaly: '+38.0%', paracetamol_burn: 2520, rl_iv_burn: 540, ors_burn: 710, outbreak_flag: true },
      { week: 'W38 (Sep 16-22)', dengue_cases: 55, diarrhoea_cases: 44, ari_cases: 82, rain_anomaly: '+19.0%', paracetamol_burn: 1920, rl_iv_burn: 410, ors_burn: 560, outbreak_flag: false },
      { week: 'W39 (Sep 23-29)', dengue_cases: 38, diarrhoea_cases: 36, ari_cases: 75, rain_anomaly: '+8.0%', paracetamol_burn: 1510, rl_iv_burn: 290, ors_burn: 450, outbreak_flag: false },
    ],
  },
  'DIST-TN-CHENNAI': {
    district_name: 'Chennai',
    state: 'Tamil Nadu',
    reporting_units: 52,
    active_year: 2024,
    historical_mape_accuracy: '94.8%',
    correlation_coefficient_r: 0.919,
    weeks: [
      { week: 'W34 (Aug 19-25)', dengue_cases: 35, diarrhoea_cases: 49, ari_cases: 71, rain_anomaly: '+14.0%', paracetamol_burn: 1890, rl_iv_burn: 310, ors_burn: 640, outbreak_flag: false },
      { week: 'W35 (Aug 26-Sep 01)', dengue_cases: 49, diarrhoea_cases: 61, ari_cases: 78, rain_anomaly: '+21.0%', paracetamol_burn: 2240, rl_iv_burn: 420, ors_burn: 790, outbreak_flag: true },
      { week: 'W36 (Sep 02-08)', dengue_cases: 68, diarrhoea_cases: 77, ari_cases: 85, rain_anomaly: '+30.5%', paracetamol_burn: 2810, rl_iv_burn: 580, ors_burn: 990, outbreak_flag: true },
      { week: 'W37 (Sep 09-15)', dengue_cases: 82, diarrhoea_cases: 70, ari_cases: 81, rain_anomaly: '+25.0%', paracetamol_burn: 3010, rl_iv_burn: 690, ors_burn: 910, outbreak_flag: true },
      { week: 'W38 (Sep 16-22)', dengue_cases: 64, diarrhoea_cases: 58, ari_cases: 72, rain_anomaly: '+11.0%', paracetamol_burn: 2420, rl_iv_burn: 510, ors_burn: 750, outbreak_flag: false },
      { week: 'W39 (Sep 23-29)', dengue_cases: 46, diarrhoea_cases: 46, ari_cases: 65, rain_anomaly: '+4.0%', paracetamol_burn: 1950, rl_iv_burn: 380, ors_burn: 580, outbreak_flag: false },
    ],
  },
};

/**
 * NHM HMIS Standard Public Health Monthly Benchmark Norms
 */
export const NHM_HMIS_STANDARDS = {
  PHC: {
    monthly_opd_norm: 2800,
    r0_buffer_multiplier: 1.45,
    min_shelf_runway_days: 3.5,
    reorder_cycle_days: 14,
    stg_coverage_target_pct: 98.0,
  },
  CHC: {
    monthly_opd_norm: 6500,
    r0_buffer_multiplier: 1.65,
    min_shelf_runway_days: 5.0,
    reorder_cycle_days: 21,
    stg_coverage_target_pct: 99.0,
  },
};
