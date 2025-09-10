const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Projects with specific pages to capture
const projects = [
  { 
    name: 'ezticket',
    baseUrl: 'https://ezticket.vercel.app',
    pages: [
      { path: '/', desc: 'Homepage with Web3 features' },
      { path: '/', scroll: 800, desc: 'NFT ticket showcase' },
      { path: '/', action: 'click-wallet', desc: 'Wallet connection' },
      { path: '/', scroll: 1500, desc: 'How it works section' },
      { path: '/', mobile: true, desc: 'Mobile responsive view' }
    ]
  },
  { 
    name: 'comimake',
    baseUrl: 'https://comimake.vercel.app',
    pages: [
      { path: '/', desc: 'Marketplace homepage' },
      { path: '/', scroll: 600, desc: 'Artist portfolios' },
      { path: '/', scroll: 1200, desc: 'Featured works' },
      { path: '/', action: 'hover-cards', desc: 'Interactive elements' },
      { path: '/', mobile: true, desc: 'Mobile marketplace' }
    ]
  },
  { 
    name: 'rentygo',
    baseUrl: 'https://rentygo.vercel.app',
    pages: [
      { path: '/', desc: 'Car rental homepage' },
      { path: '/', scroll: 500, desc: 'Alexa integration showcase' },
      { path: '/', scroll: 1000, desc: 'Fleet showcase' },
      { path: '/', action: 'click-car', desc: 'Car selection interface' },
      { path: '/', mobile: true, desc: 'Mobile booking' }
    ]
  },
  { 
    name: 'coinchashop',
    baseUrl: 'https://coinchashop.vercel.app',
    pages: [
      { path: '/', desc: 'Airdrop platform' },
      { path: '/', scroll: 600, desc: 'Token distribution' },
      { path: '/', scroll: 1200, desc: 'Web3 features' },
      { path: '/', action: 'hover-features', desc: 'Interactive features' },
      { path: '/', mobile: true, desc: 'Mobile airdrop interface' }
    ]
  },
  { 
    name: 'aucoin',
    baseUrl: 'https://aucoin.vercel.app',
    pages: [
      { path: '/', desc: 'Auction homepage' },
      { path: '/', scroll: 500, desc: 'Collectible coins showcase' },
      { path: '/', scroll: 1000, desc: 'Blockchain certificates' },
      { path: '/', scroll: 1500, desc: 'Authentication process' },
      { path: '/', mobile: true, desc: 'Mobile auction view' }
    ]
  },
  { 
    name: 'menonitapp',
    baseUrl: 'https://menonitapp.com',
    pages: [
      { path: '/', desc: 'Local marketplace' },
      { path: '/', scroll: 600, desc: 'Product categories' },
      { path: '/', scroll: 1200, desc: 'Local businesses' },
      { path: '/', scroll: 2000, desc: 'Community features' },
      { path: '/', mobile: true, desc: 'Mobile shopping' }
    ]
  }
];

async function captureProjectScreenshots(browser, project) {
  console.log(`📸 Capturing ${project.name}:`);
  
  const outputDir = path.join('public', 'images', 'projects', project.name);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (let i = 0; i < project.pages.length; i++) {
    const pageConfig = project.pages[i];
    const page = await browser.newPage();
    
    try {
      // Set viewport (mobile or desktop)
      if (pageConfig.mobile) {
        await page.setViewport({ width: 390, height: 844 });
      } else {
        await page.setViewport({ width: 1920, height: 1080 });
      }
      
      // Navigate to the page
      const url = project.baseUrl + pageConfig.path;
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      // Wait for initial load
      await new Promise(r => setTimeout(r, 3000));
      
      // Perform scroll if specified
      if (pageConfig.scroll) {
        await page.evaluate((scrollY) => {
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
        }, pageConfig.scroll);
        await new Promise(r => setTimeout(r, 2000));
      }
      
      // Perform action if specified
      if (pageConfig.action) {
        try {
          switch(pageConfig.action) {
            case 'click-wallet':
              // Try to click wallet/connect button
              await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const walletBtn = buttons.find(btn => 
                  btn.textContent.toLowerCase().includes('connect') ||
                  btn.textContent.toLowerCase().includes('wallet')
                );
                if (walletBtn) walletBtn.click();
              });
              break;
            
            case 'hover-cards':
              // Hover over cards/portfolios
              await page.evaluate(() => {
                const cards = document.querySelectorAll('[class*="card"], [class*="portfolio"], article');
                if (cards.length > 0) {
                  const event = new MouseEvent('mouseover', { bubbles: true });
                  cards[0].dispatchEvent(event);
                }
              });
              break;
            
            case 'click-car':
              // Try to click on a car card
              await page.evaluate(() => {
                const cars = document.querySelectorAll('[class*="car"], [class*="vehicle"], [class*="rental"]');
                if (cars.length > 0) cars[0].click();
              });
              break;
            
            case 'hover-features':
              // Hover over feature cards
              await page.evaluate(() => {
                const features = document.querySelectorAll('[class*="feature"], [class*="benefit"]');
                if (features.length > 0) {
                  const event = new MouseEvent('mouseover', { bubbles: true });
                  features[0].dispatchEvent(event);
                }
              });
              break;
          }
          await new Promise(r => setTimeout(r, 1500));
        } catch (e) {
          // Action failed, continue anyway
        }
      }
      
      // Take screenshot
      const screenshotPath = path.join(outputDir, `${project.name}-screenshot-${i + 1}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false
      });
      
      console.log(`  ✓ ${i + 1}. ${pageConfig.desc}`);
      
    } catch (error) {
      console.error(`  ❌ Error on screenshot ${i + 1}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
  
  console.log();
}

async function main() {
  console.log('🚀 Starting detailed screenshot capture...\n');
  console.log('📝 This will capture various pages and interactions\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  
  try {
    for (const project of projects) {
      await captureProjectScreenshots(browser, project);
    }
    
    console.log('✨ All detailed screenshots captured successfully!');
    
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);