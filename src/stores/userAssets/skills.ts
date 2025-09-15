import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Skill = Database['public']['Tables']['user_skills']['Row'];

export const skillsStore = atom<Skill[]>([]);
export const skillsStoreLoading = atom(false);
export const skillsStoreError = atom<SupabaseCustomError | null>(null);

export function manageSkills(
  op: 'create' | 'update' | 'delete',
  data: Skill
) {
  const current = skillsStore.get();
  
  switch (op) {
    case 'create':
      skillsStore.set([...current, data as Skill]);
      break;
    case 'update':
      skillsStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      skillsStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeSkills(userId: string) {
  try {
    skillsStoreLoading.set(true);
    const { data: skills, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      skillsStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (skills) {
      skillsStore.set(skills);
      skillsStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: skillsStoreError.get() };
  } finally {
    skillsStoreError.set(null);
    skillsStoreLoading.set(false);
  }
}