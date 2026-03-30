# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Laravel Invoicing Application

## Project Configuration

### Environment
- **Laravel Version**: 13.x
- **PHP Version**: 8.5
- **Database**: PostgreSQL 17
- **UI Framework**: Vue 3 + Inertia.js v3 (TypeScript, 100% TS codebase)
- **CSS**: Tailwind CSS v4 (CSS-based `@theme` config, no tailwind.config.js)
- **Testing**: Pest 4 (backend), Pest Browser + Playwright (browser), Vitest (frontend)
- **Package Manager**: Bun
- **Container**: Laravel Sail (dev), ServerSideUp FrankenPHP + Octane (prod)
- **Linting**: ESLint (Vue + TS + import ordering) + Prettier (Tailwind class sorting)

### Key Packages
- `akaunting/laravel-money` - For monetary value handling
- `laravel/octane` - FrankenPHP worker mode for production
- `inertiajs/inertia-laravel` v3 - Server-side Inertia adapter
- `gotenberg/gotenberg` - PDF generation via Docker sidecar (replaced Browsershot/Chrome)

## Development Commands

> **First-time setup**: see README.md. TL;DR: `sail up -d && sail php artisan app:setup --seed && sail bun install && sail bun run build`

### Laravel Commands
```bash
# Run migrations
sail php artisan migrate

# Create migration
sail php artisan make:migration [migration_name]

# Create model with migration
sail php artisan make:model [ModelName] -m

# Create custom cast
sail php artisan make:cast [CastName]

# Create mailable
sail php artisan make:mail [MailableName]

# Regenerate Wayfinder typed routes (after route changes)
sail php artisan wayfinder:generate --path=resources/js --no-interaction

# Clear caches
sail php artisan config:clear
sail php artisan cache:clear
sail php artisan view:clear
```

### Testing Commands
```bash
# Fresh database migration before tests (ALWAYS run this first)
sail php artisan migrate:fresh --env=testing

# Run all tests
sail php artisan test

# Run specific test file
sail php artisan test tests/Unit/Models/InvoiceTest.php

# Run specific test by name filter
sail php artisan test --filter="can create invoice"

# Run tests with coverage
sail php artisan test --coverage

# Single test suite
sail php artisan test tests/Unit/
sail php artisan test tests/Feature/
```

### Browser Testing Commands (Pest Browser + Playwright)
```bash
# First-time setup (downloads Chromium, ~60s, persists across restarts)
sail composer browser-setup

# If browser-setup fails with EACCES permission error on /opt/playwright-browsers,
# fix volume permissions first, then re-run:
sail root-shell -c "chmod 777 /opt/playwright-browsers"
sail composer browser-setup

# Run all browser tests
sail php artisan test tests/Browser

# Run specific browser test file
sail php artisan test tests/Browser/SmokeTest.php

# Run browser tests with visible browser
sail pest --headed tests/Browser

# View screenshots directory
ls -la tests/Browser/Screenshots/

# Note: Uses Playwright (runs inside app container, no external browser service)
```

### Database Commands
```bash
# Check migration status
sail php artisan migrate:status

# Fresh migration with seeding (demo data - local environment only)
sail php artisan migrate:fresh --seed

# Run demo seeding only (local environment only)
sail php artisan db:seed

# Production seeding (can run in any environment, asks confirmation in production)
sail php artisan db:seed --class=ProductionSeeder

# Rollback migration
sail php artisan migrate:rollback
```

### Code Formatting & Linting Commands
```bash
# PHP: Format current uncommitted changes with Laravel Pint (ALWAYS run before commits)
sail pint --dirty

# PHP: Format specific files
sail pint app/Models/Invoice.php

# PHP: Check formatting without fixing
sail pint --test

# Frontend: ESLint (fix all issues)
sail bun run lint

# Frontend: ESLint (check only, no fix)
sail bun run lint:check

# Frontend: Prettier (format all resources/)
sail bun run format

# Frontend: Prettier (check only)
sail bun run format:check

# Frontend: TypeScript type check
sail bun run types:check

# BEFORE EVERY COMMIT: Run both PHP and frontend formatters
sail pint --dirty && sail bun run lint && sail bun run format
```

