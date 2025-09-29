import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth";
import { opportunitiesStore, getOpportunityById } from "../../../stores/userAssets/opportunities";
import { 
  commentsStore, 
  initializeCommentsForOpportunity, 
  getCommentsByOpportunityId,
  createComment,
  deleteComment 
} from "../../../stores/userAssets/opportunityComments";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import CommentForm from "./OpportunityCommentForm";
import { notify } from '../../../stores/notifications';

interface OpportunityDetailProps {
  opportunityId: string;
}

export default function OpportunityDetail(props: OpportunityDetailProps) {
  const $session = useStore(authStore);
  const $opportunities = useStore(opportunitiesStore);
  const $comments = useStore(commentsStore);
  
  const [opportunity, setOpportunity] = createSignal(getOpportunityById(props.opportunityId));
  const [loading, setLoading] = createSignal(true);
  const [showCommentModal, setShowCommentModal] = createSignal(false);
  const [deletingCommentId, setDeletingCommentId] = createSignal<string | null>(null);

  // Get comments for this opportunity
  const opportunityComments = () => getCommentsByOpportunityId(props.opportunityId);

  // Initialize data
  onMount(async () => {
    try {
      // If opportunity not found in store, you might want to fetch it
      if (!opportunity()) {
        // You could add a fetchOpportunityById function to your store
        console.warn('Opportunity not found in store, ID:', props.opportunityId);
      }
      
      // Load comments for this opportunity
      await initializeCommentsForOpportunity(props.opportunityId);
    } catch (error) {
      console.error('Error loading opportunity details:', error);
      notify.error('Failed to load opportunity details', 'Error');
    } finally {
      setLoading(false);
    }
  });

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get discovery method label
  const getDiscoveryMethodLabel = (method: string) => {
    const discoveryMethodOptions = [
      { value: "customer_interview", label: "Customer Interview" },
      { value: "market_research", label: "Market Research" },
      { value: "data_analysis", label: "Data Analysis" },
      { value: "competitor_analysis", label: "Competitor Analysis" },
      { value: "trend_analysis", label: "Trend Analysis" },
      { value: "user_feedback", label: "User Feedback" },
      { value: "sales_data", label: "Sales Data" },
      { value: "support_tickets", label: "Support Tickets" }
    ];
    
    return discoveryMethodOptions.find(opt => opt.value === method)?.label || method;
  };

  return (
    <div class="max-w-4xl mx-auto">
      {/* Loading State */}
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

      {/* Opportunity Details */}
      <Show when={!loading() && opportunity()}>
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
                <p class="text-gray-600">{getDiscoveryMethodLabel(opportunity()!.discovery_method)}</p>
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
                <span class={`badge ${
                  opportunity()!.status === 'added' ? 'badge-primary' :
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
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                Comments ({opportunityComments().length})
              </h2>
            </div>

            {/* Comments List */}
            <Show when={opportunityComments().length > 0} fallback={
              <div class="text-center py-8 bg-gray-50 rounded-lg">
                <Icon icon="mdi:comment-text-outline" width={48} height={48} class="text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">No comments yet. Be the first to add one!</p>
              </div>
            }>
              <div class="space-y-4">
                <For each={opportunityComments()}>
                  {(comment) => (
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <h3 class="font-semibold text-gray-900">{comment.title}</h3>
                          <Show when={comment.comment_type}>
                            <span class="badge badge-outline badge-sm">
                              {comment.comment_type}
                            </span>
                          </Show>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-sm text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            class="btn btn-ghost btn-xs text-error"
                            disabled={deletingCommentId() === comment.id}
                          >
                            <Show when={deletingCommentId() === comment.id} fallback={
                              <Icon icon="mdi:delete" width={16} height={16} />
                            }>
                              <span class="loading loading-spinner loading-xs"></span>
                            </Show>
                          </button>
                        </div>
                      </div>
                      <p class="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Add Comment Modal */}
      <Modal 
        isOpen={showCommentModal()} 
        onClose={() => setShowCommentModal(false)}
        size="md"
      >
        <CommentForm 
          opportunityId={props.opportunityId}
          onSuccess={handleCommentSuccess}
          onCancel={() => setShowCommentModal(false)}
        />
      </Modal>
    </div>
  );
}