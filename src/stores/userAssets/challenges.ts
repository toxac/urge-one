import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type UniversalError } from '../../../types/appTypes.ts';

const supabase = supabaseBrowserClient;
type Challenge = Database['public']['Tables']['user_challenge_progress']['Row'];

export const challengeStore = atom<Challenge[]>([]);
export const challengeStoreLoading = atom(false);
export const challengeStoreError = atom<UniversalError | null>(null);

export function manageChallenges(
  op: 'create' | 'update' | 'delete',
  data: Partial<Challenge> & { id: string }
) {
  const current = challengeStore.get();
  
  switch (op) {
    case 'create':
      challengeStore.set([...current, data as Challenge]);
      break;
    case 'update':
      challengeStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      challengeStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeChallenges(userId: string) {
  try {
    challengeStoreLoading.set(true);
    const { data: challenges, error } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      challengeStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (challenges) {
      challengeStore.set(challenges);
      challengeStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: challengeStoreError.get() };
  } finally {
    challengeStoreError.set(null);
    challengeStoreLoading.set(false);
  }
}