import { ref, shallowRef } from 'vue';
import SignUpFormVue from '../components/SignUpForm.vue';
import SignInForm from '../components/SignInForm.vue';

const show = ref(false);
const component = shallowRef();

export function useModal() {
    return {
        show,
        component,
        showModal: (type: 'signIn' | 'signUp') => {
            (show.value = true);
            switch (type) {
                case 'signIn' : return component.value = SignInForm
                case 'signUp' : return component.value = SignUpFormVue
            }
        },
        hideModal: () => (show.value = false)
    };
}