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

// Journal Categories
export type JournalCategory = 'reflection' | 'build' | 'market' | 'money';

// Journal Types (Communication Intent)
export type JournalType = 'rant' | 'appeal' | 'observation' | 'celebration' | 'question' | 'milestone' | 'announcement';

// CTA Types
export type CtaType = 
  | 'help_request'
  | 'feedback_needed'
  | 'advice_seeking'
  | 'resource_request'
  | 'connection_ask'
  | 'discussion_prompt'
  | 'opinion_poll'
  | 'experience_share'
  | 'collaboration_offer'
  | 'beta_testers'
  | 'early_access'
  | 'product_review'
  | 'content_amplification';

// Urgency Levels
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

// Program Reference
export type ProgramReference = {
  content_id: string;
  content_type: 'milestones' | 'exercises' | 'challenges' | 'concepts';
};




// Social Platforms for Cross-posting
export type SocialPlatform = 'twitter' | 'linkedin' | 'indiehackers' | 'product_hunt';


// Reflection Entry Data
export type JournalReflectionEntryData = {
  program_satisfaction?: number; // 1-5
  applied_learnings?: string[];
  confidence_change?: 'increased' | 'decreased' | 'same';
  questions?: string[];
};

// Build Entry Data
export type JournalBuildEntryData = {
  build_phase?: 'ideation' | 'planning' | 'prototyping' | 'testing' | 'validation' | 'iteration';
  is_launch?: boolean;
  time_invested?: number; // hours
  technical_challenges?: string[];
  validation_results?: string;
  launch_type?: 'mvp' | 'feature' | 'product' | 'company';
  metrics_tracked?: string[];
};

// Market Entry Data
export type JournalMarketEntryData = {
  activity_type?: 'customer_research' | 'sales' | 'marketing' | 'feedback_collection' | 'partnership';
  target_audience?: string;
  channels_used?: string[];
  results?: {
    leads_generated?: number;
    conversions?: number;
    feedback_received?: string[];
    insights_gained?: string[];
    cost_per_acquisition?: number;
  };
};

// Money Entry Data
export type JournalMoneyEntryData = {
  financial_activity?: 'pricing' | 'funding' | 'expenses' | 'revenue' | 'forecasting' | 'investment';
  amount_involved?: number;
  currency?: string;
  financial_metrics?: {
    runway_extension?: number;
    revenue_change?: number;
    cost_reduction?: number;
    valuation_impact?: number;
  };
  decision_factors?: string[];
  risk_assessment?: 'low' | 'medium' | 'high';
};

// Union type for all entry data
export type JournalEntryData = 
  | JournalReflectionEntryData
  | JournalBuildEntryData
  | JournalMarketEntryData
  | JournalMoneyEntryData;
