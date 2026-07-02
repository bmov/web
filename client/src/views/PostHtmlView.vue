<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostActions from '../components/PostActions.vue';
import { fetchPost } from '../services/posts.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const message = ref('');
const post = ref(null);

async function loadPost() {
  loading.value = true;
  message.value = '';

  try {
    const data = await fetchPost(route.params.id);
    post.value = data.post;
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

function afterDelete() {
  router.push({ name: 'posts' });
}

onMounted(loadPost);
</script>

<template>
  <section>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Processing...</p>
    <template v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.author.name }}</p>
      <article v-html="post.contentHtml"></article>
      <button type="button" @click="router.push(`/posts/${post.id}/source`)">Source</button>
      <PostActions :post-id="post.id" include-source @deleted="afterDelete" @error="message = $event" />
    </template>
  </section>
</template>
