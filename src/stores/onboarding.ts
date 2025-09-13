// stores/onboardingContext.ts
import { atom } from 'nanostores';

export type OnboardingContext = {
    intent: 'register' | 'enroll' | 'subscribe' | 'challenge' | 'event';
    details?: string; // add reference ids either of program or challenge
}

export const onboardingContext = atom<OnboardingContext>({
    intent: "register",
    details: ""
});