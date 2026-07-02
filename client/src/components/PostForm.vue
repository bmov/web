<script setup>
import { nextTick, ref, watch } from 'vue';

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    required: true,
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
});

const model = defineModel({
  type: Object,
  required: true,
});

const textarea = ref(null);

defineEmits(['submit']);

function resizeTextarea() {
  if (!textarea.value) return;

  textarea.value.style.height = 'auto';
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
}

watch(
  () => model.value.content,
  async () => {
    await nextTick();
    resizeTextarea();
  },
  { immediate: true },
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <label v-if="showTitle">
      <input v-model="model.title" maxlength="200" placeholder="Title" required />
    </label>
    <label>
      <textarea
        ref="textarea"
        v-model="model.content"
        rows="3"
        placeholder="Content"
        required
        @input="resizeTextarea"
      ></textarea>
    </label>
    <button type="submit" :disabled="loading">{{ submitLabel }}</button>
  </form>
</template>
