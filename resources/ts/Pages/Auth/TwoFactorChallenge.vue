<script setup lang="ts">
import { useForm, Head } from '@inertiajs/vue3';
import { ref, nextTick } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { store as twoFactorLogin } from '@/routes/two-factor/login';

const recovery = ref(false);
const codeInput = ref<HTMLInputElement | null>(null);
const recoveryCodeInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    code: '',
    recovery_code: '',
});

function toggleRecovery(): void {
    recovery.value = !recovery.value;
    nextTick(() => {
        if (recovery.value) {
            form.code = '';
            recoveryCodeInput.value?.focus();
        } else {
            form.recovery_code = '';
            codeInput.value?.focus();
        }
    });
}

function submit(): void {
    form.post(twoFactorLogin.url());
}
</script>

<template>
    <GuestLayout title="Two-factor Confirmation">
        <Head title="Two-factor Confirmation" />

        <div class="mb-4 text-sm text-gray-600">
            <template v-if="!recovery">
                Please confirm access to your account by entering the
                authentication code provided by your authenticator application.
            </template>
            <template v-else>
                Please confirm access to your account by entering one of your
                emergency recovery codes.
            </template>
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
            <div v-if="!recovery" class="mt-4">
                <label
                    for="code"
                    class="block text-sm font-medium text-gray-700"
                    >Code</label
                >
                <input
                    id="code"
                    ref="codeInput"
                    v-model="form.code"
                    type="text"
                    inputmode="numeric"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    autofocus
                    autocomplete="one-time-code"
                />
            </div>

            <div v-else class="mt-4">
                <label
                    for="recovery_code"
                    class="block text-sm font-medium text-gray-700"
                    >Recovery Code</label
                >
                <input
                    id="recovery_code"
                    ref="recoveryCodeInput"
                    v-model="form.recovery_code"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    autocomplete="one-time-code"
                />
            </div>

            <div class="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    class="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900"
                    @click="toggleRecovery"
                >
                    <template v-if="!recovery">Use a recovery code</template>
                    <template v-else>Use an authentication code</template>
                </button>

                <button
                    type="submit"
                    class="ms-4 inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                    :disabled="form.processing"
                >
                    Log in
                </button>
            </div>
        </form>
    </GuestLayout>
</template>
