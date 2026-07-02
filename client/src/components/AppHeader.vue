<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth.js';

const router = useRouter();
const auth = useAuth();

function logout() {
  auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/"><strong>Web Notepad</strong></RouterLink>
      <RouterLink v-if="auth.isLoggedIn.value" to="/posts">list</RouterLink>
      <RouterLink v-if="auth.isLoggedIn.value" to="/posts/new">write</RouterLink>
      <RouterLink v-if="!auth.isLoggedIn.value" to="/login">login</RouterLink>
      <RouterLink v-if="!auth.isLoggedIn.value" to="/signup">signup</RouterLink>
      <span v-if="auth.state.user">{{ auth.state.user.name }}</span>
      <button v-if="auth.isLoggedIn.value" type="button" @click="logout">logout</button>
    </nav>
  </header>
</template>
