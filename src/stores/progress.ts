// user program progress store
import { atom } from 'nanostores';
import { supabaseBrowserClient } from '../lib/supabase/client.ts';
import type { Database } from '../../database.types.ts';


type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type ContentMeta = Database['public']['Tables']['content_meta']['Row'];
type ContentType = 'exercises' | 'challenges' | 'concepts' | 'milestones';
type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

interface ProgressUpdate {
  status?: ProgressStatus;
  form_completed?: boolean;
  feedback_rating?: number;
  feedback_text?: string;
  updated_at?: string;
  completed_at?: string | null;
}

// supabase browser client
const supabase = supabaseBrowserClient;

// Main Progress Store
export const progressStore = atom<UserProgress[]>([]);
export const isProgressLoading = atom(false);
export const progressError = atom<string | null>(null);

// -- HELPER FUNCTIONS --

// Store Initialization
export async function initProgressStore(userId: string) {
  isProgressLoading.set(true);
  progressError.set(null);
  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId);
  if (error) {
    progressError.set(JSON.stringify(error))
    isProgressLoading.set(false);
  }
  if (data) {
    progressStore.set(data);
    isProgressLoading.set(false);
    progressError.set(null);
  }
}

export function manageProgress(
  op: 'create' | 'update' | 'delete',
  data: Partial<UserProgress> & { content_meta_id: string }
) {
  const current = progressStore.get();

  switch (op) {
    case 'create':
      progressStore.set([...current, {
        ...data,
        created_at: new Date().toISOString(),
        status: 'started',
        form_completed: false
      } as UserProgress]);
      break;
      
    case 'update':
      progressStore.set(current.map(item => 
        item.content_meta_id === data.content_meta_id ? { ...item, ...data } : item
      ));
      break;
      
    case 'delete':
      progressStore.set(current.filter(
        item => item.content_meta_id !== data.content_meta_id
      ));
      break;
  }
}

