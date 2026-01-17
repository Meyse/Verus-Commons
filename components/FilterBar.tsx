/**
 * FilterBar component
 * Chip-based multi-select filters for categories and features
 * Theme-aware with professional, minimal styling
 * 
 * Updated: Replaced dropdown selects with chip/pill multi-select UI
 * - Categories: multi-select chips
 * - Features: multi-select chips  
 * - Sort: single select dropdown (kept as is)
 */

'use client';

import { useState, useMemo } from 'react';
import { Project, CATEGORIES, VERUS_FEATURES, Category, VerusFeature } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface FilterBarProps {
  projects: Project[];
}

type SortOption = 'updated' | 'stars' | 'name';

// Format category for display (capitalize first letter)
function formatCategory(category: Category): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function FilterBar({ projects }: FilterBarProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<VerusFeature[]>([]);
  const [sort, setSort] = useState<SortOption>('updated');

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFeature = (feature: VerusFeature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedFeatures([]);
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedFeatures.length > 0;

  const filtered = useMemo(() => {
    let result = [...projects];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Categories (OR logic - matches any selected category)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Features (AND logic - must have ALL selected features)
    if (selectedFeatures.length > 0) {
      result = result.filter((p) => 
        selectedFeatures.every(f => p.verusFeatures.includes(f))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'stars') {
        return (b.github?.stars || 0) - (a.github?.stars || 0);
      }
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Default: updated
      const aDate = a.github?.lastCommit || '';
      const bDate = b.github?.lastCommit || '';
      return bDate.localeCompare(aDate);
    });

    return result;
  }, [projects, search, selectedCategories, selectedFeatures, sort]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 mb-8 sm:mb-10">
        {/* Search Bar */}
        <div className="relative w-full">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
             <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           <input
            type="text"
            placeholder={`Search ${projects.length} projects...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-14 pl-12 pr-4 text-base sm:text-lg bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-xl sm:rounded-2xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#3165D4] focus:ring-1 focus:ring-[#3165D4]/30 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Categories
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-background)] border-transparent'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                  }`}
                >
                  {formatCategory(category)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
            Features
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VERUS_FEATURES.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-background)] border-transparent'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort + Clear Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-7 px-2 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-border-strong)] transition-colors cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-12 sm:py-16 text-center border border-dashed border-[var(--color-border)] rounded-xl">
          <p className="text-[var(--color-text-muted)] text-sm">No projects found.</p>
          <button 
            onClick={clearAllFilters}
            className="mt-2 text-[var(--color-text-secondary)] text-xs hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
