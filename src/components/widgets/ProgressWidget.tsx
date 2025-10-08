// components/ProgressWidgetCompact.tsx
import { createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { progressStore, isProgressLoading } from "../../stores/progress";

interface Props {
    userId: string;
    isEnrolled: boolean;
}

export default function ProgressWidgetCompact(props: Props) {
    const $progress = useStore(progressStore);
    const $progressLoading = useStore(isProgressLoading);

    const progressStats = createMemo(() => {
        const progressData = $progress();
        const total = progressData.length;
        const completed = progressData.filter(item => item.status === 'completed').length;
        const inProgress = progressData.filter(item => item.status === 'in_progress').length;
        const notStarted = progressData.filter(item => !item.status || item.status === 'not_started').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Find current activity (first in_progress, then not_started)
        const currentActivity = progressData.find(item => item.status === 'in_progress') || 
                               progressData.find(item => !item.status || item.status === 'not_started');
        
        return { total, completed, inProgress, notStarted, percentage, currentActivity };
    });

    return (
        <div class="card bg-base-100 shadow-md compact">
            <div class="card-body p-4 space-y-3">
                <Show when={!props.isEnrolled}>
                    <div class="text-center">
                        <a href="/enroll" class="link link-primary text-sm">Enroll to track progress</a>
                    </div>
                </Show>

                <Show when={props.isEnrolled && $progressLoading()}>
                    <div class="flex justify-center py-4">
                        <span class="loading loading-spinner loading-sm"></span>
                    </div>
                </Show>

                <Show when={props.isEnrolled && !$progressLoading()}>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div class="flex flex-col items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="radial-progress text-primary" style="--value:70;" aria-valuenow="70" role="progressbar">70%</div>
                                <div class="text-lg font-bold">{progressStats().percentage}%</div>
                                <div class="text-sm">
                                    <div class="font-semibold">Progress</div>
                                    <div class="text-gray-500 text-xs">{progressStats().completed}/{progressStats().total} completed</div>
                                </div>
                            </div>
                            <div class="flex space-x-3">
                            <div class="flex items-center space-x-1">
                                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{progressStats().completed} completed</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span>{progressStats().inProgress} in progress</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{progressStats().notStarted} Not Started</span>
                            </div>
                        </div>
                        </div>
                        <Show when={progressStats().currentActivity} fallback={
                        <Show when={progressStats().total === 0}>
                            <div class="text-center">
                                <a href="/content" class="link link-primary text-sm">Start your first content</a>
                            </div>
                        </Show>
                    }>
                        <div class="flex items-center justify-between text-xs">
                            <div class="truncate flex-1 mr-2">
                                <div class="font-medium truncate">
                                    {progressStats().currentActivity?.content_title || 'Untitled'}
                                </div>
                                <div class="text-gray-500 capitalize">
                                    {progressStats().currentActivity?.content_type?.replace('_', ' ') || 'Content'}
                                </div>
                            </div>
                            <Show when={progressStats().currentActivity?.content_slug}>
                                <a 
                                    href={`/content/${progressStats().currentActivity?.content_slug}`}
                                    class="btn btn-primary btn-xs"
                                >
                                    {progressStats().currentActivity?.status === 'in_progress' ? 'Continue' : 'Start'}
                                </a>
                            </Show>
                        </div>
                    </Show>

                    </div>
                    
                </Show>
            </div>
        </div>
    );
}