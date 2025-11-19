import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from '../../../database.types.ts';
import { squadInitialized } from './squadInitialization';
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;

type SquadMember = Database['public']['Tables']['user_cheer_squad']['Row'];
type SquadMemberInsert = Database['public']['Tables']['user_cheer_squad']['Insert'];
type SquadMemberUpdate = Database['public']['Tables']['user_cheer_squad']['Update'];

export const squadStore = atom<SquadMember[]>([]);
export const squadStoreLoading = atom(false);
export const squadStoreError = atom<SupabaseCustomError | null>(null);

export async function initializeSquad(userId: string) {
  try {
    if (squadInitialized.get()) {
      // Already initialized, skip fetching
      return { success: true, error: null };
    }

    squadStoreLoading.set(true);
    squadStoreError.set(null);

    const { data: squadMembers, error } = await supabase
      .from('user_cheer_squad')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    squadStore.set(squadMembers || []);
    squadInitialized.set(true);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    squadStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details,
    });
    return { success: false, error: supabaseError };
  } finally {
    squadStoreLoading.set(false);
  }
}

export async function createSquadMember(memberData: SquadMemberInsert) {
  try {
    squadStoreLoading.set(true);
    squadStoreError.set(null);

    const { data: member, error } = await supabase
      .from('user_cheer_squad')
      .insert(memberData)
      .select()
      .single();

    if (error) throw error;

    const current = squadStore.get();
    squadStore.set([member, ...current]);

    return { success: true, data: member, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    squadStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details,
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    squadStoreLoading.set(false);
  }
}

export async function updateSquadMember(id: string, updates: SquadMemberUpdate) {
  try {
    squadStoreLoading.set(true);
    squadStoreError.set(null);

    const { data: member, error } = await supabase
      .from('user_cheer_squad')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const current = squadStore.get();
    squadStore.set(current.map(item => (item.id === id ? member : item)));

    return { success: true, data: member, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    squadStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details,
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    squadStoreLoading.set(false);
  }
}

export async function deleteSquadMember(id: string) {
  try {
    squadStoreLoading.set(true);
    squadStoreError.set(null);

    const { error } = await supabase.from('user_cheer_squad').delete().eq('id', id);

    if (error) throw error;

    const current = squadStore.get();
    squadStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    squadStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details,
    });
    return { success: false, error: supabaseError };
  } finally {
    squadStoreLoading.set(false);
  }
}