// Add content progress -- Database-first operations
export async function createProgress(userId: string,content: ContentMeta) {
  const payload: UserProgressInsert = {
    user_id: userId,
    content_meta_id: content.id,
    content_type: content.content_type,
    content_title: content.title,
    content_slug: content.slug,
    has_form: content.has_form,
    form_completed: false,
    status: 'in_progress',
    completed_at: null,
    feedback_rating: null,
    feedback_text: null,
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(payload, {
      onConflict: 'user_id, content_meta_id',
      ignoreDuplicates: false // Return existing record if conflict
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error in createProgress (upsert):", error.message);
    return { data: null, error };
  }

  if (data) {
      // Check if the item already exists in the store by content_meta_id and user_id
      const existingIndex = progressStore.get().findIndex(
        p => p.content_meta_id === data.content_meta_id && p.user_id === data.user_id
      );
  
      if (existingIndex > -1) {
        // Update existing item in the store
        progressStore.set(
          progressStore.get().map((item, index) =>
            index === existingIndex ? data : item
          )
        );
      } else {
        // Add new item to the store
        progressStore.set([...progressStore.get(), data]);
      }
    }
  
  return { data, error: null };
}

// Update progress data
export async function updateProgressStatus(
  contentMetaId: string,
  status: ProgressStatus, // Use the correct type
  formCompleted?: boolean,
  feedbackRating?: number,
  feedbackText?: string
) {
  console.log(`[progressStore] updateProgressStatus called for ID: ${contentMetaId}, Status: ${status}`);
  const originalProgress = progressStore.get().find(item => item.content_meta_id === contentMetaId);
  if (!originalProgress) {
    console.warn(`[progressStore] Attempted to update progress for non-existent contentMetaId: ${contentMetaId}`);
    return { data: null, error: new Error("Progress record not found locally.") };
  }

  const updates: ProgressUpdate = {
    status,
    ...(status === 'completed' && { completed_at: new Date().toISOString() }),
    ...(formCompleted !== undefined && { form_completed: formCompleted }),
    ...(feedbackRating !== undefined && { feedback_rating: feedbackRating }),
    ...(feedbackText !== undefined && { feedback_text: feedbackText }),
    updated_at: new Date().toISOString()
  };

  // Handle completed_at based on status
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  console.log("[progressStore] Optimistic updates payload:", updates);

  // Optimistically update the store
  const updatedStoreData = progressStore.get().map(item =>
    item.content_meta_id === contentMetaId ? { ...item, ...updates } as UserProgress : item
  );
  progressStore.set(updatedStoreData);
  console.log(`[progressStore] Store optimistically updated for ID ${contentMetaId} to status: ${status}.`);

  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('content_meta_id', contentMetaId)
    .select()
    .single();

  if (error) {
    console.error(`[progressStore] Error updating progress status in DB for ID ${contentMetaId}:`, error.message);
    // Rollback: Revert the store to its original state if the DB update fails
    progressStore.set(
      progressStore.get().map(item =>
        item.content_meta_id === contentMetaId ? originalProgress : item
      )
    );
    return { data: null, error };
  }
  console.log(`[progressStore] DB update successful for ID ${contentMetaId}. Data returned by DB:`, data);
  // The store was optimistically updated. Ensure it's correct from DB response.
  // This step might be redundant if optimistic update matches, but confirms consistency.
  progressStore.set(
    progressStore.get().map(item =>
        item.content_meta_id === contentMetaId ? data : item
    )
  );
  console.log(`[progressStore] Store confirmed with DB data for ID ${contentMetaId}. Final status in store should be: ${data.status}`);

  return { data, error: null };
}


// Form-specific helpers
export async function saveFormAndMarkCompleted(
  contentMetaId: string,
) {
  console.log({ payload: { contentMetaId: contentMetaId, isComplete: true } });
  
    const originalProgress = progressStore.get().find(item => item.content_meta_id === contentMetaId);
    if (!originalProgress) {
      console.warn(`Attempted to save form progress for non-existent contentMetaId: ${contentMetaId}`);
      return { data: null, error: new Error("Progress record not found locally.") };
    }
  
    const updates: ProgressUpdate = {
      form_completed: true,
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  
    // Optimistically update the store
    const updatedStoreData = progressStore.get().map(item =>
      item.content_meta_id === contentMetaId ? { ...item, ...updates } as UserProgress : item
    );
    progressStore.set(updatedStoreData);
  
    // update the database
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('content_meta_id', contentMetaId)
      .select()
      .single();
  
    if (error) {
      console.error('Error saving form progress in DB:', error.message);
      // Rollback
      progressStore.set(
        progressStore.get().map(item =>
          item.content_meta_id === contentMetaId ? originalProgress : item
        )
      );
      return { data: null, error: error };
    }
  
  return { data: data, error: null };
}

export function getFormStatus(contentMetaId: string) {
  const progress = progressStore.get().find(
    p => p.content_meta_id === contentMetaId
  );
  return {
    completed: progress?.form_completed || false,
  };
}

// content feedback 
export async function submitContentFeedback(contentMetaId: string, rating: number, feedbackText: string) {
  const originalProgress = progressStore.get().find(item => item.content_meta_id === contentMetaId);
    if (!originalProgress) {
      console.warn(`Attempted to submit feedback for non-existent contentMetaId: ${contentMetaId}`);
      return { data: null, error: new Error("Progress record not found locally.") };
    }
  
    const updates: ProgressUpdate = {
      feedback_rating: rating,
      feedback_text: feedbackText,
      updated_at: new Date().toISOString()
    };
  
    // Optimistically update the store
    const updatedStoreData = progressStore.get().map(item =>
      item.content_meta_id === contentMetaId ? { ...item, ...updates } as UserProgress : item
    );
    progressStore.set(updatedStoreData);
  
    // update row in supabase
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('content_meta_id', contentMetaId)
      .select()
      .single();
  
    if (error) {
      console.error('Feedback submission error:', error.message);
      // Rollback
      progressStore.set(
        progressStore.get().map(item =>
          item.content_meta_id === contentMetaId ? originalProgress : item
        )
      );
      return { data: null, error };
    }
  
  return { data, error: null };
}

// Get all the entries for milestone
export function getContentProgressByMilestone(milestoneId: string, contentMeta: ContentMeta[]): {
  completed: ContentMeta[];
  incomplete: ContentMeta[];
} {
  const progress = progressStore.get();
  
  const milestoneContent = contentMeta.filter(content => 
    content.milestone_id === milestoneId && 
    content.content_type !== 'milestone' // exclude the milestone itself
  );

  const result = {
    completed: [] as ContentMeta[],
    incomplete: [] as ContentMeta[]
  };

  milestoneContent.forEach(content => {
    const progressRecord = progress.find(p => p.content_meta_id === content.id);
    if (progressRecord?.status === 'completed') {
      result.completed.push(content);
    } else {
      result.incomplete.push(content);
    }
  });

  return result;
}

export function isMilestoneComplete(milestoneId: string, contentMeta: ContentMeta[]): boolean {
  const milestoneContent = contentMeta.filter(content => 
    content.milestone_id === milestoneId && 
    content.content_type !== 'milestone'
  );

  if (milestoneContent.length === 0) return false;

  const progress = progressStore.get();
  
  return milestoneContent.every(content => {
    const progressRecord = progress.find(p => p.content_meta_id === content.id);
    return progressRecord?.status === 'completed';
  });
}