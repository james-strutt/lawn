# LAWN - Property Intelligence for the Rest of Us

**Every number. Exposed.**

LAWN is a standalone property intelligence web application for first home buyers and property investors in NSW, Australia. Built with a distinctive brutalist design aesthetic, LAWN provides transparent property analysis without the fluff.

## Features

- 🗺️ **Direct Mapbox Integration** - No iframe dependencies, full control over map rendering
- 💰 **Financial Calculators**
  - NSW Stamp Duty calculator with FHB exemptions
  - Mortgage repayment calculator
  - Rental yield analysis
  - Land tax calculator
  - Cashflow projections
- 🏠 **Property Intelligence**
  - Zoning, FSR, HOB data
  - Flood, bushfire, heritage overlays
  - Amenity distance calculations
  - Sales history
- 🎨 **Brutalist Design System** - Monospace typography, thick borders, hard shadows, high contrast
- 📊 **Real-time NSW Government Data** - Direct API integration with NSW Planning Portal, Spatial Services, Transport NSW

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (brutalist custom theme)
- **Map**: Mapbox GL JS 3.x
- **State**: Zustand + TanStack Query
- **Auth/DB**: Supabase
- **Payments**: Stripe
- **Spatial**: Turf.js, proj4
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Mapbox account and API token
- Supabase project (for auth/database)
- Stripe account (for payments, optional for development)

### Installation

1. Clone the repository:
   \`\`\`bash
   cd /home/user/landiq-labs/lawn
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Add your API keys to \`.env\`:
   - \`VITE_MAPBOX_TOKEN\` - Get from [Mapbox](https://account.mapbox.com/)
   - \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` - Get from your [Supabase project](https://app.supabase.com/)
   - \`VITE_STRIPE_PUBLISHABLE_KEY\` - Get from [Stripe Dashboard](https://dashboard.stripe.com/)

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

\`\`\`
lawn/
├── src/
│   ├── app/                    # App shell, routing, providers
│   ├── components/
│   │   ├── brutal/             # Brutalist design system components
│   │   ├── map/                # Mapbox components
│   │   ├── nav/                # Navigation components
│   │   ├── property/           # Property display components
│   │   └── financial/          # Financial calculator UI
│   ├── pages/                  # Route pages
│   ├── stores/                 # Zustand state stores
│   ├── utils/
│   │   ├── financial/          # Financial calculation utilities
│   │   └── geometry/           # Spatial utilities
│   ├── constants/              # Constants and configuration
│   ├── lib/                    # Shared utilities
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── package.json
\`\`\`

## Key Design Principles

### Brutalist Aesthetic
- **No rounded corners** - Everything is square
- **Hard shadows** - 4px 4px 0px 0px #000
- **Thick borders** - 3px solid black
- **Monospace fonts** - Space Mono, IBM Plex Mono
- **High contrast** - Black borders, white backgrounds
- **No gradients** - Solid colors only

### Data Transparency
- Show all calculations with "show working" toggles
- Display data sources prominently
- No hidden fees or costs
- Real-time government data, no black box algorithms

### Performance
- Sub-2s initial load
- Sub-500ms map interactions
- Aggressive caching with TanStack Query
- Code splitting for large dependencies

## Financial Calculators

All financial calculators are based on 2025-26 NSW rates and regulations:

- **Stamp Duty**: Includes FHB exemptions (full up to $800k, partial to $1M)
- **Land Tax**: NSW thresholds with foreign surcharge calculations
- **Mortgage**: P&I and interest-only calculations
- **LMI**: Lenders Mortgage Insurance estimation
- **Rental Yield**: Gross/net yield with expense projections

## Code Reuse from landiq-labs

LAWN reuses substantial domain logic from the parent landiq-labs platform:

- Financial calculation engines (stamp duty, land tax, tax position)
- Spatial utilities (Turf.js operations, coordinate transforms)
- Type definitions (property features, planning data, financial metrics)
- NSW government API endpoints and service configurations

**Key Difference**: LAWN does NOT use the Land iQ proprietary database. All property intelligence is computed in real-time from public NSW government APIs.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## Environment Variables

See \`.env.example\` for all required environment variables.

## License

Copyright © 2026 Lawn. All rights reserved.

## Contributing

This is a private project. For questions or issues, contact the development team.

---

**Built in Sydney** 🇦🇺

*"Having your own lawn is the Australian dream. We're here to make it real."*
