/**
 * Homepage
 * Compact hero, mobile-optimized layout with theme support
 */

import Link from 'next/link';
import { getAllProjects, getFeaturedProjects } from '@/lib/projects';
import { FilterBar } from '@/components/FilterBar';
import { FeaturedCard } from '@/components/FeaturedCard';

export const revalidate = 3600;

export default async function HomePage() {
  const [projects, featured] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
        
        {/* Hero */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight leading-tight">
              Open source projects <span className="text-[var(--color-text-muted)]">built on Verus.</span>
            </h1>
          </div>
          <div className="flex flex-row items-center gap-2 shrink-0">
            <Link
              href="/add"
              className="px-3 py-1.5 text-sm font-medium bg-[#3165D4] text-white rounded-lg border border-transparent hover:bg-[#2855b8] transition-colors"
            >
              Add your project
            </Link>
            <a
              href="/api/projects.json"
              className="hidden sm:block px-3 py-1.5 text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
            >
              Download JSON
            </a>
          </div>
        </section>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-10 sm:mb-16 lg:mb-20">
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4 sm:mb-6">
              Featured
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {featured.map((project) => (
                <FeaturedCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section id="projects" className="max-w-4xl mx-auto">
          <FilterBar projects={projects} />
        </section>
      </div>
    </main>
  );
}
