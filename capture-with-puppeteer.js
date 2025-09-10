const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Projects to capture
const projects = [
  { name: 'ezticket', url: 'https://ezticket.vercel.app/' },
  { name: 'comimake', url: 'https://comimake.vercel.app/' },
  { name: 'rentygo', url: 'https://rentygo.vercel.app/' },
  { name: 'coinchashop', url: 'https://coinchashop.vercel.app/' },
  { name: 'aucoin', url: 'https://aucoin.vercel.app/' },
  { name: 'menonitapp', url: 'https://menonitapp.com/' }
];

async function captureProject(browser, project) {
  console.log(`📸 Capturing ${project.name}...`);
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to URL with extended timeout
    console.log(`  → Navigating to ${project.url}`);
    await page.goto(project.url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const outputDir = path.join(__dirname, 'public', 'images', 'projects', project.name);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Screenshot 1: Homepage
    const screenshot1 = path.join(outputDir, `${project.name}-screenshot-1.png`);
    await page.screenshot({ path: screenshot1, fullPage: false });
    console.log(`  ✓ Screenshot 1: Homepage`);
    
    // Screenshot 2: Scroll down a bit
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshot2 = path.join(outputDir, `${project.name}-screenshot-2.png`);
    await page.screenshot({ path: screenshot2, fullPage: false });
    console.log(`  ✓ Screenshot 2: Mid section`);
    
    // Screenshot 3: Scroll more
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshot3 = path.join(outputDir, `${project.name}-screenshot-3.png`);
    await page.screenshot({ path: screenshot3, fullPage: false });
    console.log(`  ✓ Screenshot 3: Features section`);
    
    // Screenshot 4: Mobile view
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const screenshot4 = path.join(outputDir, `${project.name}-screenshot-4.png`);
    await page.screenshot({ path: screenshot4, fullPage: false });
    console.log(`  ✓ Screenshot 4: Mobile view`);
    
    // Screenshot 5: Tablet view
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const screenshot5 = path.join(outputDir, `${project.name}-screenshot-5.png`);
    await page.screenshot({ path: screenshot5, fullPage: false });
    console.log(`  ✓ Screenshot 5: Tablet view`);
    
    console.log(`  ✅ Completed ${project.name}\n`);
    
  } catch (error) {
    console.error(`  ❌ Error with ${project.name}: ${error.message}\n`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture with Puppeteer...\n');
  
  let browser;
  try {
    // Launch browser with specific args for WSL
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    // Capture each project
    for (const project of projects) {
      await captureProject(browser, project);
    }
    
    console.log('✨ All screenshots captured successfully!');
    
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
main().catch(console.error);