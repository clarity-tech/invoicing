# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Laravel Invoicing Application

## Project Configuration

### Environment
- **Laravel Version**: 12.19.3
- **PHP Version**: 8.5.2
- **Database**: PostgreSQL
- **UI Framework**: Livewire 3.6.3 + luvi-ui/laravel-luvi (shadcn for Livewire)
- **Testing**: Pest
- **Package Manager**: Bun
- **Container**: Laravel Sail

### Key Packages
- `akaunting/laravel-money` - For monetary value handling
- `luvi-ui/laravel-luvi` - shadcn UI components for Livewire
- `spatie/browsershot` - PDF generation using headless Chrome

## Development Commands

### Container Management
```bash
# Start all services
sail up -d

# Stop all services
sail down

# View logs
sail logs
```

### Laravel Commands
```bash
# Run migrations
sail php artisan migrate

# Create migration
sail php artisan make:migration [migration_name]

# Create model with migration
sail php artisan make:model [ModelName] -m

# Create Livewire component
sail php artisan make:livewire [ComponentName]

# Create custom cast
sail php artisan make:cast [CastName]

# Create mailable
sail php artisan make:mail [MailableName]

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

### Production Seeders
- **ProductionSeeder.php** - Main orchestrator with environment safety for production/staging/testing
- **ProductionUserSeeder.php** - Clarity Technologies organization with static users (accounts@claritytech.io, manash@claritytech.io)
- **ProductionCustomerSeeder.php** - Three real customers with accurate addresses and GSTIN numbers:
  - RxNow Pharmacy LLC (Dubai, AED currency)
  - DocOnline Health India Pvt Ltd (Bangalore, INR currency, GSTIN: 29AAFCD9711R1ZV)
  - Krishna Institute of Medical Sciences (Hyderabad, INR currency, GSTIN: 36AACCK2540G1ZU)
- **ProductionInvoiceSeeder.php** - Sample multi-currency invoices and estimates for demonstration
- **Environment Safety**: Production seeders can run in any environment but ask for confirmation in production/staging

### Code Formatting Commands
```bash
# Format current uncommitted changes with Laravel Pint (ALWAYS run before commits)
sail pint --dirty

# Format specific files
sail pint app/Models/Invoice.php

# Check formatting without fixing
sail pint --test
```

### Frontend Commands
```bash
# Install dependencies
sail bun install

# Development build
sail bun run dev

# Production build
sail bun run build
```

### Shell Access
```bash
# Access container shell for Linux commands
sail shell

# Access PostgreSQL directly
sail psql

# Access database via pgweb interface
# Open http://localhost:8081 in browser
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
- Current coverage: 94.7% (maintain above 90%)
- Use `createInvoiceWithItems()` and other test helpers in `tests/TestHelpers.php`

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
- **ALWAYS run `sail pint --dirty` before every commit** to format uncommitted changes
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
- `PdfService` - PDF generation using Spatie Browsershot (requires Puppeteer globally)
- `EstimateToInvoiceConverter` - Business logic for estimate-to-invoice conversion
- `DocumentMailer` - Email functionality for sending documents

**Livewire Components:**
- `OrganizationManager` / `CustomerManager` - Full CRUD with location and email management
- `InvoiceWizard` - Multi-step wizard for creating invoices/estimates with real-time calculations and tax template integration

**Custom Casts:**
- `ContactCollectionCast` - Seamless JSON ↔ ContactCollection conversion with error handling

## URL Structure & Routes
- `/organizations` - Organization management (Livewire component)
- `/customers` - Customer management (Livewire component)  
- `/invoices` - Invoice and estimate management (Livewire component)
- `/tax-templates` - Tax template management per organization
- `/invoices/{ulid}` - Public invoice view (no auth required)
- `/estimates/{ulid}` - Public estimate view (no auth required)
- `/invoices/{ulid}/pdf` - Download invoice PDF
- `/estimates/{ulid}/pdf` - Download estimate PDF

## Important Implementation Details

**PDF Generation:**
- Uses Spatie Browsershot with headless Chrome
- Puppeteer available globally via `npx` (not in package.json)
- A4 page format with professional styling
- Graceful error handling for container architecture issues

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

**Livewire Architecture:**
- Full-stack components handle complete CRUD operations
- `#[Computed]` properties for efficient data loading
- Multi-step wizard pattern in InvoiceWizard
- Real-time calculation updates in UI

**Testing Infrastructure:**
- Pest framework with custom test helpers
- 233 tests with 94.7% coverage (Unit + Feature + Browser)
- Helper functions: `createOrganizationWithLocation()`, `createInvoiceWithItems()`
- Edge case testing for large numbers, null values, decimal precision
- Pest Browser tests with Playwright for real browser testing
- Screenshots saved in `tests/Browser/Screenshots/`
- **Browser Test Architecture**: Self-contained tests with Pest Browser API
  - Uses RefreshDatabase trait for clean isolation between tests
  - Inline data creation using Laravel factories within each test
  - Authentication via `$this->actingAs($user)` before `visit()`
  - All test emails use `.test` TLD (e.g., `user@example.test`)

