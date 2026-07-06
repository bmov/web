<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostForm from '~/components/PostForm.vue';
import { createPost, fetchPost, updatePost } from '~/services/posts.js';

definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const message = ref('');
const form = ref({
  title: '',
  content: '',
  slug: '',
  categoryColor: '',
  category: '',
  summary: '',
  coverImg: '',
});

const isEdit = computed(() => !!route.params.id);

function createTitleFromContent(content) {
  const text = content
    .replace(/\[\/?[a-z][^\]]*\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 80) || 'Untitled';
}

async function loadPost() {
  if (!isEdit.value) return;

  loading.value = true;
  message.value = '';

  try {
    const data = await fetchPost(route.params.id);
    form.value = {
      title: data.post.title,
      content: data.post.content,
      slug: data.post.slug,
      categoryColor: data.post.categoryColor,
      category: data.post.category,
      summary: data.post.summary,
      coverImg: data.post.coverImg,
    };
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function submit() {
  loading.value = true;
  message.value = '';

  try {
    if (isEdit.value) {
      await updatePost(route.params.id, form.value);
      router.push(`/manage/posts/${route.params.id}`);
      return;
    }

    const data = await createPost({
      title: form.value.title,
      content: form.value.content,
      slug: form.value.slug,
      categoryColor: form.value.categoryColor ?? '',
      category: form.value.category ?? '',
      summary: form.value.summary ?? '',
      coverImg: form.value.coverImg ?? '',
    });
    router.push(`/manage/posts/${data.post.id}`);
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadPost);
</script>

<template>
  <section>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Processing...</p>
    <PostForm v-model="form" :submit-label="isEdit ? 'Edit' : 'Submit'" :loading="loading" :show-title="isEdit"
      @submit="submit" />
  </section>
</template>
