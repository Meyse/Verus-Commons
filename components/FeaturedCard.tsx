/**
 * FeaturedCard component
 * Simple horizontal card on mobile, graphic card on desktop with theme support
 * 
 * Updated: Removed feature tags and stars for cleaner featured section appearance.
 */

import Link from 'next/link';
import { Project } from '@/types/project';
import { stringToColor, getInitials } from '@/lib/utils';

export function FeaturedCard({ project }: { project: Project }) {
  const color = stringToColor(project.name);
  const hue = color.match(/\d+/)?.[0] || '210';
  
  return (
    <Link
      href={`/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-all duration-300"
    >
      {/* Mobile: Simple horizontal layout */}
      <div className="flex items-start gap-3 p-4 md:hidden">
        {project.logo ? (
          <img src={`/logos/${project.logo}`} alt="" className="w-10 h-10 rounded-lg shrink-0" />
        ) : (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: stringToColor(project.name) }}
          >
            {getInitials(project.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-[var(--color-text-primary)] truncate">{project.name}</h3>
          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-0.5">{project.description}</p>
        </div>
      </div>

      {/* Desktop: Graphic card layout */}
      <div className="hidden md:block">
        {/* Graphic Area */}
        <div className="h-28 lg:h-36 w-full relative overflow-hidden bg-[var(--color-surface-elevated)]">
          {/* Dark mode gradient */}
          <div 
            className="show-dark absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 50% 120%, hsl(${hue}, 30%, 12%), transparent 70%),
                radial-gradient(circle at 0% 0%, hsl(${hue}, 20%, 6%), transparent 40%)
              `
            }}
          />
          {/* Light mode gradient - softer, lighter colors */}
          <div 
            className="show-light absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 50% 120%, hsl(${hue}, 40%, 75%), transparent 70%),
                radial-gradient(circle at 0% 0%, hsl(${hue}, 35%, 82%), transparent 40%)
              `
            }}
          />
          
          {/* Code Window Graphic */}
          <div className="absolute inset-x-4 top-4 bottom-0 bg-[var(--color-surface)] rounded-t-lg border-t border-l border-r border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-1.5 p-2 border-b border-[var(--color-border)]">
              {/* Light mode: colored dots, Dark mode: muted dots */}
              <div className="show-light w-2 h-2 rounded-full bg-[#ff5f56]" />
              <div className="show-light w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <div className="show-light w-2 h-2 rounded-full bg-[#27ca40]" />
              <div className="show-dark w-2 h-2 rounded-full bg-[var(--color-border-strong)]" />
              <div className="show-dark w-2 h-2 rounded-full bg-[var(--color-border-strong)]" />
              <div className="show-dark w-2 h-2 rounded-full bg-[var(--color-border-strong)]" />
            </div>
            <div className="p-2.5 opacity-40 space-y-1">
              <div className="h-1.5 w-3/4 bg-[var(--color-border-strong)] rounded" />
              <div className="h-1.5 w-1/2 bg-[var(--color-border-strong)] rounded" />
            </div>
          </div>
          
          {/* Logo */}
          <div className="absolute top-2 right-2">
            {project.logo ? (
              <img src={`/logos/${project.logo}`} alt="" className="w-8 h-8 rounded-lg shadow-lg" />
            ) : (
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
              >
                {getInitials(project.name)}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <h3 className="text-base font-medium text-[var(--color-text-primary)] tracking-tight line-clamp-1">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
