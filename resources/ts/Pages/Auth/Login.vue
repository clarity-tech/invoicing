<script setup lang="ts">
import { useForm, usePage, Link, Head } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { store as loginStore } from '@/routes/login';
import { request as forgotPasswordRequest } from '@/routes/password';
import { computed } from 'vue';

defineProps<{
    status?: string;
}>();

const page = usePage();
const pageErrors = computed(() => (page.props.errors ?? {}) as Record<string, string>);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

function submit(): void {
    form.post(loginStore.url(), {
        onFinish: () => form.reset('password'),
    });
}
</script>

<template>
    <GuestLayout title="Log in">
        <Head title="Log in" />

        <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <div v-if="Object.keys(form.errors).length || Object.keys(pageErrors).length" class="mb-4 text-sm text-red-600">
            <ul>
                <li v-for="(error, key) in { ...pageErrors, ...form.errors }" :key="key">{{ error }}</li>
            </ul>
        </div>

        <form @submit.prevent="submit">
            <div>
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
                    autocomplete="current-password"
                />
            </div>

            <div class="mt-4 block">
                <label for="remember_me" class="flex items-center">
                    <input
                        id="remember_me"
                        v-model="form.remember"
                        type="checkbox"
                        class="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500"
                    />
                    <span class="ms-2 text-sm text-gray-600">Remember me</span>
                </label>
            </div>

            <div class="mt-4 flex items-center justify-end">
                <Link
                    :href="forgotPasswordRequest.url()"
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                    Forgot your password?
                </Link>

                <button
                    type="submit"
                    class="ms-4 inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Log in
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
