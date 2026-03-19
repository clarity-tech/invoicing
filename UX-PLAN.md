# UX Improvement Plan

## Target: Small business users in India (and UAE/international)

### Phase 1: Quick Wins (Input Clarity + Date Standardization) ✅
- [x] Replace "Rate (cents)" with "Unit Price" and "Tax (bps)" with "Tax Rate"
- [x] Add currency symbol prefix to price input, % suffix to tax rate input
- [x] Convert unit_price display (cents→rupees) and tax_rate display (bps→percentage)
- [x] Add format hints for GSTIN (placeholder + hint text in LocationModal)
- [x] Add format hints for SAC code ("6-digit code" hint in ItemRow)
- [x] Standardize date formatting to `en-IN` locale across Vue components
- [x] Created shared `useFormatDate` composable

### Phase 2: Real-Time Validation ✅
- [x] Add inline email validation on blur in CustomerForm
- [x] Add contact name validation (required when email provided)
- [x] Add customer name required validation on blur
- [x] Add GSTIN format validation with regex + auto-uppercase in LocationModal
- [x] Show password requirements on Register page ("at least 8 characters")
- [x] Add password mismatch detection on Register page
- [x] Add required field validation on blur in LocationModal (name, address, city, state, country)

### Phase 3: Loading States & Feedback ✅
- [x] CustomerForm submit button shows "Saving..." when processing
- [x] LocationModal submit button shows "Saving..." when processing
- [x] Invoice delete with loading state
- [x] Customer delete with loading state
- [x] Duplicate button shows "Duplicating..." and disables during operation
- [x] Convert button shows "Converting..." and disables during operation
- [x] PDF download button shows spinner + "Generating..." with auto-reset

### Phase 4: Onboarding & Empty States ✅
- [x] Improve empty state for Invoices page (icon + guided CTAs)
- [x] Improve empty state for Customers page (icon + Add Customer button)
- [x] Improve empty state for Organizations page (icon + descriptive text)

### Phase 5: Accessibility ✅
- [x] Add `role="dialog"` and `aria-modal="true"` to EmailModal (already had it)
- [x] Add `role="dialog"` and `aria-modal="true"` to Customer form modal
- [x] Add `role="dialog"` and `aria-modal="true"` to LocationModal
- [x] Add `role="dialog"` and `aria-modal="true"` to ConfirmationModal
- [x] Add skip-to-content link in AppLayout
- [x] Add `id="main-content"` to `<main>` element
- [x] Add password visibility toggle on Login page
- [x] Add password visibility toggle on Register page (both fields)

### Phase 6: Mobile & Responsive Fixes ✅
- [x] Fix EmailModal width (max-w-5xl → responsive breakpoints)
- [x] Add horizontal scroll for tables (overflow-x-auto) on Invoices page
- [x] Add horizontal scroll for tables (overflow-x-auto) on Customers page

### Phase 7: Confirmation & Safety ✅
- [x] Replace browser confirm() with ConfirmationModal for org deletion
- [x] Replace browser confirm() with ConfirmationModal for location deletion

### Phase 8: Contextual Help & Polish ✅
- [x] Add search/filter to Customers page (name, email, phone)
- [x] Standardize button colors to brand palette in Organizations page