### Frontend Commands
```bash
# Install dependencies
sail bun install

# Development build
sail bun run dev

# Production build
sail bun run build

# Run frontend tests (Vitest)
sail bun run test

# Run frontend tests in watch mode
sail bun run test:watch

# Run frontend tests with coverage
sail bun run test:coverage

# Lint TypeScript/Vue (ESLint)
sail bun run lint          # fix issues
sail bun run lint:check    # check only

# Format with Prettier
sail bun run format        # fix formatting
sail bun run format:check  # check only

# TypeScript type check
sail bun run types:check
```

## Architecture Overview

### Core Architectural Patterns

**Domain-Driven Design Influence:**
- Value Objects (`ContactCollection`, `InvoiceTotals`) encapsulate business logic
- Service Layer (`InvoiceCalculator`, `PdfService`, `EstimateToInvoiceConverter`) handles business operations
- Rich domain models with business methods (`Invoice::isInvoice()`, `InvoiceItem::getLineTotal()`)

**Data Model Architecture:**
- **Organization-Centric**: Teams renamed to Organizations with business fields (eliminates Team/Company confusion)
- Polymorphic `Location` model serves organizations and customers
- ULID identifiers for public document sharing (better performance than UUID)
- Integer-based monetary storage (cents) to avoid floating-point precision issues
- Flexible tax system (no enums) supporting multi-country tax templates
- Simple JSON arrays for email recipients and tax breakdowns

**Key Relationships:**
```
Organization (teams table) -> Location (polymorphic, primary location)
Organization -> Customer (one-to-many)
Organization -> Invoice (one-to-many)
Organization -> TaxTemplate (one-to-many)
Customer -> Location (polymorphic, primary location)  
Invoice -> Organization (belongs to)
Invoice -> Customer (belongs to)
Invoice -> Location (organization & customer locations)
Invoice -> InvoiceItem (one-to-many)

# Current Demo Data:
- 8 Organizations across different currencies (USD, EUR, INR, AED)
- 30+ Customers including UAE: RxNow LLC, 1115inc
- 160+ Invoices and estimates
- Currency-specific tax templates for all supported countries
```

### Development Guidelines

**Testing Requirements:**
- **Unit/Feature Tests**: ALWAYS run `sail php artisan migrate:fresh --env=testing` before running tests
- **Browser Tests**: Use self-contained approach with inline data creation (see Browser Testing Best Practices below)
- All Pest tests must pass before commits
- Current: 957+ test cases (950 Unit/Feature + browser tests), 83.2% backend coverage
- Use test helpers in `tests/TestHelpers.php`: `createOrganizationWithLocation()`, `createCustomerWithLocation()`, `createInvoiceWithItems()`, `createNumberingSeries()`

**Browser Testing Best Practices (Pest Browser + Playwright):**
- **✅ PREFERRED APPROACH**: Self-contained tests with inline data creation using Pest Browser API
- **✅ RefreshDatabase**: Already applied to all Browser tests via `Pest.php` configuration
- **✅ Inline Data Creation**: Create test data within each test using factories for perfect isolation
- **✅ Authentication**: Use `$this->actingAs($user)` before `visit()` for authenticated tests
- **✅ Email Domains**: Always use `.test` TLD for test email addresses (e.g., `user@example.test`)
- **❌ AVOID**: External seeders, shared test data, or manual database setup

**Example Browser Test Pattern:**
```php
it('user can access feature', function () {
    $user = User::factory()->withPersonalTeam()->create([
        'email' => 'test@example.test'
    ]);

    $this->actingAs($user);

    $page = visit('/dashboard');
    $page->assertPathIs('/dashboard')
        ->assertSee('Dashboard');
});
```

