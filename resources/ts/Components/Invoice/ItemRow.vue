<script setup lang="ts">
import { computed } from 'vue';
import { calcLineTotal, calcLineTax, calcLineTotalWithTax, type LineItem } from '@/composables/useInvoiceCalculator';
import { useFormatMoney } from '@/composables/useFormatMoney';
import type { Currency, TaxTemplate } from '@/types';

const props = defineProps<{
    item: LineItem;
    index: number;
    currency: Currency;
    taxTemplates: TaxTemplate[];
    canRemove: boolean;
    errors: Record<string, string>;
}>();

const emit = defineEmits<{
    update: [item: LineItem];
    remove: [];
}>();

const { formatMoney } = useFormatMoney();

const lineTotal = computed(() => calcLineTotalWithTax(props.item));

function updateField(field: keyof LineItem, value: string | number | null) {
    const updated = { ...props.item };
    if (field === 'quantity' || field === 'unit_price' || field === 'tax_rate') {
        updated[field] = Number(value) || 0;
    } else {
        (updated as any)[field] = value;
    }
    emit('update', updated);
}

function applyTaxTemplate(templateId: string) {
    if (!templateId) return;
    const template = props.taxTemplates.find(t => t.id === Number(templateId));
    if (template) {
        updateField('tax_rate', template.rate);
    }
}

function errorFor(field: string): string | undefined {
    return props.errors[`items.${props.index}.${field}`];
}
</script>

<template>
    <tr>
        <td class="px-4 py-3">
            <input
                :value="item.description"
                type="text"
                placeholder="Item description"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                @input="updateField('description', ($event.target as HTMLInputElement).value)"
            />
            <p v-if="errorFor('description')" class="text-red-600 text-xs mt-1">{{ errorFor('description') }}</p>

            <div class="mt-2">
                <input
                    :value="item.sac_code"
                    type="text"
                    placeholder="SAC Code (optional)"
                    class="w-40 border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    @input="updateField('sac_code', ($event.target as HTMLInputElement).value || null)"
                />
                <span v-if="item.sac_code" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    SAC: {{ item.sac_code }}
                </span>
            </div>
        </td>
        <td class="px-4 py-3">
            <input
                :value="item.quantity"
                type="number"
                min="1"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                @input="updateField('quantity', ($event.target as HTMLInputElement).value)"
            />
            <p v-if="errorFor('quantity')" class="text-red-600 text-xs mt-1">{{ errorFor('quantity') }}</p>
        </td>
        <td class="px-4 py-3">
            <input
                :value="item.unit_price"
                type="number"
                min="0"
                placeholder="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                @input="updateField('unit_price', ($event.target as HTMLInputElement).value)"
            />
            <p v-if="errorFor('unit_price')" class="text-red-600 text-xs mt-1">{{ errorFor('unit_price') }}</p>
        </td>
        <td class="px-4 py-3">
            <input
                :value="item.tax_rate"
                type="number"
                min="0"
                max="10000"
                placeholder="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                @input="updateField('tax_rate', ($event.target as HTMLInputElement).value)"
            />
            <p v-if="errorFor('tax_rate')" class="text-red-600 text-xs mt-1">{{ errorFor('tax_rate') }}</p>
            <select
                v-if="taxTemplates.length > 0"
                class="mt-1 w-full border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                @change="applyTaxTemplate(($event.target as HTMLSelectElement).value)"
            >
                <option value="">Apply template...</option>
                <option v-for="t in taxTemplates" :key="t.id" :value="t.id">
                    {{ t.name }} ({{ t.rate / 100 }}%)
                </option>
            </select>
        </td>
        <td class="px-4 py-3 text-right">
            <span class="text-sm font-medium text-gray-900">
                {{ formatMoney(lineTotal, currency) }}
            </span>
        </td>
        <td class="px-4 py-3 text-center">
            <button
                v-if="canRemove"
                type="button"
                class="text-red-500 hover:text-red-700 font-bold text-lg"
                :aria-label="`Remove item ${index + 1}`"
                @click="emit('remove')"
            >
                &times;
            </button>
        </td>
    </tr>
</template>
