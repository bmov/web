<script setup>
import { onMounted, ref } from 'vue';
import PostActions from '../components/PostActions.vue';
import { fetchPosts, updatePostPinned } from '../services/posts.js';
import { IconPin, IconPinnedOff } from '@tabler/icons-vue';

const loading = ref(false);
const message = ref('');
const posts = ref([]);
const pagination = ref({
  offset: 0,
  limit: 20,
});

const enableLimitControl = ref(false);

async function loadPosts() {
  loading.value = true;
  message.value = '';

  try {
    const data = await fetchPosts(pagination.value);
    posts.value = data.posts;
    pagination.value = data.pagination;
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

function changePage(delta) {
  const nextOffset = pagination.value.offset + delta * pagination.value.limit;
  pagination.value.offset = Math.max(0, nextOffset);
  loadPosts();
}

function changeLimit() {
  pagination.value.offset = 0;
  loadPosts();
}

async function togglePinned(post) {
  loading.value = true;
  message.value = '';

  try {
    await updatePostPinned(post.id, !post.isPinned);
    await loadPosts();
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadPosts);
</script>

<template>
  <section>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Processing...</p>
    <div v-if="enableLimitControl">
      <label>
        limit
        <input v-model.number="pagination.limit" type="number" min="1" max="50" @change="changeLimit" />
      </label>
    </div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <div v-if="post.isPinned">
          <span class="sr-only">Pinned Post</span>
          <IconPin stroke={2} aria-hidden="true" />
        </div>
        <RouterLink :to="{ name: 'post-view', params: { id: post.id } }"><strong>{{ post.title }}</strong></RouterLink>
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
      <button type="button" :disabled="pagination.offset === 0" @click="changePage(-1)">Prev</button>
      <span>offset {{ pagination.offset }}</span>
      <button type="button" :disabled="posts.length < pagination.limit" @click="changePage(1)">Next</button>
    </div>
  </section>
</template>
