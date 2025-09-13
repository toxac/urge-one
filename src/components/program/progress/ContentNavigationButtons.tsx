/**
 * @description: Displays navigation buttons (Previous, Skip, Next/Complete) for content.
 * Manages button states based on current content completion requirements.
 * Orchestrates completion logic and navigates to a dedicated progress handling page.
 * @file /src/components/program/progress/ContentNavigationButtons.tsx
 * @author Amit amitChanchal
 * @updated July 16, 2025
 */

import { createSignal, createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { navigate } from "astro:transitions/client";
import { updateProgressStatus } from "../../../stores/progress.ts";
import { authStore } from "../../../stores/auth.ts";
import { contentMetaStore } from "../../../stores/contentMeta.ts";
import { progressStore } from "../../../stores/progress.ts";
import { notify } from "../../../stores/notifications.ts";
import { Icon } from "@iconify-icon/solid";


interface Props {
    contentMetaId: string; // The UUID for database operations (e.g., user_progress table)
    contentType: string; // The collection name (e.g., 'concepts', 'milestones')
    nextContentId?: string; // Slug of the next content
    nextContentType?: string; // Type (collection name) of the next content
    previousContentId?: string; // Slug of the previous content
    previousContentType?: string; // Type (collection name) of the previous content
}

export default function ContentNavigationButtons(props: Props) {
    const [isLoading, setIsLoading] = createSignal(false);

    const $session = useStore(authStore);
    const $progress = useStore(progressStore);
    const $contentMeta = useStore(contentMetaStore);

    const currentContent = createMemo(() => $contentMeta().find(c => c.id === props.contentMetaId));
    const currentProgress = createMemo(() => $progress().find(p => p.content_meta_id === props.contentMetaId));

    // --- NEW: Determine if a warning icon should be shown next to 'Next' button ---
    const showNextButtonWarningIcon = createMemo(() => {
        if (isLoading()) return false; // Don't show warning if busy loading

        const content = currentContent();
        const progress = currentProgress();

        if (!content || !progress) return false;

        // Only show warning if it's an exercise/challenge with a form that's not completed
        if ((props.contentType === 'exercises' || props.contentType === 'challenges') && content.has_form) {
            return !progress.form_completed;
        }
        return false;
    });


    // --- Navigation Helper Function ---
    const navigateToNextContentDirectly = () => {
        const nextUrl = (props.nextContentId && props.nextContentType)
            ? `/program/${props.nextContentType}/${props.nextContentId}`
            : `/program/dashboard`;
        navigate(nextUrl);
    };

    // This function encapsulates navigation to the intermediate progress handler page
    const navigateToProgressHandler = (queryParams: URLSearchParams) => {
        console.log(`[ContentNavigationButtons] Navigating to intermediate progress handler: /program/progress/completion/?${queryParams.toString()}`);
        navigate(`/program/progress/completion/?${queryParams.toString()}`);
    };

    // --- Toast Notification Helper ---
    const showToast = (message: string, showActions: boolean = false) => {
        if (showActions) {
            // For action toasts, use a longer duration and info type
            notify.info(message, "Action Required", 3000); // 3 seconds
        } else {
            // For simple messages, use appropriate types based on context
            notify.info(message, undefined, 3000);
        }
    };


    // --- Event Handlers for Buttons ---

    const handlePrevious = () => {
        if (props.previousContentId && props.previousContentType) {
            console.log(`[ContentNavigationButtons] Navigating Previous to: /program/${props.previousContentType}/${props.previousContentId}`);
            navigate(`/program/${props.previousContentType}/${props.previousContentId}`);
        } else {
            console.log("[ContentNavigationButtons] No previous content ID/type provided. Cannot navigate back.");
        }
    };

    const handleSkip = () => {
        console.log("[ContentNavigationButtons] 'Skip' button clicked.");
        navigateToNextContentDirectly(); // Skip always bypasses the bridge page
    };

    const handleComplete = async () => {
        console.log("[ContentNavigationButtons] 'Next' (Complete) button clicked.");
        setIsLoading(true);

        const content = currentContent();
        const progress = currentProgress();
        const user = $session()?.user;

        if (!user || !content || !progress) {
            console.error("[ContentNavigationButtons] Essential data missing for completion. User:", !!user, "Content:", !!content, "Progress:", !!progress);
            notify.error("Missing data to process. Please refresh.", "Error");
            setIsLoading(false);
            return;
        }

        // --- Scenario 1: Current Page is a Milestone (No Progress Change, Direct Nav) ---
        if (props.contentType === 'milestones') {
            console.log("[ContentNavigationButtons] Current page is a Milestone. Navigating directly to next content.");
            setIsLoading(false);
            navigateToNextContentDirectly();
            return; // Exit
        }

        // --- Scenario 2: Exercise/Challenge with Incomplete Form (Show Toast, Stay on Page) ---
        if ((props.contentType === 'exercises' || props.contentType === 'challenges') &&
            content.has_form && !progress.form_completed) {
            console.log(`[ContentNavigationButtons] Form incomplete for ${props.contentType}. Showing toast.`);
            notify.warning(`Please complete the form for this ${props.contentType.slice(0, -1)} to proceed, or skip it.`, "Form Incomplete", 8000);
            setIsLoading(false);
            return; // Exit
        }

        // --- Scenario 3: Content was already completed (Direct Nav) ---
        if (progress.status === 'completed') {
            console.log(`[ContentNavigationButtons] Content "${content.title}" is already marked 'completed'. Navigating directly to next content.`);
            setIsLoading(false);
            navigateToNextContentDirectly(); // Bypass bridge page
            return; // Exit
        }

        // --- Scenario 4: Content needs to be marked 'completed' (NEW COMPLETION -> Bridge Page) ---
        console.log(`[ContentNavigationButtons] Calling updateProgressStatus for "${content.title}" (MetaId: ${props.contentMetaId}) to 'completed'.`);
        try {
            const { error } = await updateProgressStatus(
                props.contentMetaId, // The UUID
                'completed',
                content.has_form ? true : undefined
            );

            if (error) {
                // If DB update fails, show toast and stay on current page.
                console.error(`[ContentNavigationButtons] Error updating progress for "${content.title}":`, error.message);
                notify.error(`Failed to mark "${content.title}" complete: ${error.message}`);
                setIsLoading(false);
                return; // Exit
            } else {
                // Success! New completion achieved. Navigate to bridge page.
                console.log(`[ContentNavigationButtons] "${content.title}" successfully updated to 'completed' in DB. Navigating to bridge page.`);
                const queryParams = new URLSearchParams();
                queryParams.set('contentId', content.slug || ''); // Slug from store
                queryParams.set('contentType', props.contentType);
                queryParams.set('accomplishmentId', `${content?.accomplishment_id}`)

                // only send contentId(slug), contentType, navigation(id and type)
                navigateToProgressHandler(queryParams); // GO TO BRIDGE PAGE
            }
        } catch (error: any) {
            console.error("[ContentNavigationButtons] Unexpected error during updateProgressStatus:", error.message);
            notify.error("An unexpected error occurred during completion.", "Please try again.");
            setIsLoading(false);
            return; // Exit
        }
        setIsLoading(false); // Should be unreachable if all paths return/navigate.
    };

    return (
        <div class="w-full flex justify-center my-16">
            <div class="join">
                {/* Previous Button */}
                <button
                    class="btn bg-white btn-lg join-item rounded-l-full"
                    disabled={!props.previousContentId || isLoading()}
                    onClick={handlePrevious}
                >
                    <div class="flex gap-3 items-center">
                        <Icon icon="mdi:arrow-left-bold-circle" class="text-2xl text-primary" />
                        Previous
                    </div>
                </button>

                {/* Skip Button */}
                <Show when={props.nextContentId}>
                    <button
                        class="btn bg-white btn-lg join-item"
                        disabled={isLoading()}
                        onClick={handleSkip}
                    >
                        <div class="flex gap-3 items-center">
                            <Icon icon="mdi:clock-outline" class="text-2xl text-gray-500" />
                            Skip, I'll complete this later
                        </div>
                    </button>
                </Show>

                {/* Next/Complete Button */}
                <Show when={props.nextContentId}>
                    <button
                        class="btn bg-primary text-white btn-lg join-item rounded-r-full hover:bg-primary-focus"
                        disabled={isLoading()}
                        onClick={handleComplete}
                    >
                        <div class="flex gap-3 items-center">
                            <Show when={isLoading()}>
                                <span class="loading loading-spinner loading-sm"></span>
                            </Show>
                            Next
                            <Show when={showNextButtonWarningIcon()}>
                                <Icon icon="mdi:alert-circle" class="text-xl text-yellow-300 ml-1" />
                            </Show>
                            <Icon icon="mdi:arrow-right-bold-circle" class="text-2xl" />
                        </div>
                    </button>
                </Show>
            </div>
        </div>
    );
}