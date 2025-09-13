import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type UniversalError } from '../../../types/appTypes.ts';

const supabase = supabaseBrowserClient;
type Question = Database['public']['Tables']['user_questions']['Row'];

export const questionsStore = atom<Question[]>([]);
export const questionsStoreLoading = atom(false);
export const questionsStoreError = atom<UniversalError | null>(null);

export function manageQuestions(
  op: 'create' | 'update' | 'delete',
  data: Partial<Question> & { id: number }
) {
  const current = questionsStore.get();
  
  switch (op) {
    case 'create':
      questionsStore.set([...current, data as Question]);
      break;
    case 'update':
      questionsStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      questionsStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeQuestions(userId: string) {
  try {
    questionsStoreLoading.set(true);
    const { data: questions, error } = await supabase
      .from('user_questions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      questionsStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (questions) {
      questionsStore.set(questions);
      questionsStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: questionsStoreError.get() };
  } finally {
    questionsStoreError.set(null);
    questionsStoreLoading.set(false);
  }
}