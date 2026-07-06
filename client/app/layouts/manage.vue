<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '~/stores/auth.js';

const router = useRouter();
const auth = useAuth();

function logout() {
  auth.logout();
  router.push({ name: 'login' });
}
</script>

<style scoped>
main,
header {
  max-width: 900px;
  margin: 0 auto !important;
  padding: 6px 12px !important;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5em;
}

header {
  border-bottom: 1px solid #ddd;
  padding: 6px 0;
}

nav,
form,
li,
section>div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

input,
textarea,
button,
a {
  font: inherit;
}

a {
  color: inherit;
}
</style>

<template>
  <header class="header">
    <nav>
      <NuxtLink to="/manage"><strong>Manage Console</strong></NuxtLink>
      <NuxtLink v-if="auth.isLoggedIn.value" to="/manage/posts">list</NuxtLink>
      <NuxtLink v-if="auth.isLoggedIn.value" to="/manage/posts/new">write</NuxtLink>
      <NuxtLink v-if="auth.isLoggedIn.value" to="/manage/contact">contact</NuxtLink>
      <NuxtLink v-if="!auth.isLoggedIn.value" to="/manage/login">login</NuxtLink>
      <NuxtLink v-if="!auth.isLoggedIn.value" to="/manage/signup">signup</NuxtLink>
      <span v-if="auth.state.user">{{ auth.state.user.name }}</span>
      <button v-if="auth.isLoggedIn.value" type="button" @click="logout">logout</button>
    </nav>
  </header>
  <main class="main">
    <slot />
  </main>
</template>
