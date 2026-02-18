<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import { useForm, router } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';

interface Location {
    id: number;
    name: string;
    gstin: string | null;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

interface BankDetails {
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    ifsc?: string;
    branch?: string;
    swift?: string;
    pan?: string;
}

interface Organization {
    id: number;
    name: string;
    company_name: string | null;
    phone: string | null;
    emails: { email: string; name: string }[];
    currency: string | null;
    country_code: string | null;
    financial_year_type: string | null;
    financial_year_start_month: number;
    financial_year_start_day: number;
    tax_number: string | null;
    registration_number: string | null;
    website: string | null;
    notes: string | null;
    bank_details: BankDetails | null;
    logo_url: string | null;
    primary_location: Location | null;
    personal_team: boolean;
}

interface CountryInfo {
    value: string;
    label: string;
    currency: string;
    financial_year_options: Record<string, string>;
    default_financial_year: string;
    supported_currencies: Record<string, string>;
    tax_system: { name: string; rates: string[] };
    recommended_numbering: string;
}

interface PaginatedOrganizations {
    data: Organization[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const props = defineProps<{
    organizations: PaginatedOrganizations;
    countries: CountryInfo[];
    currencies: Record<string, string>;
}>();

const activeTab = ref<'basics' | 'location' | 'bank' | 'logo'>('basics');
const editingOrg = ref<Organization | null>(null);

const basicsForm = useForm({
    name: '',
    phone: '',
    emails: [''] as string[],
    currency: '',
    country_code: '',
    financial_year_type: '',
    financial_year_start_month: 4,
    financial_year_start_day: 1,
    tax_number: '',
    registration_number: '',
    website: '',
    notes: '',
});

const locationForm = useForm({
    location_name: '',
    gstin: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
});

const bankForm = useForm({
    bank_account_name: '',
    bank_account_number: '',
    bank_name: '',
    bank_ifsc: '',
    bank_branch: '',
    bank_swift: '',
    bank_pan: '',
});

const logoForm = useForm({
    logo: null as File | null,
});

const selectedCountry = computed(() => {
    if (!basicsForm.country_code) return null;
    return props.countries.find(c => c.value === basicsForm.country_code) ?? null;
});

const availableCurrencies = computed(() => {
    if (selectedCountry.value) {
        return selectedCountry.value.supported_currencies;
    }
    return props.currencies;
});

watch(() => basicsForm.country_code, (newCode) => {
    if (!newCode) return;
    const country = props.countries.find(c => c.value === newCode);
    if (country) {
        basicsForm.currency = country.currency;
        basicsForm.financial_year_type = country.default_financial_year;
        locationForm.country = newCode;
    }
});

function startEdit(org: Organization): void {
    editingOrg.value = org;
    activeTab.value = 'basics';

    const emails = org.emails?.map((e: { email: string }) => e.email) ?? [''];
    basicsForm.name = org.name ?? '';
    basicsForm.phone = org.phone ?? '';
    basicsForm.emails = emails.length > 0 ? emails : [''];
    basicsForm.currency = org.currency ?? '';
    basicsForm.country_code = org.country_code ?? '';
    basicsForm.financial_year_type = org.financial_year_type ?? '';
    basicsForm.financial_year_start_month = org.financial_year_start_month ?? 4;
    basicsForm.financial_year_start_day = org.financial_year_start_day ?? 1;
    basicsForm.tax_number = org.tax_number ?? '';
    basicsForm.registration_number = org.registration_number ?? '';
    basicsForm.website = org.website ?? '';
    basicsForm.notes = org.notes ?? '';

    const loc = org.primary_location;
    locationForm.location_name = loc?.name ?? '';
    locationForm.gstin = loc?.gstin ?? '';
    locationForm.address_line_1 = loc?.address_line_1 ?? '';
    locationForm.address_line_2 = loc?.address_line_2 ?? '';
    locationForm.city = loc?.city ?? '';
    locationForm.state = loc?.state ?? '';
    locationForm.country = loc?.country ?? '';
    locationForm.postal_code = loc?.postal_code ?? '';

    const bank = org.bank_details;
    bankForm.bank_account_name = bank?.account_name ?? '';
    bankForm.bank_account_number = bank?.account_number ?? '';
    bankForm.bank_name = bank?.bank_name ?? '';
    bankForm.bank_ifsc = bank?.ifsc ?? '';
    bankForm.bank_branch = bank?.branch ?? '';
    bankForm.bank_swift = bank?.swift ?? '';
    bankForm.bank_pan = bank?.pan ?? '';
}

function cancelEdit(): void {
    editingOrg.value = null;
}

function addEmail(): void {
    basicsForm.emails.push('');
}

function removeEmail(index: number): void {
    if (basicsForm.emails.length > 1) {
        basicsForm.emails.splice(index, 1);
    }
}

function saveBasics(): void {
    if (!editingOrg.value) return;
    basicsForm.put(`/organizations/${editingOrg.value.id}`, {
        preserveScroll: true,
        onSuccess: () => { editingOrg.value = null; },
    });
}

function saveLocation(): void {
    if (!editingOrg.value) return;
    locationForm.put(`/organizations/${editingOrg.value.id}/location`, {
        preserveScroll: true,
        onSuccess: () => { editingOrg.value = null; },
    });
}

function saveBankDetails(): void {
    if (!editingOrg.value) return;
    bankForm.put(`/organizations/${editingOrg.value.id}/bank-details`, {
        preserveScroll: true,
        onSuccess: () => { editingOrg.value = null; },
    });
}

function uploadLogo(): void {
    if (!editingOrg.value || !logoForm.logo) return;
    logoForm.post(`/organizations/${editingOrg.value.id}/logo`, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => { logoForm.reset(); },
    });
}

function removeLogo(): void {
    if (!editingOrg.value) return;
    router.delete(`/organizations/${editingOrg.value.id}/logo`, {
        preserveScroll: true,
    });
}

function deleteOrg(org: Organization): void {
    if (!confirm('Are you sure you want to delete this organization?')) return;
    router.delete(`/organizations/${org.id}`);
}

function onLogoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        logoForm.logo = target.files[0];
    }
}
</script>

