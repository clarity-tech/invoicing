# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Laravel Invoicing Application

## Project Configuration

### Environment
- **Laravel Version**: 12.19.3
- **PHP Version**: 8.4.8
- **Database**: PostgreSQL
- **UI Framework**: Livewire 3.6.3 + luvi-ui/laravel-luvi (shadcn for Livewire)
- **Testing**: Pest
- **Package Manager**: Yarn 4 (via corepack)
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

### Browser Testing Commands (Dusk)
```bash
# CURRENT BEST PRACTICE: Self-contained tests with inline data creation
# No setup required - each test creates its own data:
sail php artisan dusk

# Run specific browser test file
sail php artisan dusk tests/Browser/PageBasedTest.php

# Run browser tests with specific browser
sail php artisan dusk --browse

# View screenshots directory
ls -la tests/Browser/screenshots/

# Note: Uses selenium/standalone-chromium container in docker-compose
# Browser tests connect to http://selenium:4444/wd/hub automatically
# ⚠️ Known Issue: TestHelpers.php function redeclaration needs fixing
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
# Install dependencies (yarn berry)
sail yarn install

# Development build
sail yarn dev

# Production build  
sail yarn build
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

**Browser Testing Best Practices (Dusk):**
- **✅ PREFERRED APPROACH**: Self-contained tests with inline data creation using Laravel Page objects
- **✅ RefreshDatabase**: Already applied to all Browser tests via `Pest.php` configuration
- **✅ Inline Data Creation**: Create test data within each test using factories for perfect isolation
- **✅ Page Objects**: Use Laravel Dusk Page classes in `tests/Browser/Pages/` for clean, reusable page interactions
- **✅ Authentication**: Use `loginUserInBrowser($browser, $user)` helper with inline-created users
- **✅ Email Domains**: Always use `.test` TLD for test email addresses (e.g., `user@example.test`)
- **❌ AVOID**: External seeders, shared test data, or manual database setup

**Example Browser Test Pattern:**
```php
test('user can access feature', function () {
    // Create test data inline
    $user = User::factory()->withPersonalTeam()->create([
        'email' => 'test@example.test'
    ]);
    
    $this->browse(function (Browser $browser) use ($user) {
        // Use authentication helper
        loginUserInBrowser($browser, $user);
        
        // Use Page objects for clean interactions
        $page = new DashboardPage();
        $browser->visit($page);
    });
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
- Helper functions: `createOrganizationWithLocation()`, `createInvoiceWithItems()`, `loginUserInBrowser()`
- Edge case testing for large numbers, null values, decimal precision
- Laravel Dusk browser tests with automatic screenshot capture
- Screenshots saved for all browser tests in `tests/Browser/screenshots/`
- **Browser Test Architecture**: Self-contained tests with Laravel Page objects
  - Uses RefreshDatabase trait for clean isolation between tests
  - Inline data creation using Laravel factories within each test
  - Page objects in `tests/Browser/Pages/` for reusable page interactions
  - Authentication helper: `loginUserInBrowser($browser, $user)` works with inline-created users
  - All test emails use `.test` TLD (e.g., `user@example.test`)

**Package Management:**
- Yarn Berry (4.9.2) for frontend dependencies
- No package-lock.json (deleted - use yarn.lock only)
- Puppeteer available globally, not as project dependency

**Browser Testing Setup:**
- Laravel Dusk with Selenium standalone Chrome container
- Automatic screenshot capture for all browser tests
- Remote WebDriver connects to `http://selenium:4444/wd/hub`
- Screenshots stored in `tests/Browser/screenshots/`

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
5. **Run test status check**: `sail php artisan dusk` to see current browser test state

**Browser Test Fix Priority:**
- **Primary Focus**: Authentication issues in Phase 1 of PLAN.md
- **Current Status**: 22 failed, 9 passed browser tests (need 100% pass rate)
- **Key Issue**: Dusk `loginAs()` not working with Laravel Jetstream auth
- **Next Action**: Fix `loginUserInBrowser()` helper in `tests/TestHelpers.php`

**Before ending a session:**
1. **Update PLAN.md** with all completed checkboxes and new discoveries
2. **Commit progress** with atomic commits following git workflow
3. **Run formatting**: `sail pint --dirty`
4. **Note next session focus** in PLAN.md

**Reference Documents:**
- `PLAN.md` - Comprehensive browser test fix tracking
- `PRD.md` - Project requirements (100% browser test target)
- `tests/TestHelpers.php` - Authentication helper functions