/**
 * ProjectTableRow component
 * Compact table row for developer-focused list view
 * Shows language, stats in a scannable format
 * 
 * Updated: Uses Next.js Image for optimized logo loading
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import { stringToColor, getInitials, timeAgo } from '@/lib/utils';

export function ProjectTableRow({ project }: { project: Project }) {
  const primaryLang = project.github?.languages?.[0] || null;

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
      {/* Project Name & Description */}
      <td className="py-3 px-3">
        <Link href={`/${project.slug}`} className="block">
          <div className="flex items-center gap-3">
            {/* Logo / Icon */}
            <div className="shrink-0">
              {project.logo ? (
                <Image
                  src={`/logos/${project.logo}`}
                  alt={project.name}
                  width={64}
                  height={64}
                  className="w-8 h-8 rounded-md object-cover bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium border border-[var(--color-border)]"
                  style={{ backgroundColor: stringToColor(project.name) }}
                >
                  {getInitials(project.name)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-[var(--color-text-primary)] truncate">
                {project.name}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] truncate max-w-[200px] sm:max-w-[300px]">
                {project.description}
              </div>
            </div>
          </div>
        </Link>
      </td>

      {/* Language */}
      <td className="py-3 px-3 hidden sm:table-cell">
        {primaryLang && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded border border-[var(--color-border)]">
            <LanguageIcon language={primaryLang} />
            {primaryLang}
          </span>
        )}
      </td>

      {/* Stats */}
      <td className="py-3 px-3 text-right hidden sm:table-cell">
        {project.github && (project.github.stars > 0 || project.github.forks > 0) ? (
          <div className="flex items-center justify-end gap-3 text-xs text-[var(--color-text-muted)]">
            {project.github.stars > 0 && (
              <span className="flex items-center gap-1">
                <span>★</span>
                <span>{project.github.stars}</span>
              </span>
            )}
            {project.github.forks > 0 && (
              <span className="flex items-center gap-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-75"
                >
                  <circle cx="12" cy="18" r="3" />
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M6 9v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
                  <path d="M12 12v3" />
                </svg>
                <span>{project.github.forks}</span>
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">—</span>
        )}
      </td>

      {/* Updated */}
      <td className="py-3 px-3 text-right">
        {project.github?.lastCommit ? (
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            {timeAgo(project.github.lastCommit)}
          </span>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">—</span>
        )}
      </td>
    </tr>
  );
}

// Simple language icon component
function LanguageIcon({ language }: { language: string }) {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    Rust: '#dea584',
    Go: '#00add8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Swift: '#fa7343',
    Kotlin: '#a97bff',
    Ruby: '#cc342d',
    PHP: '#4f5d95',
    Svelte: '#ff3e00',
  };

  const color = colors[language] || '#6b7280';

  return (
    <span 
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}
