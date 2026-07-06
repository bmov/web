<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import PostActions from '~/components/PostActions.vue';
import { updatePostPinned } from '~/services/posts.js';
import { IconPin, IconPinnedOff } from '@tabler/icons-vue';
import { scrollEvent } from '~/ui/navbar';
import { formatRelativeTime } from '~/ui/time';

const config = useRuntimeConfig();
const loading = ref(false);
const loadingMore = ref(false);
const message = ref('');
const limit = ref(20);
const allPosts = ref([]);

const blogDescription = 'Notes on how we build, ship, and think about software — straight from the people doing the work.';
useSeoMeta({
  title: `Blog`,
  ogTitle: `BMOV Blog`,
  twitterTitle: `BMOV Blog`,
  description: blogDescription,
  ogDescription: blogDescription,
  twitterDescription: blogDescription,
})

const { data, refresh } = await useAsyncData('blog-posts', () => {
  const apiBase = !import.meta.client ? config.public.apiBase : '';
  return $fetch(`${apiBase}/api/posts`, {
    params: { offset: 0, limit: limit.value }
  });
});

// Initialize allPosts from initial SSR data
if (data.value?.posts) {
  allPosts.value = data.value.posts;
}

const posts = computed(() => allPosts.value);

const featuredPost = computed(() => {
  return posts.value.find(p => p.isPinned) ?? null;
});

const slicedResult = computed(() => {
  // If there's a featured (pinned) post, exclude it from the grid
  if (featuredPost.value) {
    return posts.value.filter(p => p.id !== featuredPost.value.id);
  }
  return posts.value;
});

const hasMore = computed(() => {
  return posts.value.length >= limit.value;
});

async function loadMore() {
  loadingMore.value = true;
  message.value = '';

  try {
    const apiBase = !import.meta.client ? config.public.apiBase : '';
    const data = await $fetch(`${apiBase}/api/posts`, {
      params: { offset: allPosts.value.length, limit: limit.value }
    });
    if (data.posts && data.posts.length > 0) {
      // Append new posts, avoiding duplicates
      const existingIds = new Set(allPosts.value.map(p => p.id));
      const newPosts = data.posts.filter(p => !existingIds.has(p.id));
      allPosts.value = [...allPosts.value, ...newPosts];
      // Observe new elements after DOM update
      await nextTick();
      observeRevealElements();
    }
  } catch (error) {
    message.value = error.message;
  } finally {
    loadingMore.value = false;
  }
}

let io = null;

function observeRevealElements() {
  if (io) io.disconnect();

  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

onMounted(() => {
  observeRevealElements();

  /* Control Navbar */
  const navbar = document.querySelector("nav");
  navbar.classList.remove("bg");
  window.addEventListener("scroll", scrollEvent);
});
</script>

<style scoped>
/* HEADER */
.blog-hero {
  background: var(--hero-bg);
  padding: 20vh 3.5rem 8vh;
}

.blog-hero-inner {
  max-width: 760px;
  animation: riseIn 0.9s ease both;
}

.blog-eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
  font-weight: 600;
  margin: 0 0 0.8rem 0;
}

.blog-hero h1 {
  font-size: 5.5rem;
  line-height: 0.95;
  margin: 0 0 1.2rem 0;
}

.blog-hero p {
  font-size: 1.3rem;
  line-height: 1.55;
  color: var(--ink-soft);
  max-width: 560px;
  margin: 0;
}

