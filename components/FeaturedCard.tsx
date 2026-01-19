/**
 * FeaturedCard component
 * Displays featured project with featured image banner
 * 
 * Updated: Now displays featured image instead of code window mockup.
 * Projects must have a featured.png/jpg in their screenshots folder.
 */

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import { getInitials } from '@/lib/utils';
import { getFeaturedImage } from '@/lib/projects';

export function FeaturedCard({ project }: { project: Project }) {
  const featuredImage = getFeaturedImage(project.slug);
  
  return (
    <Link
      href={`/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-all duration-300"
    >
      {/* Graphic card layout - all screen sizes */}
      <div>
        {/* Featured Image Area */}
        <div className="h-24 sm:h-28 lg:h-36 w-full relative overflow-hidden bg-[var(--color-surface-elevated)]">
          {featuredImage && (
            <Image
              src={`/screenshots/${project.slug}/${featuredImage}`}
              alt={`${project.name} featured image`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Logo badge */}
          <div className="absolute top-2 right-2">
            {project.logo ? (
              <Image 
                src={`/logos/${project.logo}`} 
                alt="" 
                width={64} 
                height={64} 
                className="w-8 h-8 rounded-lg shadow-lg border border-white/20" 
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold bg-black/30 backdrop-blur-sm border border-white/20"
              >
                {getInitials(project.name)}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-medium text-[var(--color-text-primary)] tracking-tight line-clamp-1">
            {project.name}
          </h3>
          <p className="mt-0.5 sm:mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
