/**
 * ProjectCard component
 * Compact horizontal list item, mobile-first with theme support
 * 
 * Updated: Now displays ALL feature tags instead of limiting to 3
 */

import Link from 'next/link';
import { Project } from '@/types/project';
import { VerusFeatureTag } from './VerusFeatureTag';
import { stringToColor, getInitials, timeAgo } from '@/lib/utils';

export function ProjectCard({ project }: { project: Project }) {
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
            <h3 className="text-base sm:text-lg font-medium text-[var(--color-text-primary)] truncate">
              {project.name}
            </h3>
            
            {project.github && (
              <span className="hidden sm:block text-xs text-[var(--color-text-muted)] font-mono shrink-0">
                {timeAgo(project.github.lastCommit)}
              </span>
            )}
          </div>
          
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {project.verusFeatures.map((feature) => (
                <VerusFeatureTag key={feature} feature={feature} />
              ))}
            </div>
            
            {project.github && project.github.stars > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] shrink-0">
                <span>★</span>
                <span>{project.github.stars}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
