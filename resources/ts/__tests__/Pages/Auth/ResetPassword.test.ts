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

vi.mock('@/routes/password', () => ({
    update: { url: () => '/reset-password' },
    email: { url: () => '/forgot-password' },
    request: { url: () => '/forgot-password' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import ResetPassword from '@/Pages/Auth/ResetPassword.vue';

describe('ResetPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountComponent() {
        return mount(ResetPassword, {
            props: { token: 'test-token', email: 'user@example.test' },
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders email, password, and confirm password fields', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('input#email').exists()).toBe(true);
        expect(wrapper.find('input#password').exists()).toBe(true);
        expect(wrapper.find('input#password_confirmation').exists()).toBe(true);
    });

    it('renders reset password button', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('button[type="submit"]').text()).toBe(
            'Reset Password',
        );
    });

    it('pre-fills email from props', () => {
        const wrapper = mountComponent();
        const emailInput = wrapper.find('input#email');
        expect(emailInput.element.value).toBe('user@example.test');
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountComponent();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith(
            '/reset-password',
            expect.any(Object),
        );
    });
});
