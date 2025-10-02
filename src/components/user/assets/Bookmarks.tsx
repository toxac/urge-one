// OpportunitiesApp.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { bookmarksStore, bookmarkStoreLoading } from "../../../stores/userAssets/bookmarks";
import { getTimeDifference } from "../../../lib/content/dateUtils";
import type { Database } from "../../../../database.types";

type Bookmark = Database['public']['Tables']['user_bookmarks']['Row'];

export default function OpportunitiesList() {

    const $bookmarks = useStore(bookmarksStore);
    const $bookmarksLoading = useStore(bookmarkStoreLoading);

    const [bookmarks, setBookmarks] = createSignal<Bookmark[] | []>([]);
    const [loading, setLoading] = createSignal(false);

    createEffect(() => {
        if ($bookmarksLoading()) {
            setLoading(true)
            return;
        } else {
            const loadedBookmarks = $bookmarks();
            setBookmarks(loadedBookmarks);
            setLoading(false);
        }
    })


    const handleViewDetails = (bookmark: Bookmark) => {
        navigate(`/assets/bookmarks/${bookmark.id}`);
    };



    return (
        <div class="w-full mx-auto px-4 py-8">
            {/* Loading State */}
            <Show when={loading()}>
                <div class="flex justify-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </Show>
            {/* No bookmarks */}
            <Show when={bookmarks().length == 0 && !loading()}>
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} />
                    </div>
                    <h3 class="text-xl font-semibold mb-2">You have no bookmarks saved.</h3>
                    <p class="text-gray-600 mb-6">You can bookmark program content or resources. Bookmark button is on top right of all the pages.</p>
                </div>
            </Show>
            {/* Bookmark Grid  {
          content_type: string | null
          created_at: string
          id: number
          reference_table: string | null
          reference_url: string | null
          related_content_id: string | null
          user_id: string | null
        } */}
            <Show when={bookmarks().length > 0 && !loading()}>
                <div class="grid grid-cols-1 gap-4">
                    <For each={bookmarks()}>
                        {(bookmark) => (
                            <div class="shadow-lg px-8 py-4 mt-8">
                                <div class="flex justify-between items-start">
                                    <div class="badge badge-sm badge-outline capitalize mb-4">{bookmark.content_type}</div>
                                    <div class="text-sm">{getTimeDifference(bookmark.created_at)}</div>
                                </div>

                                <p class="text-md mb-2 capitalize">{bookmark.title}</p>
                                <div class="flex justify-end items-end mt-4">
                                    <a class="btn btn-ghost btn-circle" href={bookmark.reference_url}>
                                        <Icon icon="mdi-delete-outline" class="text-lg" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </For>
                </div>

            </Show>
        </div>
    );
}