/* FEATURED */
.featured {
  display: block;
  position: relative;
  margin: 0 3.5rem 6vh;
  border-radius: 2px;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  min-height: 56vh;
  background-image:
    linear-gradient(180deg, rgba(23, 21, 18, 0.15) 0%, rgba(23, 21, 18, 0.85) 100%),
    url('https://picsum.photos/seed/featuredpost/1600/900');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.featured-body {
  padding: 3rem;
  max-width: 640px;
}

.tag {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
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

.featured h2 {
  font-size: 3rem;
  line-height: 1;
  margin: 0 0 0.8rem 0;
  color: #fff;
}

.featured p.excerpt {
  font-size: 1.1rem;
  color: #e9e7e1;
  margin: 0 0 1rem 0;
}

.meta {
  font-size: 0.9rem;
  color: #c7c4bb;
}

.featured .meta {
  color: #d9d6cd;
}

/* GRID */
.blog-grid-sec {
  padding: 2vh 3.5rem 12vh;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

.post-card {
  text-decoration: none;
  color: var(--ink);
  display: block;
}

.post-thumb {
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  margin-bottom: 1.2rem;
  background: var(--logo-gray);
}

.post-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.post-card:hover .post-thumb img {
  transform: scale(1.06);
}

.post-card h3 {
  font-size: 1.4rem;
  line-height: 1.25;
  margin: 0 0 0.6rem 0;
  font-weight: 700;
  word-break: break-word;
}

.post-card .excerpt {
  font-size: 1rem;
  color: var(--ink-soft);
  line-height: 1.5;
  margin: 0 0 0.8rem 0;
}

.post-card .meta {
  color: var(--ink-soft);
}

.blog-grid .post-card:nth-child(2) {
  transition-delay: 0.05s;
}

.blog-grid .post-card:nth-child(3) {
  transition-delay: 0.1s;
}

.blog-grid .post-card:nth-child(5) {
  transition-delay: 0.05s;
}

.blog-grid .post-card:nth-child(6) {
  transition-delay: 0.1s;
}

@media (max-width:1024px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more button {
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 2.5rem;
  border: 2px solid var(--ink);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s, color 0.2s;
}

.load-more button:hover:not(:disabled) {
  background: var(--ink);
  color: var(--body-bg);
}

.load-more button:disabled {
  opacity: 0.5;
  cursor: default;
}

@media (max-width:720px) {
  .blog-hero {
    padding: 16vh 1.5rem 6vh;
  }

  .blog-hero h1 {
    font-size: 3rem;
  }

  .blog-hero p {
    font-size: 1.05rem;
  }

  .featured {
    margin: 0 1.5rem 5vh;
    min-height: 42vh;
  }

  .featured h2 {
    font-size: 2rem;
  }

  .featured-body {
    padding: 1.8rem;
  }

  .blog-grid-sec {
    padding: 1vh 1.5rem 8vh;
  }

  .blog-grid {
    grid-template-columns: 1fr;
    gap: 2.4rem;
  }
}
</style>

<template>
  <header class="blog-hero">
    <div class="blog-hero-inner">
      <p class="blog-eyebrow">FROM THE TEAM</p>
      <h1 class="display">Blog</h1>
      <p>{{ blogDescription }}</p>
    </div>
  </header>
  <NuxtLink class="featured"
    :to="{ name: 'blog-idslug', params: { idslug: `${featuredPost.id}-${featuredPost.slug}` } }" v-if="featuredPost">
    <div class="featured-body">
      <span class="tag" :class="featuredPost.categoryColor">{{ (featuredPost.category ?? '').toUpperCase() }}</span>
      <h2 class="display">{{ featuredPost.title }}</h2>
      <p class="excerpt">{{ featuredPost.summary }}</p>
      <p class="meta">{{ featuredPost.author.name }} · {{ formatRelativeTime(featuredPost.createdAt) }} · {{
        featuredPost.readTime }} min read</p>
    </div>
  </NuxtLink>

  <section class="blog-grid-sec">
    <div class="blog-grid">

      <NuxtLink class="post-card" :to="{ name: 'blog-idslug', params: { idslug: `${post.id}-${post.slug}` } }"
        data-reveal v-for="post in slicedResult" :key="post.id">
        <div class="post-thumb"><img src="https://picsum.photos/seed/post1/600/450" alt=""></div>
        <span class="tag" :class="post.categoryColor">{{ (post.category ?? '').toUpperCase() }}</span>
        <h3>{{ post.title }}</h3>
        <p class="excerpt">{{ post.summary }}</p>
        <p class="meta">{{ post.author.name }} · {{ formatRelativeTime(post.createdAt) }} · {{ post.readTime }} min read
        </p>
      </NuxtLink>

    </div>
    <div class="load-more" v-if="hasMore && slicedResult">
      <button type="button" :disabled="loadingMore" @click="loadMore">
        <span v-if="loadingMore">Loading...</span>
        <span v-else>Load more</span>
      </button>
    </div>
  </section>
</template>
