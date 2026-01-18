/**
 * InstallCommand component
 * Client-side component for displaying and copying install commands
 * 
 * Created: Extracted install command copy functionality for use in server components
 */

'use client';

import { useState } from 'react';

interface InstallCommandProps {
  command: string;
  className?: string;
}

export function InstallCommand({ command, className = '' }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyCommand}
      className={`group flex items-center justify-between gap-3 w-full px-3 py-2 text-sm font-mono bg-[var(--color-background)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors ${className}`}
      title="Click to copy"
    >
      <span className="flex items-center gap-2 truncate">
        <span className="text-[var(--color-text-muted)]">$</span>
        <span className="truncate">{command}</span>
      </span>
      <span className="shrink-0">
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}
