# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YOL-BENICIO is a legal services management platform for Benício Advogados, built with React, TypeScript, and Vite. The application features a dashboard-based interface for managing legal folders, clients, tasks, and other law firm operations.

## Development Commands

### Core Development
```bash
pnpm dev                  # Start development server (opens browser automatically)
pnpm build                # Build for production
pnpm preview              # Preview production build
```

### Testing
```bash
pnpm test                 # Run unit tests in watch mode (Vitest)
pnpm test:ci              # Run unit tests in CI mode
pnpm test:e2e             # Run E2E tests with Playwright UI
pnpm test:e2e:ci          # Run E2E tests in CI mode
pnpm test:e2e:headed      # Run E2E tests in headed mode
pnpm test:e2e:debug       # Debug E2E tests
```

### Code Quality
```bash
pnpm lint                 # Run all linters (TypeScript + Biome)
pnpm lint:tsc             # TypeScript type checking
pnpm lint:biome           # Biome linting with auto-fix
pnpm format               # Format code with Biome
pnpm validate             # Full validation: lint + test:ci + test:e2e:ci
```

## Architecture

### Application Structure
The app follows a feature-based architecture with lazy-loaded routes:

- **Entry Point**: `src/main.tsx` - Sets up React Query, Router, and MSW for mocking
- **Routing**: `src/app/router.tsx` - Lazy-loaded routes with code splitting
- **Features**: Domain-specific modules in `src/features/`
  - `auth/` - Login authentication
  - `dashboard/` - Main dashboard with sidebar navigation and widgets
  - `folders/` - Legal folder management (consultation, registration, details)

### State Management
- **React Query**: Server state management with caching
- **Custom Hooks**: Feature-specific hooks for data fetching and business logic
- **MSW**: Mock Service Worker for API mocking in development and GitHub Pages deployment

### Testing Strategy
- **Unit Tests**: Vitest + Testing Library for components and utilities
- **E2E Tests**: Playwright for cross-browser testing (Chrome, Firefox, Safari, mobile)
- **Coverage**: Configured thresholds in `vite.config.ts`

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS with Vite integration
- **Biome**: Code formatting and linting with strict rules
- **Responsive Design**: Mobile-first approach with dedicated mobile E2E tests

### Key Configuration Files
- `vite.config.ts`: Build tool configuration with test setup
- `biome.json`: Formatting and linting rules
- `playwright.config.ts`: E2E test configuration
- `tsconfig.json`: TypeScript configuration with project references

### API Mocking
The application uses MSW (Mock Service Worker) for API simulation:
- Mock handlers in `src/mocks/handlers/`
- Data generators in `src/mocks/generators/`
- Automatically enabled in development and GitHub Pages deployment

### Deployment
- **Base Path**: `/yol-benicio/` for GitHub Pages deployment
- **Public Assets**: Icons, logos, and manifest in `public/`
- **Service Worker**: MSW setup for mock API responses