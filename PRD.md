# Product Requirements Document (PRD)
## Multitenant SaaS Invoicing Platform

### Document Version: 2.0
### Last Updated: 2026-02-23
### Status: Post-Jetstream Migration | Livewire v4

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Database Schema](#database-schema)
5. [Feature Inventory](#feature-inventory)
6. [Route Map](#route-map)
7. [Livewire Components](#livewire-components)
8. [Services Layer](#services-layer)
9. [Security & Authorization](#security--authorization)
10. [Multi-Currency System](#multi-currency-system)
11. [Invoice Numbering System](#invoice-numbering-system)
12. [Email System](#email-system)
13. [PDF Generation](#pdf-generation)
14. [Testing Infrastructure](#testing-infrastructure)
15. [Docker & Infrastructure](#docker--infrastructure)
16. [Bugs & Issues](#bugs--issues)
17. [Improvements Needed](#improvements-needed)
18. [Future Roadmap](#future-roadmap)

---

## 1. Executive Summary

### Project Vision
A multitenant SaaS invoicing platform where businesses can register, create organizations, manage customers, generate invoices/estimates with multi-currency support, and share professional public documents.

### Current State (February 2026)
- **Jetstream removed**: All Jetstream code inlined into `app/` (traits, events, actions, policies)
- **Livewire v4**: Upgraded from v3, using new config structure and `$wire` syntax
- **Fortify standalone**: Authentication backend via Laravel Fortify (headless)
- **839 tests passing**, 4 skipped, 94.7%+ coverage
- **9 currencies** supported with India GST compliance
- **Production Docker**: Multi-stage Dockerfile with Nginx-FPM and Chrome PDF service

### Key Achievements
- Organization-centric architecture (teams table reused as organizations)
- 4-step onboarding wizard for new organizations
- Multi-tenant data isolation via OrganizationScope + component-level authorization
- Flexible invoice numbering with financial year support
- Public document sharing via ULID-based URLs
- Comprehensive factory system with 60+ composable states

---

## 2. Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Laravel | 12.19.3 |
| PHP | PHP | 8.5.2 |
| Database | PostgreSQL | 18 |
| UI Framework | Livewire | 4.1.4 |
| UI Components | luvi-ui/laravel-luvi (shadcn for Livewire) | 0.6.0 |
| JS Framework | Alpine.js | 3.14.9 |
| CSS | Tailwind CSS | 4.1.11 |
| Auth Backend | Laravel Fortify | 1.x |
| API Tokens | Laravel Sanctum | 4.x |
| Money | akaunting/laravel-money | 6.x |
| Media | spatie/laravel-medialibrary | 11.x |
| Icons | mallardduck/blade-lucide-icons | 1.x |
| Testing | Pest | 4.x |
| Browser Testing | Pest Browser + Playwright | 4.x / 1.54 |
| Bundler | Vite | 7.0.5 |
| Package Manager | Bun | 1.2 |
| Container | Laravel Sail | 1.x |
| Server | Laravel Octane (available) | 2.x |
| PDF | Puppeteer via Chrome HTTP service | - |

### Removed Packages
- `laravel/jetstream` - EOL, code inlined into app (traits, events, actions, policies)

---

## 3. Architecture Overview

### Data Flow
```
User --> registers --> Personal Organization created (setup_completed_at = null)
                            |
                            v
                   Organization Setup Wizard (4 steps)
                            |
                            v
                   Organization (teams table)
                      /        |        \
                     v         v         v
                Customers  Invoices   Tax Templates
                    |          |
                    v          v
                Locations  InvoiceItems
               (polymorphic)
```

### Key Architectural Patterns

1. **Organization-Centric Multi-tenancy**: `Organization` model maps to `teams` table. Global `OrganizationScope` filters Customer, Invoice, TaxTemplate by current user's team.

2. **Value Objects**: `ContactCollection`, `BankDetails`, `InvoiceTotals` encapsulate business logic with immutability.

3. **Custom Casts**: `ContactCollectionCast`, `BankDetailsCast`, `ExchangeRateCast` handle JSON-to-object conversion.

4. **Integer Money Storage**: All monetary values stored as cents (bigint). Tax rates stored as basis points (1800 = 18%).

5. **Polymorphic Locations**: Single `locations` table serves both organizations and customers via `locatable_type`/`locatable_id`.

6. **ULID Public Identifiers**: Invoices use ULID for public sharing URLs (better performance than UUID, no sequential exposure).

7. **Inlined Jetstream**: Team management (HasTeams, HasProfilePhoto, events, actions, policies) lives in `app/Traits/`, `app/Events/`, `app/Actions/Jetstream/`, `app/Policies/`.

### Directory Structure
```
app/
  Actions/
    Fortify/          # Auth actions (CreateNewUser, UpdatePassword, etc.)
    Jetstream/        # Team actions (CreateTeam, AddTeamMember, etc.)
  Contracts/          # (empty - uses concrete classes)
  Currency.php        # Enum with 9 currencies
  Events/             # 10 team lifecycle events
  Http/
    Controllers/      # 7 controllers (mostly thin)
    Middleware/        # EnsureOrganizationSetup, AuthenticateSession, TrustProxies
  Livewire/           # 17 components (6 domain, 11 auth/team)
    Profile/          # 5 profile components
    Teams/            # 5 team components
  Mail/               # DocumentMailer, TeamInvitation
  Models/             # 11 models
    Scopes/           # OrganizationScope
  Policies/           # TeamPolicy, InvoicePolicy, CustomerPolicy
  Providers/          # AppServiceProvider, FortifyServiceProvider, TeamServiceProvider, PolicyServiceProvider
  Services/           # InvoiceCalculator, PdfService, InvoiceNumberingService, EstimateToInvoiceConverter
  Support/            # Jetstream helpers, Role, OwnerRole
  Traits/             # HasTeams, HasProfilePhoto, ConfirmsPasswords, etc.
```

---

## 4. Database Schema

### Tables (20 total)

#### Core Business Tables

| Table | Purpose | Key Columns | FK Constraints |
|-------|---------|-------------|----------------|
| `teams` | Organizations | user_id, name, personal_team, company_name, tax_number, currency(3), country_code(3), financial_year_type, bank_details(json), emails(json), setup_completed_at | primary_location_id -> locations |
| `customers` | Customer entities | organization_id, name, phone, emails(json), currency(3) | organization_id -> teams (cascade), primary_location_id -> locations (set null) |
| `invoices` | Invoices & estimates | organization_id, customer_id, ulid(26), type(check: invoice/estimate), status(check: draft/sent/accepted/paid/void), currency(3), exchange_rate(bigint), subtotal/tax/total(bigint), tax_breakdown(json), email_recipients(json), notes, terms | 6 FKs to teams, customers, locations, numbering_series |
| `invoice_items` | Line items | invoice_id, description, quantity(int), unit_price(bigint), tax_rate(int basis points), sac_code(20) | invoice_id -> invoices (cascade) |
| `locations` | Polymorphic addresses | locatable_type, locatable_id, name, gstin, address fields, country(3) | None (polymorphic) |
| `tax_templates` | Tax rate templates | organization_id, name, type, rate(int basis points), category, country_code(2), is_active, metadata(json) | organization_id -> teams (cascade) |
| `invoice_numbering_series` | Number sequences | organization_id, location_id, name, prefix, format_pattern, current_number, reset_frequency, is_active, is_default | organization_id -> teams (cascade), location_id -> locations (cascade) |
| `customer_contacts` | Contact people | customer_id, name, email, phone, designation, department, is_primary | customer_id -> customers (cascade) |

#### Auth & Team Tables

| Table | Purpose | Notes |
|-------|---------|-------|
| `users` | User accounts | email, password, current_team_id, profile_photo_path, 2FA fields |
| `team_user` | Team membership pivot | team_id, user_id, role. **BUG: Missing FK constraints** |
| `team_invitations` | Pending invitations | team_id, email, role. Has FK to teams |
| `personal_access_tokens` | Sanctum API tokens | Polymorphic tokenable |
| `sessions` | Database sessions | user_id, ip_address, user_agent |
| `media` | Spatie media library | Polymorphic model_type/model_id, collections, conversions |

#### Infrastructure Tables
- `cache`, `cache_locks` - Cache store
- `jobs`, `job_batches`, `failed_jobs` - Queue system
- `migrations` - Migration tracking
- `password_reset_tokens` - Password reset

### Key Indexes
- `invoices`: Composite indexes on (org_id, type, status), (org_id, issued_at), (customer_id, type), unique on ulid, unique on (org_id, invoice_number, type)
- `tax_templates`: Unique on (organization_id, name)
- `invoice_numbering_series`: Indexes on (org_id, is_active), (org_id, is_default), (org_id, location_id)

### Check Constraints
- `invoices.type`: Must be 'invoice' or 'estimate'
- `invoices.status`: Must be draft, sent, accepted, paid, or void

---

## 5. Feature Inventory

### Implemented Features

#### Authentication & User Management
- [x] User registration with personal organization auto-creation
- [x] Email/password login via Fortify
- [x] Two-factor authentication (TOTP with QR code + recovery codes)
- [x] Password reset via email
- [x] Email verification
- [x] Password confirmation for sensitive actions
- [x] Profile photo upload
- [x] Profile information updates (name, email)
- [x] Password change with current password verification
- [x] Logout other browser sessions
- [x] Account deletion with password confirmation
- [x] API token management (Sanctum) - feature available but disabled in config

#### Organization Management
- [x] 4-step onboarding wizard (Company Info -> Location -> Currency/FY -> Contacts)
- [x] Organization CRUD with full business details
- [x] Logo upload via Spatie Media Library
- [x] Bank details management (account, IFSC, SWIFT, PAN)
- [x] Country-based smart defaults (currency, financial year type)
- [x] Multiple email contacts per organization (ContactCollection)
- [x] Setup completion tracking with middleware enforcement
- [x] Organization switching (multi-team support)

#### Team Management
- [x] Team/organization creation
- [x] Team member invitations via signed email links
- [x] Team member addition (existing users)
- [x] Team member removal
- [x] Role-based permissions (Owner, Admin, Editor)
- [x] Team name updates
- [x] Team deletion (non-personal only)

#### Customer Management
- [x] Customer CRUD with organization scoping
- [x] Multiple contacts per customer (name + email)
- [x] Multiple polymorphic locations per customer
- [x] Primary location designation
- [x] GSTIN support for Indian customers
- [x] Customer-specific currency preference

#### Invoice & Estimate Management
- [x] Unified Invoice/Estimate model with type field
- [x] Multi-step creation form with real-time calculations
- [x] Line items with description, quantity, unit price, tax rate, SAC code
- [x] Automatic subtotal, tax, and total calculation (InvoiceCalculator)
- [x] Organization and customer location selection
- [x] Customer shipping location support
- [x] Status workflow: draft -> sent -> accepted -> paid / void
- [x] Estimate-to-invoice conversion (preserves data, new number)
- [x] Invoice duplication
- [x] Invoice deletion
- [x] Tax breakdown (JSON) for multi-tax support
- [x] Email recipients management
- [x] Notes and terms fields
- [x] Exchange rate support for multi-currency
- [x] File attachments via Media Library

#### Invoice Numbering
- [x] Configurable format patterns with tokens ({PREFIX}, {YEAR}, {SEQUENCE:4}, {FY}, etc.)
- [x] Reset frequencies: Never, Yearly, Monthly, Financial Year
- [x] Location-specific numbering series
- [x] Default series auto-creation
- [x] Organization-wide and location-scoped series
- [x] Real-time preview of next number
- [x] Financial year integration (India, US, UK, etc.)
- [x] Unique number enforcement per organization

#### Public Document Sharing
- [x] Public invoice view via ULID URL (no auth required)
- [x] Public estimate view via ULID URL
- [x] Professional responsive design (Zoho Books style)
- [x] Print-optimized CSS
- [x] PDF download (invoice and estimate)
- [x] Rate limiting on public views (60/min) and PDF downloads (10/min)
- [x] GST-aware headers ("TAX INVOICE" for India, "INVOICE" otherwise)
- [x] Bank details display on public documents

#### Email System
- [x] Send invoices/estimates via email (queued)
- [x] Custom email subject and body
- [x] CC recipients support
- [x] PDF attachment option
- [x] Multiple email recipients selection
- [x] Team member invitation emails with signed URLs

#### Multi-Currency
- [x] 9 supported currencies: INR, USD, EUR, GBP, AUD, CAD, SGD, JPY, AED
- [x] Currency symbols and full names
- [x] Indian number grouping (lakh/crore) for INR
- [x] Amount-to-words conversion (NumberFormatter)
- [x] Subunit names (Paise, Cents, Fils, etc.)
- [x] Currency-specific tax templates

#### Tax System
- [x] Flexible tax templates per organization
- [x] Multi-country support (India GST, UAE VAT, US Sales Tax, EU VAT, UK VAT)
- [x] Tax categories and types
- [x] Active/inactive toggle
- [x] Metadata JSON for additional tax info
- [x] Basis points storage for precision (1800 = 18%)

---

## 6. Route Map

### Public Routes (No Auth)

| Method | URI | Handler | Rate Limit |
|--------|-----|---------|------------|
| GET | `/` | Homepage (redirect if authenticated) | - |
| GET | `/terms-of-service` | TermsOfServiceController@show | - |
| GET | `/privacy-policy` | PrivacyPolicyController@show | - |
| GET | `/invoices/view/{ulid}` | PublicViewController@showInvoice | 60/min |
| GET | `/estimates/view/{ulid}` | PublicViewController@showEstimate | 60/min |
| GET | `/invoices/{ulid}/pdf` | PublicViewController@downloadInvoicePdf | 10/min |
| GET | `/estimates/{ulid}/pdf` | PublicViewController@downloadEstimatePdf | 10/min |

### Auth Routes (Fortify)

| Method | URI | Purpose |
|--------|-----|---------|
| GET/POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET/POST | `/register` | Registration |
| GET/POST | `/forgot-password` | Password reset request |
| GET/POST | `/reset-password/{token}` | Password reset |
| GET | `/email/verify` | Email verification notice |
| GET | `/email/verify/{id}/{hash}` | Verify email |
| GET/POST | `/two-factor-challenge` | 2FA challenge |
| User profile/password/2FA routes | Various `/user/*` paths | Profile management |

### Protected Routes (Auth + Verified)

| Method | URI | Component/Controller | Setup Required |
|--------|-----|---------------------|----------------|
| GET | `/organization/setup` | OrganizationSetup (Livewire) | No |
| GET | `/dashboard` | dashboard view | Yes |
| GET | `/organizations` | OrganizationManager (Livewire) | Yes |
| GET | `/organization/edit` | OrganizationManager (auto-edit) | Yes |
| GET | `/customers` | CustomerManager (Livewire) | Yes |
| GET | `/invoices` | InvoiceList (Livewire) | Yes |
| GET | `/invoices/create` | InvoiceForm (Livewire) | Yes |
| GET | `/invoices/{invoice}/edit` | InvoiceForm (Livewire) | Yes |
| GET | `/estimates/create` | InvoiceForm (Livewire) | Yes |
| GET | `/numbering-series` | NumberingSeriesManager (Livewire) | Yes |
| GET | `/teams/create` | TeamController@create | No |
| GET | `/teams/{team}` | TeamController@show | No |
| PUT | `/current-team` | CurrentTeamController@update | No |

---

## 7. Livewire Components

### Domain Components (6)

| Component | Lines (PHP) | View Size | Purpose |
|-----------|-------------|-----------|---------|
| `InvoiceForm` | ~500 + 498 trait | 63KB | Invoice/estimate creation and editing with email modal |
| `InvoiceList` | ~100 | 7.4KB | Paginated invoice list with CRUD actions |
| `OrganizationManager` | ~580 | 36KB | Organization CRUD with locations, bank details, logo |
| `OrganizationSetup` | ~456 | 28KB | 4-step onboarding wizard |
| `CustomerManager` | ~400 | 27KB | Customer CRUD with contacts and locations |
| `NumberingSeriesManager` | ~347 | 25KB | Invoice numbering series management |

### Auth/Team Components (11)

| Component | Purpose |
|-----------|---------|
| `NavigationMenu` | Top nav with org switcher |
| `Profile/UpdateProfileInformationForm` | Name, email, photo |
| `Profile/UpdatePasswordForm` | Password change |
| `Profile/DeleteUserForm` | Account deletion |
| `Profile/TwoFactorAuthenticationForm` | 2FA setup |
| `Profile/LogoutOtherBrowserSessionsForm` | Session management |
| `Teams/TeamMemberManager` | Add/remove members, roles |
| `Teams/UpdateTeamNameForm` | Team name editing |
| `Teams/DeleteTeamForm` | Team deletion |
| `Teams/CreateTeamForm` | New team creation |
| `Teams/ApiTokenManager` | Sanctum token management |

### Shared Traits (2)

| Trait | Lines | Purpose |
|-------|-------|---------|
| `InvoiceFormLogic` | 498 | Invoice form properties, validation, calculation, save logic |
| `ManagesBankDetails` | 66 | Bank detail fields and value object conversion |

---

## 8. Services Layer

### InvoiceCalculator
- Calculates subtotal, tax, total from invoice items
- Returns immutable `InvoiceTotals` value object
- All operations in cents (integers)
- 24 test cases covering edge cases

### PdfService
- HTTP-based PDF generation via Puppeteer Chrome service
- Renders HTML via Laravel View engine, posts to Chrome service
- Configurable via `config/services.chrome` env vars
- Returns PDF binary or HTTP download response
- Graceful error handling with user-friendly messages

### InvoiceNumberingService
- Format token replacement: {PREFIX}, {YEAR}, {MONTH}, {SEQUENCE:4}, {FY}, etc.
- Reset frequencies: NEVER, YEARLY, MONTHLY, FINANCIAL_YEAR
- Transaction-safe number generation
- Auto-creates default series on first invoice
- Financial year integration for tax compliance

### EstimateToInvoiceConverter
- Validates input is estimate type
- Creates new invoice with estimate's data
- Duplicates all items
- Generates new invoice number
- Recalculates totals

---

## 9. Security & Authorization

### Multi-Tenant Data Isolation

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| Global Scope | `OrganizationScope` | Filters Invoice, Customer, TaxTemplate by current user's team |
| Component Level | `$user->allTeams()` checks | All Livewire component actions verify team membership |
| Route Level | `organization.setup` middleware | Enforces setup completion |
| Policy Level | `TeamPolicy`, `InvoicePolicy`, `CustomerPolicy` | Gate-based authorization |

### Policy Registration

| Model | Policy | Registration |
|-------|--------|-------------|
| Organization | TeamPolicy | Explicit in PolicyServiceProvider |
| Invoice | InvoicePolicy | Auto-discovery (exists but not explicitly registered) |
| Customer | CustomerPolicy | Auto-discovery (exists but not explicitly registered) |

### Rate Limiting
- Login: 5/minute per email+IP
- Two-factor: 5/minute per session
- Public invoice views: 60/minute
- Public PDF downloads: 10/minute

### Authentication Stack
- Fortify handles login, registration, password reset, email verification, 2FA
- Sanctum for API token authentication
- Session-based auth with `AuthenticateSession` middleware
- HTTPS forced in production

---

## 10. Multi-Currency System

### Supported Currencies (9)

| Code | Symbol | Name | Subunit | Special |
|------|--------|------|---------|---------|
| INR | ₹ | Indian Rupee | Paise | Lakh/crore grouping |
| USD | $ | US Dollar | Cents | Standard |
| EUR | Euro | Euro | Cents | Standard |
| GBP | £ | British Pound | Pence | Standard |
| AUD | A$ | Australian Dollar | Cents | Standard |
| CAD | C$ | Canadian Dollar | Cents | Standard |
| SGD | S$ | Singapore Dollar | Cents | Standard |
| JPY | ¥ | Japanese Yen | - | Zero decimal |
| AED | د.إ | UAE Dirham | Fils | Standard |

### Tax Templates by Currency

| Currency | Templates |
|----------|-----------|
| INR | CGST 9%, SGST 9%, IGST 18%, GST 5/12/28%, TDS 10% |
| AED | VAT 5%, VAT 0%, VAT Exempt, Excise Tax 50/99% |
| USD | Sales Tax 4/6/8.25%, No Tax |
| EUR | VAT 7/19%, VAT 0% |
| GBP | VAT 5/20%, VAT 0% |

---

## 11. Invoice Numbering System

### Format Tokens

| Token | Output | Example |
|-------|--------|---------|
| `{PREFIX}` | Series prefix | INV, EST |
| `{YEAR}` | Full year | 2026 |
| `{YEAR:2}` | 2-digit year | 26 |
| `{MONTH}` | Month (01-12) | 02 |
| `{MONTH:3}` | Abbreviation | Feb |
| `{DAY}` | Day (01-31) | 23 |
| `{SEQUENCE}` | Number | 1 |
| `{SEQUENCE:4}` | Padded | 0001 |
| `{FY}` | Financial year | 2025-26 |
| `{FY_START}` | FY start year | 2025 |
| `{FY_END}` | FY end year | 2026 |

### Examples
- Standard: `INV-2026-02-0001`
- Financial Year: `INV-2025-26-0001`
- Location-specific: `DXB-INV-2026-0001`
- Simple: `EST-0001`

---

## 12. Email System

### Document Emails (DocumentMailer)
- Queued via `ShouldQueue`
- Custom subject and body support
- CC recipients
- PDF attachment option
- Auto-detects invoice vs estimate for template selection
- Generates public view URLs using ULID

### Team Invitation Emails
- Signed URL for secure acceptance
- Markdown template
- Expires naturally (no explicit TTL)

---

## 13. PDF Generation

### Architecture
- Chrome HTTP service running Puppeteer in Docker
- Laravel renders HTML template, posts to Chrome service
- Chrome converts HTML to A4 PDF
- Config: `CHROME_SERVICE_URL` (default `http://chrome:3000`)

### Endpoints
- `POST /generate-pdf` - Accepts `{html, options}` JSON
- `GET /health` - Health check

---

## 14. Testing Infrastructure

### Test Suite Summary
- **Framework**: Pest v4 with Playwright for browser tests
- **Total Tests**: 737 passing, 4 skipped
- **Coverage**: 94.7%
- **Database**: RefreshDatabase trait on ALL tests

### Test Categories

| Category | Location | Count | Coverage |
|----------|----------|-------|----------|
| Unit - Models | tests/Unit/Models/ | ~100 | All 11 models |
| Unit - Services | tests/Unit/Services/ | ~30 | InvoiceCalculator, PdfService |
| Unit - Casts | tests/Unit/Casts/ | ~20 | All custom casts |
| Unit - Enums | tests/Unit/Enums/ | ~10 | FinancialYearType, etc. |
| Unit - Livewire | tests/Unit/Livewire/ | ~30 | OrganizationSetup, CustomerManager |
| Feature - Auth | tests/Feature/ | ~50 | Registration, login, 2FA, profile |
| Feature - Actions | tests/Feature/ | ~40 | Fortify & Jetstream actions |
| Browser | tests/Browser/ | ~30 | 10 test files, Playwright |

### Test Helpers (`tests/TestHelpers.php`)
- `createUserWithTeam()` - User + personal org + team context
- `createOrganizationWithLocation()` - Org with primary location + FY
- `createCustomerWithLocation()` - Customer with location
- `createInvoiceWithItems()` - Invoice with line items + relationships
- `createLocation()` - Polymorphic location creation

### Factory States (60+)
- **UserFactory**: withPersonalTeam, withBusinessOrganization, persona states
- **OrganizationFactory**: country-specific (usCompany, indianCompany, uaeCompany), setup states, business types
- **InvoiceFactory**: type states, status states, currency states, industry states, amount ranges
- **InvoiceItemFactory**: service types, tax rates, edge cases
- **CustomerFactory**: industry-specific, geographic, relationship maturity states

---

## 15. Docker & Infrastructure

### Production Dockerfiles (3 variants)
1. `Dockerfile.nginx-fpm` - ServerSideUp PHP 8.5 FPM + Nginx (primary)
2. `Dockerfile.frankenphp` - FrankenPHP variant
3. `Dockerfile.standalone` - Standalone variant

### Multi-Stage Build
```
Stage 1: PHP Dependencies (composer install --no-dev)
Stage 2: Frontend Build (bun install + bun run build)
Stage 3: Clean App Assembly (merge PHP deps + frontend assets)
Stage 4: Production (PHP extensions + supervisor + nginx)
```

### PHP Extensions (Production)
pdo_pgsql, pgsql, redis, gd, bcmath, intl, exif

### Environment Defaults
- APP_ENV=production, APP_DEBUG=false
- LOG_CHANNEL=stderr (JSON formatter)
- SESSION_DRIVER=redis, CACHE_DRIVER=redis, QUEUE_CONNECTION=redis

### Chrome PDF Service
- Separate container: `docker/chrome/pdf-service.js`
- Node.js + Puppeteer, port 3000
- Health check at `/health`
- Per-request browser launch (no pooling)

---

## 16. Bugs & Issues

### Critical — All Resolved

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 1 | ~~team_user table missing FK constraints~~ | Database schema | **FIXED** — FK constraints added directly in `create_team_user_table.php` migration |

### High — All Resolved

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 2 | ~~InvoicePolicy vs CustomerPolicy inconsistency~~ | `app/Policies/` | **FIXED** — Both use `$user->allTeams()->contains()` consistently |
| 3 | ~~Policies not explicitly registered~~ | `PolicyServiceProvider` | **FIXED** — All 3 policies explicitly registered (TeamPolicy, InvoicePolicy, CustomerPolicy) |
| 4 | ~~DeleteUser doesn't handle team ownership~~ | `app/Actions/Jetstream/DeleteUser.php` | **FIXED** — Prevents deletion when owned orgs have members, purges sole-owner orgs, 11 new tests |
| 5 | ~~country_code type inconsistency~~ | Database schema | **FIXED** — All columns standardized to char(2) ISO 3166-1 alpha-2 in original migrations |

### Medium — All Resolved

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 6 | ~~InvoiceForm broad exception handling in mount()~~ | `app/Livewire/Traits/InvoiceFormLogic.php` | **FIXED** — No try-catch in mount(); added null-safe operator for orphaned location relationships |
| 7 | ~~OrganizationSetup redirects from render()~~ | `app/Livewire/OrganizationSetup.php` | **NON-ISSUE** — Redirect is in mount() (not render()), which is standard Livewire pattern |
| 8 | ~~array_column() on ContactCollection~~ | `app/Livewire/OrganizationSetup.php` | **ALREADY FIXED** — Code uses `->getEmails()` ContactCollection API |
| 9 | ~~BankDetailsCast nullable inconsistency~~ | `app/Casts/BankDetailsCast.php` | **FIXED** — `get()` now always returns BankDetails instance (empty() instead of null) |
| 10 | ~~NumberingSeriesManager validation gap~~ | `app/Livewire/NumberingSeriesManager.php` | **ALREADY FIXED** — Lines 102-114 validate location belongs to organization |
| 11 | ~~LogoutOtherBrowserSessionsForm~~ | `resources/views/profile/show.blade.php` | **FIXED** — Component only renders when session driver is 'database' |
| 12 | ~~No event listeners registered~~ | `app/Models/Organization.php` | **FIXED** — Removed unused $dispatchesEvents and 3 empty event classes; kept action-dispatched events as extension points |

### Low

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 13 | **InvoiceStatus 'accepted' unused** | Database check constraint | Status value exists in DB but not clearly used in application flow. |
| 14 | **Chrome PDF service single-browser-per-request** | `docker/chrome/pdf-service.js` | No connection pooling. Inefficient under load. |
| 15 | **ULID format not validated in routes** | `routes/web.php` | Invalid ULIDs hit database query instead of being rejected at route level. |

---

## 17. Improvements Needed

### Security Hardening (Priority: High)

1. ~~**Register all policies explicitly**~~ — **DONE** (PolicyServiceProvider registers all 3)
2. ~~**Align policy authorization logic**~~ — **DONE** (all use `allTeams()->contains()`)
3. ~~**Add FK constraints to team_user table**~~ — **DONE** (consolidated into original migration)
4. ~~**Implement team ownership transfer**~~ — **DONE** (DeleteUser prevents deletion when members exist, purges sole-owner orgs)
5. **Add rate limiting to password reset**
   - Prevent email enumeration via `/forgot-password`

### Code Quality (Priority: Medium)

6. ~~**Break down large Livewire views**~~ — **DONE** (17 Blade partials extracted from 3 views)
   - InvoiceForm: 6 partials (header, details, customer-address, items, attachments, email-modal)
   - OrganizationManager: 6 partials (header, form-basics, form-country, form-location, form-bank-details, list)
   - CustomerManager: 5 partials (header, form, locations, location-modal, list)

7. ~~**Extract shared location component**~~ — **DONE** (shared `partials/location-fields.blade.php`)
   - Reusable Blade partial for location address fields
   - Used by OrganizationManager form-location partial

8. ~~**Standardize country_code column types**~~ — **DONE** (already char(2) across all tables)
   - Verified: locations.country, teams.country_code, tax_templates.country_code all char(2)

9. ~~**Improve error handling in InvoiceForm mount()**~~ — **DONE** (no broad try-catch; added null-safe operators for orphaned relationships)

10. **Add interface layer for services**
    - Create `PdfGeneratorInterface`, `NumberingServiceInterface`
    - Improves testability and allows swapping implementations

### Testing (Priority: Medium)

11. ~~**Add security isolation tests**~~ — **DONE** (46 + 16 = 62 tests)
    - `tests/Feature/Security/SecurityIsolationTest.php` (46 tests)
    - `tests/Feature/Security/OnboardingFlowTest.php` (16 tests)

12. ~~**Add PDF service integration tests**~~ — **DONE** (10 tests)
    - Mock-based HTTP service flow, error handling (ConnectionException, RequestException)
    - Download response headers, Chrome disabled handling
    - `tests/Feature/Services/PdfServiceIntegrationTest.php`

13. ~~**Add email attachment tests**~~ — **DONE** (12 tests)
    - CC recipients, custom body/subject, multiple recipients, public URLs
    - `tests/Feature/Mail/DocumentMailerIntegrationTest.php`

14. ~~**Add edge case tests for numbering service**~~ — **DONE** (17 tests)
    - Monthly/FY reset boundaries, FY validation errors
    - Format tokens (DAY, MONTH:3, FY, FY_START, FY_END), createDefaultSeries idempotency
    - `tests/Feature/Services/NumberingServiceEdgeCaseTest.php`

### Performance (Priority: Low)

15. **Add browser pool to Chrome PDF service**
    - Use `puppeteer-cluster` for connection pooling
    - Significantly improves PDF generation throughput

16. **Review N+1 queries in Livewire components**
    - Ensure eager loading on all relationship access
    - Add query logging in development

17. **Implement caching for tax templates**
    - Tax templates rarely change, ideal for caching
    - Cache per organization with invalidation on update

### UX Improvements (Priority: Low)

18. **Add email preview before send**
    - Show rendered email body before sending
    - Reduce accidental sends

19. **Add loading states for all async operations**
    - PDF generation, email sending, form saves
    - Wire:loading indicators throughout

20. **Implement invoice payment tracking**
    - Record partial payments
    - Payment history per invoice
    - Auto-update status on full payment

---

## 18. Future Roadmap

### Phase Next: Stability & Security
- [x] Fix all Critical and High bugs (items 1-5) — **DONE**
- [x] Register all policies explicitly — **DONE**
- [x] Add team_user FK constraints — **DONE**
- [x] Security isolation test suite — **DONE** (62 tests)
- [x] PDF service integration tests — **DONE** (10 tests)
- [x] Email attachment tests — **DONE** (12 tests)
- [x] Numbering service edge case tests — **DONE** (17 tests)
- [x] Break down large Livewire views — **DONE** (17 partials)
- [x] Standardize country_code columns — **DONE** (already consistent)
- [ ] Fix medium bugs (items 6-12)
- [ ] Add rate limiting to password reset

### Phase After: Feature Completion
- [ ] Payment tracking system
- [ ] Recurring invoices
- [ ] Dashboard analytics (revenue charts, outstanding amounts)
- [ ] Customer portal (view all invoices, pay online)
- [ ] Bulk operations (send multiple invoices, export CSV)

### Long-term Vision
- [ ] Custom domain support per organization
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Multi-language support (i18n infrastructure exists)
- [ ] Advanced reporting and analytics
- [ ] API for third-party integrations
- [ ] Webhook system for external automation
- [ ] Mobile-optimized progressive web app
- [ ] AI-powered invoice data extraction from photos

---

## Models Reference

### Enums

| Enum | Values |
|------|--------|
| `Currency` | INR, USD, EUR, GBP, AUD, CAD, SGD, JPY, AED |
| `InvoiceStatus` | draft, sent, accepted, paid, void |
| `ResetFrequency` | NEVER, YEARLY, MONTHLY, FINANCIAL_YEAR |
| `Country` | Multiple countries with defaults |
| `FinancialYearType` | Various FY systems by country |

### Value Objects

| Class | Purpose | Fields |
|-------|---------|--------|
| `ContactCollection` | Immutable contact list | name, email per entry |
| `BankDetails` | Bank account info | accountName, accountNumber, bankName, ifsc, branch, swift, pan |
| `InvoiceTotals` | Calculation results | subtotal, tax, total (all in cents) |

### Custom Casts

| Cast | Model Column | Conversion |
|------|-------------|------------|
| `ContactCollectionCast` | emails (json) | JSON <-> ContactCollection |
| `BankDetailsCast` | bank_details (json) | JSON <-> BankDetails |
| `ExchangeRateCast` | exchange_rate (bigint) | Micro-units <-> decimal string |

---

**Document Status**: Comprehensive audit complete
**Branch**: `with-jetstream` (post-Jetstream removal, Livewire v4)
**Last Test Run**: 839 passing, 4 skipped, 94.7%+ coverage
**Last Bug Fix Session**: 2026-02-24 — All critical & high bugs resolved
**Last Test Session**: 2026-02-24 — PRD improvements #6-8, #11-14 completed (101 new tests)
