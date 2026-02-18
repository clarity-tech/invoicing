<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { watch } from 'vue';
import type { Location } from '@/types';

const props = defineProps<{
    show: boolean;
    customerId: number;
    location?: Location | null;
    countries: Record<string, string>;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const form = useForm({
    name: '',
    gstin: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
});

watch(() => props.show, (val) => {
    if (val && props.location) {
        form.name = props.location.name ?? '';
        form.gstin = props.location.gstin ?? '';
        form.address_line_1 = props.location.address_line_1;
        form.address_line_2 = props.location.address_line_2 ?? '';
        form.city = props.location.city;
        form.state = props.location.state;
        form.country = props.location.country;
        form.postal_code = props.location.postal_code ?? '';
    } else if (val) {
        form.reset();
    }
});

function submit() {
    if (props.location?.id) {
        form.put(`/customers/${props.customerId}/locations/${props.location.id}`, {
            preserveScroll: true,
            onSuccess: () => emit('close'),
        });
    } else {
        form.post(`/customers/${props.customerId}/locations`, {
            preserveScroll: true,
            onSuccess: () => emit('close'),
        });
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="emit('close')" />
                <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                    <form @submit.prevent="submit">
                        <div class="bg-white px-4 pb-4 pt-5 sm:p-6">
                            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                                {{ location?.id ? 'Edit Location' : 'Add Location' }}
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Location Name *</label>
                                    <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" placeholder="e.g., Head Office">
                                    <p v-if="form.errors.name" class="mt-1 text-sm text-red-600">{{ form.errors.name }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">GSTIN</label>
                                    <input v-model="form.gstin" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                    <p v-if="form.errors.gstin" class="mt-1 text-sm text-red-600">{{ form.errors.gstin }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Address Line 1 *</label>
                                    <input v-model="form.address_line_1" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                    <p v-if="form.errors.address_line_1" class="mt-1 text-sm text-red-600">{{ form.errors.address_line_1 }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Address Line 2</label>
                                    <input v-model="form.address_line_2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">City *</label>
                                        <input v-model="form.city" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                        <p v-if="form.errors.city" class="mt-1 text-sm text-red-600">{{ form.errors.city }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">State *</label>
                                        <input v-model="form.state" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                        <p v-if="form.errors.state" class="mt-1 text-sm text-red-600">{{ form.errors.state }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Country *</label>
                                        <select v-model="form.country" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                            <option value="">Select country</option>
                                            <option v-for="(label, value) in countries" :key="value" :value="value">{{ label }}</option>
                                        </select>
                                        <p v-if="form.errors.country" class="mt-1 text-sm text-red-600">{{ form.errors.country }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Postal Code</label>
                                        <input v-model="form.postal_code" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 sm:ml-3 sm:w-auto disabled:opacity-50" :disabled="form.processing">
                                {{ location?.id ? 'Update' : 'Add' }} Location
                            </button>
                            <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto" @click="emit('close')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>
