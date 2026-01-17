/**
 * Type definitions for the Commons project registry
 * Defines Project, GitHubData, and related interfaces
 * 
 * Updated: New feature list with auto-generated colors support.
 * Features can be added without defining colors - they're generated automatically.
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

export interface GitHubData {
  stars: number;
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
  maintainer: string;
  liveUrl?: string;
  docsUrl?: string;
  logo?: string;
  screenshots?: string[];
}

export interface Project extends ProjectYAML {
  github: GitHubData | null;
}
