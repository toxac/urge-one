// squadInitialization.ts
import { atom } from 'nanostores';

export const squadInitialized = atom(false);
export const squadUpdatesInitialized = atom(false);

export function resetInitialization() {
  squadInitialized.set(false);
  squadUpdatesInitialized.set(false);
}