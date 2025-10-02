import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Note = Database['public']['Tables']['user_notes']['Row'];
type NoteInsert = Database['public']['Tables']['user_notes']['Insert'];
type NoteUpdate = Database['public']['Tables']['user_notes']['Update'];

export const notesStore = atom<Note[]>([]);
export const notesStoreLoading = atom(false);
export const notesStoreError = atom<SupabaseCustomError | null>(null);

// Initialize notes for a user
export async function initializeNotes(userId: string) {
  try {
    notesStoreLoading.set(true);
    notesStoreError.set(null);

    const { data: notes, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    notesStore.set(notes || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    notesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    notesStoreLoading.set(false);
  }
}

// Create a new note (Supabase first, then store)
export async function createNote(noteData: NoteInsert) {
  try {
    notesStoreLoading.set(true);
    notesStoreError.set(null);

    // Supabase operation first
    const { data: note, error } = await supabase
      .from('user_notes')
      .insert(noteData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = notesStore.get();
    notesStore.set([note, ...current]);

    return { success: true, data: note, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    notesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    notesStoreLoading.set(false);
  }
}

// Update an existing note (Supabase first, then store)
export async function updateNote(id: number, updates: NoteUpdate) {
  try {
    notesStoreLoading.set(true);
    notesStoreError.set(null);

    // Supabase operation first
    const { data: note, error } = await supabase
      .from('user_notes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = notesStore.get();
    notesStore.set(
      current.map(item => item.id === id ? note : item)
    );

    return { success: true, data: note, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    notesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    notesStoreLoading.set(false);
  }
}

// Delete a note (Supabase first, then store)
export async function deleteNote(id: number) {
  try {
    notesStoreLoading.set(true);
    notesStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = notesStore.get();
    notesStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    notesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    notesStoreLoading.set(false);
  }
}

// Get note by ID
export function getNoteById(id: number): Note | undefined {
  return notesStore.get().find(note => note.id === id);
}


// Clear store and errors
export function clearNotes() {
  notesStore.set([]);
  notesStoreError.set(null);
}