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

vi.mock('@/routes', () => ({
    login: { url: () => '/login' },
    logout: { url: () => '/logout' },
}));

vi.mock('@/routes/register', () => ({
    store: { url: () => '/register' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import Register from '@/Pages/Auth/Register.vue';

describe('Register', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountRegister() {
        return mount(Register, {
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders all form fields', () => {
        const wrapper = mountRegister();
        expect(wrapper.find('input#name').exists()).toBe(true);
        expect(wrapper.find('input#email').exists()).toBe(true);
        expect(wrapper.find('input#password').exists()).toBe(true);
        expect(wrapper.find('input#password_confirmation').exists()).toBe(true);
        expect(wrapper.find('input#terms').exists()).toBe(true);
    });

    it('renders register button', () => {
        const wrapper = mountRegister();
        expect(wrapper.find('button[type="submit"]').text()).toBe('Register');
    });

    it('renders already registered link', () => {
        const wrapper = mountRegister();
        expect(wrapper.text()).toContain('Already registered?');
    });

    it('renders terms and privacy links', () => {
        const wrapper = mountRegister();
        expect(wrapper.text()).toContain('Terms of Service');
        expect(wrapper.text()).toContain('Privacy Policy');
    });

    it('shows password hint', () => {
        const wrapper = mountRegister();
        expect(wrapper.text()).toContain('Must be at least 8 characters');
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountRegister();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith('/register', expect.any(Object));
    });

    it('toggles password visibility', async () => {
        const wrapper = mountRegister();
        const passwordInput = wrapper.find('input#password');
        expect(passwordInput.attributes('type')).toBe('password');

        // First toggle button is for password field
        const toggleBtns = wrapper.findAll('button[type="button"]');
        await toggleBtns[0].trigger('click');
        expect(wrapper.find('input#password').attributes('type')).toBe('text');
    });

    it('toggles confirm password visibility', async () => {
        const wrapper = mountRegister();
        expect(
            wrapper.find('input#password_confirmation').attributes('type'),
        ).toBe('password');

        const toggleBtns = wrapper.findAll('button[type="button"]');
        await toggleBtns[1].trigger('click');
        expect(
            wrapper.find('input#password_confirmation').attributes('type'),
        ).toBe('text');
    });
});
