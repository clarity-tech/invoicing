<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import MoneyDisplay from '@/Components/MoneyDisplay.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import type { Invoice, InvoiceStatus } from '@/types';

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const props = defineProps<{
    invoices: PaginatedInvoices;
    filters: { type: string | null; status: string | null };
    statusOptions: Record<string, string>;
}>();

const activeTab = ref<string>(props.filters.type ?? 'all');
const statusFilter = ref<string>(props.filters.status ?? '');

function applyFilters() {
    const params: Record<string, string> = {};
    if (activeTab.value !== 'all') {
        params.type = activeTab.value;
    }
    if (statusFilter.value) {
        params.status = statusFilter.value;
    }
    router.get('/invoices', params, { preserveState: true, replace: true });
}

function setTab(tab: string) {
    activeTab.value = tab;
    applyFilters();
}

function onStatusChange() {
    applyFilters();
}

// Delete
const confirmingDelete = ref(false);
const invoiceToDelete = ref<Invoice | null>(null);

function confirmDelete(invoice: Invoice) {
    invoiceToDelete.value = invoice;
    confirmingDelete.value = true;
}

const deleting = ref(false);
const duplicating = ref<number | null>(null);
const converting = ref<number | null>(null);

function deleteInvoice() {
    if (!invoiceToDelete.value) return;
    deleting.value = true;
    router.delete(`/invoices/${invoiceToDelete.value.id}`, {
        preserveScroll: true,
        onSuccess: () => { confirmingDelete.value = false; invoiceToDelete.value = null; },
        onFinish: () => { deleting.value = false; },
    });
}

function duplicateInvoice(invoice: Invoice) {
    duplicating.value = invoice.id;
    router.post(`/invoices/${invoice.id}/duplicate`, {}, {
        preserveScroll: true,
        onFinish: () => { duplicating.value = null; },
    });
}

function convertEstimate(invoice: Invoice) {
    converting.value = invoice.id;
    router.post(`/invoices/${invoice.id}/convert`, {}, {
        preserveScroll: true,
        onFinish: () => { converting.value = null; },
    });
}

function publicUrl(invoice: Invoice): string {
    return invoice.type === 'invoice'
        ? `/invoices/view/${invoice.ulid}`
        : `/estimates/view/${invoice.ulid}`;
}

function pdfUrl(invoice: Invoice): string {
    return invoice.type === 'invoice'
        ? `/invoices/${invoice.ulid}/pdf`
        : `/estimates/${invoice.ulid}/pdf`;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'invoice', label: 'Invoices' },
    { key: 'estimate', label: 'Estimates' },
];
</script>

<template>
    <AppLayout title="Invoices & Estimates">
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">Invoices & Estimates</h2>
                <div class="flex gap-2">
                    <a
                        href="/estimates/create"
                        class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                    >
                        Create Estimate
                    </a>
                    <a
                        href="/invoices/create"
                        class="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
                    >
                        Create Invoice
                    </a>
                </div>
            </div>
        </template>

        <div class="py-4">
            <!-- Filter Tabs and Status -->
            <div class="mb-4 flex items-center justify-between">
                <div class="flex gap-1 rounded-lg bg-gray-100 p-1">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        type="button"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                        @click="setTab(tab.key)"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <select
                    v-model="statusFilter"
                    class="rounded-md border-gray-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    @change="onStatusChange"
                >
                    <option value="">All Statuses</option>
                    <option v-for="(label, value) in statusOptions" :key="value" :value="value">{{ label }}</option>
                </select>
            </div>

            <!-- Table -->
            <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Number</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="invoice in invoices.data" :key="invoice.id" class="hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4">
                                <span
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    :class="invoice.type === 'invoice' ? 'bg-brand-100 text-brand-800' : 'bg-green-100 text-green-800'"
                                >
                                    {{ invoice.type.toUpperCase() }}
                                </span>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {{ invoice.customer?.name ?? 'N/A' }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right">
                                <div class="text-sm font-medium text-gray-900">
                                    <MoneyDisplay :amount="invoice.total" :currency="invoice.currency" />
                                </div>
                                <div v-if="invoice.tax > 0" class="text-xs text-gray-500">
                                    Tax: <MoneyDisplay :amount="invoice.tax" :currency="invoice.currency" />
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <StatusBadge :status="invoice.status" />
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {{ formatDate(invoice.issued_at) }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div class="flex items-center justify-end gap-2">
                                    <a :href="publicUrl(invoice)" target="_blank" class="text-green-600 hover:text-green-900">View</a>
                                    <a :href="`/invoices/${invoice.id}/edit`" class="text-brand-600 hover:text-brand-900">Edit</a>
                                    <a :href="pdfUrl(invoice)" class="text-red-600 hover:text-red-900">PDF</a>
                                    <button type="button" class="text-gray-600 hover:text-gray-900 disabled:opacity-50" :disabled="duplicating === invoice.id" @click="duplicateInvoice(invoice)">{{ duplicating === invoice.id ? 'Duplicating...' : 'Duplicate' }}</button>
                                    <button
                                        v-if="invoice.type === 'estimate'"
                                        type="button"
                                        class="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                        :disabled="converting === invoice.id"
                                        @click="convertEstimate(invoice)"
                                    >
                                        {{ converting === invoice.id ? 'Converting...' : 'Convert' }}
                                    </button>
                                    <button type="button" class="text-red-600 hover:text-red-900" @click="confirmDelete(invoice)">Delete</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="invoices.data.length === 0">
                            <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500">
                                No documents found.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <nav v-if="invoices.last_page > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div class="hidden sm:block">
                        <p class="text-sm text-gray-700">
                            Showing page <span class="font-medium">{{ invoices.current_page }}</span> of <span class="font-medium">{{ invoices.last_page }}</span>
                            ({{ invoices.total }} total)
                        </p>
                    </div>
                    <div class="flex flex-1 justify-between sm:justify-end gap-2">
                        <template v-for="link in invoices.links" :key="link.label">
                            <button
                                v-if="link.url"
                                type="button"
                                class="relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
                                :class="link.active ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
                                @click="router.get(link.url!)"
                                v-html="link.label"
                            />
                            <span
                                v-else
                                class="relative inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
                                v-html="link.label"
                            />
                        </template>
                    </div>
                </nav>
            </div>
        </div>

        <!-- Delete Confirmation -->
        <ConfirmationModal
            :show="confirmingDelete"
            title="Delete Document"
            message="Are you sure you want to delete this document? This action cannot be undone."
            confirm-label="Delete"
            :destructive="true"
            @confirm="deleteInvoice"
            @cancel="confirmingDelete = false"
        />
    </AppLayout>
</template>
