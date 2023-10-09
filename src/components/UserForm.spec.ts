import { mount } from "@vue/test-utils";
import { Router, createMemoryHistory, createRouter } from "vue-router";
import { Pinia, createPinia, setActivePinia } from "pinia";
import { describe, it, expect, beforeEach} from "vitest";
import UserForm from "./UserForm.vue";
import { routes } from "../router";

describe("UserForm", () => {
    let pinia: Pinia
    let router: Router

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        router = createRouter({
            history: createMemoryHistory(),
            routes
        });
    });

    it("runs through the workflow", async () => {
        const wrapper = mount(UserForm, {
            global: {
                plugins: [pinia, router]
            }
        });

        const btn = wrapper.find('button');
        expect(btn.element.disabled).toBe(true);

        expect(wrapper.find('[data-testid="username"]').find(".is-danger").text()).toBe('This field is required');
        expect(wrapper.find('[data-testid="password"]').find(".is-danger").text()).toBe('This field is required');

        await wrapper.find('#Username').setValue('user');
        await wrapper.find('#Password').setValue('password');

        expect(wrapper.find('[data-testid="username"]').find(".is-danger").text()).toBe('This field must be between 5 and 10');
        expect(wrapper.find('[data-testid="password"]').find(".is-danger").text()).toBe('This field must be between 10 and 40');

        await wrapper.find('#Username').setValue('username');
        await wrapper.find('#Password').setValue('password123');

        expect(wrapper.find('[data-testid="username"]').find(".is-danger").exists()).toBe(false);
        expect(wrapper.find('[data-testid="password"]').find(".is-danger").exists()).toBe(false);

        expect(btn.element.disabled).toBe(false);

        wrapper.find('form').trigger('submit.prevent');
        expect(wrapper.emitted().submit[0]).toEqual([{
            username: 'username',
            password: 'password123'
        }]);
        // console.log(wrapper.html());
    });
});