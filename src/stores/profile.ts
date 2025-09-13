// src/stores/profile.store.ts
import { atom, computed } from 'nanostores';
import { supabaseBrowserClient } from '../lib/supabase/client';
import type { Database } from '../../database.types';

type Profile = Database['public']['Tables']['user_profiles']['Row'];


// Explicitly type the required fields
const REQUIRED_FIELDS = [
  'address',
  'age_group',
  'bio',
  'first_name',
  'gender',
  'last_name',
  'username'
] as const satisfies ReadonlyArray<keyof Profile>;

const supabase = supabaseBrowserClient;

export const profileStore = atom<Profile | null>(null);
export const isProfileLoading = atom(false);



export async function loadProfile(userId: string) {
  try {
    isProfileLoading.set(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    profileStore.set(data);
    return { data, error: null };
    
  } catch (error) {
    return { data: null, error };
  } finally {
    isProfileLoading.set(false);
  }
}

// Helper to check required fields
export const isProfileComplete = computed(profileStore, (profile) => {
  if (!profile) return false;
  
  return REQUIRED_FIELDS.every((field) => {
    const value = profile[field];
    
    // Handle Json fields differently
    if (field === 'address') {
      return !!value && Object.keys(value).length > 0;
    }
    
    // Standard string/null checks for other fields
    return value !== null && value !== '';
  });
});