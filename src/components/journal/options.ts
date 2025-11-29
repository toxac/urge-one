/**
 * @file src/components/journal/options.ts
 * @description options for fields in journal
 */

export const MOODS = [
  { value: 'energised', label: 'Energised', icon: 'mdi:rocket' },
  { value: 'neutral', label: 'Neutral', icon: 'mdi:balance' },
  { value: 'stuck', label: 'Stuck', icon: 'mdi:help-circle' },
  { value: 'anxious', label: 'Anxious', icon: 'mdi:heart-pulse' },
  { value: 'breakthrough', label: 'Breakthrough', icon: 'mdi:lightning-bolt' }
] as const;

export const URGENCIES = [
  { value: 'low', label: 'Low', icon: 'mdi:clock-outline' },
  { value: 'medium', label: 'Medium', icon: 'mdi:clock-fast' },
  { value: 'high', label: 'High', icon: 'mdi:alert' },
  { value: 'critical', label: 'Critical', icon: 'mdi:alert-circle' }
] as const;

export const CATEGORIES = [
  { value: 'daily', label: 'Daily Reflection' },
  { value: 'business', label: 'Business' },
  { value: 'product', label: 'Product' },
  { value: 'customers', label: 'Customers' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'finance', label: 'Finance' },
  { value: 'team', label: 'Team' },
  { value: 'mindset', label: 'Mindset' },
  { value: 'program', label: 'Program' },  // Urge-specific
] as const;