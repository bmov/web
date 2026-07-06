<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostActions from '~/components/PostActions.vue';
import { fetchPost } from '~/services/posts.js';
import { scrollEvent } from '~/ui/navbar';
import { formatRelativeTime } from '~/ui/time';

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const message = ref('');

const { data, refresh } = await useAsyncData('manage-posts-id', () => {
  const apiBase = !import.meta.client ? config.public.apiBase : '';
  const id = route.params.idslug.split('-')[0];
  return $fetch(`${apiBase}/api/posts/${id}`);
}
);

const post = computed(() => {
  const postData = data.value?.post ?? null;

  if (!postData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      statusText: 'The post has been deleted or does not exist.',
      fatal: true
    })
  }

  return postData;
});

const postData = computed(() => data.value?.post ?? null);

useHead({
  title: () => postData.value?.title ?? '',
});

useSeoMeta({
  title: () => postData.value?.title ?? '',
  ogTitle: () => postData.value?.title ?? '',
  twitterTitle: () => postData.value?.title ?? '',
  description: () => postData.value?.summary ?? '',
  ogDescription: () => postData.value?.summary ?? '',
  twitterDescription: () => postData.value?.summary ?? '',
  ogImage: () => postData.value?.coverImg || 'https://bmov.co/img/bmov-cover-default.jpg',
  twitterImage: () => postData.value?.coverImg || 'https://bmov.co/img/bmov-cover-default.jpg',
});

function afterDelete() {
  router.push({ name: 'posts' });
}

onMounted(() => {
  const navbar = document.querySelector("nav");
  navbar.classList.add("bg");
  window.removeEventListener("scroll", scrollEvent);
});
</script>

<style>
/* COVER HERO */
.post-cover {
  position: relative;
  min-height: 64vh;
  display: flex;
  align-items: flex-end;
  background-image:
    linear-gradient(180deg, rgba(23, 21, 18, 0.1) 0%, rgba(23, 21, 18, 0.9) 100%);
  background-size: cover;
  background-position: center;
  color: #fff;
}

.post-cover-inner {
  padding: 4rem 3.5rem;
  max-width: 900px;
  animation: riseIn 0.9s ease both;
}

.tag {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1.2rem;
  background: var(--sec1-bg);
  color: var(--ink);
}

.tag.yellow {
  background-color: var(--tag-yellow) !important;
}

.tag.teal {
  background-color: var(--tag-teal) !important;
}

.tag.blue {
  background-color: var(--tag-blue) !important;
}

.tag.green {
  background-color: var(--tag-green) !important;
}

.tag.red {
  background-color: var(--tag-red) !important;
}

.tag.gray {
  background-color: var(--tag-gray) !important;
}

.post-cover h1 {
  font-size: 4rem;
  line-height: 1.02;
  margin: 0 0 1.2rem 0;
  max-width: 820px;
}

.post-meta {
  font-size: 0.95rem;
  color: #d9d6cd;
}

/* BACK LINK */
.back-link {
  display: block;
  padding: 2.2rem 3.5rem 0;
  max-width: 720px;
  margin: 0 auto;
}

.back-link a {
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.back-link a:hover {
  color: var(--ink);
  border-color: var(--ink);
}

/* ARTICLE BODY */
.post-body {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 3.5rem 10vh;
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--ink);
}

.post-body p {
  margin: 0 0 1.6rem 0;
}

.post-body h2 {
  font-family: 'Anton', sans-serif;
  font-style: italic;
  font-size: 2.1rem;
  line-height: 1.1;
  margin: 3rem 0 1.2rem 0;
}

.post-body blockquote {
  margin: 2.5rem 0;
  padding: 0.4rem 0 0.4rem 1.8rem;
  border-left: 3px solid var(--sec2-bg);
  font-size: 1.35rem;
  font-style: italic;
  color: var(--ink-soft);
}

.post-body blockquote p {
  margin: 0;
}

.post-body ul {
  margin: 0 0 1.6rem 0;
  padding-left: 1.4rem;
}

.post-body li {
  margin-bottom: 0.6rem;
}

.post-body strong {
  font-weight: 700;
}

.post-body figure {
  margin: 1rem 0;
}

.post-body figure img {
  max-width: 100%;
  margin: 0 auto;
}

.post-body figcaption {
  font-size: 0.9rem;
  color: var(--ink-soft);
  text-align: center;
  margin-top: 0.75rem;
}

.author-box {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 3.5rem 8vh;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  border-top: 1px solid #ececea;
  padding-top: 2.5rem;
}

.author-photo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.author-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.author-name {
  font-weight: 700;
  margin: 0;
}

.author-role {
  color: var(--ink-soft);
  font-size: 0.92rem;
  margin: 0.15rem 0 0 0;
}

@media (max-width:720px) {
  .post-cover {
    min-height: 52vh;
  }

  .post-cover-inner {
    padding: 2.5rem 1.5rem;
  }

  .post-cover h1 {
    font-size: 2.4rem;
  }

  .back-link {
    padding: 1.8rem 1.5rem 0;
  }

  .post-body {
    padding: 2rem 1.5rem 8vh;
    font-size: 1.05rem;
  }

  .post-body h2 {
    font-size: 1.6rem;
  }

  .post-body blockquote {
    font-size: 1.15rem;
  }

  .author-box {
    padding: 0 1.5rem 6vh;
  }
}
</style>

<template>
  <section>
    <p v-if="message" role="alert">{{ message }}</p>
    <p v-if="loading">Processing...</p>
    <template v-if="post">
      <header class="post-cover" :style="{
        backgroundImage: `linear-gradient(180deg, rgba(23, 21, 18, 0.1) 0%, rgba(23, 21, 18, 0.9) 100%),
                        url('${post.coverImg || ''}')`
      }">
        <div class="post-cover-inner">
          <span class="tag" :class="post.categoryColor">{{ (post.category ?? '').toUpperCase() }}</span>
          <h1 class="display">{{ post.title }}</h1>
          <p class="post-meta">{{ post.author.name }} · {{ formatRelativeTime(post.createdAt) }} · {{ post.readTime }}
            min read</p>
        </div>
      </header>

      <div class="back-link">
        <NuxtLink to="/blog">&larr; Back to Blog</NuxtLink>
      </div>

      <article class="post-body" v-html="post.contentHtml"></article>

      <div class="author-box">
        <div class="author-photo"><img src="/img/bmov-cover-default.jpg" alt="Photo"></div>
        <div>
          <p class="author-name">{{ post.author.name }}</p>
        </div>
      </div>
    </template>
  </section>
</template>
