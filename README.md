# Verus Commons

A community-curated directory of open-source projects built on the [Verus Protocol](https://verus.io). Browse apps, wallets, libraries, and tools that integrate with Verus—and submit your own.

## About

Verus Commons serves as the central hub for discovering ecosystem projects. It provides:

- **Project Directory** — Browse all open-source Verus projects with search and filtering
- **Developer Resources** — Find libraries and tools to build your own Verus integrations
- **Featured Section** — Highlighted apps, wallets, and dashboards rotate daily
- **Maintainer Pages** — View all projects by a specific contributor
- **JSON API** — Download the complete project registry at `/api/projects.json`

## Featured Projects

Projects in the `app`, `wallet`, or `dashboard` categories can appear in the Featured section on the homepage. To be eligible:

1. Your project must have `category: "app"`, `category: "wallet"`, or `category: "dashboard"`
2. Add a featured banner image at `public/images/projects/{your-slug}/featured.png`
   - Dimensions: 800 × 300 pixels
   - Format: PNG or JPG
   - Max size: 300KB

**How rotation works:** Eligible projects are randomly shuffled daily using a date-seeded algorithm (UTC). Three projects are displayed at a time, and all eligible projects get equal opportunity to be featured over time.

## Adding Your Project

### Quick Start

1. **Fork** this repository: [github.com/Meyse/Verus-Commons](https://github.com/Meyse/Verus-Commons)
2. **Copy** the template: `data/projects/_template.yaml`
3. **Rename** to your project slug: `data/projects/your-project-slug.yaml`
4. **Fill in** the required fields
5. **Add images** (optional): Create `public/images/projects/your-slug/`
6. **Submit** a pull request

### YAML Schema

```yaml
# Required fields
name: "Your Project Name"              # Max 60 characters
slug: "your-project-slug"              # Lowercase, hyphens only, max 50 chars
description: "Short one-liner"         # Max 200 characters
longDescription: |                     # Markdown supported, max 10,000 chars
  Full description with features, usage, etc.
category: "app"                        # wallet | app | dashboard | tool | library | other
repo: "https://github.com/you/repo"    # GitHub URL (required)
verusFeatures:                         # At least one required
  - VerusID

# Optional fields
liveUrl: "https://your-app.com"
docsUrl: "https://docs.your-app.com"
maintainer: "your-github-username"     # Defaults to repo owner
```

### Project Categories

| Category | Description |
|----------|-------------|
| `wallet` | Cryptocurrency wallets with Verus support |
| `app` | End-user applications |
| `dashboard` | Analytics, explorers, monitoring tools |
| `tool` | Developer utilities, CLI tools, scripts |
| `library` | SDKs, APIs, code libraries |
| `other` | Anything that doesn't fit above |

### Verus Features

Tag your project with the Verus Protocol features it uses:

- `VerusID` — Decentralized identity
- `Currencies` — Multi-currency support
- `DeFi` — Decentralized finance features
- `Cross-chain` — Bridge and cross-chain operations
- `Zero-knowledge privacy` — Privacy features
- `Marketplace` — NFT or marketplace functionality
- `Data` — On-chain data storage
- `PBaaS-chain` — Public Blockchains as a Service
- `Staking` — Proof-of-stake functionality
- `Mining` — Mining-related features

### Images

All images are auto-detected from `public/images/projects/{your-slug}/`:

| File | Purpose | Specs |
|------|---------|-------|
| `logo.png` | Project logo | 128×128px |
| `screenshot1.png` ... `screenshot6.png` | Gallery images | Max 1MB each |
| `featured.png` | Homepage banner | 800×300px, max 300KB |

JPG format is also supported for all image types.

## Development

### Prerequisites

- Node.js 18+
- Yarn

### Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Project Structure

```
├── app/                    # Next.js app router pages
│   ├── [slug]/            # Individual project pages
│   ├── add/               # Submit project instructions
│   ├── maintainer/[name]/ # Maintainer profile pages
│   └── api/               # API routes
├── components/            # React components
├── data/projects/         # Project YAML files
├── lib/                   # Utilities (GitHub API, validation, etc.)
├── public/images/         # Project logos and screenshots
└── types/                 # TypeScript definitions
```

### Key Files

- `lib/projects.ts` — Project loading, featured selection, daily rotation logic
- `lib/validation.ts` — Zod schemas for YAML validation
- `lib/github.ts` — GitHub API integration for stars, forks, etc.
- `types/project.ts` — TypeScript interfaces

### Environment Variables

No environment variables are required for basic development. GitHub API requests work without authentication but are rate-limited.

For higher rate limits, you can optionally set:

```env
GITHUB_TOKEN=your_personal_access_token
```

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Zod](https://zod.dev) — Schema validation
- [YAML](https://yaml.org) — Project data format

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

For adding projects, follow the submission process above.

## License

This project is open source. See individual project repositories for their respective licenses.
