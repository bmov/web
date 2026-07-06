<script setup>
import { ref, computed } from 'vue';
import PostActions from '~/components/PostActions.vue';
import { updatePostPinned } from '~/services/posts.js';
import { IconPin, IconPinnedOff } from '@tabler/icons-vue';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const config = useRuntimeConfig();
const loading = ref(false);
const message = ref('');
const offset = ref(0);
const limit = ref(20);
const enableLimitControl = ref(false);

const { data, refresh } = await useAsyncData('manage-posts', () => {
  const apiBase = !import.meta.client ? config.public.apiBase : '';
  return $fetch(`${apiBase}/api/posts`, {
    params: { offset: offset.value, limit: limit.value }
  });
},
  { watch: [offset, limit] }
);

const posts = computed(() => data.value?.posts ?? []);

function changePage(delta) {
  const nextOffset = offset.value + delta * limit.value;
  offset.value = Math.max(0, nextOffset);
}

function changeLimit() {
  offset.value = 0;
}

async function togglePinned(post) {
  loading.value = true;
  message.value = '';

  try {
    await updatePostPinned(post.id, !post.isPinned);
    await refresh();
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
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

button.clear {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;
}

button.clear:hover {
  background-color: #eee;
}

ul {
  padding-left: 0;
}

li {
  margin-bottom: 8px;
  flex-wrap: nowrap;
}

pre,
article {
  border: 1px solid #ddd;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
}
</style>

<template>
  <section>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Processing...</p>
    <div v-if="enableLimitControl">
      <label>
        limit
        <input v-model.number="limit" type="number" min="1" max="50" @change="changeLimit" />
      </label>
    </div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <div v-if="post.isPinned">
          <span class="sr-only">Pinned Post</span>
          <IconPin stroke={2} aria-hidden="true" />
        </div>
        <NuxtLink :to="{ name: 'manage-posts-id', params: { id: post.id } }"><strong>{{ post.title }}</strong>
        </NuxtLink>
        <div>
          <span class="sr-only">Post author</span>
          <span>{{ post.author.name }}</span>
        </div>
        <button type="button" :title="post.isPinned ? 'Unpin' : 'Pin'" class="clear" @click="togglePinned(post)">
          <IconPin v-if="!post.isPinned" stroke={2} />
          <IconPinnedOff v-if="post.isPinned" stroke={2} />
        </button>
      </li>
    </ul>
    <div>
      <button type="button" :disabled="offset === 0" @click="changePage(-1)">Prev</button>
      <span>offset {{ offset }}</span>
      <button type="button" :disabled="posts.length < limit" @click="changePage(1)">Next</button>
    </div>
  </section>
</template>
