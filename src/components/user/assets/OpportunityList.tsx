// OpportunitiesApp.tsx
import { createSignal, createEffect, onMount, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../../stores/userAssets/opportunities";
import Modal from "../../appFeedback/Modal";
import OpportunityForm from "../../forms/exercises/OpportunityForm";
import UpdateOpportunityForm from "../../user/assets/OpportunityFormEdit";
import CommentForm from "../../user/assets/OpportunityCommentForm";
import OpportunityCard from "../../user/assets/OpportunityCard";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];

export default function OpportunitiesList() {
  const $session = useStore(authStore);
  const $opportunities = useStore(opportunitiesStore);
  const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [showCommentModal, setShowCommentModal] = createSignal(false);
  const [savedOpportunities, setSavedOpportunities] = createSignal<Opportunity[] | []> ([]);
  const [selectedOpportunity, setSelectedOpportunity] = createSignal<Opportunity | null>(null);
  const [loading, setLoading] = createSignal(false);
  
  createEffect(()=>{
    if($opportunitiesLoading()) return ;
    const opportunities = $opportunities();
    setSavedOpportunities(opportunities)
  })

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowEditModal(true);
  };

  const handleAddComment = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowCommentModal(true);
  };

  const handleViewDetails = (opportunity: Opportunity) => {
    window.location.href = `/assets/opportunities/${opportunity.id}`;
  };

  const handleFormSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowCommentModal(false);
    setSelectedOpportunity(null);
  };

  return (
    <div class="container mx-auto px-4 py-8">
      {/* Header */}
      <div class="flex justify-between items-center mb-8">
        <div>
          <h4>Saved Opportunities</h4>
          <p class="text-gray-600">Manage your discovered opportunities</p>
        </div>
        <button
          class="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Opportunity
        </button>
      </div>

      {/* Opportunities Grid */}
      <Show when={!loading()} fallback={
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }>
        <Show when={savedOpportunities().length > 0} fallback={
          <div class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} />
            </div>
            <h3 class="text-xl font-semibold mb-2">No opportunities yet</h3>
            <p class="text-gray-600 mb-6">Start by adding your first opportunity</p>
            <button
              class="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add Your First Opportunity
            </button>
          </div>
        }>
          <div class="grid grid-cols-1 gap-4">
            <For each={savedOpportunities()}>
              {(opportunity) => (
                <OpportunityCard
                  opportunity={opportunity}
                  onEdit={handleEditOpportunity}
                  onAddComment={handleAddComment}
                  onViewDetails={handleViewDetails}
                />
              )}
            </For>
          </div>
        </Show>
      </Show>

      {/* Modals */}
      <Modal
        isOpen={showAddModal()}
        onClose={() => setShowAddModal(false)}
        size="lg"
      >
        <OpportunityForm onSuccess={handleFormSuccess} />
      </Modal>

      <Modal
        isOpen={showEditModal()}
        onClose={() => setShowEditModal(false)}
        size="lg"
      >
        <Show when={selectedOpportunity()}>
          <UpdateOpportunityForm
            opportunityId={selectedOpportunity()!.id}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        </Show>
      </Modal>

      <Modal
        isOpen={showCommentModal()}
        onClose={() => setShowCommentModal(false)}
        size="md"
      >
        <Show when={selectedOpportunity()}>
          <CommentForm
            opportunityId={selectedOpportunity()!.id}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowCommentModal(false)}
          />
        </Show>
      </Modal>
    </div>
  );
}