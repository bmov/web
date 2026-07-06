<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchContactMessage } from '~/services/contact.js';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const route = useRoute();
const loading = ref(false);
const errorMessage = ref('');
const messageData = ref(null);

const message = computed(() => messageData.value);

async function loadMessage() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const data = await fetchContactMessage(route.params.id);
    messageData.value = data.message ?? null;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadMessage);
</script>

<style scoped>
article {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  white-space: pre-wrap;
}

.meta {
  color: #666;
}

a {
  color: inherit;
}
</style>

<template>
  <section>
    <NuxtLink to="/manage/contact">← Back to Contact Messages</NuxtLink>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <p v-if="loading">Loading...</p>

    <template v-else-if="message">
      <h2>{{ message.name }}</h2>
      <p class="meta">{{ message.email }}</p>
      <p class="meta">{{ new Date(message.createdAt).toLocaleString() }}</p>
      <article>{{ message.message }}</article>
    </template>
  </section>
</template>
