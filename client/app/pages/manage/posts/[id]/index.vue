<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostActions from '~/components/PostActions.vue';
import { fetchPost } from '~/services/posts.js';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const message = ref('');

const { data, refresh } = await useAsyncData('manage-posts-id', () => {
  const apiBase = !import.meta.client ? config.public.apiBase : '';
  return $fetch(`${apiBase}/api/posts/${route.params.id}`);
}
);

const post = computed(() => data.value?.post ?? null);

function afterDelete() {
  router.push({ name: 'posts' });
}
</script>

<style scoped>
input,
textarea,
button,
a {
  font: inherit;
}

a {
  color: inherit;
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
    <template v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.author.name }}</p>
      <article v-html="post.contentHtml"></article>
      <button type="button" @click="router.push(`/posts/${post.id}/source`)">Source</button>
      <PostActions :post-id="post.id" include-source @deleted="afterDelete" @error="message = $event" />
    </template>
  </section>
</template>
