// /store/userAssets/opportunities-basic.ts
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['user_opportunities']['Insert'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

export const opportunitiesStore = atom<Opportunity[]>([]);
export const opportunitiesStoreLoading = atom(false);
export const opportunitiesStoreError = atom<SupabaseCustomError | null>(null);

// Initialize opportunities for a user
export async function initializeOpportunities(userId: string) {
  try {
    opportunitiesStoreLoading.set(true);
    opportunitiesStoreError.set(null);

    const { data: opportunities, error } = await supabase
      .from('user_opportunities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    opportunitiesStore.set(opportunities || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    opportunitiesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    opportunitiesStoreLoading.set(false);
  }
}

// Create a new opportunity (Supabase first, then store)
export async function createOpportunity(opportunityData: OpportunityInsert) {
  try {
    opportunitiesStoreLoading.set(true);
    opportunitiesStoreError.set(null);
    console.log(opportunityData)

    // Supabase operation first
    const { data: opportunity, error } = await supabase
      .from('user_opportunities')
      .insert(opportunityData)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = opportunitiesStore.get();
    opportunitiesStore.set([opportunity, ...current]);

    return { success: true, data: opportunity, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    opportunitiesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    opportunitiesStoreLoading.set(false);
  }
}

// Update an existing opportunity (Supabase first, then store)
export async function updateOpportunity(id: string, updates: OpportunityUpdate) {
  try {
    opportunitiesStoreLoading.set(true);
    opportunitiesStoreError.set(null);

    // Supabase operation first
    const { data: opportunity, error } = await supabase
      .from('user_opportunities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = opportunitiesStore.get();
    opportunitiesStore.set(
      current.map(item => item.id === id ? opportunity : item)
    );

    return { success: true, data: opportunity, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    opportunitiesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    opportunitiesStoreLoading.set(false);
  }
}

// Delete an opportunity (Supabase first, then store)
export async function deleteOpportunity(id: string) {
  try {
    opportunitiesStoreLoading.set(true);
    opportunitiesStoreError.set(null);

    // Supabase operation first
    const { error } = await supabase
      .from('user_opportunities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Only update store after successful Supabase operation
    const current = opportunitiesStore.get();
    opportunitiesStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    opportunitiesStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    opportunitiesStoreLoading.set(false);
  }
}

// Get opportunity by ID
export function getOpportunityById(id: string): Opportunity | undefined {
  return opportunitiesStore.get().find(opportunity => opportunity.id === id);
}

// Get opportunities by status
export function getOpportunitiesByStatus(status: string): Opportunity[] {
  return opportunitiesStore.get().filter(opportunity => opportunity.status === status);
}

// Clear store and errors
export function clearOpportunities() {
  opportunitiesStore.set([]);
  opportunitiesStoreError.set(null);
}

