import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('file:///tmp/deck_previews/AusdhadSetu.pptx.qlpreview/Preview.html', { waitUntil: 'load' });
  
  const slides = await page.$$('.slide');
  console.log('Slides count on page:', slides.length);
  
  for (let i = 0; i < slides.length; i++) {
    const slideNum = i + 1;
    await slides[i].screenshot({ path: `/tmp/deck_slide_${slideNum}.png` });
    console.log(`Captured Slide ${slideNum}`);
  }
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
