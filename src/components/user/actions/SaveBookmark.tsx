import { Show, createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { bookmarksStore, manageBookmarks, bookmarkStoreLoading } from "../../../stores/userAssets/bookmarks";
import { Icon } from "@iconify-icon/solid";
import { notify } from "../../../stores/notifications";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import { type Database } from "../../../../database.types";

type Boookmark = Database["public"]["Tables"]["user_bookmarks"]["Row"];
type BoookmarkInsert = Database["public"]["Tables"]["user_bookmarks"]["Insert"];

interface BookmarkProps {
    userId?: string;
    contentType: string; // type of content maps to content_type
    relatedContentId: string; // maps to related_content_id
    referenceUrl: string; // maps to reference_url
    referenceTable: string; // maps to reference_table
}

const supabase = supabaseBrowserClient;

export default function SaveBookmark(props: BookmarkProps) {
    const [showToast, setShowToast] = createSignal(false);
    const [error, setError] = createSignal("");

    const $bookmarks = useStore(bookmarksStore);
    const $bookmarkStoreLoading = useStore(bookmarkStoreLoading);

    // Check if current content is already bookmarked
    const isBookmarked = () => {
        return $bookmarks().some(
            bookmark =>
                bookmark.related_content_id === props.relatedContentId &&
                bookmark.user_id === props.userId
        );
    };

    // Find existing bookmark ID for deletion
    const getExistingBookmarkId = () => {
        const bookmark = $bookmarks().find(
            b => b.related_content_id === props.relatedContentId && b.user_id === props.userId
        );
        return bookmark?.id;
    };


    const handleClick = async () => {
        if (isBookmarked()) {
            // Delete existing bookmark
            try {
                const bookmarkId = getExistingBookmarkId();
                if (!bookmarkId) return;

                const { error: deleteError } = await supabase
                    .from("user_bookmarks")
                    .delete()
                    .eq("id", bookmarkId);

                if (deleteError) throw deleteError;

                manageBookmarks('delete', { id: bookmarkId });
                setError("");
                notify.success("Bookmark removed successfully!");
            } catch (err) {
                console.error("Delete failed:", err);
                setError("Failed to remove bookmark");
                // Show error notification
                notify.error("Failed to remove bookmark. Please try again.");
            }
        } else {
            // Create new bookmark
            const currentDate = new Date().toISOString();
            const payload: BoookmarkInsert = {
                content_type: props.contentType,
                created_at: currentDate,
                reference_table: props.referenceTable,
                reference_url: props.referenceUrl,
                related_content_id: props.relatedContentId,
                user_id: props.userId
            };

            try {
                const { data: bookmarkData, error: bookmarkError } = await supabase
                    .from("user_bookmarks")
                    .insert(payload)
                    .select('*')
                    .single();

                if (bookmarkError) throw bookmarkError;

                if (bookmarkData) {
                    manageBookmarks('create', bookmarkData);
                    setError("");
                    // Show success notification
                    notify.success("Bookmark saved successfully!");
                }
            } catch (err) {
                console.error("Create failed:", err);
                setError("Bookmark could not be saved");
                notify.error("Bookmark could not be saved. Please try again.");
            }
        }
    };
    //<Icon icon="mdi:bookmark-check" width="24" height="24" />

    return (
        <button
            onClick={handleClick}
            class="p-2 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-base-100"
            aria-label={isBookmarked() ? "Remove bookmark" : "Add bookmark"}
        >
            <Icon
                icon={isBookmarked() ? "mdi:bookmark-check" : "mdi:bookmark"}
                class={`text-xl ${isBookmarked() ? "text-accent" : "text-primary"}`}
            />
        </button>

    );
}