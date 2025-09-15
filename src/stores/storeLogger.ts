// lib/logger.ts
import { logger } from '@nanostores/logger';

// Import all the stores
import { authStore } from './auth';
import { profileStore } from './profile';
import { progressStore } from './progress';
import { contentMetaStore } from './contentMeta';
import { onboardingContext } from './onboarding';
import { rolesStore } from './roles';
import { paymentStore } from './payment';

import { bookmarksStore } from './userAssets/bookmarks';
import { opportunitiesStore } from './userAssets/opportunities';
import { notesStore } from './userAssets/notes';
import { questionsStore } from './userAssets/questions';
import { journalsStore } from './userAssets/journals';
import { accomplishmentStore } from './userAssets/accomplishments';
import { squadStore } from './userAssets/squad';
import { skillsStore } from './userAssets/skills';
import { challengeStore } from './userAssets/challenges';


// Only initialize logger in development
let destroyLogger: (() => void) | null = null;

export const initStoreLogger = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV || process.env.NODE_ENV === 'development') {
    destroyLogger = logger({
      'Auth': authStore,
      'Profile': profileStore,
      'Progress': progressStore,
      'ContentMeta': contentMetaStore,
      'Onboarding': onboardingContext,
      'Bookmarks': bookmarksStore,
      'Notes': notesStore,
      'Opportunities': opportunitiesStore,
      'Questions': questionsStore,
      'Journals': journalsStore,
      'Accomplishments': accomplishmentStore,
      'Squad': squadStore,
      'Skills': skillsStore,
      'Challenges': challengeStore,
      'Roles': rolesStore,
      'Payments': paymentStore
    });
    
    console.log('NanoStores logger initialized in development mode');
  }
};

export const destroyStoreLogger = () => {
  if (destroyLogger) {
    destroyLogger();
    destroyLogger = null;
    console.log('NanoStores logger destroyed');
  }
};