// stores/userAssets/notes.ts
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type UniversalError } from '../../../types/appTypes.ts';

const supabase = supabaseBrowserClient;
type Note = Database['public']['Tables']['user_notes']['Row'];

export const notesStore = atom<Note[]>([]);
export const notesStoreLoading = atom(false);
export const notesStoreError = atom<UniversalError | null>(null);

export function manageNotes(
  op: 'create' | 'update' | 'delete',
  data: Partial<Note> & { id: number }
) {
  const current = notesStore.get();
  
  switch (op) {
    case 'create':
      notesStore.set([...current, data as Note]);
      break;
    case 'update':
      notesStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      notesStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeNotes(userId: string) {
  try {
    notesStoreLoading.set(true);
    const { data: notes, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      notesStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (notes) {
      notesStore.set(notes);
      notesStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: notesStoreError.get() };
  } finally {
    notesStoreLoading.set(false);
  }
}