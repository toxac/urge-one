import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type UniversalError } from '../../../types/appTypes.ts';

const supabase = supabaseBrowserClient;
type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];

export const opportunitiesStore = atom<Opportunity[]>([]);
export const opportunitiesStoreLoading = atom(false);
export const opportunitiesStoreError = atom<UniversalError | null>(null);

export function manageOpportunities(
  op: 'create' | 'update' | 'delete',
  data: Partial<Opportunity> & { id: number }
) {
  const current = opportunitiesStore.get();
  
  switch (op) {
    case 'create':
      opportunitiesStore.set([...current, data as Opportunity]);
      break;
    case 'update':
      opportunitiesStore.set(current.map(item => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      break;
    case 'delete':
      opportunitiesStore.set(current.filter(item => item.id !== data.id));
      break;
  }
}

export async function initializeOpportunities(userId: string) {
  try {
    opportunitiesStoreLoading.set(true);
    const { data: opportunities, error } = await supabase
      .from('user_opportunities')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      opportunitiesStoreError.set({
        name: error.name,
        message: error.message,
        details: error.details
      });
      throw new Error(error.message);
    }

    if (opportunities) {
      opportunitiesStore.set(opportunities);
      opportunitiesStoreError.set(null);
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: opportunitiesStoreError.get() };
  } finally {
    opportunitiesStoreError.set(null);
    opportunitiesStoreLoading.set(false);
  }
}