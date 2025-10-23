import type {JournalCategory, JournalType, CtaType, UrgencyLevel, JournalBuildEntryData, JournalMarketEntryData, SocialPlatform, JournalMoneyEntryData, JournalReflectionEntryData} from "../../types/urgeTypes"
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