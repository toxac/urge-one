import type { User, Session } from '@supabase/supabase-js'

// ------ Authentication and Supabase ----------

export interface AuthStore {
    user: User | null
    session: Session | null
    loading: boolean
}

export type AuthEventType = 'INITIAL_SESSION' |'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY'

export interface SupabaseCustomError {
    name: string;
    message: string;
    details?: string
}

// ------ Opportunities ----------
export type UserOpportunitiesStatus = "added" | "archived" | "selected";
export type UserOpportunitiesDiscoveryMethod = "personal-problems" | "skill-based" | "zone-of-influence" | "broader-search";
export type UserOppotunityCommentType =  "observation"| "insight" | "question" |"update";

// ----- User Questions ------

export type UserQuestionStatus = "pending" | "answered" | "rejected" | "archived" | "flagged" ;
/*
"pending" — The question has been submitted but not yet reviewed or answered.
"approved" — The question has been reviewed and approved for display.
"answered" — The question has received an answer.
"rejected" — The question was reviewed but not approved (e.g., inappropriate or off-topic).
"archived" — The question is no longer active but kept for record/history.
"flagged" — The question has been reported for review (e.g., inappropriate content).
*/