**Code Standards:**
- All monetary values stored as integers (never floats)
- Use Value Objects for complex data structures
- Implement custom casts for JSON columns (`ContactCollectionCast`)
- Follow latest Laravel conventions (use `casts()` method, not `$casts` property)
- Avoid associative arrays - use proper object instances for data passing

**Money Handling:**
- Store all amounts in cents (integer) 
- Use akaunting/laravel-money package for formatting
- Default currency: INR (Indian Rupees)

**Translation System (Laravel Internationalization):**
- **Comprehensive translation infrastructure** in `lang/en/` with 4 organized files:
  - `documents.php` - Document headers, fields, financial terms, table labels, status values
  - `forms.php` - Form labels, validation messages, steps, placeholders, hints
  - `actions.php` - Buttons, navigation, confirmations, tooltips, shortcuts
  - `messages.php` - Email templates, notifications, system messages, help text
- **Translation Usage Pattern**: Always use `{{ __('key') }}` helper in Blade templates
- **Key Organization**: Group translations logically (e.g., `documents.fields.due_date`, `actions.buttons.create_invoice`)
- **Parameterized Translations**: Support dynamic content with `{{ __('key', ['param' => $value]) }}`
- **Consistency Rule**: ALL user-facing text must use translation strings - no hardcoded text in views
- **Terminology Standards**: Use "Due Date" consistently for both invoices and estimates (not "Valid Until")

**Translation Implementation Examples:**
```php
// Document fields
{{ __('documents.fields.due_date') }}          // "Due Date"
{{ __('documents.financial.total') }}          // "Total:"
{{ __('documents.headers.invoice_upper') }}    // "INVOICE"

// Form labels with parameters
{{ __('forms.labels.price_required', ['currency' => 'INR']) }}  // "Price (INR) *"
{{ __('messages.email.greeting', ['email' => $email]) }}        // "Dear john@example.com,"

// Action buttons
{{ __('actions.buttons.create_invoice') }}     // "Create Invoice"
{{ __('actions.buttons.download_pdf') }}       // "Download PDF"
```

**Commit Guidelines:**
- **ALWAYS run ALL formatters before every commit:**
  1. `sail pint --dirty` — PHP formatting
  2. `sail bun run lint` — ESLint fix (Vue + TypeScript)
  3. `sail bun run format` — Prettier (Tailwind class sorting)
- Atomic, conventional commits with format: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- All tests must pass before commit
- Commit regularly with meaningful messages

### Key Components

**Models:**
- `Organization` - Business entities (renamed from Team) with polymorphic locations, ContactCollection contacts, tax templates, and multi-currency support including AED
- `Customer` - Customer entities with polymorphic locations, belonging to organizations (includes UAE customers: RxNow LLC, 1115inc)
- `Location` - Polymorphic model serving organizations and customers
- `Invoice` - Unified model for invoices/estimates with organization relationship, flexible tax types, and JSON email recipients
- `InvoiceItem` - Line items with quantity, unit_price, tax_rate calculations
- `TaxTemplate` - Multi-country tax templates per organization with flexible categories (includes UAE VAT and Excise taxes)

**Value Objects:**
- `ContactCollection` - Immutable collection with validation for multiple contacts (name + email)
- `InvoiceTotals` - Readonly class for subtotal, tax, total calculations

**Services:**
- `InvoiceCalculator` - Business logic for financial calculations
- `PdfService` - PDF generation via Gotenberg (multipart/form-data API)
- `EstimateToInvoiceConverter` - Business logic for estimate-to-invoice conversion
- `DocumentMailer` - Email functionality for sending documents

**Controllers (Inertia):**
- `DashboardController` - Analytics with period filters, KPIs, trends
- `OrganizationController` - Organization CRUD with show/edit pages, logo upload, bank details
- `OrganizationSetupController` - 4-step setup wizard
- `CustomerController` - Customer CRUD with location management
- `InvoiceController` - Invoice/estimate CRUD, duplicate, convert, email, PDF
- `NumberingSeriesController` - Numbering series CRUD with live preview
- `UserProfileController` - Profile settings (Inertia render)
- `TeamController` - Team management with member roles

