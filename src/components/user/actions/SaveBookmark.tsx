import { Show, createSignal, createEffect } from "solid-js";
import { useStore } from "@nanostores/solid";
import { bookmarksStore, createBookmark, deleteBookmark, bookmarksStoreLoading } from "../../../stores/userAssets/bookmarks";
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

export default function SaveBookmark(props: BookmarkProps) {
    const $bookmarks = useStore(bookmarksStore);
    const $bookmarksLoading = useStore(bookmarksStoreLoading);

    const [loading, setLoading] = createSignal(false);
    const [bookmark, setBookmark] = createSignal<Boookmark | null>(null)


    // Find existing bookmark ID for deletion
    const getExistingBookmarkId = () => {
        const currentBookmark = $bookmarks().find(
            b => b.related_content_id === props.relatedContentId && b.user_id === props.userId
        );
        if(currentBookmark) {
            return bookmark;
        } else { return null}
        
    };

    createEffect(()=>{
        if($bookmarksLoading()){
            setLoading(true);
        } else {
            const currentBookmark  =  getExistingBookmarkId()
            if(currentBookmark){
                setBookmark(currentBookmark);
            }
            setLoading(false);
        }
    })


    const handleBookmark = async () => {
        if (bookmark().length) {
            // Delete existing bookmark
            try {

                const { error: deleteError } = await deleteBookmark(bookmark().id)

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