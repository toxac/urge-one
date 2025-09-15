import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type CheerSquad = Database['public']['Tables']['user_cheer_squad']['Row'];

export const squadStore = atom<CheerSquad[]>([]);
export const squadStoreLoading = atom(false);
export const squadStoreError = atom<SupabaseCustomError | null>(null);

export function manageSquad(
  op: 'create' | 'update' | 'delete',
  data: CheerSquad
) {
  const current = squadStore.get();
  
  switch (op) {
    case 'create':
      squadStore.set([...current, data as CheerSquad]);
      break;
    case 'update':
      squadStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      squadStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeSquad(userId: string) {
  try {
    squadStoreLoading.set(true);
    const { data: squad, error } = await supabase
      .from('user_cheer_squad')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      squadStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (squad) {
      squadStore.set(squad);
      squadStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: squadStoreError.get() };
  } finally {
    squadStoreError.set(null);
    squadStoreLoading.set(false);
  }
}