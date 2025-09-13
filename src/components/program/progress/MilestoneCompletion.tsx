import { navigate } from "astro:transitions/client";
import { createSignal, createEffect, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { contentMetaStore } from "../../../stores/contentMeta.ts";
import { progressStore, getContentProgressByMilestone, updateProgressStatus } from "../../../stores/progress.ts";
import type { Database } from "../../../../database.types.ts";

type ContentMeta = Database['public']['Tables']['content_meta']['Row'];

interface ComponentProps {
    contentMetaId: string | null;
}

export default function MilestoneCompletion(props: ComponentProps) {
    const $contentMeta = useStore(contentMetaStore);
    const $progress = useStore(progressStore);
    const [isLoading, setIsLoading] = createSignal(true);
    const [completionStatus, setCompletionStatus] = createSignal<{
        completed: ContentMeta[];
        incomplete: ContentMeta[];
    }>({ completed: [], incomplete: [] });
    const [milestoneContentMeta, setMilestoneContentMeta] = createSignal<ContentMeta | null>(null);

    // Check if all content is completed and update milestone status if needed
    const checkAndUpdateMilestoneStatus = async () => {
        const currentContent = $contentMeta().find(c => c.id === props.contentMetaId);
        if (!currentContent?.milestone_id) return;

        // Find the milestone record itself
        const milestoneRecord = $contentMeta().find(c =>
            c.milestone_id === currentContent.milestone_id &&
            c.content_type === 'milestone'
        );

        if (!milestoneRecord) return;
        setMilestoneContentMeta(milestoneRecord);

        // Check if milestone progress exists
        const milestoneProgress = $progress().find(p =>
            p.content_meta_id === milestoneRecord.id
        );

        // If all content is completed but milestone isn't marked as complete
        if (completionStatus().incomplete.length === 0 && milestoneProgress?.status !== 'completed') {
            try {
                // Update milestone status to completed
                const { error } = await updateProgressStatus(
                    milestoneRecord.id,
                    'completed'
                );

                if (error) {
                    console.error('Failed to update milestone status:', error);
                }
            } catch (err) {
                console.error('Error updating milestone status:', err);
            }
        }
    };

    createEffect(() => {
        setIsLoading(true);
        const currentContent = $contentMeta().find(c => c.id === props.contentMetaId);
        const milestoneId = currentContent?.milestone_id;

        if (milestoneId) {
            const status = getContentProgressByMilestone(milestoneId, $contentMeta());
            setCompletionStatus(status);
            checkAndUpdateMilestoneStatus(); // Check and update milestone status
        }
        setIsLoading(false);
    });

    const isComplete = () => completionStatus().incomplete.length === 0;
    const completionPercentage = () => {
        const total = completionStatus().completed.length + completionStatus().incomplete.length;
        return total > 0
            ? Math.round((completionStatus().completed.length / total) * 100)
            : 0;
    };

    const handleNavigateToContent = (contentId: string) => {
        const content = $contentMeta().find(c => c.id === contentId);
        if (content) navigate(`/content/${content.slug}`);
    };

    return (
        <div class="p-6 bg-base-200 rounded-lg shadow-sm">
            <Show when={isLoading()}>
                <div class="flex justify-center my-8">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>
            </Show>

            <Show when={!isLoading()}>
                <h2 class="text-2xl font-bold mb-4">Milestone Progress</h2>

                <Show when={isComplete() && milestoneContentMeta()}>
                    <div class="alert alert-success mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Milestone Complete! You've mastered {milestoneContentMeta()?.title}!</span>
                    </div>

                    {/* Rest of your completion UI */}
                </Show>

                <Show when={!isComplete()}>
                    <div></div>
                </Show>
            </Show>
        </div>
    );
}