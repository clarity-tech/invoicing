import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn();

vi.mock('@inertiajs/vue3', () => ({
    useForm: (initial: Record<string, unknown>) => {
        const data = { ...initial };
        return new Proxy(data, {
            get(target, prop) {
                if (prop === 'post') return mockPost;
                if (prop === 'get') return vi.fn();
                if (prop === 'errors') return {};
                if (prop === 'processing') return false;
                if (prop === 'reset') return vi.fn();
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

vi.mock('@/routes/password', () => ({
    email: { url: () => '/forgot-password' },
    request: { url: () => '/forgot-password' },
    update: { url: () => '/reset-password' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import ForgotPassword from '@/Pages/Auth/ForgotPassword.vue';

describe('ForgotPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountComponent(props = {}) {
        return mount(ForgotPassword, {
            props,
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders email field', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('input#email').exists()).toBe(true);
    });

    it('renders submit button', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('button[type="submit"]').text()).toBe(
            'Email Password Reset Link',
        );
    });

    it('renders instructional text', () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('Forgot your password?');
    });

    it('displays status message when provided', () => {
        const wrapper = mountComponent({ status: 'Reset link sent!' });
        expect(wrapper.text()).toContain('Reset link sent!');
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountComponent();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith('/forgot-password');
    });
});
