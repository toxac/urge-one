import { Show, createSignal, createEffect } from "solid-js";
import { useStore } from "@nanostores/solid";
import { bookmarksStore, createBookmark, deleteBookmark, bookmarksStoreLoading } from "../../../stores/userAssets/bookmarks";
import { Icon } from "@iconify-icon/solid";
import { notify } from "../../../stores/notifications";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import { type Database } from "../../../../database.types";

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
    const [currentBookmarkId, setCurrentBookmarkId] = createSignal <number | null>(null);
    const [submitting, setSubmitting] = createSignal(false);


    // Find existing bookmark ID for deletion
    const getExistingBookmarkId = () => {
        const currentBookmark = $bookmarks().find(
            b => b.related_content_id === props.relatedContentId && b.user_id === props.userId
        );
        if(currentBookmark) {
            setCurrentBookmarkId(currentBookmark.id)
        } 
        
    };

    createEffect(()=>{
        if($bookmarksLoading()){
            setLoading(true);
        } else {
            getExistingBookmarkId();
        }
    }) 


    const handleBookmark = async () => {
        setSubmitting(true);
        const bookmarkId = currentBookmarkId();
        if (bookmarkId !== null) {
            // Delete existing bookmark
            try {
                const { success, error} = await deleteBookmark(bookmarkId);
                if(error) throw error;
                if(success){
                    notify.success("Bookmark removed successfully!", "Success!");
                }
                
            } catch (error) {
                console.error("Delete failed:", error);
                // Show error notification
                notify.error("Failed to remove bookmark. Please try again.", "Fail.");
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
                const { success, error } = await createBookmark(payload);

                if(error) throw error

                if (success) {
                    notify.success("Bookmark saved successfully!", "Success!");
                }
            } catch (err) {
                console.error("Create failed:", err);
                notify.error("Bookmark could not be saved. Please try again.");
            } finally {
                setSubmitting(false);
            }
        }
    };


    return (
        <button
            onClick={handleBookmark}
            class="p-2 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-base-100"
            aria-label={currentBookmarkId() ? "Remove bookmark" : "Add bookmark"}
        >
            <Icon
                icon={currentBookmarkId() ? "mdi:bookmark-check" : "mdi:bookmark"}
                class={`text-xl ${currentBookmarkId() ? "text-accent" : "text-primary"}`}
            />
        </button>

    );
}