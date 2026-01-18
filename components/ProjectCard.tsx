/**
 * ProjectCard component
 * Compact horizontal list item with library-specific enhancements
 * Shows install command and primary language for libraries
 * 
 * Updated: Added copy-to-clipboard for install commands, language badge,
 * and category-specific visual treatments for libraries/tools.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { VerusFeatureTag } from './VerusFeatureTag';
import { stringToColor, getInitials, timeAgo } from '@/lib/utils';

export function ProjectCard({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);
  const isLibrary = project.category === 'library' || project.category === 'tool';
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
    <Link
      href={`/${project.slug}`}
      className="group block p-4 sm:p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-strong)] transition-all duration-200"
    >
      <div className="flex items-start gap-3 sm:gap-5">
        {/* Logo / Icon */}
        <div className="shrink-0">
          {project.logo ? (
            <img
              src={`/logos/${project.logo}`}
              alt={project.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
            />
          ) : (
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-sm sm:text-base font-medium border border-[var(--color-border)]"
              style={{ backgroundColor: stringToColor(project.name) }}
            >
              {getInitials(project.name)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-medium text-[var(--color-text-primary)] truncate">
                {project.name}
              </h3>
              {/* Language badge for libraries */}
              {isLibrary && primaryLang && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-1.5 py-0.5 text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] rounded border border-[var(--color-border)]">
                  <LanguageDot language={primaryLang} />
                  {primaryLang}
                </span>
              )}
            </div>
            
            {project.github && (
              <span className="hidden sm:block text-xs text-[var(--color-text-muted)] font-mono shrink-0">
                {timeAgo(project.github.lastCommit)}
              </span>
            )}
          </div>
          
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Install command for libraries */}
          {isLibrary && project.installCommand && (
            <div className="mb-3">
              <button
                onClick={copyInstallCommand}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono bg-[var(--color-background)] text-[var(--color-text-secondary)] rounded-md border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
                title="Click to copy"
              >
                <span className="text-[var(--color-text-muted)]">$</span>
                <span className="truncate max-w-[200px] sm:max-w-[300px]">{project.installCommand}</span>
                <span className="shrink-0 ml-1">
                  {copied ? (
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {project.verusFeatures.map((feature) => (
                <VerusFeatureTag key={feature} feature={feature} />
              ))}
            </div>
            
            {project.github && (project.github.stars > 0 || project.github.forks > 0) && (
              <div className="flex items-center gap-3 shrink-0">
                {project.github.stars > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <span>★</span>
                    <span>{project.github.stars}</span>
                  </div>
                )}
                {project.github.forks > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Language color dot
function LanguageDot({ language }: { language: string }) {
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
