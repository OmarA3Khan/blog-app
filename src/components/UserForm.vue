<script lang="ts" setup>
import { computed, ref } from 'vue';
import { validate, length, required } from '../validation';
import { NewUser } from '../users'
import FormInput from './FormInput.vue';

const props = defineProps<{
    error?: string,
    formType?: 'signIn' | 'signUp',
}>()

const emit = defineEmits<{
    (event: 'submit', payload: NewUser): void
}>()

const username = ref('')
const usernameStatus = computed(() => {
    if (props.formType === 'signUp') {
        return validate(username.value, [required, length({min: 5, max: 10})])
    } else {
        return {
            valid: true
        }
    }
});

const password = ref('')
const passwordStatus = computed(() => {
  if (props.formType === 'signUp') {
    return validate(password.value, [required, length({min: 8, max: 40})]);
    } else {
        return {
            valid: true
        }
    }
});

const isInvalid = computed(() => {
    return (!usernameStatus.value.valid || !passwordStatus.value.valid)
});

async function handleSubmit () {
    if(isInvalid.value) {
        return
    }

    const newUser: NewUser = {
        username: username.value,
        password: password.value
    }

    try {
        emit('submit', newUser);
    } catch (e) {}

}
</script>

<template>
    <form class="form" @submit.prevent="handleSubmit">
        <FormInput name="Username" v-model="username" :status="usernameStatus" type="text" />
        <FormInput name="Password" v-model="password" :status="passwordStatus" type="password" />
        <div class="is-danger help">
            {{ error }}
        </div>
        <button class="button" :disabled="isInvalid">Submit</button>
    </form>
</template>

<style scoped>
.form {
    background: white;
    padding: 30px;
    margin-top: 50px;
}
</style>
