/**
 * Screenshot dimension utilities
 * 
 * Reads pre-extracted screenshot dimensions from dimensions.json
 * Generated at build time by scripts/extract-dimensions.js
 */

import fs from 'fs';
import path from 'path';

export interface ScreenshotDimensions {
  width: number;
  height: number;
}

export interface ScreenshotWithDimensions {
  filename: string;
  src: string;
  width: number;
  height: number;
  isLandscape: boolean;
}

type DimensionsMap = Record<string, ScreenshotDimensions>;

// Cache the dimensions in memory (loaded once per server instance)
let dimensionsCache: DimensionsMap | null = null;

/**
 * Load dimensions from the pre-generated JSON file
 */
function loadDimensions(): DimensionsMap {
  if (dimensionsCache) {
    return dimensionsCache;
  }

  const dimensionsPath = path.join(process.cwd(), 'public', 'screenshots', 'dimensions.json');
  
  try {
    if (fs.existsSync(dimensionsPath)) {
      const content = fs.readFileSync(dimensionsPath, 'utf-8');
      dimensionsCache = JSON.parse(content);
      return dimensionsCache!;
    }
  } catch (err) {
    console.warn('Failed to load screenshot dimensions:', err);
  }
  
  return {};
}

/**
 * Get screenshot dimensions for a project
 * Returns null if dimensions aren't available (triggers client-side fallback)
 */
export function getScreenshotDimensions(
  projectSlug: string,
  screenshots: string[]
): ScreenshotWithDimensions[] | null {
  const dimensions = loadDimensions();
  const result: ScreenshotWithDimensions[] = [];
  
  for (const filename of screenshots) {
    const key = `${projectSlug}/${filename}`;
    const dims = dimensions[key];
    
    if (!dims) {
      // If any screenshot is missing dimensions, return null to trigger fallback
      return null;
    }
    
    result.push({
      filename,
      src: `/screenshots/${projectSlug}/${filename}`,
      width: dims.width,
      height: dims.height,
      isLandscape: dims.width > dims.height,
    });
  }
  
  return result;
}
