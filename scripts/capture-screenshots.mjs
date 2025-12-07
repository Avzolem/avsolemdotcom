import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    colorScheme: 'dark'
  });
  const page = await context.newPage();

  console.log('Capturing Yu-Gi-Oh Manager screenshots...');

  // Yu-Gi-Oh - Main search page
  await page.goto('http://localhost:3000/yugioh', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/yugioh-manager/01-search.png'),
    fullPage: false
  });
  console.log('  - Search page captured');

  // Yu-Gi-Oh - Search for a card
  await page.fill('input[type="text"]', 'Dark Magician');
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/yugioh-manager/02-results.png'),
    fullPage: false
  });
  console.log('  - Search results captured');

  // Yu-Gi-Oh - Collection page
  await page.goto('http://localhost:3000/yugioh/coleccion', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/yugioh-manager/03-collection.png'),
    fullPage: false
  });
  console.log('  - Collection page captured');

  // Yu-Gi-Oh - Catalog page
  await page.goto('http://localhost:3000/yugioh/catalogo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/yugioh-manager/04-catalog.png'),
    fullPage: false
  });
  console.log('  - Catalog page captured');

  console.log('\nCapturing ROMS Index screenshots...');

  // ROMS - Main page
  await page.goto('http://localhost:3000/roms', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/roms-index/01-main.png'),
    fullPage: false
  });
  console.log('  - Main page captured');

  // ROMS - Scroll to PlayStation section
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/roms-index/02-playstation.png'),
    fullPage: false
  });
  console.log('  - PlayStation section captured');

  // ROMS - Scroll to more consoles
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(projectRoot, 'public/images/projects/roms-index/03-more-consoles.png'),
    fullPage: false
  });
  console.log('  - More consoles captured');

  await browser.close();
  console.log('\nAll screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
