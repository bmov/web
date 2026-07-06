import { computed, reactive } from 'vue';
import { clearSession, getStoredUser, setSession } from '../api.js';

const state = reactive({
  user: getStoredUser(),
});

export const useAuth = () => {
  const isLoggedIn = computed(() => Boolean(state.user));

  const login = (session) => {
    setSession(session);
    state.user = session.user;
  };

  const logout = () => {
    clearSession();
    state.user = null;
  };

  return {
    state,
    isLoggedIn,
    login,
    logout,
  };
};
