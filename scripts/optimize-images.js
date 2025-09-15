const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const QUALITY = {
  high: 85,
  medium: 75,
  low: 65
};

const MAX_WIDTH = {
  desktop: 1920,
  tablet: 1024,
  mobile: 640
};

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    quality = QUALITY.medium,
    maxWidth = MAX_WIDTH.desktop,
    format = 'webp'
  } = options;

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Only resize if image is larger than maxWidth
    if (metadata.width > maxWidth) {
      image.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convert to specified format with quality
    if (format === 'webp') {
      await image
        .webp({ quality })
        .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    } else if (format === 'jpg' || format === 'jpeg') {
      await image
        .jpeg({ quality, progressive: true })
        .toFile(outputPath);
    } else {
      await image
        .png({ compressionLevel: 9, progressive: true })
        .toFile(outputPath);
    }

    const originalSize = (await fs.stat(inputPath)).size;
    const optimizedSize = (await fs.stat(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'))).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

    console.log(`✓ ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB (-${reduction}%)`);

    return { originalSize, optimizedSize, reduction };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeDirectory(dirPath, options = {}) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        const subResults = await optimizeDirectory(fullPath, options);
        totalOriginal += subResults.totalOriginal;
        totalOptimized += subResults.totalOptimized;
      } else if (/\.(jpg|jpeg|png)$/i.test(file.name) && !file.name.includes('.webp')) {
        const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        // Skip if WebP version already exists
        try {
          await fs.access(outputPath);
          console.log(`⊘ ${file.name}: WebP version already exists`);
          continue;
        } catch {}

        const result = await optimizeImage(fullPath, outputPath, options);
        if (result) {
          totalOriginal += result.originalSize;
          totalOptimized += result.optimizedSize;
        }
      }
    }

    return { totalOriginal, totalOptimized };
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
    return { totalOriginal: 0, totalOptimized: 0 };
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const projectsDir = path.join(__dirname, '..', 'public', 'images', 'projects');
  const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

  // Optimize project images
  console.log('📁 Optimizing project images...');
  const projectResults = await optimizeDirectory(projectsDir, {
    quality: QUALITY.medium,
    maxWidth: MAX_WIDTH.desktop,
    format: 'webp'
  });

  // Optimize gallery images
  console.log('\n📁 Optimizing gallery images...');
  const galleryResults = await optimizeDirectory(galleryDir, {
    quality: QUALITY.high,
    maxWidth: MAX_WIDTH.tablet,
    format: 'webp'
  });

  // Summary
  const totalOriginal = projectResults.totalOriginal + galleryResults.totalOriginal;
  const totalOptimized = projectResults.totalOptimized + galleryResults.totalOptimized;
  const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);

  console.log('\n' + '='.repeat(50));
  console.log('✨ Optimization Complete!');
  console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Total reduction: ${totalReduction}%`);
  console.log('='.repeat(50));
}

// Run the script
main().catch(console.error);