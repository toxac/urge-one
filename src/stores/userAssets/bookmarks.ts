// file : /stores/userAssets/bookmarks.ts
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Bookmark = Database['public']['Tables']['user_bookmarks']['Row'];

export const bookmarksStore = atom<Bookmark[]>([]);
export const bookmarkStoreLoading = atom(false);
export const bookmarkStoreError = atom<SupabaseCustomError| null>(null)

// Bookmarks
export function manageBookmarks(
  op: 'create' | 'update' | 'delete',
  data: Partial<Database['public']['Tables']['user_bookmarks']['Row']> & { id: number }
) {
  const current = bookmarksStore.get();
  
  switch (op) {
    case 'create':
      bookmarksStore.set([...current, data as Database['public']['Tables']['user_bookmarks']['Row']]);
      break;
    case 'update':
      bookmarksStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      bookmarksStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

// User Assets initialization function
export async function initializeBookmarks(userId: string) {
  try {
      bookmarkStoreLoading.set(true);
    // Fetch all data 
      const { data: bookmarks, error: bookmarksError } = await supabase.from('user_bookmarks').select('*').eq('user_id', userId);

      if (bookmarksError) {
          bookmarkStoreError.set({
              name: bookmarksError.name,
              message: bookmarksError.message,
              details: bookmarksError.details
          });

          throw new Error(bookmarksError.message);
      }
      
    // Update stores with fetched data
      if (bookmarks) {
          bookmarksStore.set(bookmarks);
          bookmarkStoreError.set(null);
      }

    return {success: true, error: null}
  } catch (error) {
      return { success: false, error: bookmarkStoreError.get() };
  } finally {
      bookmarkStoreError.set(null)
      bookmarkStoreLoading.set(false);
  }
}


