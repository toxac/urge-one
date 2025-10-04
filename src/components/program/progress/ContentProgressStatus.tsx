/**
 * @description: displays progress status for given content
 * @file /src/component/program/progress/ContentProgressStatus
 * @param contentMetaId  <string> UUID for row id/content ID
 * @returns jsx status indicator element
 * @author amitChanchal
 * @updated May 29, 2025
 */

import { useStore } from "@nanostores/solid";
import { createMemo } from "solid-js";
import { progressStore } from "../../../stores/progress.ts";

type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

const statusText = {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed"
};

interface Props {
    contentId: string;
}

export default function ContentProgressStatus(props: Props) {
    const $progress = useStore(progressStore);

    const progress = createMemo(() => {
        const item = $progress().find(p => p.content_meta_id === props.contentId);
        return (item?.status || 'not_started') as ProgressStatus;
    });

    const isLoading = createMemo(() => $progress().length === 0);

    return (
        <div class="flex items-center gap-2">
            {isLoading() ? (
                <div class="text-sm text-gray-400">Loading...</div>
            ) : (
                <div class="text-sm font-medium">
                        in proghress
                </div>
            )}
        </div>
    );
}