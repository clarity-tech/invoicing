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

vi.mock('@/routes/two-factor/login', () => ({
    store: { url: () => '/two-factor-challenge' },
}));

vi.mock('@/Layouts/GuestLayout.vue', () => ({
    default: { template: '<div><slot /></div>' },
}));

import TwoFactorChallenge from '@/Pages/Auth/TwoFactorChallenge.vue';

describe('TwoFactorChallenge', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function mountComponent() {
        return mount(TwoFactorChallenge, {
            global: { stubs: { Teleport: true, Head: true, Link: true } },
        });
    }

    it('renders code input by default', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('input#code').exists()).toBe(true);
        expect(wrapper.find('input#recovery_code').exists()).toBe(false);
    });

    it('renders authenticator code instructions', () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('authentication code');
    });

    it('renders login button', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('button[type="submit"]').text()).toBe('Log in');
    });

    it('toggles to recovery code mode', async () => {
        const wrapper = mountComponent();
        const toggleBtn = wrapper.find('button[type="button"]');
        expect(toggleBtn.text()).toBe('Use a recovery code');

        await toggleBtn.trigger('click');
        expect(wrapper.find('input#recovery_code').exists()).toBe(true);
        expect(wrapper.find('input#code').exists()).toBe(false);
        expect(wrapper.text()).toContain('emergency recovery codes');
    });

    it('toggles back to authentication code mode', async () => {
        const wrapper = mountComponent();
        const toggleBtn = wrapper.find('button[type="button"]');

        await toggleBtn.trigger('click');
        expect(toggleBtn.text()).toBe('Use an authentication code');

        await toggleBtn.trigger('click');
        expect(wrapper.find('input#code').exists()).toBe(true);
        expect(wrapper.find('input#recovery_code').exists()).toBe(false);
    });

    it('calls form.post on submit', async () => {
        const wrapper = mountComponent();
        await wrapper.find('form').trigger('submit');
        expect(mockPost).toHaveBeenCalledWith('/two-factor-challenge');
    });
});
