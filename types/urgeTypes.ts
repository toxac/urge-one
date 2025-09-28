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

