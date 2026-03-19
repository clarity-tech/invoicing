<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { Link, useForm, router, usePage } from '@inertiajs/vue3';
import ItemRow from './ItemRow.vue';
import EmailModal from './EmailModal.vue';
import { useInvoiceCalculator, type LineItem } from '@/composables/useInvoiceCalculator';
import { useFormatMoney } from '@/composables/useFormatMoney';
import type { Invoice, Customer, Location, TaxTemplate, InvoiceNumberingSeries, Currency } from '@/types';

const props = defineProps<{
    mode: 'create' | 'edit';
    type: 'invoice' | 'estimate';
    invoice?: Invoice;
    customers: Customer[];
    organizationLocations: Location[];
    taxTemplates: TaxTemplate[];
    numberingSeries: InvoiceNumberingSeries[];
    statusOptions: Record<string, string>;
    defaults?: {
        organization_id: number | null;
        organization_location_id: number | null;
        invoice_numbering_series_id: number | null;
        issued_at: string;
        due_at: string;
        currency: string;
    };
}>();

const { formatMoney } = useFormatMoney();
const showEmailModal = ref(false);
const downloadingPdf = ref(false);
let pdfTimer: ReturnType<typeof setTimeout> | null = null;

// Reset PDF loading state after download starts
watch(downloadingPdf, (val) => {
    if (val) {
        pdfTimer = setTimeout(() => { downloadingPdf.value = false; }, 5000);
    }
});

onUnmounted(() => {
    if (pdfTimer) clearTimeout(pdfTimer);
});

// Build initial items
function buildInitialItems(): LineItem[] {
    if (props.mode === 'edit' && props.invoice?.items?.length) {
        return props.invoice.items.map(item => ({
            description: item.description,
            sac_code: item.sac_code,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate,
        }));
    }
    return [{ description: '', sac_code: null, quantity: 1, unit_price: 0, tax_rate: 0 }];
}

const items = ref<LineItem[]>(buildInitialItems());
const { totals } = useInvoiceCalculator(items);

// Determine currency from selected customer
const selectedCustomerId = ref<number | null>(
    props.mode === 'edit' ? (props.invoice?.customer_id ?? null) : null
);

const selectedCustomer = computed(() =>
    props.customers.find(c => c.id === selectedCustomerId.value) ?? null
);

const customerLocations = computed(() =>
    selectedCustomer.value?.locations ?? []
);

const currentCurrency = computed<Currency>(() =>
    selectedCustomer.value?.currency ?? (props.defaults?.currency as Currency) ?? 'INR'
);

// Form
const form = useForm({
    type: props.type,
    organization_id: props.mode === 'edit'
        ? props.invoice!.organization_id
        : (props.defaults?.organization_id ?? null),
    customer_id: selectedCustomerId.value,
    organization_location_id: props.mode === 'edit'
        ? props.invoice!.organization_location?.id ?? null
        : (props.defaults?.organization_location_id ?? null),
    customer_location_id: props.mode === 'edit'
        ? (props.invoice!.customer_location?.id ?? null)
        : null as number | null,
    customer_shipping_location_id: props.mode === 'edit'
        ? (props.invoice!.customer_shipping_location?.id ?? null)
        : null as number | null,
    status: props.mode === 'edit'
        ? props.invoice!.status
        : 'draft',
    issued_at: props.mode === 'edit'
        ? (props.invoice!.issued_at?.split('T')[0] ?? '')
        : (props.defaults?.issued_at ?? ''),
    due_at: props.mode === 'edit'
        ? (props.invoice!.due_at?.split('T')[0] ?? '')
        : (props.defaults?.due_at ?? ''),
    invoice_numbering_series_id: props.defaults?.invoice_numbering_series_id ?? null as number | null,
    notes: props.mode === 'edit' ? (props.invoice!.notes ?? '') : '',
    items: [] as LineItem[],
});

// Sync items into form before submit
function syncItems() {
    form.items = items.value.map(item => ({
        ...item,
        tax_rate: item.tax_rate ?? 0,
    }));
}