**Package Management:**
- Bun for frontend dependencies
- No package-lock.json (deleted - use bun.lock only)
- Puppeteer available globally, not as project dependency

**Browser Testing Setup:**
- Pest Browser plugin with Playwright (runs inside app container)
- Chromium is opt-in: run `sail composer browser-setup` once to download (~60s, persists across restarts)
- Automatic screenshot capture on failure
- No external browser service needed (no Selenium)
- Screenshots stored in `tests/Browser/Screenshots/`

## Development Database
- pgweb interface available at http://localhost:8081
- Direct PostgreSQL access via `sail psql`
- All services accessible at http://localhost

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

## UAE Customer Details
- **RxNow LLC**: Healthcare company in Dubai Healthcare City
- **1115inc**: Technology company at Al Warsan Towers, 305, Barsha Heights, Dubai
  - Primary contact: ayshwarya@1115inc.com
  - Secondary contact: consult@1115inc.com

## Invoice Numbering Series System

### Architecture Overview
The invoice numbering system provides flexible, multi-organization support with automatic series creation and comprehensive format pattern support.

**Complete User Flow:**
1. **User Registration** → Personal organization auto-created via Jetstream
2. **Organization Setup** → 4-step wizard for business configuration
3. **Numbering Series** → Auto-created on first invoice OR manually managed
4. **Invoice Creation** → Automatic series selection with manual override option

### Key Components

**Models:**
- `InvoiceNumberingSeries` - Core model with reset logic and sequence management
- Relationships: Organization (teams), Location, Invoice
- Scopes: `active()`, `default()`, `forOrganization()`, `forLocation()`

**Service Layer:**
- `InvoiceNumberingService` - Business logic for number generation
- Handles format pattern parsing, financial year integration, uniqueness validation
- Transaction-safe number generation with automatic fallbacks

**Management Interface:**
- Route: `/numbering-series` → `NumberingSeriesManager` Livewire component
- Full CRUD with real-time preview, security checks, default series management

### Format Pattern Tokens
```php
{PREFIX}      // Series prefix (INV, EST, DXB-INV)
{YEAR}        // Full year (2024)
{YEAR:2}      // 2-digit year (24)
{MONTH}       // Month number (01-12)
{MONTH:3}     // Month abbreviation (Jan, Feb)
{DAY}         // Day of month (01-31)
{SEQUENCE}    // Sequential number
{SEQUENCE:4}  // Padded sequence (0001, 0002)
{FY}          // Financial year (2024-25)
{FY_START}    // FY start year (2024)
{FY_END}      // FY end year (2025)
```

### Reset Frequencies
- `NEVER` - Continuous numbering (1, 2, 3, ...)
- `YEARLY` - Reset every calendar year
- `MONTHLY` - Reset every month  
- `FINANCIAL_YEAR` - Reset based on organization's financial year

### Series Selection Hierarchy
1. **Specific series requested** → Use that series
2. **Location provided** → Find location-specific active series
3. **Fall back to default** → Use organization's default series
4. **No default exists** → Create default series automatically

### Database Schema
```sql
invoice_numbering_series:
  - organization_id, location_id (nullable for org-wide)
  - name, prefix, format_pattern
  - current_number, reset_frequency
  - is_active, is_default, last_reset_at
```

### Example Generated Numbers
- Standard: `INV-2024-01-0001`
- Financial Year: `INV-2024-25-0001`
- Location-specific: `DXB-INV-2024-0001`
- Simple: `EST-0001`

### Financial Year Integration
- Requires `organization.financial_year_type` and `country_code`
- Automatic FY calculation based on current date
- Validates FY setup for FY-based series and format patterns
- Supports different country financial year systems

## Git Workflow
- Always run `sail pint --dirty` to run pint formatter on current changes that are not commited before commit
- Always run tests for both (browser and unit) and make sure it passes before commit
- make atomic isolated commits regulary after each feature or atomic changes are done

## Session Continuation Instructions

**CRITICAL: At the start of EVERY session:**
1. **Check PLAN.md first** - Review current progress and task status
2. **Update PLAN.md checkboxes** as tasks are completed during the session
3. **Follow PLAN.md phases** for browser test fixes (currently Phase 1: Authentication)
4. **Reference PRD.md** for project requirements validation
5. **Run test status check**: `sail php artisan test tests/Browser` to see current browser test state

**Browser Test Status:**
- **Framework**: Pest Browser (Playwright) - migrated from Dusk
- **Tests**: 8 test files covering smoke, auth, dashboard, org, customer, invoice, public views, a11y

**Before ending a session:**
1. **Update PLAN.md** with all completed checkboxes and new discoveries
2. **Commit progress** with atomic commits following git workflow
3. **Run formatting**: `sail pint --dirty`
4. **Note next session focus** in PLAN.md

