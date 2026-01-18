/**
 * Project data loading utilities
 * Reads YAML files from /data/projects/ and merges with GitHub data
 * 
 * Updated: Added getLibraryProjects() for developer resources section,
 * supports new developer-focused fields (installCommand, primaryLanguage, etc.)
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { Project, ProjectYAML } from '@/types/project';
import { fetchGitHubData, parseGitHubUrl } from './github';

const PROJECTS_DIR = path.join(process.cwd(), 'data', 'projects');
const FEATURED_PATH = path.join(process.cwd(), 'data', 'featured.json');

/**
 * Get all projects with GitHub data merged in
 */
export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.yaml'));
  
  const projects = await Promise.all(
    files.map(async (file) => {
      const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
      const yaml = parse(content) as ProjectYAML;
      const github = await fetchGitHubData(yaml.repo);
      
      const parsedRepo = parseGitHubUrl(yaml.repo);
      const maintainer = yaml.maintainer || parsedRepo?.owner || 'Unknown';

      return { ...yaml, maintainer, github } as Project;
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
  
  return { ...yaml, maintainer, github };
}

/**
 * Get featured projects (defined in featured.json)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  if (!fs.existsSync(FEATURED_PATH)) return [];

  const featuredSlugs = JSON.parse(fs.readFileSync(FEATURED_PATH, 'utf-8')) as string[];
  const allProjects = await getAllProjects();
  
  return featuredSlugs
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
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
 * Sorted by those with install commands first, then by stars
 */
export async function getLibraryProjects(): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects
    .filter((p) => p.category === 'library' || p.category === 'tool')
    .sort((a, b) => {
      // Prioritize projects with install commands
      if (a.installCommand && !b.installCommand) return -1;
      if (!a.installCommand && b.installCommand) return 1;
      // Then sort by stars
      return (b.github?.stars || 0) - (a.github?.stars || 0);
    });
}
