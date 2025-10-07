// components/ProgressWidget.tsx
import { createMemo, Show, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { progressStore, isProgressLoading } from "../../stores/progress";
import type { Database } from "../../../database.types";

type Progress = Database['public']['Tables']['user_progress']['Row'];
type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

interface Props {
    userId: string;
    isEnrolled: boolean;
    profile: any;
}

export default function ProgressWidget(props: Props) {
    const $progress = useStore(progressStore);
    const $progressLoading = useStore(isProgressLoading);

    // Memoized computations for performance
    const progressStats = createMemo(() => {
        const progressData = $progress();
        
        const total = progressData.length;
        
        const byStatus = progressData.reduce((acc, item) => {
            const status = (item.status as ProgressStatus) || 'not_started';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<ProgressStatus, number>);

        // Ensure all statuses are present with at least 0
        const statusCounts = {
            not_started: byStatus.not_started || 0,
            in_progress: byStatus.in_progress || 0,
            completed: byStatus.completed || 0,
        };

        const completionPercentage = total > 0 ? Math.round((statusCounts.completed / total) * 100) : 0;

        // Find current progress (first in_progress item, or first not_started if no in_progress)
        const currentProgress = progressData.find(item => item.status === 'in_progress') || 
                              progressData.find(item => item.status === 'not_started' || !item.status);

        return {
            total,
            byStatus: statusCounts,
            completionPercentage,
            currentProgress
        };
    });

    const statusConfig = {
        'not_started': { label: 'Not Started', color: 'bg-gray-500', textColor: 'text-gray-700' },
        'in_progress': { label: 'In Progress', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
        'completed': { label: 'Completed', color: 'bg-green-500', textColor: 'text-green-700' }
    };

    return (
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Your Learning Progress</h2>
                
                <Show when={!props.isEnrolled}>
                    <div class="alert alert-info">
                        <div>
                            <span>You're not enrolled yet. </span>
                            <a href="/enroll" class="link link-primary">Enroll now to get started!</a>
                        </div>
                    </div>
                </Show>

                <Show when={props.isEnrolled}>
                    <Show when={$progressLoading()} fallback={
                        <div>
                            {/* Overall Progress Card */}
                            <div class="stats shadow w-full mb-6">
                                <div class="stat">
                                    <div class="stat-title">Total Content</div>
                                    <div class="stat-value">{progressStats().total}</div>
                                    <div class="stat-desc">Items in your journey</div>
                                </div>
                                
                                <div class="stat">
                                    <div class="stat-title">Completion</div>
                                    <div class="stat-value">{progressStats().completionPercentage}%</div>
                                    <div class="stat-desc">
                                        {progressStats().byStatus.completed} of {progressStats().total} completed
                                    </div>
                                </div>
                            </div>

                            {/* Progress Breakdown */}
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold mb-4">Progress Breakdown</h3>
                                <div class="space-y-3">
                                    <For each={Object.entries(progressStats().byStatus)}>
                                        {([status, count]) => {
                                            const config = statusConfig[status as ProgressStatus];
                                            const percentage = progressStats().total > 0 
                                                ? Math.round((count / progressStats().total) * 100) 
                                                : 0;
                                            
                                            return (
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center space-x-3">
                                                        <div class={`w-3 h-3 rounded-full ${config.color}`}></div>
                                                        <span class={`font-medium ${config.textColor}`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <div class="flex items-center space-x-2">
                                                        <span class="font-semibold">{count}</span>
                                                        <span class="text-sm text-gray-500">({percentage}%)</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </For>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div class="mb-6">
                                <div class="flex justify-between text-sm mb-2">
                                    <span>Overall Progress</span>
                                    <span>{progressStats().completionPercentage}%</span>
                                </div>
                                <progress 
                                    class="progress progress-primary w-full h-4" 
                                    value={progressStats().completionPercentage} 
                                    max="100"
                                >
                                    {progressStats().completionPercentage}%
                                </progress>
                            </div>

                            {/* Current Progress */}
                            <Show when={progressStats().currentProgress}>
                                <div class="border-t pt-4">
                                    <h3 class="text-lg font-semibold mb-2">Current Focus</h3>
                                    <div class="bg-base-200 rounded-lg p-4">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="font-semibold">
                                                    {progressStats().currentProgress?.content_title || 'Untitled'}
                                                </h4>
                                                <p class="text-sm text-gray-600 capitalize">
                                                    {progressStats().currentProgress?.content_type?.replace('_', ' ') || 'Content'}
                                                </p>
                                                <div class="badge badge-primary badge-sm mt-1">
                                                    {statusConfig[progressStats().currentProgress?.status as ProgressStatus || 'not_started'].label}
                                                </div>
                                            </div>
                                            <Show when={progressStats().currentProgress?.content_slug}>
                                                <a 
                                                    href={`/content/${progressStats().currentProgress?.content_slug}`}
                                                    class="btn btn-primary btn-sm"
                                                >
                                                    Continue
                                                </a>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </Show>

                            {/* Empty State */}
                            <Show when={progressStats().total === 0}>
                                <div class="text-center py-8">
                                    <div class="text-gray-500 mb-4">
                                        No progress tracked yet. Start your first piece of content!
                                    </div>
                                    <a href="/content" class="btn btn-primary">
                                        Browse Content
                                    </a>
                                </div>
                            </Show>
                        </div>
                    }>
                        <div class="flex justify-center items-center py-8">
                            <span class="loading loading-spinner loading-lg"></span>
                            <span class="ml-2">Loading your progress...</span>
                        </div>
                    </Show>
                </Show>
            </div>
        </div>
    );
}