import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from '../../../database.types.ts';
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type SquadUpdate = Database['public']['Tables']['user_cheer_squad_updates']['Row'];

export const squadUpdatesStore = atom<SquadUpdate[]>([]);
export const squadUpdatesStoreLoading = atom(false);
export const squadUpdatesStoreError = atom<SupabaseCustomError | null>(null);

export async function initializeSquadUpdates(userId: string) {
  try {
    squadUpdatesStoreLoading.set(true);
    squadUpdatesStoreError.set(null);

    const { data: updates, error } = await supabase
      .from('user_cheer_squad_updates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    squadUpdatesStore.set(updates || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    squadUpdatesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details,
    });
    return { success: false, error: supabaseError };
  } finally {
    squadUpdatesStoreLoading.set(false);
  }
}
