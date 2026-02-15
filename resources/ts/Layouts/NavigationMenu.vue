<script setup lang="ts">
import { ref } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { dashboard, logout } from '@/routes';
import { index as customersIndex } from '@/routes/customers';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as organizationsIndex } from '@/routes/organizations';
import { show as profileShow } from '@/routes/profile';

const page = usePage();
const showMobileMenu = ref(false);
const showUserDropdown = ref(false);

const auth = page.props.auth as {
    user: { id: number; name: string; email: string; profile_photo_url: string } | null;
    currentTeam: { id: number; name: string; company_name: string | null } | null;
};

function handleLogout() {
    router.post(logout.url());
}

function isCurrentPath(path: string): boolean {
    return page.url.startsWith(path);
}
</script>

<template>
    <nav class="border-b border-gray-100 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 justify-between">
                <!-- Left side -->
                <div class="flex">
                    <div class="flex shrink-0 items-center">
                        <Link :href="dashboard.url()">
                            <span class="text-xl font-bold text-brand-600">Invoicing</span>
                        </Link>
                    </div>

                    <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                        <Link
                            :href="dashboard.url()"
                            class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition"
                            :class="isCurrentPath('/dashboard')
                                ? 'border-brand-400 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                        >
                            Dashboard
                        </Link>
                        <Link
                            :href="customersIndex.url()"
                            class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition"
                            :class="isCurrentPath('/customers')
                                ? 'border-brand-400 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                        >
                            Customers
                        </Link>
                        <Link
                            :href="invoicesIndex.url()"
                            class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition"
                            :class="isCurrentPath('/invoices')
                                ? 'border-brand-400 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                        >
                            Invoices
                        </Link>
                        <Link
                            :href="organizationsIndex.url()"
                            class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition"
                            :class="isCurrentPath('/organizations')
                                ? 'border-brand-400 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                        >
                            Organizations
                        </Link>
                    </div>
                </div>

                <!-- Right side -->
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    <span v-if="auth.currentTeam" class="mr-4 text-sm text-gray-500">
                        {{ auth.currentTeam.company_name || auth.currentTeam.name }}
                    </span>

                    <div class="relative ml-3">
                        <button
                            class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                            @click="showUserDropdown = !showUserDropdown"
                        >
                            <img
                                v-if="auth.user?.profile_photo_url"
                                class="h-8 w-8 rounded-full object-cover"
                                :src="auth.user.profile_photo_url"
                                :alt="auth.user.name"
                            >
                            <span v-else class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100">
                                <span class="text-sm font-medium text-brand-600">
                                    {{ auth.user?.name?.charAt(0) }}
                                </span>
                            </span>
                        </button>

                        <div
                            v-show="showUserDropdown"
                            class="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                            @click="showUserDropdown = false"
                        >
                            <div class="block px-4 py-2 text-xs text-gray-400">
                                {{ auth.user?.email }}
                            </div>
                            <Link
                                :href="profileShow.url()"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </Link>
                            <button
                                class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                @click="handleLogout"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu button -->
                <div class="-mr-2 flex items-center sm:hidden">
                    <button
                        class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                        @click="showMobileMenu = !showMobileMenu"
                    >
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path
                                :class="{ hidden: showMobileMenu, 'inline-flex': !showMobileMenu }"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                :class="{ hidden: !showMobileMenu, 'inline-flex': showMobileMenu }"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        <div v-show="showMobileMenu" class="sm:hidden">
            <div class="space-y-1 pb-3 pt-2">
                <Link :href="dashboard.url()" class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium" :class="isCurrentPath('/dashboard') ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'">Dashboard</Link>
                <Link :href="customersIndex.url()" class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium" :class="isCurrentPath('/customers') ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'">Customers</Link>
                <Link :href="invoicesIndex.url()" class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium" :class="isCurrentPath('/invoices') ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'">Invoices</Link>
                <Link :href="organizationsIndex.url()" class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium" :class="isCurrentPath('/organizations') ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'">Organizations</Link>
            </div>
            <div class="border-t border-gray-200 pb-1 pt-4">
                <div class="px-4">
                    <div class="text-base font-medium text-gray-800">{{ auth.user?.name }}</div>
                    <div class="text-sm font-medium text-gray-500">{{ auth.user?.email }}</div>
                </div>
                <div class="mt-3 space-y-1">
                    <Link :href="profileShow.url()" class="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Profile</Link>
                    <button class="block w-full px-4 py-2 text-left text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800" @click="handleLogout">Log Out</button>
                </div>
            </div>
        </div>
    </nav>
</template>
