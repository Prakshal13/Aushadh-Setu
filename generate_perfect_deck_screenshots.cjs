const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/prakshal13/Desktop/app_screenshots';

(async () => {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  console.log('--- Step 1: DHO Dashboard & Redistribution Queue ---');
  await page.goto('http://localhost:5173/?role=dho&tab=dho', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Redistribution Queue
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const target = headings.find(h => h.textContent.includes('Peer-to-Peer Stock Redistribution Queue'));
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '1_redistribution_transfer_queue.png') });
  console.log('Saved 1_redistribution_transfer_queue.png');

  // 2. Authorize Transfer on TR-01
  console.log('--- Step 2: Approving Transfer TR-01 ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const authBtn = buttons.find(b => b.textContent.includes('Authorize Dispatch') || b.textContent.includes('Authorize Transfer'));
    if (authBtn) authBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '2_dho_approved_transfer_state.png') });
  console.log('Saved 2_dho_approved_transfer_state.png');

  // 2b. Open and Capture Digital Gate Pass (Form 18-B) Modal
  console.log('--- Step 2b: Capturing Digital Gate Pass (Form 18-B) Modal ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const passBtn = buttons.find(b => b.textContent.includes('View Digital Gate Pass'));
    if (passBtn) passBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '2b_digital_gate_pass_modal.png') });
  console.log('Saved 2b_digital_gate_pass_modal.png');

  // Close modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const doneBtn = buttons.find(b => b.textContent.includes('Done') || b.textContent.includes('✕'));
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Capture GIS Map with Telemetry HUD
  console.log('--- Step 3: Redistribution GIS Map & Van Telemetry ---');
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const mapHeading = headings.find(h => h.textContent.includes('District GIS Facility Health'));
    if (mapHeading) {
      const y = mapHeading.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '3_redistribution_gis_map.png') });
  console.log('Saved 3_redistribution_gis_map.png');

  // 4. Capture IDSP Disease Surveillance vs Clinic Stock Burn Chart
  console.log('--- Step 4: IDSP Surveillance vs Stock Burn Chart ---');
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const chartHeading = headings.find(h => h.textContent.includes('IDSP Disease Surveillance'));
    if (chartHeading) {
      const y = chartHeading.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '4_surveillance_burn_chart.png') });
  console.log('Saved 4_surveillance_burn_chart.png');

  // 5. Navigate to Pharmacist Portal via in-memory tab switch to preserve transfers state
  console.log('--- Step 5: In-memory Navigation to Pharmacist Portal ---');
  await page.evaluate(() => {
    // Open dropdown
    const serviceBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Services'));
    if (serviceBtn) serviceBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    const pharmLink = document.querySelector('a[href="#pharmacist"]');
    if (pharmLink) pharmLink.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 6a. Capture Pharmacist Inbound Delivery Pending Intake
  console.log('--- Step 6a: Pharmacist Inbound Delivery Pending ---');
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const inboundHeading = headings.find(h => h.textContent.includes('Incoming Emergency Stock Redirection'));
    if (inboundHeading) {
      const y = inboundHeading.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '6a_inbound_transfer_pending.png') });
  console.log('Saved 6a_inbound_transfer_pending.png');

  // 6b. Click Verify Physical Delivery & Restock Shelf
  console.log('--- Step 6b: Verifying Delivery & Restocking ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const restockBtn = buttons.find(b => b.textContent.includes('Verify Physical Delivery'));
    if (restockBtn) restockBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '6b_received_and_verified_state.png') });
  console.log('Saved 6b_received_and_verified_state.png');

  // 7. Test Gemini Vision Scanner with photo & OCR metadata
  console.log('--- Step 7: Gemini Vision Carton Scanner Result ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sampleBtn = buttons.find(b => b.textContent.includes('Paracetamol') || b.textContent.includes('Sample'));
    if (sampleBtn) sampleBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const scanHeading = headings.find(h => h.textContent.includes('Gemini Vision Carton Scanner'));
    if (scanHeading) {
      const y = scanHeading.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '5_scanner_after_gemini_result.png') });
  console.log('Saved 5_scanner_after_gemini_result.png');

  // 8. Navigate to Predictive AI Studio & capture SEIR Curve
  console.log('--- Step 8: Predictive AI Studio & SEIR Epidemic Curve ---');
  await page.evaluate(() => {
    const serviceBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Services'));
    if (serviceBtn) serviceBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    const forecastLink = document.querySelector('a[href="#forecast"]');
    if (forecastLink) forecastLink.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to 14-Day SEIR Trajectory Chart
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3'));
    const seirHeading = headings.find(h => h.textContent.includes('14-Day Trajectory') || h.textContent.includes('Symbolic SEIR Core'));
    if (seirHeading) {
      const y = seirHeading.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '7_predictive_ai_studio_seir_curve.png') });
  console.log('Saved 7_predictive_ai_studio_seir_curve.png');

  await browser.close();
  console.log('All deck screenshots generated successfully!');
})();
