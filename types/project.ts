/**
 * Type definitions for the Commons project registry
 * Defines Project, GitHubData, and related interfaces
 * 
 * Updated: Added developer-focused fields for libraries (primaryLanguage, 
 * installCommand, packageManager, platformSupport). Enhanced support for
 * SDK/library discovery.
 */

export const VERUS_FEATURES = [
  'VerusID',
  'Currencies',
  'DeFi',
  'Cross-chain',
  'Zero-knowledge',
  'Marketplace',
  'Data',
  'Blockchain',
  'Staking',
  'Mining',
] as const;

export type VerusFeature = (typeof VERUS_FEATURES)[number];

export const CATEGORIES = [
  'wallet',
  'app',
  'dashboard',
  'tool',
  'library',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PACKAGE_MANAGERS = ['npm', 'yarn', 'cargo', 'pip', 'go', 'other'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const PLATFORMS = ['web', 'node', 'desktop', 'mobile', 'cli'] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface GitHubData {
  stars: number;
  forks: number;
  lastCommit: string;
  license: string | null;
  languages: string[];
}

export interface ProjectYAML {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: Category;
  repo: string;
  verusFeatures: VerusFeature[];
  maintainer?: string;
  liveUrl?: string;
  docsUrl?: string;
  logo?: string;
  screenshots?: string[];
  
  // Developer-focused fields (primarily for libraries/tools)
  primaryLanguage?: string;
  packageManager?: PackageManager;
  installCommand?: string;
  platformSupport?: Platform[];
}

export interface Project extends ProjectYAML {
  maintainer: string;
  github: GitHubData | null;
}
