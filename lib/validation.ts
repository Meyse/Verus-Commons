/**
 * Validation utilities for security
 * 
 * Security: Provides URL validation to prevent malicious links and
 * Zod schemas for YAML content validation.
 */

import { z } from 'zod';

// =============================================================================
// URL Validation
// =============================================================================

/** Allowed URL protocols for external links */
const ALLOWED_PROTOCOLS = ['https:', 'http:'];

/** Blocked URL patterns that could be used for attacks */
const BLOCKED_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^vbscript:/i,
  /^file:/i,
  /^about:/i,
];

/**
 * Validate that a URL is safe for use as an external link.
 * Returns the URL if valid, or null if invalid/malicious.
 * 
 * Checks:
 * - URL is a valid format
 * - Protocol is http or https
 * - No javascript:, data:, or other dangerous protocols
 */
export function validateExternalUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // Check for blocked patterns first (before URL parsing)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      console.warn(`Blocked malicious URL pattern: ${trimmed.substring(0, 50)}...`);
      return null;
    }
  }

  try {
    const parsed = new URL(trimmed);

    // Verify protocol is allowed
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      console.warn(`Blocked URL with disallowed protocol: ${parsed.protocol}`);
      return null;
    }

    // Additional check: hostname must exist
    if (!parsed.hostname) {
      return null;
    }

    return trimmed;
  } catch {
    // Invalid URL format
    return null;
  }
}

/**
 * Validate a GitHub repository URL specifically.
 * Must be a valid GitHub URL in the format: https://github.com/owner/repo
 */
export function validateGitHubUrl(url: string | undefined | null): string | null {
  const validated = validateExternalUrl(url);
  if (!validated) {
    return null;
  }

  try {
    const parsed = new URL(validated);
    
    // Must be github.com
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      console.warn(`Invalid GitHub URL hostname: ${parsed.hostname}`);
      return null;
    }

    // Path must have at least /owner/repo format
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      console.warn(`Invalid GitHub URL path format: ${parsed.pathname}`);
      return null;
    }

    return validated;
  } catch {
    return null;
  }
}

// =============================================================================
// Zod Schemas for YAML Validation
// =============================================================================

/** Valid Verus features */
export const VerusFeaturesSchema = z.enum([
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
]);

/** Valid project categories */
export const CategorySchema = z.enum([
  'wallet',
  'app',
  'dashboard',
  'tool',
  'library',
  'other',
]);

/** Slug validation pattern */
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Safe URL that passes validation */
const SafeUrlSchema = z.string().refine(
  (url) => validateExternalUrl(url) !== null,
  { message: 'Invalid or unsafe URL' }
);

/** GitHub URL that passes validation */
const GitHubUrlSchema = z.string().refine(
  (url) => validateGitHubUrl(url) !== null,
  { message: 'Invalid GitHub repository URL' }
);

/**
 * Schema for validating project YAML files.
 * Enforces type safety and security constraints.
 */
export const ProjectYAMLSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less')
    .regex(slugPattern, 'Slug must be lowercase alphanumeric with hyphens'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less'),
  
  longDescription: z
    .string()
    .min(1, 'Long description is required')
    .max(10000, 'Long description must be 10000 characters or less'),
  
  category: CategorySchema,
  
  repo: GitHubUrlSchema,
  
  verusFeatures: z
    .array(VerusFeaturesSchema)
    .min(1, 'At least one Verus feature is required'),
  
  // Optional fields
  maintainer: z
    .string()
    .max(100, 'Maintainer must be 100 characters or less')
    .optional(),
  
  liveUrl: SafeUrlSchema.optional(),
  
  docsUrl: SafeUrlSchema.optional(),
  
  logo: z
    .string()
    .max(100, 'Logo filename must be 100 characters or less')
    .optional(),
  
  screenshots: z
    .array(z.string().max(100, 'Screenshot filename must be 100 characters or less'))
    .max(10, 'Maximum 10 screenshots allowed')
    .optional(),
});

/** Type inferred from the schema */
export type ValidatedProjectYAML = z.infer<typeof ProjectYAMLSchema>;

/**
 * Validate a parsed YAML object against the project schema.
 * Returns the validated data or throws an error with details.
 */
export function validateProjectYAML(data: unknown, filename: string): ValidatedProjectYAML {
  const result = ProjectYAMLSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    
    throw new Error(`Invalid project YAML in ${filename}:\n${errors}`);
  }
  
  return result.data;
}
