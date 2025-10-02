import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Bookmark = Database['public']['Tables']['user_bookmarks']['Row'];
type BookmarkInsert = Database['public']['Tables']['user_bookmarks']['Insert'];
type BookmarkUpdate = Database['public']['Tables']['user_bookmarks']['Update'];

export const bookmarksStore = atom<Bookmark[]>([]);
export const bookmarksStoreLoading = atom(false);
export const bookmarksStoreError = atom<SupabaseCustomError | null>(null);

// Initialize bookmarks for a user
export async function initializeBookmarks(userId: string) {
  try {
    bookmarksStoreLoading.set(true);
    bookmarksStoreError.set(null);

    const { data: bookmarks, error } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    bookmarksStore.set(bookmarks || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    bookmarksStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    bookmarksStoreLoading.set(false);
  }
}

// Create a new bookmark (Supabase first, then store)
export async function createBookmark(bookmarkData: BookmarkInsert) {
  try {
    bookmarksStoreLoading.set(true);
    bookmarksStoreError.set(null);

    // Supabase operation first
    const { data: bookmark, error } = await supabase
      .from('user_bookmarks')
      .insert(bookmarkData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = bookmarksStore.get();
    bookmarksStore.set([bookmark, ...current]);

    return { success: true, data: bookmark, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    bookmarksStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    bookmarksStoreLoading.set(false);
  }
}

// Update an existing bookmark (Supabase first, then store)
export async function updateBookmark(id: number, updates: BookmarkUpdate) {
  try {
    bookmarksStoreLoading.set(true);
    bookmarksStoreError.set(null);

    // Supabase operation first
    const { data: bookmark, error } = await supabase
      .from('user_bookmarks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = bookmarksStore.get();
    bookmarksStore.set(
      current.map(item => item.id === id ? bookmark : item)
    );

    return { success: true, data: bookmark, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    bookmarksStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    bookmarksStoreLoading.set(false);
  }
}

// Delete a bookmark (Supabase first, then store)
export async function deleteBookmark(id: number) {
  try {
    bookmarksStoreLoading.set(true);
    bookmarksStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = bookmarksStore.get();
    bookmarksStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    bookmarksStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    bookmarksStoreLoading.set(false);
  }
}

// Get bookmark by ID
export function getBookmarkById(id: number): Bookmark | undefined {
  return bookmarksStore.get().find(bookmark => bookmark.id === id);
}


// Clear store and errors
export function clearBookmarks() {
  bookmarksStore.set([]);
  bookmarksStoreError.set(null);
}