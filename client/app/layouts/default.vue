<script setup>
import PublicHeader from '~/components/PublicHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
</script>

<template>
  <public-header />
  <main class="main">
    <slot />
  </main>
  <app-footer />
</template>
