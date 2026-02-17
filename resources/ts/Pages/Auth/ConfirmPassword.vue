<script setup lang="ts">
import { useForm, Head } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { store as confirmPasswordStore } from '@/routes/password/confirm';

const form = useForm({
    password: '',
});

function submit(): void {
    form.post(confirmPasswordStore.url(), {
        onFinish: () => form.reset('password'),
    });
}
</script>

<template>
    <GuestLayout title="Confirm Password">
        <Head title="Confirm Password" />

        <div class="mb-4 text-sm text-gray-600">
            This is a secure area of the application. Please confirm your password before continuing.
        </div>

        <div v-if="Object.keys(form.errors).length" class="mb-4 text-sm text-red-600">
            <ul>
                <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
            </ul>
        </div>

        <form @submit.prevent="submit">
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
                    autofocus
                    autocomplete="current-password"
                />
            </div>

            <div class="mt-4 flex justify-end">
                <button
                    type="submit"
                    class="ms-4 inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Confirm
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
