import { atom, computed } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthStoreState } from '../../types/appTypes';
import type { Database } from "../../database.types"

type Profile = Database['public']['Tables']['user_profiles']['Row'];


export const authStore = atom<AuthStoreState>({
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

// Optional clear function
export const clearAuth = () => {
  authStore.set({
    user: null,
    session: null,
    loading: false
  });
};

