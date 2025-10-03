import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Question = Database['public']['Tables']['user_questions']['Row'];
type QuestionInsert = Database['public']['Tables']['user_questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['user_questions']['Update'];

export const questionsStore = atom<Question[]>([]);
export const questionsStoreLoading = atom(false);
export const questionsStoreError = atom<SupabaseCustomError | null>(null);

// Initialize questions for a user
export async function initializeQuestions(userId: string) {
  try {
    questionsStoreLoading.set(true);
    questionsStoreError.set(null);

    const { data: questions, error } = await supabase
      .from('user_questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    questionsStore.set(questions || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    questionsStoreLoading.set(false);
  }
}

// Create a new question (Supabase first, then store)
export async function createQuestion(questionData: QuestionInsert) {
  try {
    questionsStoreLoading.set(true);
    questionsStoreError.set(null);

    // Supabase operation first
    const { data: question, error } = await supabase
      .from('user_questions')
      .insert(questionData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionsStore.get();
    questionsStore.set([question, ...current]);

    return { success: true, data: question, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    questionsStoreLoading.set(false);
  }
}

// Update an existing question (Supabase first, then store)
export async function updateQuestion(id: number, updates: QuestionUpdate) {
  try {
    questionsStoreLoading.set(true);
    questionsStoreError.set(null);

    // Supabase operation first
    const { data: question, error } = await supabase
      .from('user_questions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionsStore.get();
    questionsStore.set(
      current.map(item => item.id === id ? question : item)
    );

    return { success: true, data: question, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    questionsStoreLoading.set(false);
  }
}

// Delete a question (Supabase first, then store)
export async function deleteQuestion(id: number) {
  try {
    questionsStoreLoading.set(true);
    questionsStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_questions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionsStore.get();
    questionsStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    questionsStoreLoading.set(false);
  }
}

// Get question by ID
export function getQuestionById(id: number): Question | undefined {
  return questionsStore.get().find(question => question.id === id);
}

// Get questions by status
export function getQuestionsByStatus(status: string): Question[] {
  return questionsStore.get().filter(question => question.status === status);
}


// Clear store and errors
export function clearQuestions() {
  questionsStore.set([]);
  questionsStoreError.set(null);
}