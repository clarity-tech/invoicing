# UX Improvement Plan

## Target: Small business users in India (and UAE/international)

### Phase 1: Quick Wins (Input Clarity + Date Standardization)
- [ ] Replace "Rate (cents)" with proper currency-labeled input (e.g., "Rate (₹)")
- [ ] Replace "Tax (bps)" with "Tax (%)" and convert basis points to percentage in UI
- [ ] Add currency symbol prefix/suffix to price input fields
- [ ] Add format hints for GSTIN (e.g., placeholder "29AAFCD9711R1ZV")
- [ ] Add format hints for phone, SAC code fields
- [ ] Standardize date formatting to `en-IN` locale (DD/MM/YYYY) across all Vue components
- [ ] Fix date format inconsistency between Blade (DD/MM/YYYY) and Vue (en-US)

### Phase 2: Real-Time Validation
- [ ] Add inline validation for email fields (on blur)
- [ ] Add GSTIN format validation with helpful error message
- [ ] Show password requirements on Register page before submission
- [ ] Add validation feedback on blur for required fields in CustomerForm
- [ ] Add validation feedback on blur for required fields in InvoiceForm
- [ ] Add validation feedback in LocationModal/LocationFields

### Phase 3: Loading States & Feedback
- [ ] Standardize all submit buttons to show "Saving..." text when processing
- [ ] Add skeleton/loading states for Dashboard cards
- [ ] Add loading spinner for PDF generation
- [ ] Add success toast/flash for customer create/update/delete
- [ ] Add success toast/flash for invoice create/update
- [ ] Add success toast/flash for organization create/update

### Phase 4: Onboarding & Empty States
- [ ] Add "Getting Started" checklist widget on empty Dashboard
- [ ] Improve empty state for Customers page (illustration + guided CTA)
- [ ] Improve empty state for Invoices page (show prerequisites)
- [ ] Improve empty state for Organizations page
- [ ] Add first-time user detection and onboarding hints

### Phase 5: Accessibility
- [ ] Add `role="dialog"` and `aria-modal="true"` to EmailModal
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
