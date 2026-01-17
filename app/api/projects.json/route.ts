/**
 * API endpoint: GET /api/projects.json
 * Returns all projects with GitHub data merged in
 */

import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projects';

export const revalidate = 3600;

export async function GET() {
  const projects = await getAllProjects();

  return NextResponse.json({
    projects,
    generatedAt: new Date().toISOString(),
  });
}