<template>
    <AppLayout title="Organizations">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Organizations
            </h2>
        </template>

        <div class="py-4">
            <!-- Edit Form -->
            <div v-if="editingOrg" class="mb-6 rounded-lg bg-white shadow">
                <div class="border-b border-gray-200 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800">
                            Edit Organization
                        </h2>
                        <button type="button" class="text-gray-400 hover:text-gray-600" @click="cancelEdit">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8 px-6">
                        <button
                            v-for="tab in [
                                { key: 'basics', label: 'Basics' },
                                { key: 'location', label: 'Location' },
                                { key: 'bank', label: 'Bank Details' },
                                { key: 'logo', label: 'Logo' },
                            ]"
                            :key="tab.key"
                            type="button"
                            class="border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap"
                            :class="activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                            @click="activeTab = tab.key as typeof activeTab"
                        >
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <div class="p-6">
                    <!-- Basics Tab -->
                    <form v-if="activeTab === 'basics'" @submit.prevent="saveBasics" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Name *</label>
                                <input v-model="basicsForm.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="basicsForm.errors.name" class="mt-1 text-sm text-red-600">{{ basicsForm.errors.name }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Phone</label>
                                <input v-model="basicsForm.phone" type="tel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="basicsForm.errors.phone" class="mt-1 text-sm text-red-600">{{ basicsForm.errors.phone }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tax Number</label>
                                <input v-model="basicsForm.tax_number" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Registration Number</label>
                                <input v-model="basicsForm.registration_number" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Website</label>
                                <input v-model="basicsForm.website" type="url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Country *</label>
                                <select v-model="basicsForm.country_code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select country</option>
                                    <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
                                </select>
                                <p v-if="basicsForm.errors.country_code" class="mt-1 text-sm text-red-600">{{ basicsForm.errors.country_code }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Currency *</label>
                                <select v-model="basicsForm.currency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select currency</option>
                                    <option v-for="(label, code) in availableCurrencies" :key="code" :value="code">{{ label }}</option>
                                </select>
                                <p v-if="basicsForm.errors.currency" class="mt-1 text-sm text-red-600">{{ basicsForm.errors.currency }}</p>
                            </div>

                            <div v-if="selectedCountry">
                                <label class="block text-sm font-medium text-gray-700">Financial Year</label>
                                <select v-model="basicsForm.financial_year_type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option v-for="(label, value) in selectedCountry.financial_year_options" :key="value" :value="value">{{ label }}</option>
                                </select>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Email Addresses *</label>
                                <div v-for="(email, index) in basicsForm.emails" :key="index" class="mt-2 flex items-center gap-2">
                                    <input v-model="basicsForm.emails[index]" type="email" placeholder="email@example.com" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    <button v-if="index > 0" type="button" class="text-red-600 hover:text-red-800" @click="removeEmail(index)">
                                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                    </button>
                                </div>
                                <button type="button" class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800" @click="addEmail">+ Add email</button>
                                <p v-if="basicsForm.errors['emails.0']" class="mt-1 text-sm text-red-600">{{ basicsForm.errors['emails.0'] }}</p>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea v-model="basicsForm.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 border-t pt-4">
                            <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" @click="cancelEdit">Cancel</button>
                            <button type="submit" :disabled="basicsForm.processing" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                {{ basicsForm.processing ? 'Saving...' : 'Save Basics' }}
                            </button>
                        </div>
                    </form>

                    <!-- Location Tab -->
                    <form v-if="activeTab === 'location'" @submit.prevent="saveLocation" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Location Name</label>
                                <input v-model="locationForm.location_name" type="text" placeholder="e.g. Main Office, Head Office" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">GSTIN / Tax ID</label>
                                <input v-model="locationForm.gstin" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Address Line 1 *</label>
                                <input v-model="locationForm.address_line_1" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="locationForm.errors.address_line_1" class="mt-1 text-sm text-red-600">{{ locationForm.errors.address_line_1 }}</p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Address Line 2</label>
                                <input v-model="locationForm.address_line_2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">City *</label>
                                <input v-model="locationForm.city" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="locationForm.errors.city" class="mt-1 text-sm text-red-600">{{ locationForm.errors.city }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">State / Province *</label>
                                <input v-model="locationForm.state" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="locationForm.errors.state" class="mt-1 text-sm text-red-600">{{ locationForm.errors.state }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Country *</label>
                                <select v-model="locationForm.country" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select country</option>
                                    <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
                                </select>
                                <p v-if="locationForm.errors.country" class="mt-1 text-sm text-red-600">{{ locationForm.errors.country }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Postal Code *</label>
                                <input v-model="locationForm.postal_code" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                <p v-if="locationForm.errors.postal_code" class="mt-1 text-sm text-red-600">{{ locationForm.errors.postal_code }}</p>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 border-t pt-4">
                            <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" @click="cancelEdit">Cancel</button>
                            <button type="submit" :disabled="locationForm.processing" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                {{ locationForm.processing ? 'Saving...' : 'Save Location' }}
                            </button>
                        </div>
                    </form>

                    <!-- Bank Details Tab -->
                    <form v-if="activeTab === 'bank'" @submit.prevent="saveBankDetails" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Account Name</label>
                                <input v-model="bankForm.bank_account_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Account Number</label>
                                <input v-model="bankForm.bank_account_number" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Bank Name</label>
                                <input v-model="bankForm.bank_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">IFSC Code</label>
                                <input v-model="bankForm.bank_ifsc" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Branch</label>
                                <input v-model="bankForm.bank_branch" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">SWIFT Code</label>
                                <input v-model="bankForm.bank_swift" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">PAN</label>
                                <input v-model="bankForm.bank_pan" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 border-t pt-4">
                            <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" @click="cancelEdit">Cancel</button>
                            <button type="submit" :disabled="bankForm.processing" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                {{ bankForm.processing ? 'Saving...' : 'Save Bank Details' }}
                            </button>
                        </div>
                    </form>

                    <!-- Logo Tab -->
                    <div v-if="activeTab === 'logo'" class="space-y-6">
                        <div v-if="editingOrg?.logo_url" class="flex items-center gap-4">
                            <img :src="editingOrg.logo_url" alt="Organization logo" class="h-24 w-24 rounded-lg border object-contain" />
                            <button type="button" class="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50" @click="removeLogo">
                                Remove Logo
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Upload Logo</label>
                            <input type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" @change="onLogoChange" />
                            <p v-if="logoForm.errors.logo" class="mt-1 text-sm text-red-600">{{ logoForm.errors.logo }}</p>
                        </div>
                        <div class="flex justify-end gap-3 border-t pt-4">
                            <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" @click="cancelEdit">Cancel</button>
                            <button type="button" :disabled="!logoForm.logo || logoForm.processing" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50" @click="uploadLogo">
                                {{ logoForm.processing ? 'Uploading...' : 'Upload Logo' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Organizations List -->
            <div class="overflow-hidden rounded-lg bg-white shadow">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Currency</th>
                            <th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Location</th>
                            <th class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="org in organizations.data" :key="org.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                                <div v-if="org.company_name && org.company_name !== org.name" class="text-sm text-gray-500">{{ org.company_name }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ org.currency ?? '-' }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                <span v-if="org.primary_location">
                                    {{ org.primary_location.city }}, {{ org.primary_location.state }}
                                </span>
                                <span v-else class="text-gray-400">No location</span>
                            </td>
                            <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                <button type="button" class="text-blue-600 hover:text-blue-900" @click="startEdit(org)">Edit</button>
                                <button v-if="!org.personal_team" type="button" class="ml-4 text-red-600 hover:text-red-900" @click="deleteOrg(org)">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="organizations.data.length === 0">
                            <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">No organizations found.</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="organizations.last_page > 1" class="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <nav class="flex items-center justify-between">
                        <div class="flex flex-1 justify-between sm:justify-end">
                            <template v-for="link in organizations.links" :key="link.label">
                                <button
                                    v-if="link.url"
                                    type="button"
                                    class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    :class="{ 'bg-blue-50 text-blue-600': link.active }"
                                    @click="router.get(link.url)"
                                    v-html="link.label"
                                />
                            </template>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
