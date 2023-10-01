<script setup lang="ts">
import { ref } from 'vue';
import UserForm from './UserForm.vue';
import { useUsers } from '../stores/users';
import { useModal } from '../composables/modal';
import { NewUser } from '../users';

const usersStore = useUsers();
const modal = useModal();
const error = ref('')

async function hadnleSignIn (newUser: NewUser ) {
    const body = JSON.stringify(newUser)
    const res = await window.fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    if ([401, 404].includes(res.status)) {
        error.value = 'Username or Password is incorrect'
    } else {
        usersStore.authenticate();
        modal.hideModal();
    }
}
</script>

<template>
    <UserForm @submit="hadnleSignIn" :error="error" />
</template>