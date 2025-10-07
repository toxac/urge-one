// components/OpportunitiesWidgetCompact.tsx
import { createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../stores/userAssets/opportunities";

interface Props {
    userId: string;
    isEnrolled: boolean;
}

export default function OpportunitiesWidget(props: Props) {
    const $opportunities = useStore(opportunitiesStore);
    const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

    const opportunityStats = createMemo(() => {
        const opportunitiesData = $opportunities();
        const total = opportunitiesData.length;
        
        // Count by discovery method
        const methodCounts = opportunitiesData.reduce((acc, item) => {
            const method = item.discovery_method || 'personal-problems';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get most recent opportunity
        const recentOpportunity = opportunitiesData[0];
        
        return { total, methodCounts, recentOpportunity };
    });

    const methodLabels = {
        'personal-problems': 'Personal',
        'skill-based': 'Skill',
        'zone-of-influence': 'Influence', 
        'broader-search': 'Search'
    };

    const methodColors = {
        'personal-problems': 'bg-purple-500',
        'skill-based': 'bg-blue-500', 
        'zone-of-influence': 'bg-green-500',
        'broader-search': 'bg-orange-500'
    };

    return (
        <div class="card bg-base-100 shadow-md compact">
            <div class="card-body p-4 space-y-3">
                <Show when={!props.isEnrolled}>
                    <div class="text-center">
                        <a href="/enroll" class="link link-primary text-sm">Enroll for opportunities</a>
                    </div>
                </Show>

                <Show when={props.isEnrolled && $opportunitiesLoading()}>
                    <div class="flex justify-center py-4">
                        <span class="loading loading-spinner loading-sm"></span>
                    </div>
                </Show>

                <Show when={props.isEnrolled && !$opportunitiesLoading()}>
                    {/* Row 1: Total Count */}
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="text-lg font-bold">{opportunityStats().total}</div>
                            <div class="text-sm">
                                <div class="font-semibold">Opportunities</div>
                                <div class="text-gray-500 text-xs">across all methods</div>
                            </div>
                        </div>
                        <Show when={opportunityStats().total > 0}>
                            <div class="text-2xl">🎯</div>
                        </Show>
                    </div>

                    {/* Row 2: Discovery Methods */}
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex space-x-3">
                            {Object.entries(opportunityStats().methodCounts)
                                .slice(0, 3) // Show max 3 methods
                                .map(([method, count]) => (
                                <div class="flex items-center space-x-1">
                                    <div class={`w-2 h-2 rounded-full ${methodColors[method as keyof typeof methodColors] || 'bg-gray-400'}`}></div>
                                    <span>{methodLabels[method as keyof typeof methodLabels] || method}: {count}</span>
                                </div>
                            ))}
                            {Object.keys(opportunityStats().methodCounts).length > 3 && (
                                <div class="text-gray-500">
                                    +{Object.keys(opportunityStats().methodCounts).length - 3} more
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Recent Opportunity */}
                    <Show when={opportunityStats().recentOpportunity} fallback={
                        <Show when={opportunityStats().total === 0}>
                            <div class="text-center">
                                <a href="/opportunities/new" class="link link-primary text-sm">Add first opportunity</a>
                            </div>
                        </Show>
                    }>
                        <div class="flex items-center justify-between text-xs">
                            <div class="truncate flex-1 mr-2">
                                <div class="font-medium truncate">
                                    {opportunityStats().recentOpportunity?.title || 'New Opportunity'}
                                </div>
                                <div class="text-gray-500 capitalize">
                                    {opportunityStats().recentOpportunity?.discovery_method?.replace('-', ' ') || 'personal'}
                                </div>
                            </div>
                            <a 
                                href={`/opportunities/${opportunityStats().recentOpportunity?.id}`}
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