<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import type { Invoice, Customer } from '@/types';

const props = defineProps<{
    show: boolean;
    invoice: Invoice;
    customers: Customer[];
}>();

const emit = defineEmits<{
    close: [];
}>();

const page = usePage();
const auth = computed(() => (page.props as any).auth);

const customer = computed(() =>
    props.customers.find(c => c.id === props.invoice.customer_id) ?? null
);

const customerEmails = computed(() =>
    customer.value?.emails?.map(c => c.email) ?? []
);

const orgEmails = computed(() =>
    auth.value?.currentTeam?.emails?.map((c: any) => c.email) ?? []
);

const form = useForm({
    recipients: [] as string[],
    cc: [] as string[],
    subject: '',
    body: '',
    attach_pdf: true,
});

const newToEmail = ref('');
const newCcEmail = ref('');

// Initialize form when modal opens
watch(() => props.show, (isOpen) => {
    if (isOpen) {
        const orgName = auth.value?.currentTeam?.company_name ?? auth.value?.currentTeam?.name ?? 'Your Company';
        const docType = props.invoice.type === 'invoice' ? 'Invoice' : 'Estimate';

        form.recipients = [...customerEmails.value];
        form.cc = [...orgEmails.value];
        form.subject = `${docType} - ${props.invoice.invoice_number} from ${orgName}`;
        form.body = `<p><strong>${docType} #${props.invoice.invoice_number}</strong></p><p>Dear ${customer.value?.name ?? 'Customer'},</p><p>Thank you for your business. Your ${docType.toLowerCase()} can be viewed, printed and downloaded as PDF from the link below.</p>`;
        form.attach_pdf = true;
        form.clearErrors();
        newToEmail.value = '';
        newCcEmail.value = '';
    }
});

function addToRecipient() {
    const email = newToEmail.value.trim();
    if (email && !form.recipients.includes(email)) {
        form.recipients.push(email);
    }
    newToEmail.value = '';
}

function removeRecipient(email: string) {
    form.recipients = form.recipients.filter(e => e !== email);
}

function addCcRecipient() {
    const email = newCcEmail.value.trim();
    if (email && !form.cc.includes(email)) {
        form.cc.push(email);
    }
    newCcEmail.value = '';
}

function removeCcRecipient(email: string) {
    form.cc = form.cc.filter(e => e !== email);
}

function send() {
    form.post(`/invoices/${props.invoice.id}/send-email`, {
        preserveScroll: true,
        onSuccess: () => emit('close'),
    });
}
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        @keydown.escape="emit('close')"
    >
        <div class="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col" role="dialog" aria-modal="true">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h2 class="text-xl font-semibold text-gray-900">
                    Email to {{ customer?.name ?? 'Customer' }}
                </h2>
                <button class="text-gray-400 hover:text-gray-600" aria-label="Close" @click="emit('close')">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
                <!-- To -->
                <div class="mb-4">
                    <div class="flex items-start">
                        <label class="text-sm font-medium text-gray-600 w-20 pt-2">Send To</label>
                        <div class="flex-1">
                            <div class="border border-gray-300 rounded-md p-2 min-h-[44px] flex flex-wrap gap-2 items-center focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                                <div v-for="email in form.recipients" :key="email" class="inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                                    <span class="text-sm text-gray-700">{{ email }}</span>
                                    <button type="button" class="text-gray-500 hover:text-gray-700" @click="removeRecipient(email)">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                    </button>
                                </div>
                                <input
                                    v-model="newToEmail"
                                    type="email"
                                    placeholder="Type email and press Enter"
                                    class="flex-1 min-w-[200px] border-none outline-none focus:ring-0 text-sm p-1"
                                    @keydown.enter.prevent="addToRecipient"
                                />
                            </div>
                            <p v-if="form.errors.recipients" class="text-red-600 text-xs mt-1">{{ form.errors.recipients }}</p>
                        </div>
                    </div>
                </div>

                <!-- Cc -->
                <div class="mb-4">
                    <div class="flex items-start">
                        <label class="text-sm font-medium text-gray-600 w-20 pt-2">Cc</label>
                        <div class="flex-1">
                            <div class="border border-gray-300 rounded-md p-2 min-h-[44px] flex flex-wrap gap-2 items-center focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                                <div v-for="email in form.cc" :key="email" class="inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                                    <span class="text-sm text-gray-700">{{ email }}</span>
                                    <button type="button" class="text-gray-500 hover:text-gray-700" @click="removeCcRecipient(email)">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                    </button>
                                </div>
                                <input
                                    v-model="newCcEmail"
                                    type="email"
                                    placeholder="Type email and press Enter"
                                    class="flex-1 min-w-[200px] border-none outline-none focus:ring-0 text-sm p-1"
                                    @keydown.enter.prevent="addCcRecipient"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subject -->
                <div class="mb-4">
                    <div class="flex items-center">
                        <label class="text-sm font-medium text-gray-600 w-20">Subject</label>
                        <input
                            v-model="form.subject"
                            type="text"
                            class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <p v-if="form.errors.subject" class="text-red-600 text-xs mt-1 ml-20">{{ form.errors.subject }}</p>
                </div>

                <!-- Body -->
                <div class="mb-4">
                    <textarea
                        v-model="form.body"
                        rows="10"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Email body..."
                    />
                    <p v-if="form.errors.body" class="text-red-600 text-xs mt-1">{{ form.errors.body }}</p>
                </div>

                <!-- Attach PDF -->
                <div class="mb-4 border-t pt-4">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Attachments</h3>
                    <label class="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-md">
                        <input v-model="form.attach_pdf" type="checkbox" class="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500" />
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}.pdf</div>
                            <div class="text-xs text-gray-500">Invoice PDF document</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex gap-3 bg-gray-50">
                <button
                    type="button"
                    class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                    @click="emit('close')"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    :disabled="form.processing"
                    class="px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="send"
                >
                    {{ form.processing ? 'Sending...' : 'Send' }}
                </button>
            </div>
        </div>
    </div>
</template>
