// components/SequentialContentList.tsx
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { contentMetaStore, fetchContentMeta } from '../../../stores/contentMeta';
import { progressStore } from '../../../stores/progress';
import ContentProgressStatus from '../progress/ContentProgressStatus';


export default function SequentialContentList() {
    const $contentMeta = useStore(contentMetaStore);
    const $progress = useStore(progressStore);
    const [isLoading, setIsLoading] = createSignal(true);
    const [error, setError] = createSignal<string | null>(null);

    // Fetch content meta data when component mounts
    createEffect(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Only fetch if store is empty
            if ($contentMeta().length === 0) {
                const { data, error } = await fetchContentMeta();
                if (data) {
                    contentMetaStore.set(data);
                }
                if (error) {
                    setError(JSON.stringify(error));
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load content');
            console.error('Error loading content:', err);
        } finally {
            setIsLoading(false);
        }
    });

    // Group content by milestone
    const groupedContent = createMemo(() => {
        const content = $contentMeta();

        if (content.length === 0) return [];

        // Get all milestones sorted by sequence
        const milestones = content
            .filter(item => item.content_type === 'milestone')
            .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

        return milestones.map(milestone => {
            // Get all content for this milestone, sorted by sequence
            const milestoneContent = content
                .filter(item => item.milestone_id === milestone.id)
                .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

            return {
                milestone,
                content: milestoneContent
            };
        });
    });



    return (
        <div class="space-y-8">
            <For each={groupedContent()}>
                {({ milestone, content }) => (
                    <div class="border rounded-lg overflow-hidden">
                        {/* Milestone Header */}
                        <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-2xl font-bold">
                                        {milestone.sequence}. {milestone.title}
                                    </h2>
                                    <Show when={milestone.description}>
                                        <p class="text-orange-100 mt-2">{milestone.description}</p>
                                    </Show>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm opacity-90">Milestone</div>
                                    <div class="text-lg font-semibold">#{milestone.sequence}</div>
                                </div>
                            </div>
                        </div>

                        {/* Content List */}
                        <ul class="list bg-base-100 rounded-box shadow-md">

                            <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>
                            <For each={content}>
                                {(item) => {
                                    return (
                                        <li class="list-row">
                                            <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" /></div>
                                            <div>
                                                <div>{item.content_type}</div>
                                                <div class="text-xs uppercase font-semibold opacity-60">{item.title}</div>
                                            </div>
                                            <button class="btn btn-square btn-ghost">
                                                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                                            </button>
                                            <button class="btn btn-square btn-ghost">
                                                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
                                            </button>
                                        </li>
                                    );
                                }}
                            </For>
                        </ul>

                    </div>
                )}
            </For>
        </div>
    );
}