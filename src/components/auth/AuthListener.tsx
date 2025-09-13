import { onMount, onCleanup, createEffect, Show } from 'solid-js'
import { supabaseBrowserClient } from '../../lib/supabase/client';
// import all stores
import { setAuth, clearAuth } from '../../stores/auth';
import { contentMetaStore } from '../../stores/contentMeta.ts';
import { profileStore, loadProfile } from '../../stores/profile.ts';
import { initProgressStore, progressStore } from '../../stores/progress.ts';
//import { initializeUserAssets } from '../../stores/userAssets';
import { rolesStore } from '../../stores/roles.ts';
import { loadingStore } from '../../stores/loadingStore.ts';

import type { Database } from "../../../database.types.ts";

type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface Props {
    roles: UserRole[] | null;
}
const supabase = supabaseBrowserClient;

export default function AuthListener(props: Props) {

    onMount(async () => {
        // set data loading to true
        loadingStore.set(true);
        // Set user roles to nanostore to sync with middleware
        rolesStore.set(props.roles);

        try {
            console.log("[AuthProvider] Attempting to get session...");
            // Fetch the user session
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            console.log("[AuthProvider] Session data:", data.session ? "Found" : "Not Found");

            // If user is logged in, fetch relevant data and store to nanostores
            if (data.session) {
                const userId = data.session.user.id;
                setAuth(data.session.user, data.session);
                console.log("[AuthProvider] Auth store set for user:", userId);

                // Fetch and await setting profile data
                const { data: profileData, error: profileError } = await loadProfile(userId)

                if (profileError) {
                    console.warn("[AuthProvider] Could not fetch user profile:", profileError);
                } else {
                    profileStore.set(profileData);
                    console.log("[AuthProvider] Profile store set.");
                }

                // Fetch and await setting content_meta data
                const { data: contentData, error: contentError } = await supabase.from('content_meta').select('*');
                if (contentError) {
                    console.warn("[AuthProvider] Could not fetch content_meta:", contentError.message);
                } else {
                    contentMetaStore.set(contentData);
                    console.log("[AuthProvider] ContentMeta store set.");
                }

                // AWAIT these asynchronous initialization calls
                console.log("[AuthProvider] Initializing progress store...");
                await initProgressStore(userId);
                console.log("[AuthProvider] Progress store initialized.");

                //console.log("[AuthProvider] Initializing user assets store...");
                //await initializeUserAssets(userId);
                //console.log("[AuthProvider] User assets store initialized.");

            } else {
                // If no session, clear all stores to ensure clean state
                clearAuth();
                profileStore.set(null);
                contentMetaStore.set([]);
                progressStore.set([]);
                rolesStore.set(null);
                console.log("[AuthProvider] No session found, clearing user-specific stores.");
            }
        } catch (error: any) {
            console.error('[AuthProvider] Error fetching session or user data:', error.message);
            // Clear stores on error
            clearAuth();
            profileStore.set(null);
            contentMetaStore.set([]);
            progressStore.set([]);
            rolesStore.set(null);
        } finally {
            loadingStore.set(false);
            console.log("[AuthProvider] AuthProvider initialization finished.");
        }
    });

    createEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`[AuthProvider] Auth state change event: ${event}`);

            switch (event) {
                case "INITIAL_SESSION":
                case "SIGNED_IN":
                    if (session) {
                        setAuth(session.user, session)
                        // You might want to trigger data refreshes here
                    }
                    break;
                case "USER_UPDATED":
                    if (session) {
                        setAuth(session.user, session)
                        // You might want to trigger data refreshes here
                    }

                case "PASSWORD_RECOVERY":
                    if (session) {
                        setAuth(session.user, session);
                    }
                    break;
                case "SIGNED_OUT":
                    clearAuth();
                    profileStore.set(null);
                    contentMetaStore.set([]);
                    progressStore.set([]);
                    rolesStore.set(null);
                    console.log("[AuthProvider] User signed out, all stores cleared.");
                    break;
                default:
                    break;
            }
        });

        onCleanup(() => {
            console.log("[AuthProvider] Unsubscribing from auth state changes.");
            subscription.unsubscribe();
        });
    });

    // Return a loading indicator that can be used by Astro pages
    return null;

}