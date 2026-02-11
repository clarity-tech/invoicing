<script setup>
import { Head } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';

defineProps({
    laravelVersion: String,
    phpVersion: String,
});
</script>

<template>
    <Head title="Welcome" />

    <div class="flex min-h-screen flex-col items-center bg-background text-foreground">
        <header class="w-full max-w-4xl px-6 py-8">
            <nav class="flex items-center justify-between">
                <h1 class="text-xl font-bold tracking-tight">Invoicing</h1>
            </nav>
        </header>

        <main class="flex flex-1 flex-col items-center justify-center px-6">
            <div class="text-center">
                <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
                    Laravel Invoicing
                </h2>
                <p class="mt-4 text-lg text-muted-foreground">
                    Built with Laravel {{ laravelVersion }}, Vue 3 &amp; Inertia.js
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                    PHP {{ phpVersion }}
                </p>
                <div class="mt-8 flex items-center justify-center gap-4">
                    <Button>Get Started</Button>
                    <Button variant="outline">Documentation</Button>
                </div>
            </div>
        </main>

        <footer class="w-full max-w-4xl px-6 py-8 text-center text-sm text-muted-foreground">
            Laravel v{{ laravelVersion }} (PHP v{{ phpVersion }})
        </footer>
    </div>
</template>
