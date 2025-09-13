import { atom } from 'nanostores';
import { initializeBookmarks } from './bookmarks';
import { initializeAccomplishments } from './accomplishments';
import { initializeChallenges } from './challenges';
import { initializeJournals } from './journals';
import { initializeOpportunities } from './opportunities';
import { initializeNotes } from './notes';
import { initializeQuestions } from './questions';
import { initializeSkills } from './skills';
import { initializeSquad } from './squad';

export const isUserAssetsStoreLoading = atom(false);

export async function initializeUserAssets(userId: string) {
  try {
    isUserAssetsStoreLoading.set(true);
    
    const results = await Promise.allSettled([
      initializeBookmarks(userId),
      initializeNotes(userId),
      initializeOpportunities(userId),
      initializeQuestions(userId),
      initializeSkills(userId),
      initializeSquad(userId),
      initializeChallenges(userId),
      initializeJournals(userId),
      initializeAccomplishments(userId)
    ]);

    // Check for any failures
    const errors = results
      .filter(result => result.status === 'rejected')
      .map(result => (result as PromiseRejectedResult).reason);

    if (errors.length > 0) {
      console.error('Errors initializing user assets:', errors);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing user assets:', error);
    return false;
  } finally {
    isUserAssetsStoreLoading.set(false);
  }
}