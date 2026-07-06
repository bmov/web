<template>
  <div class="counter">
    <h2>Interactive Counter</h2>
    <p class="count">Count: <strong>{{ count }}</strong></p>
    <div class="buttons">
      <button class="btn btn-decrement" @click="decrement">-</button>
      <button class="btn btn-increment" @click="increment">+</button>
      <button class="btn btn-reset" @click="reset">Reset</button>
    </div>
    <p v-if="count !== 0" class="double">Double: {{ double }}</p>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}
</script>

<style scoped>
.counter {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  max-width: 350px;
  margin: 0 auto;
}

.counter h2 {
  margin-top: 0;
  color: #166534;
}

.count {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-increment {
  background: #22c55e;
  color: #fff;
}

.btn-increment:hover {
  background: #16a34a;
}

.btn-decrement {
  background: #ef4444;
  color: #fff;
}

.btn-decrement:hover {
  background: #dc2626;
}

.btn-reset {
  background: #6b7280;
  color: #fff;
}

.btn-reset:hover {
  background: #4b5563;
}

.double {
  margin-top: 1rem;
  color: #166534;
  font-size: 1.1rem;
}
</style>
