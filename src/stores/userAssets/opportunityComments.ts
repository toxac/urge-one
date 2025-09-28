// stores/userAssets/opportunityComments.ts
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../../lib/supabase/client.ts';
import { type Database } from "../../../database.types.ts";
import { type SupabaseCustomError } from '../../../types/urgeTypes.ts';

const supabase = supabaseBrowserClient;
type Comment = Database['public']['Tables']['user_opportunity_comments']['Row'];
type CommentInsert = Database['public']['Tables']['user_opportunity_comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['user_opportunity_comments']['Update'];

export const commentsStore = atom<Comment[]>([]);
export const commentsStoreLoading = atom(false);
export const commentsStoreError = atom<SupabaseCustomError | null>(null);

// Initialize comments for a user
export async function initializeOpportunityComments(userId: string) {
  try {
    commentsStoreLoading.set(true);
    commentsStoreError.set(null);
    
    const { data: comments, error } = await supabase
      .from('user_opportunity_comments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    commentsStore.set(comments || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    commentsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    commentsStoreLoading.set(false);
  }
}

// Initialize comments for a specific opportunity
export async function initializeCommentsForOpportunity(opportunityId: string) {
  try {
    commentsStoreLoading.set(true);
    commentsStoreError.set(null);
    
    const { data: comments, error } = await supabase
      .from('user_opportunity_comments')
      .select('*')
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    commentsStore.set(comments || []);
    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    commentsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    commentsStoreLoading.set(false);
  }
}

// Create a new comment
export async function createComment(commentData: CommentInsert) {
  try {
    commentsStoreLoading.set(true);
    commentsStoreError.set(null);

    const { data: comment, error } = await supabase
      .from('user_opportunity_comments')
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    // Update store after successful Supabase operation
    const current = commentsStore.get();
    commentsStore.set([comment, ...current]);

    return { success: true, data: comment, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    commentsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    commentsStoreLoading.set(false);
  }
}

// Update an existing comment
export async function updateComment(id: string, updates: CommentUpdate) {
  try {
    commentsStoreLoading.set(true);
    commentsStoreError.set(null);

    const { data: comment, error } = await supabase
      .from('user_opportunity_comments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const current = commentsStore.get();
    commentsStore.set(
      current.map(item => item.id === id ? comment : item)
    );

    return { success: true, data: comment, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    commentsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, data: null, error: supabaseError };
  } finally {
    commentsStoreLoading.set(false);
  }
}

// Delete a comment
export async function deleteComment(id: string) {
  try {
    commentsStoreLoading.set(true);
    commentsStoreError.set(null);

    const { error } = await supabase
      .from('user_opportunity_comments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const current = commentsStore.get();
    commentsStore.set(current.filter(item => item.id !== id));

    return { success: true, error: null };
  } catch (error) {
    const supabaseError = error as SupabaseCustomError;
    commentsStoreError.set({
      name: supabaseError.name,
      message: supabaseError.message,
      details: supabaseError.details
    });
    return { success: false, error: supabaseError };
  } finally {
    commentsStoreLoading.set(false);
  }
}

// Get comments by opportunity ID
export function getCommentsByOpportunityId(opportunityId: string): Comment[] {
  return commentsStore.get().filter(comment => comment.opportunity_id === opportunityId);
}

// Get comment by ID
export function getCommentById(id: string): Comment | undefined {
  return commentsStore.get().find(comment => comment.id === id);
}

// Get comments count for an opportunity
export function getCommentsCount(opportunityId: string): number {
  return commentsStore.get().filter(comment => comment.opportunity_id === opportunityId).length;
}

// Clear store and errors
export function clearComments() {
  commentsStore.set([]);
  commentsStoreError.set(null);
}