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
- [x] Invoice delete with loading state (`deleting` ref + `onFinish`)
- [x] Customer delete with loading state
- [x] Duplicate button shows "Duplicating..." and disables during operation
- [x] Convert button shows "Converting..." and disables during operation
- [x] PDF download button shows spinner + "Generating..." with 5s auto-reset
- [ ] Add skeleton/loading states for Dashboard cards
- [ ] Add success toast/flash for organization create/update

### Phase 4: Onboarding & Empty States
- [ ] Add "Getting Started" checklist widget on empty Dashboard
- [ ] Improve empty state for Customers page (illustration + guided CTA)
- [ ] Improve empty state for Invoices page (show prerequisites)
- [ ] Improve empty state for Organizations page
- [ ] Add first-time user detection and onboarding hints

### Phase 5: Accessibility
- [x] Add `role="dialog"` and `aria-modal="true"` to EmailModal (already had it)
- [ ] Add skip-to-content link in AppLayout
- [ ] Add focus trapping in all modals
- [ ] Add focus management (auto-focus first input on modal open)
- [ ] Add keyboard navigation for table rows
- [ ] Add password visibility toggle on auth pages

### Phase 6: Mobile & Responsive Fixes
- [ ] Fix EmailModal width (max-w-5xl → responsive)
- [ ] Fix invoice line item input widths for mobile
- [ ] Add visual scroll indicator for horizontal-scrolling tables
- [ ] Ensure all modals are full-width on mobile (w-full sm:max-w-xl)

### Phase 7: Confirmation & Safety
- [ ] Replace browser confirm() with ConfirmationModal for org deletion
- [ ] Replace browser confirm() with ConfirmationModal for location deletion
- [ ] Add confirmation for numbering series deactivation
- [ ] Add confirmation for setting default series

### Phase 8: Contextual Help & Polish
- [ ] Add tooltips for GSTIN, SAC code, financial year fields
- [ ] Add tooltip/help for numbering format tokens (make more discoverable)
- [ ] Standardize button colors to brand palette
- [ ] Add search/filter to Customers page
- [ ] Consistent spacing across all forms
