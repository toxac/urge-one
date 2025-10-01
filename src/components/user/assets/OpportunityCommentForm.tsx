import { createSignal, createEffect, Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth";
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { notify } from '../../../stores/notifications';
import { createComment, commentsStore, updateComment, getCommentById, commentsStoreLoading } from "../../../stores/userAssets/opportunityComments";
import { type Database } from "../../../../database.types";

type CommentInsert = Database['public']['Tables']['user_opportunity_comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['user_opportunity_comments']['Update'];

const schema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    content: z.string().min(1, "Comment content is required").max(1000),
    comment_type: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CommentFormProps {
    opportunityId: string;
    commentId?: string; // only used min edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CommentForm(props: CommentFormProps) {
    const $session = useStore(authStore);
    const $comments = useStore(commentsStore);
    const [userId, setUserId] = createSignal<string | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [isEditMode, setIsEditMode] = createSignal(false);

    // get current user from store 
    createEffect(() => {
        if (!$session() || $session().loading) return;
        const user = $session().user;
        if (user) {
            setUserId(user.id);
        }
    })


    const { form, isSubmitting, errors, reset, setFields } = createForm<FormData>({
        initialValues: {
            comment_type: "",
            content: "",
            title: ""
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (userId()) {
                    if (isEditMode() && props.commentId) {
                        // update comment
                        const updatedCommentPayload: CommentUpdate = {
                            comment_type: values.comment_type,
                            content: values.content,
                            title: values.title,
                            updated_at: new Date().toISOString(),
                        }

                        const { success, error } = await updateComment(props.commentId, updatedCommentPayload);
                        if (success) {
                            notify.success("Comment was successfully updated.", "Success!");
                            props.onSuccess?.();
                        } else if (error) {
                            throw error;
                        }

                    } else {
                        // Add a new comment
                        const newCommentPayload: CommentInsert = {
                            comment_type: values.comment_type,
                            content: values.content,
                            created_at: new Date().toISOString(),
                            opportunity_id: props.opportunityId,
                            title: values.title,
                            user_id: userId()
                        }

                        const { success, error } = await createComment(newCommentPayload);
                        if (success) {
                            notify.success("Comment was successfully added.", "Success!");
                            reset();
                            props.onSuccess?.();
                        } else if (error) {
                            throw error;
                        }
                    }

                } else {
                    notify.error("No user found! Please log in again.", "Error");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                notify.error("Failed to add comment. Please try again.", "Error")
            } finally {
                setLoading(false);
            }
        },
        extend: validator({ schema })
    });

    createEffect(() => {
    if (props.commentId) {
        setIsEditMode(true);
        if ($comments().length > 0) {
            const comment = $comments().find(c => c.id === props.commentId);
            if (comment) {
                setFields('comment_type', comment.comment_type || "");
                setFields('content', comment.content || "");
                setFields('title', comment.title || "");
            } else {
                console.warn(`Comment with id ${props.commentId} not found in store`);
                notify.error("Comment not found", "Error");
                props.onCancel?.();
            }
        }
    }
});

    return (
        <div class="w-full">
            <form use:form class="space-y-4">
                <div class="form-control">
                    <select name="comment_type" class="select select-neutral w-full">
                        <option value="">Select type</option>
                        <option value="observation">Observation</option>
                        <option value="insight">Insight</option>
                        <option value="question">Question</option>
                        <option value="update">Update</option>
                    </select>
                </div>
                <div class="form-control">
                    <input
                        type="text"
                        name="title"
                        class="input input-neutral w-full"
                        placeholder="Brief title for your comment"
                    />
                    <Show when={errors().title}>
                        <span class="text-sm text-red-600 mt-1">{errors().title}</span>
                    </Show>
                </div>

                <div class="form-control">
                    <textarea
                        name="content"
                        class="textarea textarea-neutral w-full h-32"
                        placeholder="Add your observations or comments..."
                    />
                    <Show when={errors().content}>
                        <span class="text-sm text-red-600 mt-1">{errors().content}</span>
                    </Show>
                </div>



                <div class="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        class="btn btn-outline"
                        onClick={props.onCancel}
                        disabled={isSubmitting()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        disabled={isSubmitting()}
                    >
                        <Show when={isSubmitting()} fallback={
                            <>
                                <Icon icon="mdi:comment-plus" class="mr-2" />
                                Add Comment
                            </>
                        }>
                            <span class="loading loading-spinner loading-sm"></span>
                            Adding...
                        </Show>
                    </button>
                </div>
            </form>
        </div>
    );
}