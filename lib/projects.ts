/**
 * Project data loading utilities
 * Reads YAML files from /data/projects/ and merges with GitHub data
 * 
 * Updated: Unified image structure at public/images/projects/{slug}/
 * All assets (logo, screenshots, featured) auto-detected from single folder.
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { Project, ProjectYAML } from '@/types/project';
import { fetchGitHubData, parseGitHubUrl } from './github';

const PROJECTS_DIR = path.join(process.cwd(), 'data', 'projects');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

/** Categories eligible for featured section */
const FEATURED_ELIGIBLE_CATEGORIES = ['app', 'wallet', 'dashboard'];

/**
 * Get the project images directory path
 */
function getProjectImagesDir(slug: string): string {
  return path.join(IMAGES_DIR, slug);
}

/**
 * Auto-detect logo for a project
 * Looks for logo.png or logo.jpg in public/images/projects/{slug}/
 */
function getProjectLogo(slug: string): string | undefined {
  const projectDir = getProjectImagesDir(slug);
  if (!fs.existsSync(projectDir)) return undefined;
  
  if (fs.existsSync(path.join(projectDir, 'logo.png'))) {
    return 'logo.png';
  }
  if (fs.existsSync(path.join(projectDir, 'logo.jpg'))) {
    return 'logo.jpg';
  }
  return undefined;
}

/**
 * Auto-detect screenshots for a project
 * Looks for screenshot1.png, screenshot2.png, etc. in public/images/projects/{slug}/
 * Supports both .png and .jpg formats
 */
export function getProjectScreenshots(slug: string): string[] {
  const projectDir = getProjectImagesDir(slug);
  if (!fs.existsSync(projectDir)) return [];
  
  const screenshots: string[] = [];
  
  // Check for screenshot1 through screenshot6
  for (let i = 1; i <= 6; i++) {
    const pngFile = `screenshot${i}.png`;
    const jpgFile = `screenshot${i}.jpg`;
    
    if (fs.existsSync(path.join(projectDir, pngFile))) {
      screenshots.push(pngFile);
    } else if (fs.existsSync(path.join(projectDir, jpgFile))) {
      screenshots.push(jpgFile);
    }
  }
  
  return screenshots;
}

/**
 * Get all projects with GitHub data merged in
 */
export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  // Exclude template file (starts with underscore)
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'));
  
  const projects = await Promise.all(
    files.map(async (file) => {
      const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
      const yaml = parse(content) as ProjectYAML;
      const github = await fetchGitHubData(yaml.repo);
      
      const parsedRepo = parseGitHubUrl(yaml.repo);
      const maintainer = yaml.maintainer || parsedRepo?.owner || 'Unknown';
      const logo = getProjectLogo(yaml.slug);
      const screenshots = getProjectScreenshots(yaml.slug);

      return { ...yaml, maintainer, logo, screenshots, github } as Project;
    })
  );

  return projects;
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.yaml`);
  
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  const yaml = parse(content) as ProjectYAML;
  const github = await fetchGitHubData(yaml.repo);
  
  const parsedRepo = parseGitHubUrl(yaml.repo);
  const maintainer = yaml.maintainer || parsedRepo?.owner || 'Unknown';
  const logo = getProjectLogo(slug);
  const screenshots = getProjectScreenshots(slug);
  
  return { ...yaml, maintainer, logo, screenshots, github };
}

/**
 * Check if a project has a featured image
 */
function hasFeaturedImage(slug: string): boolean {
  const projectDir = getProjectImagesDir(slug);
  if (!fs.existsSync(projectDir)) return false;
  
  return (
    fs.existsSync(path.join(projectDir, 'featured.png')) ||
    fs.existsSync(path.join(projectDir, 'featured.jpg'))
  );
}

/**
 * Get the featured image filename for a project
 */
export function getFeaturedImage(slug: string): string | null {
  const projectDir = getProjectImagesDir(slug);
  if (!fs.existsSync(projectDir)) return null;
  
  if (fs.existsSync(path.join(projectDir, 'featured.png'))) {
    return 'featured.png';
  }
  if (fs.existsSync(path.join(projectDir, 'featured.jpg'))) {
    return 'featured.jpg';
  }
  return null;
}

/**
 * Seeded random number generator (mulberry32)
 * Returns a function that generates deterministic random numbers from 0-1
 */
function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle array using seeded random (Fisher-Yates)
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = seededRandom(seed);
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * Get date-based seed for daily rotation (UTC)
 */
function getDailySeed(): number {
  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
  // Simple hash of date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get featured projects
 * - Filters to eligible categories (app, wallet, dashboard)
 * - Requires featured image in screenshots folder
 * - Returns 3 projects, shuffled daily using date-seeded randomization
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const allProjects = await getAllProjects();
  
  // Filter to eligible projects
  const eligible = allProjects.filter((project) => 
    FEATURED_ELIGIBLE_CATEGORIES.includes(project.category) &&
    hasFeaturedImage(project.slug)
  );
  
  if (eligible.length === 0) return [];
  
  // Shuffle with daily seed and take top 3
  const seed = getDailySeed();
  const shuffled = seededShuffle(eligible, seed);
  
  return shuffled.slice(0, 3);
}

/**
 * Get all projects by a maintainer
 */
export async function getProjectsByMaintainer(name: string): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter(
    (p) => p.maintainer.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get all library projects (category: library or tool)
 * Sorted by stars
 */
export async function getLibraryProjects(): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects
    .filter((p) => p.category === 'library' || p.category === 'tool')
    .sort((a, b) => (b.github?.stars || 0) - (a.github?.stars || 0));
}
