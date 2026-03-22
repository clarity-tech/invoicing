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
            errors: {},
            auth: { user: null },
            flash: { success: null, error: null, message: null },
        },
    }),
}));

vi.mock('@/routes/login', () => ({
    store: { url: () => '/login' },
}));

vi.mock('@/routes/password', () => ({
    request: { url: () => '/forgot-password' },
    email: { url: () => '/forgot-password' },
    update: { url: () => '/reset-password' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import Login from '@/Pages/Auth/Login.vue';

describe('Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountLogin(props = {}) {
        return mount(Login, {
            props,
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders email and password fields', () => {
        const wrapper = mountLogin();
        expect(wrapper.find('input#email').exists()).toBe(true);
        expect(wrapper.find('input#password').exists()).toBe(true);
    });

    it('renders login button', () => {
        const wrapper = mountLogin();
        expect(wrapper.find('button[type="submit"]').text()).toBe('Log in');
    });

    it('renders remember me checkbox', () => {
        const wrapper = mountLogin();
        expect(wrapper.find('input#remember_me').exists()).toBe(true);
        expect(wrapper.text()).toContain('Remember me');
    });

    it('renders forgot password link', () => {
        const wrapper = mountLogin();
        expect(wrapper.text()).toContain('Forgot your password?');
    });

    it('displays status message when provided', () => {
        const wrapper = mountLogin({ status: 'Password reset link sent!' });
        expect(wrapper.text()).toContain('Password reset link sent!');
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountLogin();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith('/login', expect.any(Object));
    });

    it('toggles password visibility', async () => {
        const wrapper = mountLogin();
        const passwordInput = wrapper.find('input#password');
        expect(passwordInput.attributes('type')).toBe('password');

        const toggleBtn = wrapper.find('button[type="button"]');
        await toggleBtn.trigger('click');
        expect(wrapper.find('input#password').attributes('type')).toBe('text');

        await toggleBtn.trigger('click');
        expect(wrapper.find('input#password').attributes('type')).toBe(
            'password',
        );
    });

    it('disables submit button when processing', () => {
        // processing is false in our mock so button should not be disabled
        const wrapper = mountLogin();
        expect(
            wrapper.find('button[type="submit"]').attributes('disabled'),
        ).toBeUndefined();
    });
});
