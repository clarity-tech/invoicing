<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import InvoiceForm from '@/Components/Invoice/InvoiceForm.vue';
import type { Customer, Location, TaxTemplate, InvoiceNumberingSeries } from '@/types';

defineProps<{
    type: 'invoice' | 'estimate';
    customers: Customer[];
    organizationLocations: Location[];
    taxTemplates: TaxTemplate[];
    numberingSeries: InvoiceNumberingSeries[];
    statusOptions: Record<string, string>;
    defaults: {
        organization_id: number | null;
        organization_location_id: number | null;
        invoice_numbering_series_id: number | null;
        issued_at: string;
        due_at: string;
        currency: string;
    };
}>();
</script>

<template>
    <AppLayout :title="`Create ${type === 'estimate' ? 'Estimate' : 'Invoice'}`">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <InvoiceForm
                mode="create"
                :type="type"
                :customers="customers"
                :organization-locations="organizationLocations"
                :tax-templates="taxTemplates"
                :numbering-series="numberingSeries"
                :status-options="statusOptions"
                :defaults="defaults"
            />
        </div>
    </AppLayout>
</template>
