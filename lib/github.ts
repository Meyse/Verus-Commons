/**
 * GitHub API utilities
 * Fetches repository data (stars, commits, license, languages)
 */

import { GitHubData } from '@/types/project';

/**
 * Extract owner and repo from a GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Fetch GitHub repository data with ISR caching
 */
export async function fetchGitHubData(repoUrl: string): Promise<GitHubData | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;

  try {
    const [repoRes, commitsRes, languagesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
    ]);

    if (!repoRes.ok) return null;

    const repoData = await repoRes.json();
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];
    const languagesData = languagesRes.ok ? await languagesRes.json() : {};

    return {
      stars: repoData.stargazers_count || 0,
      lastCommit: commitsData[0]?.commit?.author?.date || repoData.pushed_at || '',
      license: repoData.license?.spdx_id || null,
      languages: Object.keys(languagesData),
    };
  } catch {
    return null;
  }
}
