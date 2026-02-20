# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lawn is a consumer-facing property intelligence web app ("property intelligence for the rest of us"). It provides property analysis tools including financial calculators (stamp duty, mortgage, rental yield), property comparison, report generation, and interactive map exploration. Built with React + TypeScript, deployed on Vercel with a Supabase backend and Stripe payments.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3001)
npm run dev

# Build for production
tsc && vite build

# Type checking (no emit)
npx tsc --noEmit

# Lint
npx eslint src/

# Run tests
npx vitest run

# Run tests with UI
npx vitest --ui

# Run tests with coverage
npx vitest --coverage
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with Brutal design system components
- **State**: Zustand (client state), React Query (server state)
- **Maps**: Mapbox GL JS + Turf.js + proj4
- **Backend**: Supabase (auth, database, RLS)
- **Payments**: Stripe
- **Charts**: Recharts
- **Testing**: Vitest + jsdom
- **Analytics**: PostHog
- **Deploy**: Vercel

## Project Structure

```
src/
├── app/                # App shell and router
├── components/
│   ├── brutal/         # Brutal design system (Button, Card, Input, etc.)
│   ├── financial/      # Financial calculators
│   ├── property/       # Property-specific components
│   └── reports/        # Report generation
├── constants/          # Shared constants (tax rates, etc.)
├── lib/                # Utility wrappers (cn, etc.)
├── pages/              # Route-level page components
├── services/           # External service integrations (Stripe, etc.)
├── stores/             # Zustand stores (property, user)
├── styles/             # Global CSS
└── utils/
    └── financial/      # Pure financial calculation functions
```

## Path Aliases

**Always use `@/` alias for imports from `src/`:**

```typescript
// ✅ Correct
import { BrutalButton } from '@/components/brutal/BrutalButton'
import { calculateStampDuty } from '@/utils/financial/stampDuty'

// ❌ Incorrect
import { BrutalButton } from '../../../components/brutal/BrutalButton'
```

## Code Quality Standards

### TypeScript

- **No `any` types** - Use proper typing or generics
- **Explicit return types** on exported functions; leverage inference internally
- **No type suppression comments** (`@ts-expect-error`, `@ts-ignore`, `eslint-disable`)
- **Prefix unused variables with `_`** to satisfy the linter
- **Use `??` over `||`** for nullish checks (avoids catching `0`, `''`, `false`)

### Code Style

- **Early returns and guard clauses** over nested conditionals
- **Optional chaining (`?.`) and nullish coalescing (`??`)** over verbose null checks
- **Destructuring** - Extract what you need upfront
- **Array methods** (`map`, `filter`, `find`, `reduce`) over imperative loops
- **Template literals** over string concatenation
- **`const` by default** - Only use `let` when reassignment is necessary

### React Patterns

- **Derive state, don't store it** - If computable from existing state/props, compute inline
- **Avoid unnecessary `useEffect`** - Prefer event handlers and render-time computation
- **Zustand** for client-side state (property selections, UI state)
- **React Query** for all server state - don't duplicate server data into local state
- **Every `useEffect` with side effects must clean up** (listeners, timers, subscriptions, map instances)

### Brutal Design System

Use components from `@/components/brutal/`:

- `BrutalButton`, `BrutalCard`, `BrutalInput`, `BrutalSelect`, `BrutalToggle`, `BrutalBadge`, `BrutalMetric`

Use Tailwind theme classes from `tailwind.config.js`:

```typescript
// ✅ Use theme classes
className="bg-brand-accent text-surface-primary shadow-brutal border-brutal"

// ❌ Don't hardcode design values
style={{ backgroundColor: '#146CFD', boxShadow: '4px 4px 0px 0px #000' }}
```

Use `cn()` from `@/lib/utils` for conditional class merging.

### File Organisation

- **≤500 lines per file** - Split if larger
- **<30 lines per function** - Split complex functions
- **One store per domain** (propertyStore, userStore)
- **Pure utility functions** in `@/utils/` (especially financial calculations)
- **Services** in `@/services/` for external API integrations

### Security

- **Never hardcode** API keys, secrets, or credentials
- **Environment variables**: `import.meta.env.VITE_*`
- **Supabase RLS** for data access control
- **Stripe server-side** for payment processing (never handle card details client-side)
- **Validate** all external inputs (form data, search text, coordinates)

### Forbidden Patterns

- `any` types
- Type suppression comments (`@ts-expect-error`, `@ts-ignore`, `eslint-disable`)
- Commented-out code blocks (use version control)
- TODO/FIXME/HACK comments
- Tutorial-style comments ("First, we fetch...", "Now let's update...")
- Generic names (`handleClick`, `processData`, `helperFunction`)
- Hardcoded design values (use Tailwind theme)
- Relative imports from `src/` (use `@/` alias)
- `console.log` in production code
- Duplicate logic that exists in `@/utils` or `@/services`

## Testing

Tests live in `__tests__/` mirroring the `src/` structure. Run with `npx vitest run`.

- **Financial utilities** have comprehensive test coverage (stamp duty, mortgage, rental yield)
- **Components** tested with React Testing Library patterns
- **Stores** tested in isolation

## Verification Checklist

After making changes:

```bash
npx tsc --noEmit          # No TypeScript errors
npx eslint src/           # No ESLint errors
npx vitest run            # All tests pass
```
