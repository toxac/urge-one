// components/QuestionsWidgetCompact.tsx
import { createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { questionsStore, questionsStoreLoading } from "../../stores/userAssets/questions";

interface Props {
    userId: string;
    isEnrolled: boolean;
}

type UserQuestionStatus = "pending" | "answered" | "rejected" | "archived" | "flagged";

export default function QuestionsWidgetCompact(props: Props) {
    const $questions = useStore(questionsStore);
    const $questionsLoading = useStore(questionsStoreLoading);

    const questionsStats = createMemo(() => {
        const questionsData = $questions();
        const total = questionsData.length;
        
        // Count by status
        const statusCounts = questionsData.reduce((acc, item) => {
            const status = (item.status as UserQuestionStatus) || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<UserQuestionStatus, number>);

        // Get most recent question
        const recentQuestion = questionsData[0];
        
        return { total, statusCounts, recentQuestion };
    });

    const statusConfig = {
        'pending': { label: 'Pending', color: 'bg-yellow-500', badge: 'badge-warning' },
        'answered': { label: 'Answered', color: 'bg-green-500', badge: 'badge-success' },
        'rejected': { label: 'Rejected', color: 'bg-red-500', badge: 'badge-error' },
        'archived': { label: 'Archived', color: 'bg-gray-500', badge: 'badge-neutral' },
        'flagged': { label: 'Flagged', color: 'bg-orange-500', badge: 'badge-warning' }
    };

    const getStatusConfig = (status: UserQuestionStatus) => {
        return statusConfig[status] || 
               { label: status, color: 'bg-gray-400', badge: 'badge-neutral' };
    };

    return (
        <div class="card bg-base-100 shadow-md compact">
            <div class="card-body p-4 space-y-3">
                <Show when={!props.isEnrolled}>
                    <div class="text-center">
                        <a href="/enroll" class="link link-primary text-sm">Enroll to ask questions</a>
                    </div>
                </Show>

                <Show when={props.isEnrolled && $questionsLoading()}>
                    <div class="flex justify-center py-4">
                        <span class="loading loading-spinner loading-sm"></span>
                    </div>
                </Show>

                <Show when={props.isEnrolled && !$questionsLoading()}>
                    {/* Row 1: Total Count */}
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="text-lg font-bold">{questionsStats().total}</div>
                            <div class="text-sm">
                                <div class="font-semibold">Questions</div>
                                <Show when={questionsStats().statusCounts['answered']}>
                                    <div class="text-gray-500 text-xs">
                                        {questionsStats().statusCounts['answered']} answered
                                    </div>
                                </Show>
                                <Show when={!questionsStats().statusCounts['answered']}>
                                    <div class="text-gray-500 text-xs">asked by you</div>
                                </Show>
                            </div>
                        </div>
                        <Show when={questionsStats().total > 0}>
                            <div class="text-2xl">❓</div>
                        </Show>
                    </div>

                    {/* Row 2: Status Breakdown */}
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex space-x-3">
                            {Object.entries(questionsStats().statusCounts)
                                .slice(0, 3) // Show max 3 statuses
                                .map(([status, count]) => {
                                    const config = getStatusConfig(status as UserQuestionStatus);
                                    return (
                                        <div class="flex items-center space-x-1">
                                            <div class={`w-2 h-2 rounded-full ${config.color}`}></div>
                                            <span>{config.label}: {count}</span>
                                        </div>
                                    );
                                })}
                            {Object.keys(questionsStats().statusCounts).length > 3 && (
                                <div class="text-gray-500">
                                    +{Object.keys(questionsStats().statusCounts).length - 3} more
                                </div>
                            )}
                        </div>
                        <Show when={questionsStats().statusCounts['pending']}>
                            <div class="text-warning text-xs">
                                {questionsStats().statusCounts['pending']} pending
                            </div>
                        </Show>
                    </div>

                    {/* Row 3: Recent Question */}
                    <Show when={questionsStats().recentQuestion} fallback={
                        <Show when={questionsStats().total === 0}>
                            <div class="text-center">
                                <a href="/questions/new" class="link link-primary text-sm">Ask your first question</a>
                            </div>
                        </Show>
                    }>
                        <div class="flex items-center justify-between text-xs">
                            <div class="truncate flex-1 mr-2">
                                <div class="font-medium truncate">
                                    {questionsStats().recentQuestion?.title || 'Untitled Question'}
                                </div>
                                <div class="text-gray-500 capitalize">
                                    {getStatusConfig(questionsStats().recentQuestion?.status as UserQuestionStatus || 'pending').label}
                                </div>
                            </div>
                            <a 
                                href={`/questions/${questionsStats().recentQuestion?.id}`}
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