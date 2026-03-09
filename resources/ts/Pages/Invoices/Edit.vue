<script setup lang="ts">
import InvoiceForm from '@/Components/Invoice/InvoiceForm.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import type {
    Invoice,
    Customer,
    Location,
    TaxTemplate,
    InvoiceNumberingSeries,
} from '@/types';

defineProps<{
    invoice: Invoice;
    customers: Customer[];
    organizationLocations: Location[];
    taxTemplates: TaxTemplate[];
    numberingSeries: InvoiceNumberingSeries[];
    statusOptions: Record<string, string>;
}>();
</script>

<template>
    <AppLayout
        :title="`Edit ${invoice.type === 'estimate' ? 'Estimate' : 'Invoice'}`"
    >
        <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <InvoiceForm
                mode="edit"
                :type="invoice.type"
                :invoice="invoice"
                :customers="customers"
                :organization-locations="organizationLocations"
                :tax-templates="taxTemplates"
                :numbering-series="numberingSeries"
                :status-options="statusOptions"
            />
        </div>
    </AppLayout>
</template>
