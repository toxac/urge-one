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


// ----- Program ------

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

// -- USER JOURNAL ---

export type JournalCategory = "learning" | "progress" | "insights" | "build-log" | "reflection"; 

export type JournalProgressEntryData = {
  progress_date: string;
  milestone: string;
  progress_percent?: number;
  key_activities?: string[];
  next_steps?: string[];
};

export type JournalChallengeEntryData = {
  challenge_area: string;
  description: string;
  severity?: 'minor' | 'moderate' | 'major' | 'critical';
  attempted_solutions?: string[];
  help_needed?: string;
};

export type JournalLearningEntryData = {
  source: string;
  key_takeaways: string[];
  applied_in_project?: boolean;
  application_notes?: string;
};

export type JournalInsightEntryData = {
  insight_origin: string;
  theme: string;
  impact?: string;
  confidence_level?: 'hypothesis' | 'validated' | 'pivot';
  potential_experiments?: string[];
};

export type JournalBuildLogEntryData = {
  version: string;
  environment?: 'beta' | 'staging' | 'production';
  changes?: string[];
  feedback_count?: number;
  issues_reported?: number;
  planned_hotfixes?: string[];
};

export type JournalReflectionEntryData = {
  reflection_prompt?: string;
  personal_insight: string;
  gratitude_note?: string;
};

export type JournalEntryData =
  | JournalProgressEntryData
  | JournalChallengeEntryData
  | JournalLearningEntryData
  | JournalInsightEntryData
  | JournalBuildLogEntryData
  | JournalReflectionEntryData;
