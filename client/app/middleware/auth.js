import { useAuth } from '~/stores/auth.js';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip server-side rendering
  if (import.meta.server) {
    const auth = useAuth();
    if (!auth.isLoggedIn.value) {
      return navigateTo('/manage/login');
    }
  }

  // Skip server-side rendering
  if (import.meta.server) return;

  const token = localStorage.getItem('notepad.token');
  if (!token) {
    return navigateTo('/manage/login');
  }
});
