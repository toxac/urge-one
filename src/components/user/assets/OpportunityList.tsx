import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading, opportunitiesStoreError } from "src/stores/userAssets/opportunities";
import { authStore } from "src/stores/auth";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { notify } from '../../../stores/notifications';
import { manageOpportunities } from "src/stores/userAssets/opportunities";
import type { Database } from "../../../../database.types";
import type { UserOpportunitiesStatus, UserOpportunitiesDiscoveryMethod } from "../../../../types/dbconsts";

type UserOpportunity = Database['public']['Tables']['user_opportunities']['Row'];

interface OpportunityListProps {
  showActions?: boolean;
  onEdit?: (opportunity: UserOpportunity) => void;
  onDelete?: (opportunity: UserOpportunity) => void;
}

export default function OpportunityList(props: OpportunityListProps) {
  const $session = useStore(authStore);
  const $opportunities = useStore(opportunitiesStore);
  const $loading = useStore(opportunitiesStoreLoading);
  const $error = useStore(opportunitiesStoreError);
  
  const [userId, setUserId] = createSignal<string | null>(null);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);

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

  // Get status badge color
  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { class: string; label: string }> = {
      added: { class: "badge badge-primary", label: "Added" },
      reviewed: { class: "badge badge-secondary", label: "Reviewed" },
      prioritized: { class: "badge badge-accent", label: "Prioritized" },
      rejected: { class: "badge badge-error", label: "Rejected" }
    };
    
    const config = status ? statusConfig[status] : statusConfig.added;
    return config || { class: "badge badge-neutral", label: status || "Unknown" };
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle delete opportunity
  const handleDelete = async (opportunity: UserOpportunity) => {
    if (!confirm(`Are you sure you want to delete "${opportunity.title}"?`)) {
      return;
    }

    setDeletingId(opportunity.id);
    
    try {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase
        .from('user_opportunities')
        .delete()
        .eq('id', opportunity.id);

      if (error) {
        throw error;
      }

      // Remove from store
      manageOpportunities("delete", opportunity.id );
      notify.success("Opportunity deleted successfully", "Success!");
      
      if (props.onDelete) {
        props.onDelete(opportunity);
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      notify.error("Failed to delete opportunity", "Error");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle edit opportunity
  const handleEdit = (opportunity: UserOpportunity) => {
    if (props.onEdit) {
      props.onEdit(opportunity);
    }
  };

  // Initialize user ID
  createEffect(() => {
    if (!$session() || $session().loading) return;
    const user = $session().user;
    if (user) {
      setUserId(user.id);
    }
  });

  return (
    <div class="w-full space-y-6">
      {/* Loading State */}
      <Show when={$loading()}>
        <div class="flex justify-center items-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="ml-3 text-lg text-gray-600">Loading opportunities...</span>
        </div>
      </Show>

      {/* Error State */}
      <Show when={$error()}>
        <div class="alert alert-error shadow-lg">
          <Icon icon="mdi:alert-circle" width={24} height={24} />
          <div>
            <h3 class="font-bold">Error loading opportunities</h3>
            <div class="text-xs">{$error()?.message}</div>
          </div>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!$loading() && !$error() && $opportunities().length === 0}>
        <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} class="text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-600 mb-2">No opportunities yet</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            Start by adding your first opportunity to see it listed here.
          </p>
        </div>
      </Show>

      {/* Opportunities List */}
      <Show when={!$loading() && $opportunities().length > 0}>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Saved Opportunities ({$opportunities().length})
            </h3>
          </div>

          <div class="grid gap-4">
            <For each={$opportunities()}>
              {(opportunity) => (
                <div class="card bg-base-100 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div class="card-body p-6">
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <h4 class="card-title text-lg font-semibold text-gray-900">
                            {opportunity.title || "Untitled Opportunity"}
                          </h4>
                          <div class={getStatusBadge(opportunity.status).class}>
                            {getStatusBadge(opportunity.status).label}
                          </div>
                          <Show when={opportunity.rank}>
                            <div class="badge badge-outline">
                              Rank: {opportunity.rank}
                            </div>
                          </Show>
                        </div>
                        
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span class="flex items-center gap-1">
                            <Icon icon="mdi:compass" width={16} height={16} />
                            {getDiscoveryMethodLabel(opportunity.discovery_method)}
                          </span>
                          <Show when={opportunity.category}>
                            <span class="flex items-center gap-1">
                              <Icon icon="mdi:tag" width={16} height={16} />
                              {opportunity.category}
                            </span>
                          </Show>
                          <Show when={opportunity.observation_type}>
                            <span class="flex items-center gap-1">
                              <Icon icon="mdi:eye" width={16} height={16} />
                              {opportunity.observation_type}
                            </span>
                          </Show>
                          <span class="flex items-center gap-1">
                            <Icon icon="mdi:calendar" width={16} height={16} />
                            {formatDate(opportunity.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <Show when={props.showActions !== false}>
                        <div class="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(opportunity)}
                            class="btn btn-sm btn-outline btn-primary"
                            title="Edit opportunity"
                          >
                            <Icon icon="mdi:pencil" width={16} height={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(opportunity)}
                            class="btn btn-sm btn-outline btn-error"
                            disabled={deletingId() === opportunity.id}
                            title="Delete opportunity"
                          >
                            <Show 
                              when={deletingId() === opportunity.id} 
                              fallback={<Icon icon="mdi:delete" width={16} height={16} />}
                            >
                              <span class="loading loading-spinner loading-xs"></span>
                            </Show>
                          </button>
                        </div>
                      </Show>
                    </div>

                    {/* Description */}
                    <Show when={opportunity.description}>
                      <p class="text-gray-700 mb-3 whitespace-pre-wrap">
                        {opportunity.description}
                      </p>
                    </Show>

                    {/* Goal Alignment */}
                    <Show when={opportunity.goal_alignment}>
                      <div class="flex items-center gap-2 text-sm">
                        <span class="font-medium text-gray-700">Goal Alignment:</span>
                        <span class="text-gray-600">{opportunity.goal_alignment}</span>
                      </div>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}