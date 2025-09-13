import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type UniversalError } from '../../../types/appTypes.ts';

const supabase = supabaseBrowserClient;
type Journal = Database['public']['Tables']['user_journals']['Row'];

export const journalsStore = atom<Journal[]>([]);
export const journalsStoreLoading = atom(false);
export const journalsStoreError = atom<UniversalError | null>(null);

export function manageJournals(
  op: 'create' | 'update' | 'delete',
  data: Partial<Journal> & { id: string }
) {
  const current = journalsStore.get();
  
  switch (op) {
    case 'create':
      journalsStore.set([...current, data as Journal]);
      break;
    case 'update':
      journalsStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      journalsStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeJournals(userId: string) {
  try {
    journalsStoreLoading.set(true);
    const { data: journals, error } = await supabase
      .from('user_journals')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      journalsStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (journals) {
      journalsStore.set(journals);
      journalsStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: journalsStoreError.get() };
  } finally {
    journalsStoreError.set(null);
    journalsStoreLoading.set(false);
  }
}