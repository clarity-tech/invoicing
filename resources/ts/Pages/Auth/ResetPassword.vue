<script setup lang="ts">
import { useForm, Head } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { update as resetPassword } from '@/routes/password';

const props = defineProps<{
    token: string;
    email: string;
}>();

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

function submit(): void {
    form.post(resetPassword.url(), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
}
</script>

<template>
    <GuestLayout title="Reset Password">
        <Head title="Reset Password" />

        <div v-if="Object.keys(form.errors).length" class="mb-4 text-sm text-red-600">
            <ul>
                <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
            </ul>
        </div>

        <form @submit.prevent="submit">
            <div class="block">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
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

            <div class="mt-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
                    autocomplete="new-password"
                />
            </div>

            <div class="mt-4">
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
                    autocomplete="new-password"
                />
            </div>

            <div class="mt-4 flex items-center justify-end">
                <button
                    type="submit"
                    class="inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Reset Password
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
