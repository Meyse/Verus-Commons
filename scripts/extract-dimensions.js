/**
 * Build-time screenshot dimension extraction script
 * 
 * Scans /public/screenshots/ for images and extracts their dimensions.
 * Outputs a JSON file that can be read at build time to enable
 * server-side rendering of the ScreenshotGallery without client-side
 * dimension detection.
 * 
 * Run: node scripts/extract-dimensions.js
 * Runs automatically before build via "prebuild" script in package.json
 */

const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'screenshots', 'dimensions.json');

/**
 * Recursively find all image files in a directory
 */
function findImages(dir, basePath = '') {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    return images;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      images.push(...findImages(fullPath, relativePath));
    } else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(entry.name)) {
      images.push({ relativePath, fullPath });
    }
  }
  
  return images;
}

/**
 * Extract dimensions from all screenshots
 */
function extractDimensions() {
  console.log('Extracting screenshot dimensions...');
  
  const images = findImages(SCREENSHOTS_DIR);
  const dimensions = {};
  
  for (const { relativePath, fullPath } of images) {
    try {
      const buffer = fs.readFileSync(fullPath);
      const result = imageSize(buffer);
      // Use forward slashes for consistency (works on all platforms)
      const key = relativePath.replace(/\\/g, '/');
      dimensions[key] = {
        width: result.width,
        height: result.height,
      };
      console.log(`  ✓ ${key}: ${result.width}x${result.height}`);
    } catch (err) {
      console.warn(`  ✗ Failed to read ${relativePath}: ${err.message}`);
    }
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dimensions, null, 2));
  console.log(`\nWrote ${Object.keys(dimensions).length} entries to ${OUTPUT_FILE}`);
}

// Run
extractDimensions();
