
# Journal Feature

## Overview
A journalling feature for urge which is designed to
- Encourage users to record reflection through their entrepreneurial journey
- Journal also become tool to document and communicate building, market insights and experience
- Users can use this as their personal diary or use it to communicate with others (community, squad, everyone else)
- Journals can also be crossposted to users blogs and social account
- Key motivation is to get users to communicate as much as possible 

# Schema 
Journal is stored in user_journals table in supabase. There is also supporting journal_comments table which stores the feedbacks for journal.

**user_journals** schema

```ts
user_journals: {
    Row: {
        category: string | null
        content: string | null
        created_at: string
        cross_post_to_blog: boolean | null
        cross_post_to_social: string[] | null
        cta_description: string | null
        cta_title: string | null
        cta_type: string | null
        entry_data: Json | null
        has_cta: boolean | null
        id: string
        is_public: boolean | null
        program_ref: Json | null
        response_deadline: string | null
        should_email_followers: boolean | null
        tags: string[] | null
        title: string | null
        type: string | null
        updated_at: string | null
        urgency: string | null
        user_id: string | null
    }
}

```

## Field options

```ts

// Types
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
  content_type: 'module' | 'exercise' | 'resource' | 'mentor_session';
};

// Social Platforms for Cross-posting
export type SocialPlatform = 'twitter' | 'linkedin' | 'indiehackers' | 'product_hunt';


// Category options with labels and icons
export const JOURNAL_CATEGORIES: { value: JournalCategory; label: string; icon: string }[] = [
  { value: 'reflection', label: 'Reflection', icon: 'mdi:account-heart' },
  { value: 'build', label: 'Build', icon: 'mdi:hammer-wrench' },
  { value: 'market', label: 'Market', icon: 'mdi:chart-line' },
  { value: 'money', label: 'Money', icon: 'mdi:cash' },
];

// Type options with labels
export const JOURNAL_TYPES: { value: JournalType; label: string; description: string }[] = [
  { value: 'rant', label: 'Rant', description: 'Emotional release, vulnerability' },
  { value: 'appeal', label: 'Appeal', description: 'Direct request for help' },
  { value: 'observation', label: 'Observation', description: 'Pattern recognition, insights' },
  { value: 'celebration', label: 'Celebration', description: 'Milestones and wins' },
  { value: 'question', label: 'Question', description: 'Seeking advice or clarification' },
  { value: 'milestone', label: 'Milestone', description: 'Progress markers' },
  { value: 'announcement', label: 'Announcement', description: 'Formal updates' },
];

// CTA type options with labels and icons
export const CTA_TYPES: { value: CtaType; label: string; icon: string; category: string }[] = [
  // Help-oriented CTAs
  { value: 'help_request', label: 'Help Request', icon: 'mdi:help-circle', category: 'help' },
  { value: 'advice_seeking', label: 'Advice Seeking', icon: 'mdi:lightbulb', category: 'help' },
  { value: 'resource_request', label: 'Resource Request', icon: 'mdi:toolbox', category: 'help' },
  
  // Engagement CTAs
  { value: 'discussion_prompt', label: 'Discussion Prompt', icon: 'mdi:forum', category: 'engagement' },
  { value: 'opinion_poll', label: 'Opinion Poll', icon: 'mdi:poll', category: 'engagement' },
  { value: 'experience_share', label: 'Experience Share', icon: 'mdi:account-voice', category: 'engagement' },
  
  // Action CTAs
  { value: 'beta_testers', label: 'Beta Testers', icon: 'mdi:test-tube', category: 'action' },
  { value: 'early_access', label: 'Early Access', icon: 'mdi:rocket-launch', category: 'action' },
  { value: 'product_review', label: 'Product Review', icon: 'mdi:star', category: 'action' },
  { value: 'content_amplification', label: 'Content Amplification', icon: 'mdi:share', category: 'action' },
  
  // Connection CTAs
  { value: 'connection_ask', label: 'Connection Ask', icon: 'mdi:account-arrow-right', category: 'connection' },
  { value: 'collaboration_offer', label: 'Collaboration Offer', icon: 'mdi:handshake', category: 'connection' },
  { value: 'feedback_needed', label: 'Feedback Needed', icon: 'mdi:comment-check', category: 'connection' },
];

// Urgency options
export const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low - When you have time', color: 'badge-success' },
  { value: 'medium', label: 'Medium - In the next few days', color: 'badge-warning' },
  { value: 'high', label: 'High - Need input soon', color: 'badge-warning' },
  { value: 'urgent', label: 'Urgent - Critical blocker', color: 'badge-error' },
];

// Build phase options
export const BUILD_PHASES: { value: JournalBuildEntryData['build_phase']; label: string }[] = [
  { value: 'ideation', label: 'Ideation' },
  { value: 'planning', label: 'Planning' },
  { value: 'prototyping', label: 'Prototyping' },
  { value: 'testing', label: 'Testing' },
  { value: 'validation', label: 'Validation' },
  { value: 'iteration', label: 'Iteration' },
];

// Market activity options
export const MARKET_ACTIVITIES: { value: JournalMarketEntryData['activity_type']; label: string }[] = [
  { value: 'customer_research', label: 'Customer Research' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'feedback_collection', label: 'Feedback Collection' },
  { value: 'partnership', label: 'Partnership' },
];

// Financial activity options
export const FINANCIAL_ACTIVITIES: { value: JournalMoneyEntryData['financial_activity']; label: string }[] = [
  { value: 'pricing', label: 'Pricing' },
  { value: 'funding', label: 'Funding' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'forecasting', label: 'Forecasting' },
  { value: 'investment', label: 'Investment' },
];

// Social platform options
export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string; icon: string }[] = [
  { value: 'twitter', label: 'Twitter', icon: 'mdi:twitter' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'mdi:linkedin' },
  { value: 'indiehackers', label: 'Indie Hackers', icon: 'mdi:forum' },
  { value: 'product_hunt', label: 'Product Hunt', icon: 'mdi:rocket' },
];

```

## Category-Specific Entry Data Types user_journals.entry_data

```ts
// src/types/journal-entry-data.ts

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


```


