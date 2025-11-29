// stores/userAssets/journals-basic.ts
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Journal = Database['public']['Tables']['user_journals']['Row'];
type JournalInsert = Database['public']['Tables']['user_journals']['Insert'];
type JournalUpdate = Database['public']['Tables']['user_journals']['Update'];

export const journalsStore = atom<Journal[]>([]);
export const journalsStoreLoading = atom(false);
export const journalsStoreError = atom<SupabaseCustomError | null>(null);

// Initialize journals for a user
export async function initializeJournals(userId: string) {
  try {
    journalsStoreLoading.set(true);
    journalsStoreError.set(null);

    const { data: journals, error } = await supabase
      .from('user_journals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    journalsStore.set(journals || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    journalsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    journalsStoreLoading.set(false);
  }
}

// Create a new journal (Supabase first, then store)
export async function createJournal(journalData: JournalInsert) {
  try {
    journalsStoreLoading.set(true);
    journalsStoreError.set(null);

    // Supabase operation first
    const { data: journal, error } = await supabase
      .from('user_journals')
      .insert(journalData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = journalsStore.get();
    journalsStore.set([journal, ...current]);

    return { success: true, data: journal, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    journalsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    journalsStoreLoading.set(false);
  }
}

// Update an existing journal (Supabase first, then store)
export async function updateJournal(id: string, updates: JournalUpdate) {
  try {
    journalsStoreLoading.set(true);
    journalsStoreError.set(null);

    // Supabase operation first
    const { data: journal, error } = await supabase
      .from('user_journals')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = journalsStore.get();
    journalsStore.set(
      current.map(item => item.id === id ? journal : item)
    );

    return { success: true, data: journal, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    journalsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    journalsStoreLoading.set(false);
  }
}

// Delete a journal (Supabase first, then store)
export async function deleteJournal(id: string) {
  try {
    journalsStoreLoading.set(true);
    journalsStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_journals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = journalsStore.get();
    journalsStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    journalsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    journalsStoreLoading.set(false);
  }
}

// Get journal by ID
export function getJournalById(id: string): Journal | undefined {
  return journalsStore.get().find(journal => journal.id === id);
}


// Get journals by date range
export function getJournalsByDateRange(startDate: string, endDate: string): Journal[] {
  return journalsStore.get().filter(journal => 
    journal.created_at >= startDate && journal.created_at <= endDate
  );
}

// Clear store and errors
export function clearJournals() {
  journalsStore.set([]);
  journalsStoreError.set(null);
}