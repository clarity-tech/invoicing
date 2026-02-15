import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

export function useFlash() {
    const page = usePage();

    const flash = computed(() => page.props.flash as {
        success: string | null;
        error: string | null;
        message: string | null;
    });

    const hasFlash = computed(() =>
        !!(flash.value.success || flash.value.error || flash.value.message),
    );

    return { flash, hasFlash };
}
