<script setup>
import { ref } from 'vue';
import { request } from '~/api.js';
import { useAuth } from '~/stores/auth.js';

definePageMeta({
  layout: 'manage',
});

const auth = useAuth();
const loading = ref(false);
const message = ref('');
const form = ref({
  email: '',
  password: '',
});

async function submit() {
  loading.value = true;
  message.value = '';

  try {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(form.value),
    });

    auth.login(data);
    await navigateTo({ path: '/manage/posts' });
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section>
    <h2>Login</h2>
    <p v-if="message" role="alert">{{ message }}</p>
    <form @submit.prevent="submit">
      <label>
        Email
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" required />
      </label>
      <button type="submit" :disabled="loading">Login</button>
    </form>
  </section>
</template>
