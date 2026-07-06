<script setup>
definePageMeta({
  layout: 'manage',
  middleware: 'auth',
});
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

li {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

p {
  margin: 4px 0 0;
  color: #555;
}
</style>

<template>
  <section>
    <h2>Manage Dashboard</h2>
    <ul>
      <li>
        <NuxtLink to="/manage/posts"><strong>Posts</strong></NuxtLink>
        <p>Browse and manage blog posts</p>
      </li>
      <li>
        <NuxtLink to="/manage/contact"><strong>Contact Messages</strong></NuxtLink>
        <p>Review contact message list and details</p>
      </li>
    </ul>
  </section>
</template>
