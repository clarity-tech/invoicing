<script setup lang="ts">
import { useForm, Link, Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { store as registerStore } from '@/routes/register';
import { login } from '@/routes';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
});

const passwordMismatch = computed(() => {
    if (!form.password_confirmation) return false;
    return form.password !== form.password_confirmation;
});

function submit(): void {
    form.post(registerStore.url(), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
}
</script>

<template>
    <GuestLayout title="Register">
        <Head title="Register" />

        <div v-if="Object.keys(form.errors).length" class="mb-4 text-sm text-red-600">
            <ul>
                <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
            </ul>
        </div>

        <form @submit.prevent="submit">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
                    autofocus
                    autocomplete="name"
                />
            </div>

            <div class="mt-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    required
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
                <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
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
                <p v-if="passwordMismatch" class="mt-1 text-xs text-red-600">Passwords do not match</p>
            </div>

            <div class="mt-4">
                <label for="terms" class="flex items-center">
                    <input
                        id="terms"
                        v-model="form.terms"
                        type="checkbox"
                        class="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500"
                    />
                    <span class="ms-2 text-sm text-gray-600">
                        I agree to the <a href="/terms-of-service" target="_blank" class="text-brand-600 underline hover:text-brand-500">Terms of Service</a> and <a href="/privacy-policy" target="_blank" class="text-brand-600 underline hover:text-brand-500">Privacy Policy</a>
                    </span>
                </label>
            </div>

            <div class="mt-4 flex items-center justify-end">
                <Link
                    :href="login.url()"
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                    Already registered?
                </Link>

                <button
                    type="submit"
                    class="ms-4 inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Register
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
