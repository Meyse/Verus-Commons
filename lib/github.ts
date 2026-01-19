/**
 * GitHub API utilities
 * Fetches repository data (stars, commits, license, languages)
 * 
 * Security: Uses GITHUB_TOKEN from environment for authenticated requests.
 * This increases rate limit from 60 to 5,000 requests/hour.
 * 
 * Optimization: Reduced from 3 to 2 API calls per project by using
 * pushed_at from repo endpoint instead of separate commits endpoint.
 */

import { GitHubData } from '@/types/project';

/**
 * Get GitHub API headers with optional authentication.
 * If GITHUB_TOKEN is set, includes it for higher rate limits.
 */
function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Verus-Commons-Website',
  };

  // Add authentication if token is available
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Check if we're being rate limited and log useful info
 */
function checkRateLimit(response: Response, endpoint: string): void {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const limit = response.headers.get('X-RateLimit-Limit');
  const resetTime = response.headers.get('X-RateLimit-Reset');

  if (remaining !== null && parseInt(remaining) < 10) {
    const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toISOString() : 'unknown';
    console.warn(
      `GitHub API rate limit warning: ${remaining}/${limit} remaining. ` +
      `Resets at ${resetDate}. Endpoint: ${endpoint}`
    );
  }

  // Log if we hit the rate limit
  if (response.status === 403 || response.status === 429) {
    const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toISOString() : 'unknown';
    console.error(
      `GitHub API rate limit exceeded! Resets at ${resetDate}. ` +
      `Consider adding GITHUB_TOKEN to environment variables.`
    );
  }
}

/**
 * Extract owner and repo from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Fetch GitHub repository data with ISR caching
 * 
 * Optimizations:
 * - Uses authentication token if available (5000 vs 60 requests/hour)
 * - Only 2 API calls instead of 3 (uses pushed_at instead of commits endpoint)
 * - Includes rate limit monitoring and warnings
 */
export async function fetchGitHubData(repoUrl: string): Promise<GitHubData | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const headers = getGitHubHeaders();

  try {
    // Only 2 API calls now - repo info and languages
    // We use pushed_at from repo endpoint instead of fetching commits separately
    const [repoRes, languagesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        next: { revalidate: 3600 },
        headers,
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        next: { revalidate: 3600 },
        headers,
      }),
    ]);

    // Check rate limits
    checkRateLimit(repoRes, `repos/${owner}/${repo}`);

    // Handle rate limit or other errors
    if (!repoRes.ok) {
      if (repoRes.status === 403 || repoRes.status === 429) {
        // Rate limited - return null gracefully
        return null;
      }
      if (repoRes.status === 404) {
        console.warn(`GitHub repo not found: ${owner}/${repo}`);
        return null;
      }
      return null;
    }

    const repoData = await repoRes.json();
    const languagesData = languagesRes.ok ? await languagesRes.json() : {};

    return {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      // Use pushed_at from repo data - no need for separate commits API call
      lastCommit: repoData.pushed_at || '',
      license: repoData.license?.spdx_id || null,
      languages: Object.keys(languagesData),
    };
  } catch (error) {
    console.error(`Failed to fetch GitHub data for ${owner}/${repo}:`, error);
    return null;
  }
}
