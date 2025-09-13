import { atom, computed } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthStore } from '../../types/urgeTypes';

export const authStore = atom<AuthStore>({
  user: null,
  session: null,
  loading: true
})

export const isAuthenticated = computed(authStore, (auth) => !!auth.user);

// Simplified to only handle user and session
export const setAuth = (user: User | null, session: Session | null) => {
  authStore.set({ 
    user, 
    session, 
    loading: false 
  });
};

export const setLoading = (loading: boolean) => {
  authStore.set({ 
    ...authStore.get(), 
    loading 
  });
};

export const getCurrentUserId = (): string | null => {
  const auth = authStore.get();
  return auth.user?.id || null;
};

// Optional clear function
export const clearAuth = () => {
  authStore.set({
    user: null,
    session: null,
    loading: false
  });
};

