/**
 * FilterBar component
 * Compact filtering with collapsible sections, language support, and URL persistence
 * 
 * Updated: Simplified - uses GitHub languages only for language filtering
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project, CATEGORIES, VERUS_FEATURES, Category, VerusFeature } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { ProjectTableRow } from './ProjectTableRow';

interface FilterBarProps {
  projects: Project[];
}

type SortOption = 'updated' | 'stars' | 'name';
type ViewMode = 'card' | 'table';

// Format category for display (capitalize first letter)
function formatCategory(category: Category): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Collapsible filter section component
function FilterSection({ 
  title, 
  isOpen, 
  onToggle, 
  activeCount,
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void;
  activeCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left group hover:bg-[var(--color-surface-elevated)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide group-hover:text-[var(--color-text-secondary)] transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#3165D4] text-white rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <svg 
          className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ projects }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    (searchParams.get('category')?.split(',').filter(Boolean) as Category[]) || []
  );
  const [selectedFeatures, setSelectedFeatures] = useState<VerusFeature[]>(
    (searchParams.get('features')?.split(',').filter(Boolean) as VerusFeature[]) || []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    searchParams.get('lang')?.split(',').filter(Boolean) || []
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'updated'
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'card'
  );

  // Collapsible section states - auto-expand if has active filters
  const [sectionsOpen, setSectionsOpen] = useState({
    categories: true, // Always start open
    features: (searchParams.get('features')?.split(',').filter(Boolean).length ?? 0) > 0,
    languages: (searchParams.get('lang')?.split(',').filter(Boolean).length ?? 0) > 0,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Compute unique languages from all projects (via GitHub)
  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach(p => {
      if (p.github?.languages) {
        p.github.languages.forEach(l => langs.add(l));
      }
    });
    return Array.from(langs).sort();
  }, [projects]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set('q', search);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
    if (selectedLanguages.length > 0) params.set('lang', selectedLanguages.join(','));
    if (sort !== 'updated') params.set('sort', sort);
    if (viewMode !== 'card') params.set('view', viewMode);
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/';
    
    // Use replace to avoid cluttering history
    router.replace(newUrl, { scroll: false });
  }, [search, selectedCategories, selectedFeatures, selectedLanguages, sort, viewMode, router]);

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

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedFeatures([]);
    setSelectedLanguages([]);
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedFeatures.length > 0 || selectedLanguages.length > 0;

  const filtered = useMemo(() => {
    let result = [...projects];

    // Enhanced search - includes languages and features
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.verusFeatures.some(f => f.toLowerCase().includes(q)) ||
          p.github?.languages.some(l => l.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
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

    // Languages (OR logic - matches any selected language)
    if (selectedLanguages.length > 0) {
      result = result.filter((p) => {
        const projectLangs = p.github?.languages || [];
        return selectedLanguages.some(l => projectLangs.includes(l));
      });
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
  }, [projects, search, selectedCategories, selectedFeatures, selectedLanguages, sort]);

  // Suggestion links for empty state
  const suggestLibraries = () => {
    setSelectedCategories(['library']);
    setSearch('');
    setSelectedFeatures([]);
    setSelectedLanguages([]);
  };

  const suggestApps = () => {
    setSelectedCategories(['app', 'wallet']);
    setSearch('');
    setSelectedFeatures([]);
    setSelectedLanguages([]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        {/* Compact Search Bar */}
        <div className="relative w-full max-w-sm">
           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
             <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           <input
            type="text"
            placeholder="Filter projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-2 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Collapsible Filters */}
        <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
          {/* Categories */}
          <FilterSection
            title="Categories"
            isOpen={sectionsOpen.categories}
            onToggle={() => toggleSection('categories')}
            activeCount={selectedCategories.length}
          >
            <div className="flex flex-wrap gap-1.5 px-3">
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
          </FilterSection>

          {/* Features */}
          <FilterSection
            title="Features"
            isOpen={sectionsOpen.features}
            onToggle={() => toggleSection('features')}
            activeCount={selectedFeatures.length}
          >
            <div className="flex flex-wrap gap-1.5 px-3">
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
          </FilterSection>

          {/* Languages */}
          {allLanguages.length > 0 && (
            <FilterSection
              title="Languages"
              isOpen={sectionsOpen.languages}
              onToggle={() => toggleSection('languages')}
              activeCount={selectedLanguages.length}
            >
              <div className="flex flex-wrap gap-1.5 px-3">
                {allLanguages.slice(0, 12).map((language) => {
                  const isSelected = selectedLanguages.includes(language);
                  return (
                    <button
                      key={language}
                      onClick={() => toggleLanguage(language)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-[#3165D4] text-white border-transparent'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      {language}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          )}
        </div>

        {/* Sort + View Toggle + Clear Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4">
            {/* Sort */}
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
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 border border-[var(--color-border)] rounded-md p-0.5">
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
                title="Card view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
                title="Table view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
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
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            No projects found{search ? ` matching "${search}"` : ''}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
            <span className="text-[var(--color-text-muted)]">Try:</span>
            <button 
              onClick={clearAllFilters}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Clear all filters
            </button>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">•</span>
            <button 
              onClick={suggestLibraries}
              className="text-[#3165D4] hover:underline"
            >
              Browse libraries
            </button>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">•</span>
            <button 
              onClick={suggestApps}
              className="text-[#3165D4] hover:underline"
            >
              Browse apps & wallets
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Project</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide hidden sm:table-cell">Language</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide hidden sm:table-cell">Stats</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <ProjectTableRow key={project.slug} project={project} />
              ))}
            </tbody>
          </table>
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
