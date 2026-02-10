# Test Coverage Analysis

## Current State

**Overall coverage: 33.3%** (2 tests, 2 assertions)

| File | Coverage | Notes |
|------|----------|-------|
| `Http/Controllers/Controller` | 100% | Empty base class — trivially covered |
| `Models/User` | 0% | No tests at all |
| `Providers/AppServiceProvider` | 100% | Empty `register()`/`boot()` — trivially covered |

The two existing test files are Laravel scaffolding defaults:

- `tests/Unit/ExampleTest.php` — asserts `true === true`
- `tests/Feature/ExampleTest.php` — asserts `GET /` returns HTTP 200

**No real application logic is tested.** The 100% coverage on `Controller` and `AppServiceProvider` is meaningless since those files contain no logic.

---

## Areas Requiring Test Coverage

Based on the PRD and codebase, the following areas need tests organized by priority.

### Priority 1 — Models & Relationships

These are the foundation everything else depends on.

| What to test | Type | Details |
|---|---|---|
| **User model** | Unit | Factory-based creation, attribute casting (`email_verified_at`, hashed `password`), fillable/guarded attributes |
| **Company model** | Unit | CRUD, `emails` JSON cast, `hasMany` locations, `belongsTo` primary location |
| **Customer model** | Unit | CRUD, `emails` JSON cast, `hasMany` locations, `belongsTo` primary location |
| **Location model** (polymorphic) | Unit | Polymorphic `locatable` morphTo relationship for both Company and Customer |
| **Currency model** | Unit | Basic CRUD, default currency seeding |
| **Invoice model** | Unit | `type` enum (invoice/estimate), `status` enum (draft/sent/paid/void), relationships to company/customer locations, `hasMany` items, UUID generation |
| **InvoiceItem model** | Unit | `belongsTo` invoice, monetary integer storage, calculated fields |

**Suggested tests:**
```php
// tests/Unit/Models/UserTest.php
test('user can be created with factory', function () { ... });
test('password is automatically hashed', function () { ... });

// tests/Unit/Models/CompanyTest.php
test('company has many locations', function () { ... });
test('company emails are cast to EmailCollection', function () { ... });

// tests/Unit/Models/InvoiceTest.php
test('invoice has many items', function () { ... });
test('invoice belongs to company location', function () { ... });
test('invoice belongs to customer location', function () { ... });
test('invoice type is cast to enum', function () { ... });
test('invoice status is cast to enum', function () { ... });
```

---

### Priority 2 — Value Objects & Custom Casts

The PRD specifies custom casting logic for email handling — this is core business logic that is error-prone and must be unit tested.

| What to test | Type | Details |
|---|---|---|
| **EmailCollection Value Object** | Unit | Construction from array, adding/removing emails, validation of email format, serialization to JSON, immutability |
| **EmailCollectionCast** | Unit | `get()` converts JSON string → `EmailCollection`, `set()` converts `EmailCollection` → JSON string, handles null/empty values, round-trip integrity |

**Suggested tests:**
```php
// tests/Unit/ValueObjects/EmailCollectionTest.php
test('can be created from array of emails', function () { ... });
test('rejects invalid email addresses', function () { ... });
test('can add an email', function () { ... });
test('can remove an email', function () { ... });
test('serializes to json array', function () { ... });
test('handles empty collection', function () { ... });

// tests/Unit/Casts/EmailCollectionCastTest.php
test('get converts json to EmailCollection', function () { ... });
test('set converts EmailCollection to json', function () { ... });
test('handles null value gracefully', function () { ... });
```

---

### Priority 3 — Services (Business Logic)

Services contain the most complex business logic and are the highest-risk code.

| What to test | Type | Details |
|---|---|---|
| **InvoiceCalculator** | Unit | Subtotal calculation from line items, tax calculation per item, total calculation (subtotal + tax), integer arithmetic (no floating point), edge cases: zero quantity, zero price, no items |
| **EstimateToInvoiceConverter** | Unit | Creates invoice from estimate, copies all items, sets correct type/status, preserves monetary values, does not delete original estimate |

**Suggested tests:**
```php
// tests/Unit/Services/InvoiceCalculatorTest.php
test('calculates subtotal from line items', function () { ... });
test('calculates tax per item using tax rate', function () { ... });
test('calculates total as subtotal plus tax', function () { ... });
test('handles invoice with no items', function () { ... });
test('uses integer arithmetic for monetary values', function () { ... });

// tests/Unit/Services/EstimateToInvoiceConverterTest.php
test('converts estimate to invoice', function () { ... });
test('copies all items to new invoice', function () { ... });
test('sets invoice type to invoice', function () { ... });
test('sets status to draft', function () { ... });
test('preserves original estimate', function () { ... });
```

