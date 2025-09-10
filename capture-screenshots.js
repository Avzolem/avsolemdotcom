const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Projects to capture screenshots from
const projects = [
  {
    name: 'ezticket',
    url: 'https://ezticket.vercel.app/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'features', scroll: 500 },
      { path: '/', name: 'wallet', scroll: 1000 },
      { path: '/', name: 'footer', scroll: 'bottom' }
    ]
  },
  {
    name: 'comimake',
    url: 'https://comimake.vercel.app/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'artists', scroll: 500 },
      { path: '/', name: 'marketplace', scroll: 1000 },
      { path: '/', name: 'features', scroll: 'bottom' }
    ]
  },
  {
    name: 'rentygo',
    url: 'https://rentygo.vercel.app/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'cars', scroll: 500 },
      { path: '/', name: 'alexa', scroll: 1000 },
      { path: '/', name: 'booking', scroll: 'bottom' }
    ]
  },
  {
    name: 'coinchashop',
    url: 'https://coinchashop.vercel.app/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'airdrop', scroll: 500 },
      { path: '/', name: 'features', scroll: 1000 },
      { path: '/', name: 'web3', scroll: 'bottom' }
    ]
  },
  {
    name: 'aucoin',
    url: 'https://aucoin.vercel.app/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'certificates', scroll: 500 },
      { path: '/', name: 'blockchain', scroll: 1000 },
      { path: '/', name: 'features', scroll: 'bottom' }
    ]
  },
  {
    name: 'menonitapp',
    url: 'https://menonitapp.com/',
    pages: [
      { path: '/', name: 'homepage' },
      { path: '/', name: 'hero', selector: 'main' },
      { path: '/', name: 'marketplace', scroll: 500 },
      { path: '/', name: 'products', scroll: 1000 },
      { path: '/', name: 'community', scroll: 'bottom' }
    ]
  }
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const project of projects) {
    console.log(`📸 Capturing screenshots for ${project.name}...`);
    
    const outputDir = path.join(__dirname, 'public', 'images', 'projects', project.name);
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const page = await browser.newPage();
    
    // Set viewport to desktop size
    await page.setViewport({ width: 1920, height: 1080 });
    
    try {
      // Navigate to the main URL
      await page.goto(project.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for animations to complete
      await page.waitForTimeout(2000);

      // Capture screenshots for each defined view
      for (let i = 0; i < project.pages.length; i++) {
        const pageConfig = project.pages[i];
        
        // Navigate if needed
        if (pageConfig.path !== '/') {
          await page.goto(project.url + pageConfig.path.slice(1), {
            waitUntil: 'networkidle2',
            timeout: 30000
          });
          await page.waitForTimeout(2000);
        }
        
        // Scroll if specified
        if (pageConfig.scroll) {
          if (pageConfig.scroll === 'bottom') {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          } else {
            await page.evaluate((scrollY) => window.scrollTo(0, scrollY), pageConfig.scroll);
          }
          await page.waitForTimeout(1000);
        }
        
        // Capture screenshot
        const screenshotPath = path.join(outputDir, `${project.name}-screenshot-${i + 1}.png`);
        
        if (pageConfig.selector) {
          // Capture specific element
          try {
            const element = await page.$(pageConfig.selector);
            if (element) {
              await element.screenshot({ path: screenshotPath });
            } else {
              await page.screenshot({ path: screenshotPath, fullPage: false });
            }
          } catch (e) {
            await page.screenshot({ path: screenshotPath, fullPage: false });
          }
        } else {
          // Capture viewport
          await page.screenshot({ path: screenshotPath, fullPage: false });
        }
        
        console.log(`  ✅ Saved: ${project.name}-screenshot-${i + 1}.png`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error capturing ${project.name}:`, error.message);
    }
    
    await page.close();
  }

  await browser.close();
  console.log('\n✨ Screenshot capture complete!');
}

// Run the script
captureScreenshots().catch(console.error);