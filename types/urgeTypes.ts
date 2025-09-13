import type { User, Session } from '@supabase/supabase-js'

// ------ Authentication and Supabase ----------

export interface AuthStore {
    user: User | null
    session: Session | null
    loading: boolean
}

export type AuthEventType = 'INITIAL_SESSION' |'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY'

