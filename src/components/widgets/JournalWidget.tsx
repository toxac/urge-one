// components/JournalsWidgetCompact.tsx
import { createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { journalsStore, journalsStoreLoading } from "../../stores/userAssets/journals";

interface Props {
    userId: string;
    isEnrolled: boolean;
}

export default function JournalsWidgetCompact(props: Props) {
    const $journals = useStore(journalsStore);
    const $journalsLoading = useStore(journalsStoreLoading);

    const journalsStats = createMemo(() => {
        const journalsData = $journals();
        const total = journalsData.length;
        
        // Count by category
        const categoryCounts = journalsData.reduce((acc, item) => {
            const category = item.category || 'general';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Count by type
        const typeCounts = journalsData.reduce((acc, item) => {
            const type = item.type || 'entry';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get most recent journal
        const recentJournal = journalsData[0];
        
        return { total, categoryCounts, typeCounts, recentJournal };
    });

    const categoryConfig = {
        'general': { label: 'General', color: 'bg-gray-500' },
        'reflection': { label: 'Reflection', color: 'bg-blue-500' },
        'progress': { label: 'Progress', color: 'bg-green-500' },
        'ideas': { label: 'Ideas', color: 'bg-purple-500' },
        'challenges': { label: 'Challenges', color: 'bg-orange-500' }
    };

    const typeConfig = {
        'entry': { label: 'Entry', color: 'bg-gray-400' },
        'note': { label: 'Note', color: 'bg-blue-400' },
        'reflection': { label: 'Reflection', color: 'bg-green-400' }
    };

    const getCategoryConfig = (category: string) => {
        return categoryConfig[category as keyof typeof categoryConfig] || 
               { label: category, color: 'bg-gray-400' };
    };

    const getTypeConfig = (type: string) => {
        return typeConfig[type as keyof typeof typeConfig] || 
               { label: type, color: 'bg-gray-400' };
    };

    // Get recent activity text (last 7 days)
    const recentActivity = createMemo(() => {
        const journalsData = $journals();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentCount = journalsData.filter(journal => 
            new Date(journal.created_at) > oneWeekAgo
        ).length;
        
        return recentCount;
    });

    return (
        <div class="card bg-base-100 shadow-md compact">
            <div class="card-body p-4 space-y-3">
                <Show when={!props.isEnrolled}>
                    <div class="text-center">
                        <a href="/enroll" class="link link-primary text-sm">Enroll to start journaling</a>
                    </div>
                </Show>

                <Show when={props.isEnrolled && $journalsLoading()}>
                    <div class="flex justify-center py-4">
                        <span class="loading loading-spinner loading-sm"></span>
                    </div>
                </Show>

                <Show when={props.isEnrolled && !$journalsLoading()}>
                    {/* Row 1: Total Count */}
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="text-lg font-bold">{journalsStats().total}</div>
                            <div class="text-sm">
                                <div class="font-semibold">Journal Entries</div>
                                <Show when={recentActivity() > 0}>
                                    <div class="text-gray-500 text-xs">
                                        {recentActivity()} this week
                                    </div>
                                </Show>
                                <Show when={recentActivity() === 0 && journalsStats().total > 0}>
                                    <div class="text-gray-500 text-xs">your reflections</div>
                                </Show>
                            </div>
                        </div>
                        <Show when={journalsStats().total > 0}>
                            <div class="text-2xl">📔</div>
                        </Show>
                    </div>

                    {/* Row 2: Category/Type Breakdown */}
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex space-x-3">
                            {Object.entries(journalsStats().categoryCounts)
                                .slice(0, 2) // Show max 2 categories
                                .map(([category, count]) => {
                                    const config = getCategoryConfig(category);
                                    return (
                                        <div class="flex items-center space-x-1">
                                            <div class={`w-2 h-2 rounded-full ${config.color}`}></div>
                                            <span>{config.label}: {count}</span>
                                        </div>
                                    );
                                })}
                            {Object.keys(journalsStats().typeCounts).length > 0 && (
                                <div class="flex items-center space-x-1">
                                    <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                                    <span>{Object.keys(journalsStats().typeCounts).length} types</span>
                                </div>
                            )}
                        </div>
                        <Show when={Object.keys(journalsStats().categoryCounts).length > 2}>
                            <div class="text-gray-500 text-xs">
                                +{Object.keys(journalsStats().categoryCounts).length - 2} more
                            </div>
                        </Show>
                    </div>

                    {/* Row 3: Recent Journal */}
                    <Show when={journalsStats().recentJournal} fallback={
                        <Show when={journalsStats().total === 0}>
                            <div class="text-center">
                                <a href="/journals/new" class="link link-primary text-sm">Write first entry</a>
                            </div>
                        </Show>
                    }>
                        <div class="flex items-center justify-between text-xs">
                            <div class="truncate flex-1 mr-2">
                                <div class="font-medium truncate">
                                    {journalsStats().recentJournal?.title || 'Untitled Entry'}
                                </div>
                                <div class="text-gray-500 capitalize">
                                    {getCategoryConfig(journalsStats().recentJournal?.category || 'general').label}
                                    
                                </div>
                            </div>
                            <a 
                                href={`/journals/${journalsStats().recentJournal?.id}`}
                                class="btn btn-outline btn-xs"
                            >
                                View
                            </a>
                        </div>
                    </Show>
                </Show>
            </div>
        </div>
    );
}