<script setup lang="ts">
import { useForm, Head } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { email as sendResetLink } from '@/routes/password';

defineProps<{
    status?: string;
}>();

const form = useForm({
    email: '',
});

function submit(): void {
    form.post(sendResetLink.url());
}
</script>

<template>
    <GuestLayout title="Forgot Password">
        <Head title="Forgot Password" />

        <div class="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
        </div>

        <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <div
            v-if="Object.keys(form.errors).length"
            class="mb-4 text-sm text-red-600"
        >
            <ul>
                <li v-for="(error, key) in form.errors" :key="key">
                    {{ error }}
                </li>
            </ul>
        </div>

        <form @submit.prevent="submit">
            <div class="block">
                <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email</label
                >
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
                    autofocus
                    autocomplete="username"
                />
            </div>

            <div class="mt-4 flex items-center justify-end">
                <button
                    type="submit"
                    class="inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Email Password Reset Link
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
