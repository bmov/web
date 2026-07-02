<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostForm from '../components/PostForm.vue';
import { createPost, fetchPost, updatePost } from '../services/posts.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const message = ref('');
const form = ref({
  title: '',
  content: '',
});

const isEdit = computed(() => route.name === 'post-edit');

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
      router.push(`/posts/${route.params.id}`);
      return;
    }

    const data = await createPost({
      title: createTitleFromContent(form.value.content),
      content: form.value.content,
    });
    router.push(`/posts/${data.post.id}`);
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
    <PostForm
      v-model="form"
      :submit-label="isEdit ? 'Edit' : 'Submit'"
      :loading="loading"
      :show-title="isEdit"
      @submit="submit"
    />
  </section>
</template>
