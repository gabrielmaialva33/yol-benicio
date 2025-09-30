# YOL Benício - Development Guidelines

## Project Overview
YOL Benício is a React 19 + TypeScript web application built with Vite, featuring a dashboard-based legal case management system. The project uses modern development practices including comprehensive testing, API mocking, and strict code quality standards.

## Build/Configuration Instructions

### Package Manager
- **Required**: pnpm 10.11.1+ (specified in `packageManager` field)
- Install dependencies: `pnpm install`

### Development Server
```bash
pnpm dev  # Starts development server on http://localhost:5173 with auto-open
```

### Build Process
```bash
pnpm prebuild  # Initializes MSW in public/ directory
pnpm build     # Creates production build
pnpm preview   # Preview production build locally
```

### Key Configuration Files
- **Vite**: Uses GitHub Pages deployment base (`/yol-benicio/`)
- **API Proxy**: Development server proxies `/api` requests to `http://localhost:3333`
- **TypeScript**: Project references structure with separate app/node configurations
- **MSW**: Mock Service Worker for API mocking (required for build)

### Path Aliases (tsconfig.app.json)
```
@features/*  → src/features/*
@shared/*    → src/shared/*
@ui/*        → src/shared/ui/*
@hooks/*     → src/shared/hooks/*
@types/*     → src/shared/types/*
@mocks/*     → src/mocks/*
@app/*       → src/app/*
```

## Testing Information

### Testing Stack
- **Unit Tests**: Vitest + React Testing Library + Happy DOM
- **E2E Tests**: Playwright (Chrome, Firefox, Safari, Mobile)
- **API Mocking**: MSW (Mock Service Worker)
- **Coverage**: V8 provider with strict thresholds

### Running Tests

#### Unit Tests
```bash
pnpm test           # Run tests in watch mode
pnpm test:ci        # Run tests once (CI mode)
```

#### E2E Tests
```bash
pnpm test:e2e       # Run E2E tests headless (CI)
pnpm test:e2e:headed # Run E2E tests with browser UI
pnpm test:e2e:ui    # Run with Playwright UI
pnpm test:e2e:debug # Run in debug mode
```

#### Comprehensive Validation
```bash
pnpm validate  # Runs linting, unit tests, and E2E tests
```

### Test Configuration Details

#### Unit Test Setup (vitest)
- **Environment**: Happy DOM
- **Globals**: Enabled for describe/it/expect
- **Setup**: `src/test-setup.ts` configures MSW server
- **Coverage Thresholds**:
  - Lines: 10%
  - Functions: 15%
  - Branches: 25%
  - Statements: 10%
- **Test Files**: `src/**/*.test.ts(x)`

#### E2E Test Setup (Playwright)
- **Browsers**: Chrome, Firefox, Safari (Desktop + Mobile)
- **Base URL**: `http://localhost:5173`
- **Test Directory**: `./tests/`
- **Auto Server**: Starts dev server automatically
- **Retries**: 2 in CI, 0 in development

### Test Patterns & Examples

#### Unit Test Example
```typescript
import {describe, it, expect, beforeEach, vi} from 'vitest'
import {formatUserName} from './example-util'

describe('formatUserName', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2024-01-15')) // Deterministic dates
  })

  it('should format full name correctly', () => {
    const result = formatUserName('João', 'Silva')
    expect(result).toBe('João Silva')
  })
})
```

#### E2E Test Example
```typescript
import {expect, test} from '@playwright/test'

test.describe('Feature', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/yol-benicio/')
    // Login setup if needed
  })

  test('should perform user action', async ({page}) => {
    await expect(page.getByRole('button', {name: 'Action'})).toBeVisible()
    await page.getByRole('button', {name: 'Action'}).click()
    await expect(page).toHaveURL('/expected-path')
  })
})
```

### MSW Integration
- **Setup**: Configured in `src/test-setup.ts`
- **Handlers**: Located in `src/mocks/handlers/`
- **Data**: Mock data in `src/mocks/data/`
- **Usage**: Automatically available in all tests

## Code Style & Development Conventions

### Code Formatter & Linter
- **Tool**: Biome (replaces ESLint + Prettier)
- **Commands**:
  ```bash
  pnpm lint:biome    # Check and fix code style
  pnpm format        # Format code
  pnpm lint:tsc      # TypeScript type checking
  pnpm lint          # Run all linting
  ```

### Code Style Rules
- **Indentation**: Tabs
- **Quotes**: Single quotes, single quotes in JSX
- **Semicolons**: As needed (minimal)
- **Arrow Functions**: Parentheses as needed
- **Trailing Commas**: None
- **Bracket Spacing**: None `{foo}` not `{ foo }`

### File Naming Conventions
- **Allowed Formats**: camelCase, kebab-case, PascalCase
- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Test Files**: `*.test.ts(x)` or `*.spec.ts`

### TypeScript Configuration
- **Strict Mode**: Enabled with additional strict options
- **Notable Settings**:
  - `exactOptionalPropertyTypes: true`
  - `noUncheckedIndexedAccess: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`

### Project Architecture

#### Feature-Based Structure
```
src/
├── features/          # Feature modules
│   ├── auth/         # Authentication
│   ├── dashboard/    # Main dashboard
│   └── folders/      # Folder management
├── shared/           # Shared utilities
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom hooks
│   ├── contexts/     # React contexts
│   ├── types/        # TypeScript definitions
│   ├── ui/          # UI primitives
│   └── utils/       # Utility functions
├── mocks/           # MSW mock setup
└── app/             # App configuration
```

#### Component Co-location
- Place test files next to source files
- Keep related files together in feature directories
- Use index files for clean imports

### Development Best Practices

#### Testing
- **Test File Location**: Co-locate with source (`Component.tsx` → `Component.test.tsx`)
- **Mock Strategy**: Use MSW for API calls, vi.mock for modules
- **Test Descriptions**: Use Portuguese for UI text, English for logic
- **Async Testing**: Use `findBy*` queries for async elements

#### Error Handling
- Use Error Boundaries for component-level error handling
- Implement proper loading states
- Handle network errors gracefully

#### State Management
- React Query (TanStack Query) for server state
- React Context for global client state
- Local state with useState/useReducer

#### Styling
- **Framework**: Tailwind CSS 4.x
- **Animations**: tailwindcss-animate
- **Icons**: Lucide React

### Development Workflow

#### Before Committing
```bash
pnpm validate  # Runs linting, type checking, and all tests
```

#### Adding New Features
1. Create feature directory under `src/features/`
2. Add components, hooks, and types
3. Write unit tests for logic
4. Add E2E tests for user flows
5. Update mock data if needed

#### API Integration
- Development: Uses MSW mocks
- Production: Real API endpoints
- Proxy setup handles `/api` routing in development

### Common Issues & Solutions

#### MSW Not Working
- Ensure `pnpm prebuild` was run
- Check `public/mockServiceWorker.js` exists
- Verify handlers are properly registered

#### Tests Failing in CI
- Check coverage thresholds in `vite.config.ts`
- Ensure deterministic test data (mock dates/times)
- Verify MSW handlers cover all API calls

#### Build Errors
- Run `pnpm lint:tsc` to catch TypeScript issues
- Ensure all imports use correct path aliases
- Check that MSW is properly initialized

### Performance Considerations
- Lazy load feature modules using React.lazy()
- Optimize bundle size with proper imports
- Use React Query for efficient data fetching
- Implement proper loading states for better UX

---

*Generated on 2025-09-29 for advanced developers working on the YOL Benício project.*
