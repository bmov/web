<script setup>
import { useRouter } from 'vue-router';
import { deletePost } from '../services/posts.js';

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
  includeSource: {
    type: Boolean,
    default: false,
  },
  includeHtml: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['deleted', 'error']);
const router = useRouter();

async function remove() {
  if (!confirm('Would you like to delete it?')) return;

  try {
    await deletePost(props.postId);
    emit('deleted');
  } catch (error) {
    emit('error', error.message);
  }
}
</script>

<template>
  <button type="button" @click="router.push(`/manage/posts/${postId}/edit`)">Edit</button>
  <button type="button" @click="remove">Delete</button>
</template>
