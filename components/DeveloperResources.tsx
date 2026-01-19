/**
 * DeveloperResources component
 * Dedicated section showcasing core libraries and SDKs for developers
 * 
 * Updated: "View all libraries" link now includes #projects anchor
 * to scroll users to the filtered results section.
 */

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import { stringToColor, getInitials } from '@/lib/utils';

interface DeveloperResourcesProps {
  libraries: Project[];
}

export function DeveloperResources({ libraries }: DeveloperResourcesProps) {
  if (libraries.length === 0) return null;

  // Show up to 3 libraries, sorted by stars
  const featured = libraries.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="mb-10 sm:mb-16 lg:mb-20">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            Developer Resources
          </h2>
        </div>
        <Link 
          href="/?category=library#projects"
          className="text-xs text-[#3165D4] hover:underline"
        >
          View all libraries →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {featured.map((project) => (
          <LibraryCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

function LibraryCard({ project }: { project: Project }) {
  const primaryLang = project.github?.languages?.[0] || null;

  return (
    <Link 
      href={`/${project.slug}`}
      className="group block p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-strong)] transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* Logo / Icon */}
        {project.logo ? (
          <Image
            src={`/images/projects/${project.slug}/${project.logo}`}
            alt={project.name}
            width={80}
            height={80}
            className="w-10 h-10 rounded-lg object-cover bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium border border-[var(--color-border)]"
            style={{ backgroundColor: stringToColor(project.name) }}
          >
            {getInitials(project.name)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {project.name}
            </h3>
            {primaryLang && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] rounded border border-[var(--color-border)]">
                <LanguageDot language={primaryLang} />
                {primaryLang}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-0.5">
            {project.description}
          </p>
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
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}
