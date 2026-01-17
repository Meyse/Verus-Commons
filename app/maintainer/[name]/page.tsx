/**
 * Maintainer page
 * Shows all projects by a specific maintainer, theme-aware
 */

import Link from 'next/link';
import { getProjectsByMaintainer, getAllProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  const maintainers = [...new Set(projects.map((p) => p.maintainer))];
  return maintainers.map((name) => ({ name }));
}

interface PageProps {
  params: Promise<{ name: string }>;
}

export default async function MaintainerPage({ params }: PageProps) {
  const { name } = await params;
  const projects = await getProjectsByMaintainer(name);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-[var(--color-text-muted)] mb-6 inline-block">
        ← Back to all projects
      </Link>

      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Projects by {name}
      </h1>

      {projects.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-sm">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
