<script lang="ts" setup>
import { computed } from 'vue';
import { useModal } from './composables/modal';
import { useUsers } from './stores/users'
import Navbar from './components/Navbar.vue';

const modal = useModal()
const usersStore = useUsers()

const modalStyle = computed(() => {
  return {
    display: modal.show.value ? 'block' : 'none'
  }
})

console.log('usersStore.loading:', usersStore.loading);

usersStore.authenticate()
</script>

<template>
  <div class="modal" style="color: white;" :style="modalStyle">
    <div class="modal-background">
      <div class="modal-content">
        <div id="modal"></div>
      </div>
    </div>
    <button class="modal-close is-large" @click="modal.hideModal()"></button>
  </div>

  <div class="section">
    <div class="container">
      <Navbar />
      <span v-if="usersStore.loading" class="loader is-large"></span>
      <RouterView v-else />
    </div>
  </div>
</template>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
@import "highlight.js/styles/atom-one-dark.css";

.loader {
  height: 10em;
  width: 10em;
  margin: 20vh auto auto auto;
  border-right-color: #00d1b2;
  border-top-color: #00d1b2;
}

ul {
  list-style: revert !important;
  list-style-position: inside !important;
}

h1, h2, h3, h4, h5, h6 {
  font-size: revert !important;
  margin: 10px 0 !important;
}

pre {
  margin: 10px 0 !important;
}

p {
  margin: 10px 0 !important;
}
</style>
