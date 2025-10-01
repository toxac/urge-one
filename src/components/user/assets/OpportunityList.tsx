// OpportunitiesApp.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../../stores/userAssets/opportunities";
import Modal from "../../appFeedback/Modal";
import OpportunityForm from "../../forms/exercises/OpportunityForm";
import OpportunityCard from "../../user/assets/OpportunityCard";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];

export default function OpportunitiesList() {

  const $opportunities = useStore(opportunitiesStore);
  const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [savedOpportunities, setSavedOpportunities] = createSignal<Opportunity[] | []> ([]);
  const [loading, setLoading] = createSignal(false);
  
  createEffect(()=>{
    if($opportunitiesLoading()){
      setLoading(true)
      return ;
    }else {
      const opportunities = $opportunities();
      setSavedOpportunities(opportunities)
      setLoading(false);
    }
  })


  const handleViewDetails = (opportunity: Opportunity) => {
    navigate(`/assets/opportunities/${opportunity.id}`);
  };

  const handleFormSuccess = () => {
    setShowAddModal(false);
  };

  return (
    <div class="w-full mx-auto px-4 py-8">
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
        <Show when={savedOpportunities().length > 0 && !loading()} fallback={
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
    </div>
  );
}