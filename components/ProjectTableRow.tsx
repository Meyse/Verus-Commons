/**
 * ProjectTableRow component
 * Compact table row for developer-focused list view
 * Shows language, install command, stats in a scannable format
 * 
 * Created: Table view for library/tool discovery with copy-to-clipboard
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { stringToColor, getInitials, timeAgo } from '@/lib/utils';

export function ProjectTableRow({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);

  const primaryLang = project.primaryLanguage || project.github?.languages?.[0] || null;
  
  const copyInstallCommand = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.installCommand) {
      await navigator.clipboard.writeText(project.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors">
      {/* Project Name & Description */}
      <td className="py-3 px-3">
        <Link href={`/${project.slug}`} className="block">
          <div className="flex items-center gap-3">
            {/* Logo / Icon */}
            <div className="shrink-0">
              {project.logo ? (
                <img
                  src={`/logos/${project.logo}`}
                  alt={project.name}
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

      {/* Install Command */}
      <td className="py-3 px-3 hidden md:table-cell">
        {project.installCommand ? (
          <button
            onClick={copyInstallCommand}
            className="group inline-flex items-center gap-2 px-2 py-1 text-xs font-mono bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors max-w-[200px]"
            title="Click to copy"
          >
            <span className="truncate">{project.installCommand}</span>
            <span className="shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]">
              {copied ? (
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </span>
          </button>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">—</span>
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
