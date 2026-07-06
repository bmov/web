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

  const oldHeight = textarea.value.getBoundingClientRect().height;
  const scrollTop = window.scrollY;

  textarea.value.style.height = 'auto';
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;

  const newHeight = textarea.value.getBoundingClientRect().height;
  const heightDiff = newHeight - oldHeight;

  if (heightDiff > 0) {
    window.scrollTo(window.scrollX, scrollTop + heightDiff);
  } else {
    window.scrollTo(window.scrollX, scrollTop);
  }
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

<style scoped>
form {
  flex-direction: column;
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

textarea {
  resize: none;
  font-family: monospace;
  overflow: hidden;
}
</style>

<template>
  <form @submit.prevent="$emit('submit')">
    <label>
      <input v-model="model.title" maxlength="200" placeholder="Title" required />
    </label>
    <select id="category-color" v-model="model.categoryColor" required>
      <option value="" disabled selected>category color</option>
      <option value="yellow">Yellow</option>
      <option value="teal">Teal</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
      <option value="red">Red</option>
      <option value="gray">gray</option>
    </select>
    <select id="category" v-model="model.category" required>
      <option value="" disabled selected>category</option>
      <option value="engineering">Engineering</option>
      <option value="research">Research</option>
      <option value="product">Product</option>
      <option value="service">Service</option>
      <option value="team">Team</option>
    </select>
    <label>
      <input v-model="model.slug" maxlength="200" placeholder="Slug" />
    </label>
    <label>
      <input v-model="model.coverImg" maxlength="200" placeholder="Cover image" />
    </label>
    <label>
      <input v-model="model.summary" maxlength="200" placeholder="Summary" />
    </label>
    <label>
      <textarea ref="textarea" v-model="model.content" rows="3" placeholder="Content" required
        @input="resizeTextarea"></textarea>
    </label>
    <button type="submit" :disabled="loading">{{ submitLabel }}</button>
  </form>
</template>