**Custom Casts:**
- `ContactCollectionCast` - Seamless JSON ↔ ContactCollection conversion with error handling

## URL Structure & Routes
- `/organizations` - Organization list (redirects to show for single-org users)
- `/organizations/{id}` - Organization overview
- `/organizations/{id}/edit` - Organization settings (tabbed: basics, location, bank, logo)
- `/customers` - Customer management (Inertia + Vue)
- `/invoices` - Invoice and estimate list with filters
- `/invoices/create` - Create invoice form
- `/invoices/{id}/edit` - Edit invoice form
- `/estimates/create` - Create estimate form
- `/numbering-series` - Invoice numbering series management
- `/dashboard` - Business analytics dashboard
- `/user/profile` - User profile management
- `/teams/{id}` - Team/organization member management
- `/organization/setup` - Organization setup wizard (first-time)
- `/invoices/view/{ulid}` - Public invoice view (no auth)
- `/estimates/view/{ulid}` - Public estimate view (no auth)

## Important Implementation Details

**PDF Generation (Gotenberg):**
- Uses Gotenberg 8 (https://gotenberg.dev) — purpose-built HTML-to-PDF microservice
- API: POST /forms/chromium/convert/html with index.html as multipart attachment
- A4 page format (8.27x11.7in) with 10mm margins, printBackground enabled
- Config: services.gotenberg.url, services.gotenberg.enabled, services.gotenberg.timeout

**Multi-Currency Support:**
- 9 supported currencies: INR, USD, EUR, GBP, AUD, CAD, SGD, JPY, AED
- Currency enum with symbols and names
- Tax templates per currency (UAE VAT 5%, India GST 18%, etc.)
- Automatic tax rate selection based on organization currency

**Database Insights:**
- PostgreSQL with proper foreign key constraints
- Uses `RefreshDatabase` trait in ALL tests for isolation
- ULID primary keys for public document sharing
- Decimal(5,3) for tax_rate to support high rates (up to 99.999%)
- Currency enum fields for type safety
- JSON email collections with custom cast validation

**Inertia + Vue 3 Architecture:**
- Vue 3 pages in `resources/js/Pages/` with TypeScript and Composition API
- Shared components in `resources/js/Components/`
- Composables: `useFormatMoney`, `useInvoiceCalculator`, `useFlash`
- Layouts: `AppLayout.vue`, `GuestLayout.vue`, `NavigationMenu.vue`
- Wayfinder for type-safe routing (imports from `@/routes/` and `@/actions/`)
- Inertia `useForm()` for all form submissions with server-side validation
- Tab-based editing via URL query params (e.g., `/organizations/1/edit?tab=bank`)
- `HandleInertiaRequests` middleware shares auth, flash, and team data
- `lucide-vue-next` for icons

**Object Storage (RustFS/S3):**
- Local: RustFS (S3-compatible) via Sail on port 9000
- Production: S3/DigitalOcean Spaces
- Media library defaults to S3 disk via `config/media-library.php`
- Bucket auto-created by `sail php artisan app:setup-storage`
- Public read policy applied automatically for logo/attachment URLs
- Console: http://localhost:9001 (sail/password)

**Testing Infrastructure:**
- Pest framework with custom test helpers
- 957+ test cases (950 Unit/Feature + browser tests), 83.2% backend coverage
- Parallel testing supported: `sail php artisan test --parallel --testsuite=Unit,Feature`
- Feature tests use `assertInertia()` for Inertia response assertions
- Helper functions: `createOrganizationWithLocation()`, `createCustomerWithLocation()`, `createInvoiceWithItems()`, `createNumberingSeries()`
- Edge case testing for large numbers, null values, decimal precision
- Pest Browser tests with Playwright for real browser testing
- Browser CRUD tests cover: customers, invoices, estimates, organizations, numbering series, dashboard
- Screenshots saved in `tests/Browser/Screenshots/`
- **Browser Test Architecture**: Self-contained tests with Pest Browser API
  - Uses RefreshDatabase trait for clean isolation between tests
  - Inline data creation using Laravel factories within each test
  - Authentication via `$this->actingAs($user)` before `visit()`
  - All test emails use `.test` TLD (e.g., `user@example.test`)

**Package Management:**
- Bun for frontend dependencies
- Uses bun.lockb for dependency locking
- ESLint + Prettier for frontend linting/formatting (`bun run lint`, `bun run format`)

**Frontend Directory Structure:**
```
resources/js/
├── app.ts                    # Vue/Inertia entry point
├── env.d.ts                  # TypeScript declarations
├── types/index.d.ts          # Model/enum TypeScript interfaces
├── lib/utils.ts              # cn() helper for Tailwind class merging
├── composables/
│   ├── useFormatMoney.ts     # Multi-currency formatting (9 currencies)
│   ├── useInvoiceCalculator.ts # Client-side line item math
│   └── useFlash.ts           # Flash message reactivity
├── Layouts/
│   ├── AppLayout.vue         # Authenticated layout with nav
│   ├── GuestLayout.vue       # Auth pages layout
│   └── NavigationMenu.vue    # Top navigation bar
├── Pages/
│   ├── Auth/                 # Login, Register, ForgotPassword, etc.
│   ├── Dashboard.vue         # Analytics dashboard
│   ├── Customers/Index.vue   # Customer list + CRUD
│   ├── Invoices/             # Index, Create, Edit
│   ├── NumberingSeries/      # Index with CRUD dialog
│   ├── Organizations/        # Index, Show, Edit + Partials/
│   ├── Profile/              # Show + Partials/
│   └── Teams/                # Create, Show + Partials/
├── Components/
│   ├── Invoice/              # InvoiceForm, ItemRow, EmailModal
│   ├── MoneyDisplay.vue      # Currency-aware amount display
│   ├── StatusBadge.vue       # Invoice status badges
│   ├── ConfirmationModal.vue # Reusable confirm dialog
│   └── FlashMessages.vue     # Auto-dismissing flash alerts
├── wayfinder/                # Generated Wayfinder helpers
├── routes/                   # Generated typed route functions
└── actions/                  # Generated typed controller actions
```

**Browser Testing Setup:**
- Pest Browser plugin with Playwright (runs inside app container)
- Chromium is opt-in: run `sail composer browser-setup` once to download (~60s, persists across restarts)
- Automatic screenshot capture on failure
- No external browser service needed (no Selenium)
- Screenshots stored in `tests/Browser/Screenshots/`

## Demo Data Summary
- **Organizations**: 8 organizations with different currencies
  - Dubai Trading LLC (AED) with customers: RxNow LLC, 1115inc
  - ACME Manufacturing Corp (USD)
  - TechStart Innovation Hub (USD)
  - EuroConsult GmbH (EUR)
  - Demo Company Ltd (INR)
- **Tax Templates**: Currency-specific templates
  - AED: VAT 5%, VAT 0%, VAT Exempt, Excise Tax 50/99%
  - INR: CGST 9%, SGST 9%, IGST 18%, GST 5/12/28%, TDS 10%
  - USD: Sales Tax 4/6/8.25%, No Tax
  - EUR: VAT 7/19%, VAT 0%
  - GBP: VAT 5/20%, VAT 0%

## Invoice Numbering Series

Flexible numbering with format tokens (`{PREFIX}`, `{YEAR}`, `{SEQUENCE:4}`, `{FY}`, etc.), reset frequencies (never/yearly/monthly/financial_year), and per-organization/location series. Auto-created on first invoice if none exists. See `InvoiceNumberingService` and `InvoiceNumberingSeries` model for implementation details.

## Git Workflow
- Always run all formatters before commit:
  1. `sail pint --dirty` — PHP (Laravel Pint)
  2. `sail bun run lint` — Frontend (ESLint with Vue + TypeScript)
  3. `sail bun run format` — Frontend (Prettier with Tailwind class sorting)
- Always run tests for both (browser and unit) and make sure it passes before commit
- Make atomic isolated commits regularly after each feature or atomic changes are done


===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/octane (OCTANE) - v2
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- laravel/telescope (TELESCOPE) - v5
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/vue3 (INERTIA_VUE) - v3
- vue (VUE) - v3
- eslint (ESLINT) - v10
- prettier (PRETTIER) - v3
- tailwindcss (TAILWINDCSS) - v4

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `laravel-best-practices` — Apply this skill whenever writing, reviewing, or refactoring Laravel PHP code. This includes creating or modifying controllers, models, migrations, form requests, policies, jobs, scheduled commands, service classes, and Eloquent queries. Triggers for N+1 and query performance issues, caching strategies, authorization and security patterns, validation, error handling, queue and job configuration, route definitions, and architectural decisions. Also use for Laravel code reviews and refactoring existing Laravel code to follow best practices. Covers any task involving Laravel backend PHP code patterns.
- `wayfinder-development` — Use this skill for Laravel Wayfinder which auto-generates typed functions for Laravel controllers and routes. ALWAYS use this skill when frontend code needs to call backend routes or controller actions. Trigger when: connecting any React/Vue/Svelte/Inertia frontend to Laravel controllers, routes, building end-to-end features with both frontend and backend, wiring up forms or links to backend endpoints, fixing route-related TypeScript errors, importing from @/actions or @/routes, or running wayfinder:generate. Use Wayfinder route functions instead of hardcoded URLs. Covers: wayfinder() vite plugin, .url()/.get()/.post()/.form(), query params, route model binding, tree-shaking. Do not use for backend-only task
- `pest-testing` — Use this skill for Pest PHP testing in Laravel projects only. Trigger whenever any test is being written, edited, fixed, or refactored — including fixing tests that broke after a code change, adding assertions, converting PHPUnit to Pest, adding datasets, and TDD workflows. Always activate when the user asks how to write something in Pest, mentions test files or directories (tests/Feature, tests/Unit, tests/Browser), or needs browser testing, smoke testing multiple pages for JS errors, or architecture tests. Covers: it()/expect() syntax, datasets, mocking, browser testing (visit/click/fill), smoke testing, arch(), Livewire component tests, RefreshDatabase, and all Pest 4 features. Do not use for factories, seeders, migrations, controllers, models, or non-test PHP code.
- `inertia-vue-development` — Develops Inertia.js v3 Vue client-side applications. Activates when creating Vue pages, forms, or navigation; using <Link>, <Form>, useForm, useHttp, useLayoutProps, or router; working with deferred props, prefetching, optimistic updates, instant visits, or polling; or when user mentions Vue with Inertia, Vue pages, Vue forms, or Vue navigation.
- `tailwindcss-development` — Always invoke when the user's message includes 'tailwind' in any form. Also invoke for: building responsive grid layouts (multi-column card grids, product grids), flex/grid page structures (dashboards with sidebars, fixed topbars, mobile-toggle navs), styling UI components (cards, tables, navbars, pricing sections, forms, inputs, badges), adding dark mode variants, fixing spacing or typography, and Tailwind v3/v4 work. The core use case: writing or fixing Tailwind utility classes in HTML templates (Blade, JSX, Vue). Skip for backend PHP logic, database queries, API routes, JavaScript with no HTML/CSS component, CSS file audits, build tool configuration, and vanilla CSS.
- `fortify-development` — ACTIVATE when the user works on authentication in Laravel. This includes login, registration, password reset, email verification, two-factor authentication (2FA/TOTP/QR codes/recovery codes), profile updates, password confirmation, or any auth-related routes and controllers. Activate when the user mentions Fortify, auth, authentication, login, register, signup, forgot password, verify email, 2FA, or references app/Actions/Fortify/, CreateNewUser, UpdateUserProfileInformation, FortifyServiceProvider, config/fortify.php, or auth guards. Fortify is the frontend-agnostic authentication backend for Laravel that registers all auth routes and controllers. Also activate when building SPA or headless authentication, customizing login redirects, overriding response contracts like LoginResponse, or configuring login throttling. Do NOT activate for Laravel Passport (OAuth2 API tokens), Socialite (OAuth social login), or non-auth Laravel features.
- `medialibrary-development` — Build and work with spatie/laravel-medialibrary features including associating files with Eloquent models, defining media collections and conversions, generating responsive images, and retrieving media URLs and paths.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `vendor/bin/sail bun run build`, `vendor/bin/sail bun run dev`, or `vendor/bin/sail composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `vendor/bin/sail artisan route:list`). Use `vendor/bin/sail artisan list` to discover available commands and `vendor/bin/sail artisan [command] --help` to check parameters.
- Inspect routes with `vendor/bin/sail artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `vendor/bin/sail artisan config:show app.name`, `vendor/bin/sail artisan config:show database.default`. Or read config files directly from the `config/` directory.
- To check environment variables, read the `.env` file directly.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `vendor/bin/sail artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `vendor/bin/sail artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== sail rules ===

# Laravel Sail

- This project runs inside Laravel Sail's Docker containers. You MUST execute all commands through Sail.
- Start services using `vendor/bin/sail up -d` and stop them with `vendor/bin/sail stop`.
- Open the application in the browser by running `vendor/bin/sail open`.
- Always prefix PHP, Artisan, Composer, and Node commands with `vendor/bin/sail`. Examples:
    - Run Artisan Commands: `vendor/bin/sail artisan migrate`
    - Install Composer packages: `vendor/bin/sail composer install`
    - Execute Node commands: `vendor/bin/sail bun run dev`
    - Execute PHP scripts: `vendor/bin/sail php [script]`
- View all available Sail commands by running `vendor/bin/sail` without arguments.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `vendor/bin/sail artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/Pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `vendor/bin/sail artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `vendor/bin/sail artisan list` and check their parameters with `vendor/bin/sail artisan [command] --help`.
- If you're creating a generic PHP class, use `vendor/bin/sail artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `vendor/bin/sail artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `vendor/bin/sail artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `vendor/bin/sail bun run build` or ask the user to run `vendor/bin/sail bun run dev` or `vendor/bin/sail composer run dev`.

=== octane/core rules ===

# Octane

- Octane boots the application once and reuses it across requests, so singletons persist between requests.
- The Laravel container's `scoped` method may be used as a safe alternative to `singleton`.
- Never inject the container, request, or config repository into a singleton's constructor; use a resolver closure or `bind()` instead:

```php
// Bad
$this->app->singleton(Service::class, fn (Application $app) => new Service($app['request']));

// Good
$this->app->singleton(Service::class, fn () => new Service(fn () => request()));
```

- Never append to static properties, as they accumulate in memory across requests.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/sail bin pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/sail bin pint --test --format agent`, simply run `vendor/bin/sail bin pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `vendor/bin/sail artisan make:test --pest {name}`.
- Run tests: `vendor/bin/sail artisan test --compact` or filter: `vendor/bin/sail artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-vue/core rules ===

# Inertia + Vue

Vue components must have a single root element.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

=== spatie/laravel-medialibrary rules ===

## Media Library

- `spatie/laravel-medialibrary` associates files with Eloquent models, with support for collections, conversions, and responsive images.
- Always activate the `medialibrary-development` skill when working with media uploads, conversions, collections, responsive images, or any code that uses the `HasMedia` interface or `InteractsWithMedia` trait.

</laravel-boost-guidelines>
