import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const screens = [
    {
      name: 'dho_dashboard.png',
      url: 'http://localhost:5173/?tab=dho&role=dho',
      waitSelector: 'main'
    },
    {
      name: 'pharmacist_portal.png',
      url: 'http://localhost:5173/?tab=pharmacist&role=pharmacist',
      waitSelector: 'main'
    },
    {
      name: 'simulation_lab.png',
      url: 'http://localhost:5173/?tab=simulation&role=dho',
      waitSelector: 'main'
    },
    {
      name: 'landing_hero.png',
      url: 'http://localhost:5173/?tab=landing',
      waitSelector: 'body'
    }
  ];

  for (const s of screens) {
    console.log(`Navigating to ${s.url}...`);
    await page.goto(s.url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000)); // wait for animations and leaflet tiles
    const outPath = path.join('/Users/prakshal13/Desktop/app_screenshots', s.name);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
