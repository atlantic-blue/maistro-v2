# Maistro V2

AI-powered idea validation platform. Help entrepreneurs test business ideas quickly by generating landing pages, capturing signups, and validating demand.

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript (strict mode)
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, shadcn/ui
- **Backend:** AWS Lambda (Node.js 20.x)
- **Database:** DynamoDB (single-table design)
- **Auth:** AWS Cognito
- **Infrastructure:** Terraform
- **AI:** OpenAI API (GPT-4)
- **Payments:** Stripe
- **CDN:** CloudFront
- **DNS:** Route 53

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- AWS CLI configured
- Terraform 1.5+

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

## Project Structure

```
maistro-v2/
├── packages/           # Shared libraries
│   ├── ui/            # React components (shadcn)
│   ├── types/         # Shared TypeScript types
│   ├── utils/         # Common utilities
│   ├── ai/            # OpenAI utilities
│   └── db/            # DynamoDB client & queries
│
├── platform/          # Core platform services
│   ├── backend/       # Auth, users, billing
│   └── infra/         # Core infrastructure
│
├── portals/           # User-facing apps
│   ├── web/           # Main dashboard (Next.js)
│   ├── admin/         # Admin dashboard
│   └── landing/       # Public marketing site
│
├── products/          # Individual products
│   ├── validate/      # Core validation product
│   ├── boost/         # Ad/traffic product
│   └── analytics/     # Analytics product
│
└── infrastructure/    # Global Terraform
    ├── environments/  # dev, staging, prod
    └── modules/       # Reusable modules
```

## Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm test             # Run all tests
pnpm deploy:dev       # Deploy to dev environment
```

## Core Flow

1. **Create Project** - User describes their business idea
2. **Generate Landing Page** - AI creates a landing page
3. **Publish** - Page goes live at `slug.maistro.live`
4. **Capture Signups** - Visitors can sign up
5. **View Analytics** - Dashboard shows validation metrics

## License

Proprietary - All rights reserved
