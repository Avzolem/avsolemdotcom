const fs = require('fs');
const path = require('path');
const https = require('https');

// Projects to capture
const projects = [
  { name: 'ezticket', url: 'https://ezticket.vercel.app/' },
  { name: 'comimake', url: 'https://comimake.vercel.app/' },
  { name: 'rentygo', url: 'https://rentygo.vercel.app/' },
  { name: 'coinchashop', url: 'https://coinchashop.vercel.app/' },
  { name: 'aucoin', url: 'https://aucoin.vercel.app/' },
  { name: 'menonitapp', url: 'https://menonitapp.com/' }
];

// Different viewport sizes for different screenshots
const viewports = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 1440, height: 900, name: 'laptop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 390, height: 844, name: 'mobile' },
  { width: 1920, height: 1080, name: 'fullpage', fullPage: true }
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function captureWithScreenshotAPI(project) {
  console.log(`📸 Capturing ${project.name}...`);
  
  const outputDir = path.join(__dirname, 'public', 'images', 'projects', project.name);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Use screenshot.rocks free API (no key required)
  for (let i = 0; i < 5; i++) {
    const viewport = viewports[i];
    const screenshotUrl = `https://screenshot.rocks/api/screenshot?url=${encodeURIComponent(project.url)}&width=${viewport.width}&height=${viewport.height}${viewport.fullPage ? '&fullPage=true' : ''}`;
    const outputPath = path.join(outputDir, `${project.name}-screenshot-${i + 1}.png`);
    
    try {
      console.log(`  → Capturing ${viewport.name} view...`);
      await downloadImage(screenshotUrl, outputPath);
      console.log(`  ✓ Screenshot ${i + 1}: ${viewport.name}`);
    } catch (error) {
      console.log(`  ⚠ Could not capture ${viewport.name}: ${error.message}`);
      // Create a placeholder file
      fs.writeFileSync(outputPath, '');
    }
  }
  
  console.log(`  ✅ Completed ${project.name}\n`);
}

// Alternative: Create placeholder images with project info
function createPlaceholder(project) {
  console.log(`🎨 Creating placeholders for ${project.name}...`);
  
  const outputDir = path.join(__dirname, 'public', 'images', 'projects', project.name);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // For now, copy the existing SVG files as placeholders
  const svgFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.svg'));
  
  if (svgFiles.length > 0) {
    // If SVG files exist, we'll keep them for now
    console.log(`  ℹ Using existing SVG placeholders for ${project.name}`);
  } else {
    // Create empty placeholder files
    for (let i = 1; i <= 5; i++) {
      const outputPath = path.join(outputDir, `${project.name}-screenshot-${i}.png`);
      if (!fs.existsSync(outputPath)) {
        // Create an empty file as placeholder
        fs.writeFileSync(outputPath, '');
        console.log(`  ✓ Created placeholder ${i}`);
      }
    }
  }
  
  console.log(`  ✅ Placeholders ready for ${project.name}\n`);
}

async function main() {
  console.log('🚀 Starting screenshot capture...\n');
  console.log('ℹ️  Note: Due to environment limitations, creating placeholder structure.\n');
  console.log('    Please use the Windows script to capture actual screenshots.\n');
  
  // For each project, create the folder structure and placeholder files
  for (const project of projects) {
    createPlaceholder(project);
  }
  
  console.log('✨ Folder structure prepared!');
  console.log('\n📋 Next steps:');
  console.log('1. Run capture_screenshots_windows.py from Windows');
  console.log('2. Or use capture_screenshots.bat');
  console.log('3. Screenshots will be saved in the prepared folders');
}

// Run the script
main().catch(console.error);