// Customer change: auto-select primary location
watch(selectedCustomerId, (newId) => {
    form.customer_id = newId;
    if (!newId) {
        form.customer_location_id = null;
        form.customer_shipping_location_id = null;
        return;
    }
    const customer = props.customers.find(c => c.id === newId);
    if (customer) {
        const primaryId = customer.primary_location_id;
        const locs = customer.locations ?? [];
        const fallback = primaryId ?? locs[0]?.id ?? null;
        form.customer_location_id = fallback;
        form.customer_shipping_location_id = fallback;
    }
});

function addItem() {
    items.value.push({ description: '', sac_code: null, quantity: 1, unit_price: 0, tax_rate: 0 });
}

function removeItem(index: number) {
    if (items.value.length > 1) {
        items.value.splice(index, 1);
    }
}

function updateItem(index: number, item: LineItem) {
    items.value[index] = item;
}

function submit() {
    syncItems();

    if (props.mode === 'create') {
        form.post('/invoices', {
            preserveScroll: true,
        });
    } else {
        form.put(`/invoices/${props.invoice!.id}`, {
            preserveScroll: true,
        });
    }
}

function cancel() {
    router.get('/invoices');
}

const pageTitle = computed(() => {
    const typeLabel = props.type === 'estimate' ? 'Estimate' : 'Invoice';
    return props.mode === 'edit' ? `Edit ${typeLabel}` : `Create ${typeLabel}`;
});

// Selected location display
function formatLocation(location: Location | undefined): string {
    if (!location) return '';
    const parts = [location.address_line_1, location.address_line_2, location.city, location.state, location.postal_code, location.country].filter(Boolean);
    return parts.join(', ');
}

const selectedBillingLocation = computed(() =>
    customerLocations.value.find(l => l.id === form.customer_location_id)
);

const selectedShippingLocation = computed(() =>
    customerLocations.value.find(l => l.id === form.customer_shipping_location_id)
);

const page = usePage();
const flash = computed(() => (page.props as any).flash ?? {});
</script>

