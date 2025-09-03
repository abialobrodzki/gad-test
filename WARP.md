# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository type: Playwright + TypeScript test automation framework for a demo web app (GAD). Uses dotenv, ESLint, Prettier, Husky.

- Node.js tooling: npm scripts in package.json
- Test runner: @playwright/test
- Language: TypeScript
- Path aliases: configured in tsconfig.json

Commands you’ll commonly use

- Install and prepare local environment

  - npm install
  - npx playwright install
  - cp .env-template .env # then set BASE_URL, USER_EMAIL, USER_PASSWORD

- Start local demo app (optional, if you want to run the GAD demo locally)

  - npm run start:gad # runs Docker image on http://localhost:3000

- Lint/format/type-check

  - npm run lint # ESLint (errors on console usage and missing explicit return types)
  - npm run format:text # Prettier write (with import sort plugin)
  - npm run format:check # Prettier check (excludes .ts per config)
  - npm run tsc:check # TypeScript noEmit strict check

- Run tests

  - npm test # run all tests
  - npm run test:headed # headed browser
  - npm run test:ui-mode # open Playwright UI mode (npm run test -- --ui)
  - npm run show-report # open last HTML report
  - npm run test:tag # example: runs tests tagged @GAD-R01-01 or @GAD-R01-03

- Useful Playwright invocations
  - npx playwright test tests/ui/integration/login.spec.ts # single file
  - npx playwright test -g "should login with valid credentials" # single test by title
  - npx playwright test --project=api # run only API project
  - npx playwright test --project=chromium-non-logged # UI without logged session
  - npx playwright test --project=chromium-logged # UI using storage state from setup
  - npx playwright test --grep "@login" # run by tag
  - npx playwright show-report

Environment and configuration

- Environment variables are required at runtime and validated:
  - BASE_URL, USER_EMAIL, USER_PASSWORD (see .env-template and config/env.config.ts)
- Path aliases (tsconfig.json):
  - @\_config/_ -> config/_
  - @\_pw-config -> playwright.config.ts
  - @\_src/_ -> src/_
- Husky pre-commit (enforced locally): runs lint, format:check, and tsc:check.

High-level architecture and test structure

- Runner configuration (playwright.config.ts)

  - Global constants: STORAGE_STATE (tmp/session.json), RESPONSE_TIMEOUT
  - globalSetup (config/global.setup.ts): clears existing storage state before tests
  - use.baseURL comes from env (BASE_URL) via config/env.config.ts (dotenv with required vars)
  - Reporter: HTML; Parallel: enabled; Retries: 0 (tune per CI if needed)
  - Projects:
    - api: tests under tests/api
    - chromium-non-logged: UI tests in tests/ui, grepInvert @logged
    - setup: matches \*.setup.ts (builds a logged-in session and writes storage state)
    - chromium-logged: depends on setup; uses storageState for logged scenarios

- Source layout (focus on roles, not exhaustive)

  - src/api
    - assertions: central API response assertions
    - factories: build API payloads and headers (e.g., authorization-header)
    - models: data models for API entities (article, comment, headers)
    - utils: helpers for API interactions
  - src/ui
    - components: reusable UI components (e.g., main menu)
    - factories: UI test data factories (article, comment, user)
    - fixtures: Playwright fixtures wiring page objects and composition (merging fixtures pattern)
    - models: UI data models (article, comment, user)
    - pages: Page Object Model for each page (base.page, login, articles, etc.)
    - views: non-navigable views/modals (e.g., add/edit comment flows)
    - utils: utilities such as explicit waits and response waiting
    - test-data: curated inputs (e.g., user data)
  - tests
    - api: REST tests for endpoints
    - ui:
      - setup: login.setup.ts (produces storageState for @logged scenarios)
      - smoke: lightweight checks
      - integration: feature-level POM-driven tests
      - end-to-end: chained scenarios (use sparingly; serial when necessary)

- Design patterns and conventions (from DECISION_LOG.md and CODING_STANDARDS.md)
  - Patterns: POM for UI, AAA structure in tests, composition over inheritance for UI building blocks, factories for data generation (faker)
  - Page Object methods that navigate should return the target Page Object to enable fluent flows
  - Naming: models in PascalCase; locators and methods in camelCase; methods verbNoun
  - Assertions: prefer extracting expected values to named variables; minimal custom messages

What future Warp instances should know

- Logged vs non-logged test split is driven by Playwright projects and @logged tag:
  - chromium-logged depends on setup project; storage state path is fixed (tmp/session.json). If storage issues occur, confirm setup ran and BASE_URL/credentials are correct.
- Environment validation is strict: missing env vars will throw early. Always ensure .env is present and correct for your target BASE_URL.
- ESLint rules are strict enough to block commits via Husky (no-console, explicit return types). If you need diagnostics in debugging, prefer temporary debug utilities or targeted exceptions rather than console.log.
- Import paths use aliases; prefer non-relative imports per VSCode settings and tsconfig paths.

Short troubleshooting

- Tests fail immediately with env error: verify .env and values (BASE_URL, USER_EMAIL, USER_PASSWORD).
- Logged project cannot find storage state: run the setup project or run full test suite so setup executes; confirm tmp/session.json is writable and not stale (globalSetup deletes it at start).
- Lint/format/type errors block commit: run npm run lint && npm run format:text && npm run tsc:check locally to fix before committing.
