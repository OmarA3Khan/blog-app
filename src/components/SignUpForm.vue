<script setup lang="ts">
import UserForm from './UserForm.vue';
import { useUsers } from '../stores/users';
import { useModal } from '../composables/modal';
import { NewUser } from '../users';

const usersStore = useUsers();
const modal = useModal();

async function hadnleSignUp (newUser: NewUser ) {
    await usersStore.createUser(newUser);
    modal.hideModal()
}
</script>

<template>
    <UserForm @submit="hadnleSignUp" :formType="'signUp'" />
</template>