/**
 * Project detail page
 * Shows full project info with markdown description and sidebar, theme-aware
 * 
 * Updated: Added install command display with copy-to-clipboard for libraries,
 * platform support badges, and enhanced sidebar for developer metadata.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import { VerusFeatureTag } from '@/components/VerusFeatureTag';
import { ScreenshotGallery } from '@/components/ScreenshotGallery';
import { InstallCommand } from '@/components/InstallCommand';
import { stringToColor, getInitials, timeAgo } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isLibrary = project.category === 'library' || project.category === 'tool';
  const primaryLang = project.primaryLanguage || project.github?.languages?.[0] || null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/" className="text-sm text-[var(--color-text-muted)] mb-6 inline-block">
        ← Back to all projects
      </Link>

      {/* Header - Mobile: stacked, Desktop: row with buttons on right */}
      <div className="mb-8">
        {/* Desktop layout */}
        <div className="hidden md:flex md:items-start md:gap-4">
          {project.logo ? (
            <img
              src={`/logos/${project.logo}`}
              alt={project.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-medium"
              style={{ backgroundColor: stringToColor(project.name) }}
            >
              {getInitials(project.name)}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{project.name}</h1>
              {isLibrary && primaryLang && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] rounded border border-[var(--color-border)]">
                  <LanguageDot language={primaryLang} />
                  {primaryLang}
                </span>
              )}
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {project.verusFeatures.map((feature) => (
                <VerusFeatureTag key={feature} feature={feature} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-medium bg-[#3165D4] text-white rounded-lg border border-transparent hover:bg-[#2855b8] transition-colors"
            >
              View Repo ↗
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 mb-3">
            {project.logo ? (
              <img
                src={`/logos/${project.logo}`}
                alt={project.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-medium shrink-0"
                style={{ backgroundColor: stringToColor(project.name) }}
              >
                {getInitials(project.name)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-[var(--color-text-primary)] leading-tight">
                {project.name}
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-0.5 line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          {/* Feature tags - horizontal scroll */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4">
            {project.verusFeatures.map((feature) => (
              <span key={feature} className="shrink-0">
                <VerusFeatureTag feature={feature} />
              </span>
            ))}
          </div>

          {/* Action buttons - full width */}
          <div className="flex gap-2 mt-3">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 text-sm font-medium bg-[#3165D4] text-white rounded-lg"
            >
              View Repo ↗
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)]"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Install Command for Libraries */}
      {isLibrary && project.installCommand && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
            Quick Install
          </h2>
          <InstallCommand command={project.installCommand} />
        </div>
      )}

      {/* Stats - wrap on mobile */}
      {project.github && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)] mb-8 pb-6 border-b border-[var(--color-border)]">
          <span className="flex items-center gap-1">
            <span>★</span> {project.github.stars} stars
          </span>
          <span className="flex items-center gap-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
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
            {project.github.forks} forks
          </span>
          <span>Updated {timeAgo(project.github.lastCommit)}</span>
          {project.github.license && <span>{project.github.license}</span>}
        </div>
      )}

      {/* Screenshots */}
      {project.screenshots && project.screenshots.length > 0 && (
        <ScreenshotGallery screenshots={project.screenshots} projectSlug={project.slug} />
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            About
          </h2>
          <div className="prose prose-sm max-w-none">
            <Markdown>{project.longDescription}</Markdown>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Platform Support (for libraries) */}
          {isLibrary && project.platformSupport && project.platformSupport.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Platform Support
              </h3>
              <div className="flex flex-wrap gap-1">
                {project.platformSupport.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded border border-[var(--color-border)]"
                  >
                    <PlatformIcon platform={platform} />
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {project.github && project.github.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Languages <span className="text-xs font-normal">(via GitHub)</span>
              </h3>
              <div className="flex flex-wrap gap-1">
                {project.github.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 text-xs bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
              Links
            </h3>
            <div className="space-y-1 text-sm">
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#3165D4]"
              >
                Repository ↗
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#3165D4]"
                >
                  Website ↗
                </a>
              )}
              {project.docsUrl && (
                <a
                  href={project.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#3165D4]"
                >
                  Documentation ↗
                </a>
              )}
            </div>
          </div>

          {/* Data */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
              Data
            </h3>
            <div className="space-y-1 text-sm">
              <a
                href={`/api/projects.json`}
                className="block text-[var(--color-text-secondary)]"
              >
                Download JSON
              </a>
              <a
                href={`https://github.com/veruscoin/commons/blob/main/data/projects/${project.slug}.yaml`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[var(--color-text-secondary)]"
              >
                View YAML source ↗
              </a>
            </div>
          </div>

          {/* Maintainer */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
              Maintainer
            </h3>
            <Link
              href={`/maintainer/${project.maintainer}`}
              className="text-sm text-[#3165D4]"
            >
              {project.maintainer}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

// Language color dot component
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

// Platform icon component
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'web':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'node':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
        </svg>
      );
    case 'desktop':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'cli':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
}
