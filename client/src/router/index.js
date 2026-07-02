import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from '../api.js';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import PostListView from '../views/PostListView.vue';
import PostFormView from '../views/PostFormView.vue';
import PostSourceView from '../views/PostSourceView.vue';
import PostHtmlView from '../views/PostHtmlView.vue';

const routes = [
  { path: '/', redirect: '/posts' },
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/signup', name: 'signup', component: SignupView, meta: { public: true } },
  { path: '/posts', name: 'posts', component: PostListView },
  { path: '/posts/new', name: 'post-create', component: PostFormView },
  { path: '/posts/:id', name: 'post-view', component: PostHtmlView, props: true },
  { path: '/posts/:id/edit', name: 'post-edit', component: PostFormView, props: true },
  { path: '/posts/:id/source', name: 'post-source', component: PostSourceView, props: true },
  { path: '/posts/:id/html', name: 'post-html', component: PostHtmlView, props: true },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (!to.meta.public && !getToken()) {
    return { name: 'login' };
  }

  if (to.meta.public && getToken()) {
    return { name: 'posts' };
  }

  return true;
});
