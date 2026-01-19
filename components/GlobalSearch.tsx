/**
 * GlobalSearch component
 * Prominent search bar with instant overlay results
 * 
 * Features:
 * - Instant search results in overlay
 * - Keyboard navigation (arrows, enter, escape)
 * - "/" shortcut to focus
 * - Mobile full-screen takeover
 * - Click outside to close
 * 
 * Updated: Uses Next.js Image for optimized logo loading
 */

'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Project } from '@/types/project';
import { stringToColor, getInitials } from '@/lib/utils';

interface GlobalSearchProps {
  projects: Project[];
}

export function GlobalSearch({ projects }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter projects based on query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.verusFeatures.some(f => f.toLowerCase().includes(q)) ||
          p.github?.languages.some(l => l.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 6); // Limit to 6 results
  }, [query, projects]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Open overlay when typing
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query]);

  // Global "/" shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to project
  const navigateToProject = useCallback((slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${slug}`);
  }, [router]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToProject(results[selectedIndex].slug);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-[70]">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none">
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-muted)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-12 text-base sm:text-lg bg-[var(--color-surface)] border-2 border-[var(--color-border-strong)] rounded-2xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#3165D4] focus:ring-2 focus:ring-[#3165D4]/20 transition-all shadow-sm"
        />
        {/* Keyboard shortcut hint */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          {!query && (
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md">
              /
            </kbd>
          )}
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="pointer-events-auto p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results Overlay */}
      {isOpen && query.trim() && (
        <>
          {/* Backdrop - covers everything including header */}
          <div 
            className="fixed inset-0 bg-black/50 sm:bg-black/20 z-[60]" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Results dropdown - above backdrop */}
          <div className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:inset-x-auto sm:left-0 sm:right-0 sm:top-full sm:mt-2 z-[70]">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-strong)] sm:rounded-xl rounded-t-2xl shadow-2xl max-h-[70vh] sm:max-h-[400px] overflow-hidden flex flex-col">
              {/* Mobile header */}
              <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'No results'}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Results list */}
              <div className="overflow-y-auto flex-1">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--color-text-muted)] text-sm">
                    No projects found for "{query}"
                  </div>
                ) : (
                  <ul className="py-2">
                    {results.map((project, index) => (
                      <li key={project.slug}>
                        <button
                          onClick={() => navigateToProject(project.slug)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                            index === selectedIndex
                              ? 'bg-[var(--color-surface-elevated)]'
                              : 'hover:bg-[var(--color-surface-elevated)]'
                          }`}
                        >
                          {/* Project icon/logo */}
                          {project.logo ? (
                            <Image 
                              src={`/logos/${project.logo}`} 
                              alt="" 
                              width={80}
                              height={80}
                              className="w-10 h-10 rounded-lg object-cover bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shrink-0"
                            />
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium border border-[var(--color-border)] shrink-0"
                              style={{ backgroundColor: stringToColor(project.name) }}
                            >
                              {getInitials(project.name)}
                            </div>
                          )}
                          
                          {/* Project info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--color-text-primary)] truncate">
                                {project.name}
                              </span>
                              <span className="text-xs text-[var(--color-text-muted)] capitalize shrink-0">
                                {project.category}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)] truncate mt-0.5">
                              {project.description}
                            </p>
                          </div>

                          {/* Arrow indicator */}
                          {index === selectedIndex && (
                            <svg 
                              className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 mt-1" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer hint */}
              {results.length > 0 && (
                <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded mr-1">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded mr-1">↓</kbd>
                    to navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded mr-1">↵</kbd>
                    to select
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