---

### Priority 4 — Feature / HTTP Tests

These test the full request lifecycle and ensure routes, controllers, middleware, and views work together.

| What to test | Type | Details |
|---|---|---|
| **Company CRUD** | Feature | Index/create/store/edit/update/destroy — auth required, validation rules, redirect behavior |
| **Customer CRUD** | Feature | Same as Company |
| **Invoice/Estimate CRUD** | Feature | Creation wizard, status transitions, listing with filters by type |
| **Public document view** | Feature | `/invoices/{uuid}` and `/estimates/{uuid}` accessible without auth, returns correct document, 404 for invalid UUID |
| **Email sending** | Feature | Sending document emails, recipient selection from EmailCollection, mail facade assertions |

**Suggested tests:**
```php
// tests/Feature/CompanyTest.php
test('authenticated user can create a company', function () { ... });
test('company requires a name', function () { ... });
test('authenticated user can update a company', function () { ... });
test('guest cannot access company pages', function () { ... });

// tests/Feature/InvoiceTest.php
test('authenticated user can create an invoice', function () { ... });
test('invoice number must be unique', function () { ... });
test('invoice status can transition from draft to sent', function () { ... });

// tests/Feature/PublicDocumentTest.php
test('invoice is viewable via public uuid link', function () { ... });
test('invalid uuid returns 404', function () { ... });
```

---

### Priority 5 — Livewire Component Tests

Livewire components contain UI logic that can be tested without a browser.

| What to test | Type | Details |
|---|---|---|
| **Company/Customer form components** | Feature | Livewire `test()` helper — form submission, validation errors, nested email management |
| **Invoice wizard component** | Feature | Multi-step flow, adding/removing line items, live total calculation |
| **Email modal component** | Feature | Recipient selection, email dispatch trigger |

**Suggested tests:**
```php
// tests/Feature/Livewire/CompanyFormTest.php
test('can render company form', function () {
    Livewire::test(CompanyForm::class)->assertStatus(200);
});
test('can save company with valid data', function () { ... });
test('shows validation errors for invalid data', function () { ... });
test('can add and remove emails', function () { ... });
```

---

### Priority 6 — Database & Migration Tests

| What to test | Type | Details |
|---|---|---|
| **Migrations** | Feature | All migrations run and rollback cleanly |
| **Factories** | Unit | All model factories produce valid models |
| **Seeders** | Feature | DatabaseSeeder runs without errors |

---

## Recommended Testing Infrastructure Improvements

1. **Enable `RefreshDatabase` trait** — Currently commented out in `tests/TestCase.php`. This should be enabled for any test touching the database.

2. **Add coverage threshold to CI** — Update `tests.yaml` to run `php artisan test --coverage --min=80` so PRs that drop coverage below 80% fail the pipeline.

3. **Create model factories** as each model is built — `CompanyFactory`, `CustomerFactory`, `LocationFactory`, `InvoiceFactory`, `InvoiceItemFactory`, `CurrencyFactory`.

4. **Organize test directories** to mirror the app structure:
   ```
   tests/
   ├── Unit/
   │   ├── Models/
   │   ├── ValueObjects/
   │   ├── Casts/
   │   └── Services/
   └── Feature/
       ├── Livewire/
       └── Http/
   ```

5. **Add Pest architecture tests** using Pest's `arch()` function:
   ```php
   arch('models extend Model')
       ->expect('App\Models')
       ->toExtend('Illuminate\Database\Eloquent\Model');

   arch('controllers have no public properties')
       ->expect('App\Http\Controllers')
       ->not->toHavePublicProperties();
   ```

6. **Delete placeholder tests** — `ExampleTest.php` files in both Unit and Feature directories provide no value and should be removed once real tests exist.

---

## Summary

| Priority | Area | Estimated Test Count | Current Coverage |
|----------|------|---------------------|-----------------|
| 1 | Models & Relationships | ~25-30 tests | 0% |
| 2 | Value Objects & Casts | ~10-12 tests | 0% (not yet built) |
| 3 | Services | ~10-15 tests | 0% (not yet built) |
| 4 | HTTP / Feature tests | ~20-25 tests | 1 trivial test |
| 5 | Livewire Components | ~15-20 tests | 0% (not yet built) |
| 6 | Database & Migrations | ~5-8 tests | 0% |
| **Total** | | **~85-110 tests** | **33.3% (artificial)** |

The most impactful first step is to write tests for the **User model** (the only existing model with 0% coverage), then build tests alongside each new model and service as described in the PRD.
