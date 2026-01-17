/**
 * Add Project page
 * Instructions for submitting a project via pull request, theme-aware
 * 
 * Updated: Improved instructions, added copy button for YAML template, clearer file placement guide
 */

'use client';

import { useState } from 'react';

export default function AddPage() {
  const [copied, setCopied] = useState(false);

  const yamlTemplate = `name: "Your Project Name"
slug: "your-project-name"
description: "Short one-liner describing your project"
longDescription: |
  Full description here. Markdown is supported.
  
  Explain what your project does and how it uses Verus.

category: "app"
repo: "https://github.com/username/repo"
liveUrl: "https://yourapp.com"

verusFeatures:
  - VerusID
  - DeFi

logo: "your-project-name.png"

screenshots:
  - screenshot-1.png
  - screenshot-2.png

maintainer: "your-github-username"`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">Add your project</h1>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8">
        Submit your open-source Verus project to be listed in the commons directory.
      </p>

      <div className="space-y-10">
        {/* Steps */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            How to submit
          </h2>
          <ol className="space-y-4 text-sm text-[var(--color-text-secondary)]">
            <li className="flex gap-3">
              <span className="text-[var(--color-text-muted)] font-medium">1.</span>
              <div>
                <span className="text-[var(--color-text-primary)]">Fork the repository</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Fork{' '}
                  <a
                    href="https://github.com/veruscoin/commons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3165D4]"
                  >
                    github.com/veruscoin/commons
                  </a>{' '}
                  to your GitHub account.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-text-muted)] font-medium">2.</span>
              <div>
                <span className="text-[var(--color-text-primary)]">Create your project YAML file</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Add a new file at{' '}
                  <code className="text-xs bg-[var(--color-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    data/projects/your-project-slug.yaml
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-text-muted)] font-medium">3.</span>
              <div>
                <span className="text-[var(--color-text-primary)]">Add your logo (optional)</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Place your logo at{' '}
                  <code className="text-xs bg-[var(--color-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    public/logos/your-project-name.png
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-text-muted)] font-medium">4.</span>
              <div>
                <span className="text-[var(--color-text-primary)]">Add screenshots (optional)</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Create a folder and add images at{' '}
                  <code className="text-xs bg-[var(--color-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    public/screenshots/your-project-slug/
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-text-muted)] font-medium">5.</span>
              <div>
                <span className="text-[var(--color-text-primary)]">Submit a pull request</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Open a PR to the main repository. We&apos;ll review and merge it.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Template */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              YAML Template
            </h2>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] rounded border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-4 text-sm text-[var(--color-text-secondary)] overflow-x-auto">
            <code>{yamlTemplate}</code>
          </pre>
        </section>

        {/* Field Reference */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Field Reference
          </h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">name</code>
              <span className="text-[var(--color-text-muted)]">Display name of your project</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">slug</code>
              <span className="text-[var(--color-text-muted)]">URL-friendly identifier (lowercase, hyphens only)</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">description</code>
              <span className="text-[var(--color-text-muted)]">Short one-liner, max 100 characters</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">longDescription</code>
              <span className="text-[var(--color-text-muted)]">Full description with Markdown support</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">category</code>
              <span className="text-[var(--color-text-muted)]">wallet | app | dashboard | tool | library | other</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">repo</code>
              <span className="text-[var(--color-text-muted)]">GitHub repository URL</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">liveUrl</code>
              <span className="text-[var(--color-text-muted)]">Website URL (optional)</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">verusFeatures</code>
              <span className="text-[var(--color-text-muted)]">List of Verus features used (see below)</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">logo</code>
              <span className="text-[var(--color-text-muted)]">Filename only, placed in public/logos/ (optional)</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">screenshots</code>
              <span className="text-[var(--color-text-muted)]">List of filenames in public/screenshots/your-slug/ (optional)</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <code className="text-[var(--color-text-primary)]">maintainer</code>
              <span className="text-[var(--color-text-muted)]">Your GitHub username</span>
            </div>
          </div>
        </section>

        {/* Features list */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Verus Features
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Select all features your project uses:
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-[var(--color-text-secondary)]">
            {[
              'VerusID',
              'Currencies',
              'DeFi',
              'Cross-chain',
              'Zero-knowledge',
              'Marketplace',
              'Data',
              'Blockchain',
              'Staking',
              'Mining',
            ].map((f) => (
              <span key={f} className="px-2 py-1 bg-[var(--color-surface-elevated)] rounded border border-[var(--color-border)]">
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Requirements
          </h2>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-text-muted)]">•</span>
              <span>Project must be open source with a public repository</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-text-muted)]">•</span>
              <span>Must integrate with Verus Protocol in some way</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-text-muted)]">•</span>
              <span>Logo should be 256×256 PNG with a solid background (no transparency)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-text-muted)]">•</span>
              <span>Screenshots should be high-quality PNG or JPG images</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
