<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import NavigationMenu from './NavigationMenu.vue';
import FlashMessages from '@/Components/FlashMessages.vue';

defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <Head :title="title" />
        <NavigationMenu />

        <FlashMessages />

        <!-- Page Heading -->
        <header v-if="$slots.header" class="bg-white shadow">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <slot name="header" />
            </div>
        </header>

        <!-- Page Content -->
        <main>
            <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <slot />
            </div>
        </main>
    </div>
</template>
