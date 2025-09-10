const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'ezticket', url: 'https://ezticket.vercel.app/' },
  { name: 'comimake', url: 'https://comimake.vercel.app/' },
  { name: 'rentygo', url: 'https://rentygo.vercel.app/' },
  { name: 'coinchashop', url: 'https://coinchashop.vercel.app/' },
  { name: 'aucoin', url: 'https://aucoin.vercel.app/' },
  { name: 'menonitapp', url: 'https://menonitapp.com/' }
];

async function captureProject(browser, project) {
  const page = await browser.newPage();
  
  try {
    const outputDir = path.join('public', 'images', 'projects', project.name);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`📸 ${project.name}:`);
    
    // Screenshot 1: Desktop view
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, `${project.name}-screenshot-1.png`) });
    console.log(`  ✓ Desktop view`);
    
    // Screenshot 2: Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, `${project.name}-screenshot-2.png`) });
    console.log(`  ✓ Content section`);
    
    // Screenshot 3: More scroll
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, `${project.name}-screenshot-3.png`) });
    console.log(`  ✓ Features section`);
    
    // Screenshot 4: Mobile view
    await page.setViewport({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, `${project.name}-screenshot-4.png`) });
    console.log(`  ✓ Mobile view`);
    
    // Screenshot 5: Tablet view
    await page.setViewport({ width: 768, height: 1024 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, `${project.name}-screenshot-5.png`) });
    console.log(`  ✓ Tablet view`);
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture for all projects...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  try {
    for (const project of projects) {
      await captureProject(browser, project);
      console.log();
    }
  } finally {
    await browser.close();
  }
  
  console.log('✨ All screenshots captured successfully!');
}

main().catch(console.error);