**Reference Documents:**
- `PLAN.md` - Comprehensive browser test fix tracking
- `PRD.md` - Project requirements (100% browser test target)
- `tests/TestHelpers.php` - Data creation helper functions

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5.2
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v12
- laravel/octane (OCTANE) - v2
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- livewire/livewire (LIVEWIRE) - v3
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- laravel/telescope (TELESCOPE) - v5
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `livewire-development` — Develops reactive Livewire 3 components. Activates when creating, updating, or modifying Livewire components; working with wire:model, wire:click, wire:loading, or any wire: directives; adding real-time updates, loading states, or reactivity; debugging component behavior; writing Livewire tests; or when the user mentions Livewire, component, counter, or reactive UI.
- `pest-testing` — Tests applications using the Pest 4 PHP framework. Activates when writing tests, creating unit or feature tests, adding assertions, testing Livewire components, browser testing, debugging test failures, working with datasets or mocking; or when the user mentions test, spec, TDD, expects, assertion, coverage, or needs to verify functionality works.
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

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `vendor/bin/sail npm run build`, `vendor/bin/sail npm run dev`, or `vendor/bin/sail composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double-check the available parameters.

## URLs

- Whenever you share a project URL with the user, you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain/IP, and port.

## Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.
- Use the `database-schema` tool to inspect table structure before writing migrations or models.

## Reading Browser Logs With the `browser-logs` Tool

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)

- Boost comes with a powerful `search-docs` tool you should use before trying other approaches when working with Laravel or Laravel ecosystem packages. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic-based queries at once. For example: `['rate limiting', 'routing rate limiting', 'routing']`. The most relevant results will be returned first.
- Do not add package names to queries; package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'.
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit".
3. Quoted Phrases (Exact Position) - query="infinite scroll" - words must be adjacent and in that order.
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit".
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms.

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.

## Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - `public function __construct(public GitHub $github) { }`
- Do not allow empty `__construct()` methods with zero parameters unless the constructor is private.

## Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<!-- Explicit Return Types and Method Params -->
```php
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
```

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

## Comments

- Prefer PHPDoc blocks over inline comments. Never use comments within the code itself unless the logic is exceptionally complex.

## PHPDoc Blocks

- Add useful array shape type definitions when appropriate.

=== sail rules ===

# Laravel Sail

- This project runs inside Laravel Sail's Docker containers. You MUST execute all commands through Sail.
- Start services using `vendor/bin/sail up -d` and stop them with `vendor/bin/sail stop`.
- Open the application in the browser by running `vendor/bin/sail open`.
- Always prefix PHP, Artisan, Composer, and Node commands with `vendor/bin/sail`. Examples:
    - Run Artisan Commands: `vendor/bin/sail artisan migrate`
    - Install Composer packages: `vendor/bin/sail composer install`
    - Execute Node commands: `vendor/bin/sail npm run dev`
    - Execute PHP scripts: `vendor/bin/sail php [script]`
- View all available Sail commands by running `vendor/bin/sail` without arguments.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `vendor/bin/sail artisan test --compact` with a specific filename or filter.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `vendor/bin/sail artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `vendor/bin/sail artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

## Database

- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `vendor/bin/sail artisan make:model`.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

## Authentication & Authorization

- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

## Configuration

- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `vendor/bin/sail artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `vendor/bin/sail npm run build` or ask the user to run `vendor/bin/sail npm run dev` or `vendor/bin/sail composer run dev`.

=== laravel/v12 rules ===

# Laravel 12

- CRITICAL: ALWAYS use `search-docs` tool for version-specific Laravel documentation and updated code examples.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

## Laravel 12 Structure

- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app\Console\Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

## Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== livewire/core rules ===

# Livewire

- Livewire allows you to build dynamic, reactive interfaces using only PHP — no JavaScript required.
- Instead of writing frontend code in JavaScript frameworks, you use Alpine.js to build the UI when client-side interactions are required.
- State lives on the server; the UI reflects it. Validate and authorize in actions (they're like HTTP requests).
- IMPORTANT: Activate `livewire-development` every time you're working with Livewire-related tasks.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/sail bin pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/sail bin pint --test --format agent`, simply run `vendor/bin/sail bin pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `vendor/bin/sail artisan make:test --pest {name}`.
- Run tests: `vendor/bin/sail artisan test --compact` or filter: `vendor/bin/sail artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.
- CRITICAL: ALWAYS use `search-docs` tool for version-specific Pest documentation and updated code examples.
- IMPORTANT: Activate `pest-testing` every time you're working with a Pest or testing-related task.

=== spatie/laravel-medialibrary rules ===

## Media Library

- `spatie/laravel-medialibrary` associates files with Eloquent models, with support for collections, conversions, and responsive images.
- Always activate the `medialibrary-development` skill when working with media uploads, conversions, collections, responsive images, or any code that uses the `HasMedia` interface or `InteractsWithMedia` trait.

</laravel-boost-guidelines>
