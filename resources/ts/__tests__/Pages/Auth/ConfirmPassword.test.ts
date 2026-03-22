import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn();
const mockReset = vi.fn();

vi.mock('@inertiajs/vue3', () => ({
    useForm: (initial: Record<string, unknown>) => {
        const data = { ...initial };
        return new Proxy(data, {
            get(target, prop) {
                if (prop === 'post') return mockPost;
                if (prop === 'get') return vi.fn();
                if (prop === 'errors') return {};
                if (prop === 'processing') return false;
                if (prop === 'reset') return mockReset;
                if (prop === 'clearErrors') return vi.fn();
                return target[prop as string];
            },
            set(target, prop, value) {
                target[prop as string] = value;
                return true;
            },
        });
    },
    Head: { template: '<div />' },
    Link: { template: '<a><slot /></a>' },
    router: { post: vi.fn(), get: vi.fn() },
    usePage: () => ({
        props: {
            auth: { user: null },
            flash: { success: null, error: null, message: null },
        },
    }),
}));

vi.mock('@/routes/password/confirm', () => ({
    store: { url: () => '/user/confirm-password' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import ConfirmPassword from '@/Pages/Auth/ConfirmPassword.vue';

describe('ConfirmPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountComponent() {
        return mount(ConfirmPassword, {
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders password field', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('input#password').exists()).toBe(true);
    });

    it('renders confirm button', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('button[type="submit"]').text()).toBe('Confirm');
    });

    it('renders secure area message', () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('secure area of the application');
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountComponent();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith(
            '/user/confirm-password',
            expect.any(Object),
        );
    });
});
