<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchContactMessages } from '~/services/contact.js';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const loading = ref(false);
const message = ref('');
const offset = ref(0);
const limit = ref(20);
const messagesData = ref([]);

const messages = computed(() => messagesData.value ?? []);

async function loadMessages() {
  loading.value = true;
  message.value = '';

  try {
    const data = await fetchContactMessages({
      offset: offset.value,
      limit: limit.value,
    });
    messagesData.value = data.messages ?? [];
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function changePage(delta) {
  const nextOffset = offset.value + delta * limit.value;
  offset.value = Math.max(0, nextOffset);
  await loadMessages();
}

onMounted(loadMessages);
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  padding: 10px;
}

.meta {
  margin-top: 6px;
  color: #666;
}

a {
  color: inherit;
}

button {
  font: inherit;
}

.pager {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>

<template>
  <section>
    <h2>Contact Messages</h2>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Loading...</p>
    <p v-else-if="messages.length === 0">No messages found.</p>
    <ul v-else>
      <li v-for="item in messages" :key="item.id">
        <NuxtLink :to="{ name: 'manage-contact-id', params: { id: item.id } }">
          <strong>{{ item.name }}</strong>
        </NuxtLink>
        <div class="meta">
          <span>{{ item.email }}</span>
          <span>·</span>
          <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
        </div>
        <p>{{ item.message.slice(0, 120) }}{{ item.message.length > 120 ? '…' : '' }}</p>
      </li>
    </ul>
    <div class="pager">
      <button type="button" :disabled="loading || offset === 0" @click="changePage(-1)">Prev</button>
      <span>offset {{ offset }}</span>
      <button type="button" :disabled="loading || messages.length < limit" @click="changePage(1)">Next</button>
    </div>
  </section>
</template>
