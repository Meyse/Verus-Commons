/**
 * Type definitions for the Commons project registry
 * Defines Project, GitHubData, and related interfaces
 * 
 * Updated: Simplified schema - removed developer-focused fields (primaryLanguage,
 * installCommand, etc.) as GitHub repos contain this information directly.
 */

export const VERUS_FEATURES = [
  'VerusID',
  'Currencies',
  'DeFi',
  'Cross-chain',
  'Zero-knowledge privacy',
  'Marketplace',
  'Data',
  'PBaaS-chain',
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
}

export interface Project extends ProjectYAML {
  maintainer: string;
  github: GitHubData | null;
}
