import { createSignal, createEffect, Show, For, onMount, useTransition } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth";
import { opportunitiesStore, deleteOpportunity, opportunitiesStoreLoading } from "../../../stores/userAssets/opportunities";
import {
    commentsStore,
    commentsStoreLoading,
    createComment,
    deleteComment
} from "../../../stores/userAssets/opportunityComments";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import CommentForm from "./OpportunityCommentForm";
import { notify } from '../../../stores/notifications';
import { formatDate } from "../../../lib/content/dateUtils";
import { type Database } from "../../../../database.types.ts";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type Comment = Database['public']['Tables']['user_opportunity_comments']['Row'];

interface OpportunityDetailProps {
    opportunityId: string;
    userId: string;
}

export default function OpportunityDetail(props: OpportunityDetailProps) {

    const $opportunities = useStore(opportunitiesStore);
    const $opportunitiesLoading = useStore(opportunitiesStoreLoading);
    const $comments = useStore(commentsStore);
    const $commentsLoading = useStore(commentsStoreLoading);

    const [loading, setLoading] = createSignal(false);
    const [showCommentModal, setShowCommentModal] = createSignal(false);
    const [opportunity, setOpportunity] = createSignal<Opportunity | null >(null);
    const [comments, setComments] = createSignal<Comment[] | null>(null)
    const [deletingCommentId, setDeletingCommentId] = createSignal<string | null>(null);

    // Opportunities Effect
    createEffect(()=>{
        if($opportunitiesLoading()) return;
        const currentOpportunity = $opportunities().find(opportunity => opportunity.id === props.opportunityId);
        if(currentOpportunity){
            console.log(currentOpportunity)
            setOpportunity(currentOpportunity);
        };
    })

    // Comments Effect
    createEffect(()=>{
        if($commentsLoading()) return;
        const currentComments = $comments().filter(comment => comment.opportunity_id === props.opportunityId)
        if(currentComments){
            setComments(currentComments);
        };
    })
    


    const handleAddComment = () => {
        setShowCommentModal(true);
    };

    const handleCommentSuccess = () => {
        setShowCommentModal(false);
        notify.success('Comment added successfully!');
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        setDeletingCommentId(commentId);
        try {
            const { success, error } = await deleteComment(commentId);

            if (success) {
                notify.success('Comment deleted successfully!');
            } else if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            notify.error('Failed to delete comment', 'Error');
        } finally {
            setDeletingCommentId(null);
        }
    };

    return (
        <section>
            {/* Loading State - Opportunity Loading */}
            <Show when={loading()}>
                <div class="flex justify-center items-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                    <span class="ml-3 text-lg text-gray-600">Loading opportunity details...</span>
                </div>
            </Show>
            {/* Error State - Opportunity not found */}
            <Show when={!loading() && !opportunity()}>
                <div class="text-center py-12">
                    <div class="text-red-600 mb-4">
                        <Icon icon="mdi:alert-circle" width={64} height={64} />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h3>
                    <p class="text-gray-600 mb-6">The opportunity you're looking for doesn't exist or you don't have access to it.</p>
                    <a href="/assets/opportunities" class="btn btn-primary">
                        Back to Opportunities
                    </a>
                </div>
            </Show>
            <Show when={!loading() && opportunity}>
                <div class="bg-white rounded-lg shadow-lg border border-gray-200">
                    {/* Header */}
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">{opportunity()!.title}</h1>
                                <p class="text-gray-600 mt-1">{opportunity()!.description}</p>
                            </div>
                            <button
                                class="btn btn-primary"
                                onClick={handleAddComment}
                            >
                                <Icon icon="mdi:comment-plus" class="mr-2" />
                                Add Comment
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div class="px-6 py-4 bg-gray-50">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span class="font-semibold text-gray-700">Discovery Method:</span>
                                <p class="text-gray-600">{opportunity()!.discovery_method}</p>
                            </div>
                            <Show when={opportunity()!.category}>
                                <div>
                                    <span class="font-semibold text-gray-700">Category:</span>
                                    <p class="text-gray-600">{opportunity()!.category}</p>
                                </div>
                            </Show>
                            <Show when={opportunity()!.observation_type}>
                                <div>
                                    <span class="font-semibold text-gray-700">Observation Type:</span>
                                    <p class="text-gray-600">{opportunity()!.observation_type}</p>
                                </div>
                            </Show>
                            <Show when={opportunity()!.goal_alignment}>
                                <div>
                                    <span class="font-semibold text-gray-700">Goal Alignment:</span>
                                    <p class="text-gray-600">{opportunity()!.goal_alignment}</p>
                                </div>
                            </Show>
                            <div>
                                <span class="font-semibold text-gray-700">Status:</span>
                                <span class={`badge ${opportunity()!.status === 'added' ? 'badge-primary' :
                                    opportunity()!.status === 'reviewed' ? 'badge-secondary' :
                                        opportunity()!.status === 'prioritized' ? 'badge-accent' :
                                            'badge-neutral'
                                    }`}>
                                    {opportunity()!.status || 'Added'}
                                </span>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-700">Created:</span>
                                <p class="text-gray-600">{formatDate(opportunity()!.created_at)}</p>
                            </div>
                            <Show when={opportunity()!.updated_at}>
                                <div>
                                    <span class="font-semibold text-gray-700">Last Updated:</span>
                                    <p class="text-gray-600">{formatDate(opportunity()!.updated_at!)}</p>
                                </div>
                            </Show>
                        </div>
                    </div>

                    {/* Comments Section */}
                    
                </div>
            </Show>
        </section>
    )

}