<template>
    <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <Link href="/invoices" class="text-brand-600 hover:text-brand-900">
                    &larr; Back to Invoices
                </Link>
                <h1 class="text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
            </div>
            <div v-if="mode === 'edit' && invoice?.ulid" class="flex space-x-2">
                <button
                    type="button"
                    class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    @click="showEmailModal = true"
                >
                    Send Email
                </button>
                <a
                    :href="`/${invoice.type === 'invoice' ? 'invoices' : 'estimates'}/view/${invoice.ulid}`"
                    target="_blank"
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    View Public
                </a>
                <a
                    :href="`/${invoice.type === 'invoice' ? 'invoices' : 'estimates'}/${invoice.ulid}/pdf`"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2"
                    @click="downloadingPdf = true"
                >
                    <svg v-if="downloadingPdf" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    {{ downloadingPdf ? 'Generating...' : 'Download PDF' }}
                </a>
            </div>
        </div>

        <!-- Flash message -->
        <div v-if="flash.success" class="mb-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded">
            {{ flash.success }}
        </div>
        <div v-if="flash.error" class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
            {{ flash.error }}
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <!-- Organization Location Section -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Organization Location</h2>
                <div v-if="organizationLocations.length > 0" class="max-w-md">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <select
                        v-model="form.organization_location_id"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option :value="null">Select location</option>
                        <option v-for="loc in organizationLocations" :key="loc.id" :value="loc.id">
                            {{ loc.name }} - {{ loc.city }}
                        </option>
                    </select>
                    <p v-if="form.errors.organization_location_id" class="text-red-600 text-sm mt-1">{{ form.errors.organization_location_id }}</p>
                </div>
                <div v-else class="bg-yellow-50 border border-yellow-200 rounded-md p-3 max-w-md">
                    <p class="text-sm text-yellow-700">
                        No locations found.
                        <a href="/organizations" class="font-medium underline" target="_blank">Add a location</a>
                    </p>
                </div>
            </div>

            <!-- Invoice Details Section -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                        <select
                            v-model="form.type"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :disabled="mode === 'edit'"
                        >
                            <option value="invoice">Invoice</option>
                            <option value="estimate">Estimate</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                            v-model="form.status"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option v-for="(label, value) in statusOptions" :key="value" :value="value">
                                {{ label }}
                            </option>
                        </select>
                        <p v-if="form.errors.status" class="text-red-600 text-sm mt-1">{{ form.errors.status }}</p>
                    </div>

                    <div v-if="type === 'invoice' && numberingSeries.length > 0 && mode === 'create'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Numbering Series</label>
                        <select
                            v-model="form.invoice_numbering_series_id"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option :value="null">Auto-select</option>
                            <option v-for="series in numberingSeries" :key="series.id" :value="series.id">
                                {{ series.name }}
                                {{ series.location ? `(${series.location.name})` : '(Org-wide)' }}
                            </option>
                        </select>
                        <p v-if="form.errors.invoice_numbering_series_id" class="text-red-600 text-sm mt-1">{{ form.errors.invoice_numbering_series_id }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                        <input
                            v-model="form.issued_at"
                            type="date"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <p v-if="form.errors.issued_at" class="text-red-600 text-sm mt-1">{{ form.errors.issued_at }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            v-model="form.due_at"
                            type="date"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <p v-if="form.errors.due_at" class="text-red-600 text-sm mt-1">{{ form.errors.due_at }}</p>
                    </div>
                </div>
            </div>

            <!-- Customer & Address Section -->
            <div class="bg-white shadow rounded-lg p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left: Customer & Billing -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                            <select
                                v-model="selectedCustomerId"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option :value="null">Select customer</option>
                                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                                    {{ customer.name }}
                                </option>
                            </select>
                            <p v-if="form.errors.customer_id" class="text-red-600 text-sm mt-1">{{ form.errors.customer_id }}</p>

                            <div v-if="customers.length === 0" class="mt-2 p-3 bg-brand-50 border border-brand-200 rounded-md">
                                <p class="text-sm text-brand-700">
                                    No customers found.
                                    <a href="/customers" class="font-medium underline" target="_blank">Create your first customer</a>
                                </p>
                            </div>
                        </div>

                        <div v-if="selectedCustomerId && customerLocations.length > 0" class="border border-gray-200 rounded-md p-4 bg-gray-50">
                            <h3 class="text-sm font-semibold text-gray-700 mb-2">Billing Address</h3>
                            <select
                                v-model="form.customer_location_id"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
                            >
                                <option :value="null">Select location</option>
                                <option v-for="loc in customerLocations" :key="loc.id" :value="loc.id">
                                    {{ loc.name }} - {{ loc.city }}{{ selectedCustomer?.primary_location_id === loc.id ? ' (Primary)' : '' }}
                                </option>
                            </select>
                            <p v-if="form.errors.customer_location_id" class="text-red-600 text-sm">{{ form.errors.customer_location_id }}</p>

                            <div v-if="selectedBillingLocation" class="text-sm text-gray-600 space-y-1">
                                <p v-if="selectedBillingLocation.address_line_1">{{ selectedBillingLocation.address_line_1 }}</p>
                                <p v-if="selectedBillingLocation.address_line_2">{{ selectedBillingLocation.address_line_2 }}</p>
                                <p>
                                    {{ selectedBillingLocation.city }}
                                    <span v-if="selectedBillingLocation.state">, {{ selectedBillingLocation.state }}</span>
                                    <span v-if="selectedBillingLocation.postal_code"> - {{ selectedBillingLocation.postal_code }}</span>
                                </p>
                                <p v-if="selectedBillingLocation.country">{{ selectedBillingLocation.country }}</p>
                                <p v-if="selectedBillingLocation.gstin" class="mt-1 font-medium text-gray-700">
                                    <span class="text-gray-500">GSTIN:</span> {{ selectedBillingLocation.gstin }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Shipping -->
                    <div class="space-y-4">
                        <div v-if="selectedCustomerId && customerLocations.length > 0" class="border border-gray-200 rounded-md p-4 bg-gray-50 mt-20">
                            <h3 class="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
                            <select
                                v-model="form.customer_shipping_location_id"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
                            >
                                <option :value="null">Select location</option>
                                <option v-for="loc in customerLocations" :key="loc.id" :value="loc.id">
                                    {{ loc.name }} - {{ loc.city }}{{ selectedCustomer?.primary_location_id === loc.id ? ' (Primary)' : '' }}
                                </option>
                            </select>
                            <p v-if="form.errors.customer_shipping_location_id" class="text-red-600 text-sm">{{ form.errors.customer_shipping_location_id }}</p>

                            <div v-if="selectedShippingLocation" class="text-sm text-gray-600 space-y-1">
                                <p v-if="selectedShippingLocation.address_line_1">{{ selectedShippingLocation.address_line_1 }}</p>
                                <p v-if="selectedShippingLocation.address_line_2">{{ selectedShippingLocation.address_line_2 }}</p>
                                <p>
                                    {{ selectedShippingLocation.city }}
                                    <span v-if="selectedShippingLocation.state">, {{ selectedShippingLocation.state }}</span>
                                    <span v-if="selectedShippingLocation.postal_code"> - {{ selectedShippingLocation.postal_code }}</span>
                                </p>
                                <p v-if="selectedShippingLocation.country">{{ selectedShippingLocation.country }}</p>
                                <p v-if="selectedShippingLocation.gstin" class="mt-1 font-medium text-gray-700">
                                    <span class="text-gray-500">GSTIN:</span> {{ selectedShippingLocation.gstin }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Items Section -->
            <div class="bg-white shadow rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Line Items</h2>
                    <button
                        type="button"
                        class="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2 px-4 rounded"
                        @click="addItem"
                    >
                        Add Item
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description *</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Qty *</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Unit Price</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Tax Rate</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Amount</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Action</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <ItemRow
                                v-for="(item, index) in items"
                                :key="index"
                                :item="item"
                                :index="index"
                                :currency="currentCurrency"
                                :tax-templates="taxTemplates"
                                :can-remove="items.length > 1"
                                :errors="form.errors"
                                @update="updateItem(index, $event)"
                                @remove="removeItem(index)"
                            />
                        </tbody>
                    </table>
                </div>

                <!-- Totals -->
                <div class="mt-6 flex justify-end">
                    <div class="w-full md:w-1/3 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Subtotal:</span>
                            <span class="font-medium text-gray-900">{{ formatMoney(totals.subtotal, currentCurrency) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Tax:</span>
                            <span class="font-medium text-gray-900">{{ formatMoney(totals.tax, currentCurrency) }}</span>
                        </div>
                        <div class="border-t border-gray-300 pt-2 flex justify-between">
                            <span class="text-lg font-bold text-gray-900">Total:</span>
                            <span class="text-lg font-bold text-brand-600">{{ formatMoney(totals.total, currentCurrency) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notes Section -->
            <div class="bg-white shadow rounded-lg p-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                <textarea
                    v-model="form.notes"
                    rows="4"
                    placeholder="Enter notes for the customer..."
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p v-if="form.errors.notes" class="text-red-600 text-sm mt-1">{{ form.errors.notes }}</p>
                <p class="text-xs text-gray-500 mt-1">Displayed on the PDF document.</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-4">
                <button
                    type="button"
                    class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    @click="cancel"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ form.processing ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create') }} {{ type === 'estimate' ? 'Estimate' : 'Invoice' }}
                </button>
            </div>
        </form>

        <!-- Email Modal -->
        <EmailModal
            v-if="mode === 'edit' && invoice"
            :show="showEmailModal"
            :invoice="invoice"
            :customers="customers"
            @close="showEmailModal = false"
        />
    </div>
</template>
