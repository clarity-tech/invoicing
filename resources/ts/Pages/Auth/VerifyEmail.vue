<script setup lang="ts">
import { useForm, Link, Head, router } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { send as resendVerification } from '@/routes/verification';
import { logout } from '@/routes';

defineProps<{
    status?: string;
}>();

const form = useForm({});

function resend(): void {
    form.post(resendVerification.url());
}

function logoutUser(): void {
    router.post(logout.url());
}
</script>

<template>
    <GuestLayout title="Email Verification">
        <Head title="Email Verification" />

        <div class="mb-4 text-sm text-gray-600">
            Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
        </div>

        <div v-if="status === 'verification-link-sent'" class="mb-4 text-sm font-medium text-green-600">
            A new verification link has been sent to the email address you provided in your profile settings.
        </div>

        <div class="mt-4 space-y-4">
            <form @submit.prevent="resend">
                <button
                    type="submit"
                    class="w-full justify-center inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Resend Verification Email
                </button>
            </form>

            <div class="flex items-center justify-between text-sm">
                <Link
                    href="/user/profile"
                    class="rounded-md text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                    Edit Profile
                </Link>

                <button
                    type="button"
                    class="rounded-md text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    @click="logoutUser"
                >
                    Log Out
                </button>
            </div>
        </div>
    </GuestLayout>
</template>
