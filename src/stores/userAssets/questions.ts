import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;

// Question types
type Question = Database['public']['Tables']['user_questions']['Row'];
type QuestionInsert = Database['public']['Tables']['user_questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['user_questions']['Update'];

// Question Response types
type QuestionResponse = Database['public']['Tables']['user_question_responses']['Row'];
type QuestionResponseInsert = Database['public']['Tables']['user_question_responses']['Insert'];
type QuestionResponseUpdate = Database['public']['Tables']['user_question_responses']['Update'];

// Question stores
export const questionsStore = atom<Question[]>([]);
export const questionsStoreLoading = atom(false);
export const questionsStoreError = atom<SupabaseCustomError | null>(null);

// Question Response stores
export const questionResponsesStore = atom<QuestionResponse[]>([]);
export const questionResponsesStoreLoading = atom(false);
export const questionResponsesStoreError = atom<SupabaseCustomError | null>(null);

// ===== QUESTION OPERATIONS =====

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


// Clear questions store and errors
export function clearQuestions() {
  questionsStore.set([]);
  questionsStoreError.set(null);
}

// ===== QUESTION RESPONSE OPERATIONS =====

// Initialize question responses for a user
export async function initializeQuestionResponses(userId: string) {
  try {
    questionResponsesStoreLoading.set(true);
    questionResponsesStoreError.set(null);

    const { data: responses, error } = await supabase
      .from('user_question_responses')
      .select('*')
      .eq('asker_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    questionResponsesStore.set(responses || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionResponsesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    questionResponsesStoreLoading.set(false);
  }
}

// Create a new question response (Supabase first, then store)
export async function createQuestionResponse(responseData: QuestionResponseInsert) {
  try {
    questionResponsesStoreLoading.set(true);
    questionResponsesStoreError.set(null);

    // Supabase operation first
    const { data: response, error } = await supabase
      .from('user_question_responses')
      .insert(responseData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionResponsesStore.get();
    questionResponsesStore.set([response, ...current]);

    return { success: true, data: response, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionResponsesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    questionResponsesStoreLoading.set(false);
  }
}

// Update an existing question response (Supabase first, then store)
export async function updateQuestionResponse(id: number, updates: QuestionResponseUpdate) {
  try {
    questionResponsesStoreLoading.set(true);
    questionResponsesStoreError.set(null);

    // Supabase operation first
    const { data: response, error } = await supabase
      .from('user_question_responses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionResponsesStore.get();
    questionResponsesStore.set(
      current.map(item => item.id === id ? response : item)
    );

    return { success: true, data: response, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionResponsesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    questionResponsesStoreLoading.set(false);
  }
}

// Delete a question response (Supabase first, then store)
export async function deleteQuestionResponse(id: number) {
  try {
    questionResponsesStoreLoading.set(true);
    questionResponsesStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_question_responses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = questionResponsesStore.get();
    questionResponsesStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    questionResponsesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    questionResponsesStoreLoading.set(false);
  }
}

// Get response by ID
export function getQuestionResponseById(id: number): QuestionResponse | undefined {
  return questionResponsesStore.get().find(response => response.id === id);
}

// Get responses by question ID
export function getResponsesByQuestionId(questionId: number): QuestionResponse[] {
  return questionResponsesStore.get().filter(response => response.question_id === questionId);
}

// Get responses by feedback rating
export function getResponsesByRating(rating: number): QuestionResponse[] {
  return questionResponsesStore.get().filter(response => response.feedback_rating === rating);
}

// Clear question responses store and errors
export function clearQuestionResponses() {
  questionResponsesStore.set([]);
  questionResponsesStoreError.set(null);
}

// ===== COMBINED OPERATIONS =====

// Initialize both questions and responses for a user
export async function initializeUserQuestionsData(userId: string) {
  try {
    questionsStoreLoading.set(true);
    questionResponsesStoreLoading.set(true);
    
    const [questionsResult, responsesResult] = await Promise.all([
      initializeQuestions(userId),
      initializeQuestionResponses(userId)
    ]);

    return {
      success: questionsResult.success && responsesResult.success,
      questionsError: questionsResult.error,
      responsesError: responsesResult.error
    };
  } finally {
    questionsStoreLoading.set(false);
    questionResponsesStoreLoading.set(false);
  }
}

// Clear both stores
export function clearAllQuestionsData() {
  clearQuestions();
  clearQuestionResponses();
}