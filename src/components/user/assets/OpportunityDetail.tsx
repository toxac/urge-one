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
import {getCategory, getAlignment, getDiscoveryMethod, getObservationType} from "../../../constants/exercises/opportunities.ts"

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
    const [opportunity, setOpportunity] = createSignal<Opportunity | null>(null);
    const [comments, setComments] = createSignal<Comment[] | null>(null)
    const [deletingCommentId, setDeletingCommentId] = createSignal<string | null>(null);

    // Opportunities Effect
    createEffect(() => {
        if ($opportunitiesLoading()) return;
        const currentOpportunity = $opportunities().find(opportunity => opportunity.id === props.opportunityId);
        if (currentOpportunity) {
            setOpportunity(currentOpportunity);
        };
    })

    // Comments Effect
    createEffect(() => {
        if ($commentsLoading()) return;
        const currentComments = $comments().filter(comment => comment.opportunity_id === props.opportunityId)
        if (currentComments) {
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
        <section class="w-full mx-auto p-8 space-y-8 bg-base-100 shadow-lg rounded-lg">

            {/* Loading State */}
            <Show when={$opportunitiesLoading()}>
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

            <Show when={opportunity()}>
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="badge badge-primary">{getDiscoveryMethod(opportunity()?.discovery_method)}</div>
                        <div class="badge badge-outline">{getObservationType(opportunity()?.discovery_method, opportunity()?.observation_type)}</div>
                    </div>
                    <h1 class="card-title text-3xl mb-4">{opportunity() ? opportunity()?.title : "no title"}</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-semibold text-base-content/70">Problem Type:</span>
                            <p class="mt-1">{getCategory(opportunity()?.category)}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-base-content/70">Goal Alignment:</span>
                            <p class="mt-1">{getAlignment(opportunity()?.goal_alignment)}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-base-content/70">Status:</span>
                            <p class="mt-1 capitalize">{opportunity()?.status}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-base-content/70">Rank:</span>
                            <p class="mt-1 capitalize">{opportunity()?.rank ? opportunity()?.rank: "--" }</p>
                        </div>
                    </div>
                    
                    <p class="text-base-content/90 leading-relaxed mt-8">{opportunity()?.description}</p>

                    <div class="flex gap-4 text-xs text-base-content/60 mt-6 pt-4 border-t border-base-300">
                        <span>Created: {formatDate(opportunity()?.created_at)}</span>
                        <span>Updated: {formatDate(opportunity()?.updated_at)}</span>
                    </div>

                    <div class="card-actions justify-end mt-4">
                        <button class="btn btn-outline btn-sm">Edit</button>
                        <button class="btn btn-error btn-outline btn-sm">Delete</button>
                    </div>
                </div>
                {/* Oportunity Comment */}
                <div class="mt-12">
                    <h2 class="card-title text-2xl mb-4">Comments & Notes</h2>
                    

                </div>
            </Show>


           

            <div class="card bg-base-100 shadow-lg">
                <div class="card-body">
                    <h2 class="card-title text-2xl mb-4">Comments & Notes</h2>

                    <div class="form-control mb-6">
                        <label class="label">
                            <span class="label-text font-semibold">Add a comment</span>
                        </label>
                        <input type="text" placeholder="Comment title (optional)" class="input input-bordered mb-2" />
                        <textarea
                            class="textarea textarea-bordered h-24"
                            placeholder="Write your comment or note here..."></textarea>
                        <div class="flex items-center gap-2 mt-2">
                            <select class="select select-bordered select-sm max-w-xs">
                                <option>General</option>
                                <option>Progress Update</option>
                                <option>Action Item</option>
                                <option>Research</option>
                            </select>
                            <button class="btn btn-primary btn-sm ml-auto">Add Comment</button>
                        </div>
                    </div>


                    <div class="space-y-4">

                        <div class="border-l-4 border-primary pl-4 py-2">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold">Initial Research</span>
                                    <div class="badge badge-sm badge-ghost">Research</div>
                                </div>
                                <span class="text-xs text-base-content/60">2 days ago</span>
                            </div>
                            <p class="text-sm text-base-content/80">
                                Reached out to Sarah from the team. She mentioned the company culture is excellent
                                and they're looking for someone with strong stakeholder management skills.
                            </p>
                        </div>

                        <div class="border-l-4 border-success pl-4 py-2">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold">Application Submitted</span>
                                    <div class="badge badge-sm badge-ghost">Progress Update</div>
                                </div>
                                <span class="text-xs text-base-content/60">5 days ago</span>
                            </div>
                            <p class="text-sm text-base-content/80">
                                Submitted application through referral link. Updated resume to highlight product
                                strategy experience and included portfolio case studies.
                            </p>
                        </div>


                        <div class="border-l-4 border-info pl-4 py-2">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold">Interview Preparation</span>
                                    <div class="badge badge-sm badge-ghost">Action Item</div>
                                </div>
                                <span class="text-xs text-base-content/60">1 week ago</span>
                            </div>
                            <p class="text-sm text-base-content/80">
                                Need to prepare: product case study presentation, review STAR method for behavioral
                                questions, research company's recent product launches.
                            </p>
                        </div>
                    </div>

                    {/* Empty State (hide when comments exist) */}
                    {/* <div class="text-center py-12 text-base-content/60">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>
        <p>No comments yet. Add your first note above!</p>
      </div> */}
                </div>
            </div>
        </section>
    )

}