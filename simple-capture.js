const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait 2 seconds for page to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: outputPath });
    console.log(`✅ Saved: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Test with one project first
async function main() {
  console.log('🚀 Testing screenshot capture...\n');
  
  // Create directory
  const dir = 'public/images/projects/ezticket';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Capture EzTicket
  await captureScreenshot(
    'https://ezticket.vercel.app/',
    'public/images/projects/ezticket/ezticket-screenshot-1.png'
  );
  
  console.log('\n✨ Test complete!');
}

main().catch(console.error);