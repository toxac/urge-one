import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Accomplishment = Database['public']['Tables']['user_accomplishments']['Row'];

export const accomplishmentStore = atom<Accomplishment[]>([]);
export const accomplishmentStoreLoading = atom(false);
export const accomplishmentStoreError = atom<SupabaseCustomError | null>(null);

export function manageAccomplishments(
  op: 'create' | 'update' | 'delete',
  data: Partial<Accomplishment> & { id: string }
) {
  const current = accomplishmentStore.get();
  
  switch (op) {
    case 'create':
      accomplishmentStore.set([...current, data as Accomplishment]);
      break;
    case 'update':
      accomplishmentStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      accomplishmentStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeAccomplishments(userId: string) {
  try {
    accomplishmentStoreLoading.set(true);
    const { data: accomplishments, error } = await supabase
      .from('user_accomplishments')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      accomplishmentStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (accomplishments) {
      accomplishmentStore.set(accomplishments);
      accomplishmentStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: accomplishmentStoreError.get() };
  } finally {
    accomplishmentStoreError.set(null);
    accomplishmentStoreLoading.set(false);
  }
}