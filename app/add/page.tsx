/**
 * Add Project page
 * Instructions for submitting a project via pull request, theme-aware
 * 
 * Updated: Increased Field Reference grid column width from 120px to 140px/160px
 * and gap from 2 to 4 for better spacing, especially for longDescription field.
 */

'use client';

export default function AddPage() {
  const templateUrl = 'https://github.com/Meyse/Verus-Commons/blob/main/data/projects/_template.yaml';
  const rawTemplateUrl = 'https://raw.githubusercontent.com/Meyse/Verus-Commons/main/data/projects/_template.yaml';

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
                    href="https://github.com/Meyse/Verus-Commons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3165D4]"
                  >
                    github.com/Meyse/Verus-Commons
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
                <span className="text-[var(--color-text-primary)]">Add images (optional)</span>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Create a folder at{' '}
                  <code className="text-xs bg-[var(--color-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    public/images/projects/your-slug/
                  </code>
                  {' '}and add logo.png, screenshot1.png, etc.
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
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            YAML Template
          </h2>
          <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-4">
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Use our template file as a starting point. Copy it, rename it to your project slug, and fill in the details.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={templateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-[#3165D4] text-white rounded-lg hover:bg-[#2855b8] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Template on GitHub
              </a>
              <a
                href={rawTemplateUrl}
                download="_template.yaml"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template
              </a>
            </div>
          </div>
        </section>

        {/* Field Reference */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Field Reference
          </h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">name</code>
              <span className="text-[var(--color-text-muted)]">Display name of your project, max 60 characters</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">slug</code>
              <span className="text-[var(--color-text-muted)]">URL-friendly identifier (lowercase, hyphens only), max 50 characters</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">description</code>
              <span className="text-[var(--color-text-muted)]">Short one-liner, max 200 characters</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">longDescription</code>
              <span className="text-[var(--color-text-muted)]">Full description with Markdown support, max 10,000 characters</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">category</code>
              <span className="text-[var(--color-text-muted)]">wallet | app | dashboard | tool | library | other</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">repo</code>
              <span className="text-[var(--color-text-muted)]">GitHub repository URL</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">liveUrl</code>
              <span className="text-[var(--color-text-muted)]">Website URL (optional)</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">verusFeatures</code>
              <span className="text-[var(--color-text-muted)]">List of Verus features used (see below)</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">images</code>
              <span className="text-[var(--color-text-muted)]">Auto-detected from public/images/projects/your-slug/ (optional)</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-4">
              <code className="text-[var(--color-text-primary)]">maintainer</code>
              <span className="text-[var(--color-text-muted)]">Your GitHub username, max 100 characters</span>
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
              'Zero-knowledge privacy',
              'Marketplace',
              'Data',
              'PBaaS-chain',
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
          </ul>
        </section>

        {/* Asset Guidelines */}
        <section>
          <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Asset Guidelines
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-[var(--color-text-primary)] font-medium mb-2">Logo</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• 128×128 pixels</li>
                <li>• PNG format</li>
                <li>• Solid background (no transparency)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[var(--color-text-primary)] font-medium mb-2">Screenshots</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• Maximum 6 images</li>
                <li>• PNG or JPG format</li>
                <li>• Max 1MB per image</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
