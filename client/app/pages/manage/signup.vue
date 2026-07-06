<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '~/api.js';
import { useAuth } from '~/stores/auth.js';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const router = useRouter();
const auth = useAuth();
const loading = ref(false);
const message = ref('');
const form = ref({
  email: '',
  password: '',
  name: '',
});

async function submit() {
  loading.value = true;
  message.value = '';

  try {
    const data = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form.value),
    });

    auth.login(data);
    router.push({ name: 'posts' });
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section>
    <h2>Sign up</h2>
    <p v-if="message" role="alert">{{ message }}</p>
    <form @submit.prevent="submit">
      <label>
        Name
        <input v-model="form.name" required />
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" minlength="8" required />
      </label>
      <button type="submit" :disabled="loading">Signup</button>
    </form>
  </section>
</template>
