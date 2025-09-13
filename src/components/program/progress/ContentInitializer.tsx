/**
 * @description: Initializes user progress for the current content item.
 * Runs once when stores are loaded to ensure a 'user_progress' entry exists and is 'in_progress'.
 */
import { onMount, createEffect, on } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth.ts";
import { contentMetaStore, isContentMetaLoading } from "../../../stores/contentMeta.ts";
import { progressStore, isProgressLoading } from "../../../stores/progress.ts";
import { createProgress } from "../../../stores/progress.ts";

interface Props {
    contentMetaId: string;
}

export default function ContentInitializer(props: Props) {
    const $session = useStore(authStore);
    const $contentMeta = useStore(contentMetaStore);
    const $progress = useStore(progressStore);
    const $isProgressLoading = useStore(isProgressLoading);
    const $isContentMetaLoading = useStore(isContentMetaLoading);

    let initialized = false;

    createEffect(on(
        [$session, $contentMeta, $progress, $isProgressLoading, $isContentMetaLoading],
        ([session, contentMeta, progress, progressLoading, contentMetaLoading]) => {

            // Skip if already initialized
            if (initialized) return;

            // Skip if stores aren't ready yet
            if (!session?.user || contentMeta.length === 0) {
                return;
            }

            if (progressLoading || contentMetaLoading) return;

            const user = session.user;
            const content = contentMeta.find(c => c.id === props.contentMetaId);
            const userProgress = progress.find(p => p.content_meta_id === props.contentMetaId);

            // Skip if content not found
            if (!content) {
                initialized = true; // Mark as initialized to prevent retries
                return;
            }

            // If progress exists with valid status, just log
            if (userProgress && userProgress.status && userProgress.status !== "not_started" && userProgress.status !== null) {
                console.log(`[ContentInitializer] ✅ Progress exists: ${userProgress.status}`);
                initialized = true;
                return;
            }

            // Only create progress if needed
            createProgress(user.id, content)
                .then(({ error }) => {
                    if (error) {
                        console.error(`[ContentInitializer] Failed:`, error);
                    } else {
                        console.log(`[ContentInitializer] ✅ Progress created for: ${content.title}`);
                    }
                    initialized = true;
                })
                .catch(error => {
                    console.error(`[ContentInitializer] Unexpected error:`, error);
                    initialized = true;
                });
        },
        { defer: true }
    ));

    return null;
}