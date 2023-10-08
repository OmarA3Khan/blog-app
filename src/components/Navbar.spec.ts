import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Navabar from "./Navbar.vue";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { routes } from "../router";
import { useUsers } from "../stores/users";

describe("Navbar", () => {
    it("renders signin and signup buttons when not authenticated", () => {
        const el = document.createElement('div');
        el.id = 'modal';
        document.body.appendChild(el);

        const pinia = createPinia();
        const router = createRouter({
            history: createMemoryHistory(),
            routes: routes
        });

        const wrapper = mount(Navabar, {
            global: {
                plugins: [pinia, router]
            }
        });

        console.log(wrapper.html());
        expect(wrapper.find('#sign-up').exists()).toBe(true);
        expect(wrapper.find('[data-testid="sign-in"]').exists()).toBe(true);
    });

    it.only("renders new post and logout when authenticated", async () => {
        const el = document.createElement('div');
        el.id = 'modal';
        document.body.appendChild(el);

        const pinia = createPinia();
        setActivePinia(pinia);
        const users = useUsers();
        users.currentUserId = "1";
        const router = createRouter({
            history: createMemoryHistory(),
            routes: routes
        });

        const wrapper = mount(Navabar, {
            global: {
                plugins: [pinia, router]
            }
        });

        expect(wrapper.find('a').text()).toBe('New Post');
        expect(wrapper.find('button').text()).toBe('Log Out');
        console.log(wrapper.html());
    });
});