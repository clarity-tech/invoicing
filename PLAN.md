# Invoice Numbering Series System Implementation Plan

## Overview
Transform the current global unique invoice numbering system into an organization+location-scoped system with configurable series support for invoices only.

## Current Status
🔄 **IN PROGRESS** - Phase 1: Database Structure

## Phase 1: Database Structure & Migration ⚠️ IN PROGRESS
- [x] **Create `InvoiceNumberingSeries` model** with fields:
  - `organization_id`, `location_id` (nullable for org-wide series)
  - `name`, `prefix`, `current_number`, `format_pattern`
  - `reset_frequency` (yearly/monthly/never)
  - `is_active`, `is_default`
- [ ] **Modify invoice constraints**: Remove global unique constraint, add organization-scoped uniqueness
- [ ] **Data migration**: Convert existing invoice numbers to new system structure
- [ ] **Add foreign key relationships** between invoices and numbering series

## Phase 2: Core Service Implementation
- [ ] **Create `InvoiceNumberingService`** with methods:
  - `generateInvoiceNumber($organization, $location, $seriesName)`
  - `getNextNumber($series)` with atomic counter increment
  - `createDefaultSeries($organization)` for new orgs
  - `validateNumberUniqueness($number, $organization)`
- [ ] **Thread-safe implementation** using database transactions
- [ ] **Series reset logic** based on frequency settings
- [ ] **Format pattern support** (e.g., `{PREFIX}-{YEAR}{SEQUENCE:4}`)

## Phase 3: Model Integration
- [ ] **Update Invoice model**: Add `invoice_numbering_series_id` relationship
- [ ] **Update Organization model**: Add `numberingSeries()` relationship
- [ ] **Update existing generators**: Refactor InvoiceWizard and EstimateToInvoiceConverter
- [ ] **Factory updates**: Use new service in InvoiceFactory

## Phase 4: Testing & Validation
- [ ] **Unit tests**: Service logic, number generation, uniqueness validation
- [ ] **Integration tests**: Invoice creation with series
- [ ] **Migration tests**: Ensure existing data converts properly
- [ ] **Edge cases**: Concurrent requests, series rollover, location changes

## Phase 5: UI Integration (Future)
- [ ] **Series management**: Livewire component for organization settings
- [ ] **Series preview**: Show next number format
- [ ] **Bulk series setup**: Configure multiple locations at once

## Expected Outcomes
- ✅ Organization A: INV-2025-001, INV-2025-002 (Series 1)
- ✅ Organization A: INV-Dubai-001, INV-Dubai-002 (Series 2 - Dubai location)
- ✅ Organization B: INV-2025-001, INV-2025-002 (Independent series)
- ✅ Thread-safe number generation
- ✅ Configurable formats per organization
- ✅ Backward compatibility with existing invoices

## Technical Implementation Details

### Database Schema
```sql
CREATE TABLE invoice_numbering_series (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES teams(id),
    location_id BIGINT NULL REFERENCES locations(id),
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(20) DEFAULT 'INV',
    format_pattern VARCHAR(255) DEFAULT '{PREFIX}-{YEAR}{SEQUENCE:4}',
    current_number INT DEFAULT 0,
    reset_frequency ENUM('never', 'yearly', 'monthly') DEFAULT 'yearly',
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    last_reset_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Service Interface
```php
interface InvoiceNumberingService {
    public function generateInvoiceNumber(Organization $org, ?Location $location = null, ?string $seriesName = null): string;
    public function getNextNumber(InvoiceNumberingSeries $series): int;
    public function createDefaultSeries(Organization $organization): InvoiceNumberingSeries;
    public function validateNumberUniqueness(string $number, Organization $organization): bool;
}
```

## Current Progress Log
- **2025-07-17**: Started implementation
  - [x] Created InvoiceNumberingSeries model and migration
  - [x] Defined database schema with proper constraints and indexes
  - [ ] Working on invoice table constraint modifications

## Next Steps
1. Complete database migration for invoice table constraints
2. Create the core numbering service
3. Integrate with existing Invoice model
4. Test with existing invoice creation flows

## Success Criteria
- [x] Database structure supports organization+location scoped numbering
- [ ] Service generates unique numbers per organization
- [ ] Existing invoices continue to work after migration
- [ ] New invoices use the series system
- [ ] Performance is maintained with proper indexing
- [ ] All existing tests continue to pass