# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing

- `npm test` - Run all Playwright tests
- `npm run test:headed` - Run tests with browser UI visible
- `npm run test:ui-mode` - Run tests in Playwright UI mode
- `npm run show-report` - Display test report
- `npm run test:tag` - Run specific tagged tests (@GAD-R01-01|@GAD-R01-03)

### Code Quality

- `npm run lint` - Run ESLint with zero warnings allowed
- `npm run tsc:check` - Run TypeScript compiler check
- `npm run format:text` - Format code with Prettier
- `npm run format:check` - Check formatting without making changes

### Application

- `npm run start:gad` - Start GAD application in Docker container

## Project Architecture

This is a Playwright TypeScript test automation framework for testing the GAD (Gaj-Akademia-Dobrego) web application.

### Source Structure (`src/`)

- **`api/`** - API test utilities and models
  - `assertions/`, `factories/`, `models/`, `utils/`
- **`ui/`** - UI test framework components
  - `pages/` - Page Object Model classes
  - `components/` - Reusable UI components (e.g., main menu)
  - `views/` - Modal dialogs and popups without dedicated URLs
  - `models/` - TypeScript interfaces for data structures
  - `factories/` - Test data generation using faker.js
  - `fixtures/` - Playwright test fixtures
  - `utils/` - Utility functions (e.g., wait helpers)
  - `test-data/` - Static test data

### Test Structure (`tests/`)

- **`api/`** - API integration tests
- **`ui/`** - UI test suites organized by test type:
  - `smoke/` - Basic functionality tests
  - `integration/` - Feature integration tests
  - `end-to-end/` - Complete workflow tests
  - `setup/` - Authentication and setup scripts

### Key Configuration Files

- **`playwright.config.ts`** - Multi-project configuration with separate projects for API, logged/non-logged users
- **`tsconfig.json`** - TypeScript configuration with path aliases (@\_src/, @\_config/, @\_pw-config)
- **`eslint.config.mjs`** - ESLint rules including Playwright plugin and explicit function return types
- **`.prettierrc.json`** - Code formatting rules
- **`.husky/pre-commit`** - Pre-commit hooks running lint, format check, and TypeScript compilation

### Test Patterns

- **AAA Pattern**: Arrange-Act-Assert structure
- **Page Object Model**: Separate page classes with locators and methods
- **Tagged Tests**: Use @login, @smoke, @GAD-R01-01 etc. for test categorization
- **Fixtures**: Custom test fixtures for page objects and setup
- **Session Management**: Authentication state stored in `tmp/session.json`

### Environment Setup

- Environment variables configured in `.env` file (copied from `.env-template`)
- Global setup in `config/global.setup.ts`
- Base URL and credentials loaded from environment config

### Code Standards

- TypeScript with strict mode enabled
- ESLint enforces explicit function return types and no console statements
- Prettier formatting with single quotes and 120-character line width
- Husky pre-commit hooks ensure code quality before commits
- Import path aliases for cleaner imports (`@_src/`, `@_config/`)

### Testing Features

- Multi-browser support (Chrome desktop, iPhone emulation)
- Parallel test execution
- Visual debugging with traces and screenshots on failure
- API response validation and mocking capabilities
- Test data generation with faker.js library
