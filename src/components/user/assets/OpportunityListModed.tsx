import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../../stores/userAssets/opportunities";
import Modal from "../../appFeedback/Modal";
import OpportunityMarketExploration from "../../forms/exercises/OpportunityMarketExploration";
import OpportunityCustomerResearch from "../../forms/exercises/OpportunityCustomerResearch";
import OpportunityMarketSize from "../../forms/exercises/OpportunityMarketSize";
import OpportunityAssessmentForm from "../../forms/exercises/OpportunityAssessment";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];

type ActionMode =
    | "editExploration"
    | "editCustomerResearch"
    | "editMarketSize"
    | "editAssessment"
    | "editAll"
    | "viewOnly";

interface OpportunitiesListProps {
    mode: ActionMode;
    title?: string;
    description?: string;
}

// Helper to get mode display name
const getModeDisplayName = (mode: ActionMode): string => {
    const modeMap: Record<ActionMode, string> = {
        editExploration: "Market Exploration",
        editCustomerResearch: "Customer Research",
        editMarketSize: "Market Size",
        editAssessment: "Opportunity Assessment",
        editAll: "All Details",
        viewOnly: "View Opportunities"
    };
    return modeMap[mode];
};

// Helper to get button text based on mode
const getButtonText = (mode: ActionMode): string => {
    const textMap: Record<ActionMode, string> = {
        editExploration: "Add Exploration",
        editCustomerResearch: "Add Research",
        editMarketSize: "Add Market Data",
        editAssessment: "Add Assessment",
        editAll: "Edit All",
        viewOnly: "View Details"
    };
    return textMap[mode];
};

export default function OpportunitiesList(props: OpportunitiesListProps) {
    const mode = () => props.mode || "viewOnly";
    const customTitle = () => props.title || getModeDisplayName(mode());
    const customDescription = () => props.description || `Select an opportunity to ${getButtonText(mode()).toLowerCase()}`;

    const $opportunities = useStore(opportunitiesStore);
    const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

    const [showEditModal, setShowEditModal] = createSignal(false);
    const [selectedOpportunity, setSelectedOpportunity] = createSignal<Opportunity | null>(null);
    const [savedOpportunities, setSavedOpportunities] = createSignal<Opportunity[] | []>([]);
    const [loading, setLoading] = createSignal(false);

    createEffect(() => {
        if ($opportunitiesLoading()) {
            setLoading(true);
            return;
        } else {
            const opportunities = $opportunities();
            setSavedOpportunities(opportunities);
            setLoading(false);
        }
    });

    const handleSelectOpportunity = (currentOpportunity: Opportunity) => {
        setSelectedOpportunity(currentOpportunity);
        if (props.mode === "editAll") {
            navigate(`/opportunities/${currentOpportunity.id}/edit`);
        } else {
            setShowEditModal(true);
        }
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
    };

    return (
        <div class="space-y-6">
            {/* Header */}
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    {customTitle()}
                </h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    {customDescription()}
                </p>
            </div>

            {/* Loading State */}
            <Show when={loading()}>
                <div class="flex justify-center items-center py-12">
                    <div class="loading loading-spinner loading-lg text-primary"></div>
                    <span class="ml-3 text-gray-600">Loading opportunities...</span>
                </div>
            </Show>

            {/* Empty State */}
            <Show when={!loading() && savedOpportunities().length === 0}>
                <div class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Icon icon="mdi:lightbulb-on-outline" class="text-4xl text-gray-400 mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">No opportunities yet</h3>
                    <p class="text-gray-600 mb-6">Start by creating your first opportunity to explore.</p>
                    <button class="btn btn-primary">
                        <Icon icon="mdi:plus" class="mr-2" />
                        Create Opportunity
                    </button>
                </div>
            </Show>

            {/* Opportunities List */}
            <Show when={!loading() && savedOpportunities().length > 0}>
                <div class="grid grid-cols-1 gap-3">
                    <For each={savedOpportunities()}>
                        {(opportunity) => (
                            <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-gray-900 truncate">
                                        {opportunity.title}
                                    </h3>
                                    <Show when={opportunity.description}>
                                        <p class="text-sm text-gray-600 truncate mt-1">
                                            {opportunity.description}
                                        </p>
                                    </Show>
                                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <Show when={opportunity.category}>
                                            <span class="badge badge-outline badge-sm">
                                                {opportunity.category}
                                            </span>
                                        </Show>
                                        <span>
                                            Created {new Date(opportunity.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <button 
                                    class="btn btn-sm btn-primary ml-4 flex-shrink-0"
                                    onClick={() => handleSelectOpportunity(opportunity)}
                                >
                                    {getButtonText(mode())}
                                </button>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            {/* Edit Modals */}
            <Show when={selectedOpportunity()}>
                <Modal isOpen={mode() === "editExploration" && showEditModal()} onClose={() => setShowEditModal(false)}>
                    <OpportunityMarketExploration 
                        opportunity={selectedOpportunity()!} 
                        onCancel={() => setShowEditModal(false)} 
                        onSuccess={handleEditSuccess} 
                    />
                </Modal>
                <Modal isOpen={mode() === "editCustomerResearch" && showEditModal()} onClose={() => setShowEditModal(false)}>
                    <OpportunityCustomerResearch
                        opportunity={selectedOpportunity()!} 
                        onCancel={() => setShowEditModal(false)} 
                        onSuccess={handleEditSuccess} 
                    />
                </Modal>
                <Modal isOpen={mode() === "editMarketSize" && showEditModal()} onClose={() => setShowEditModal(false)}>
                    <OpportunityMarketSize
                        opportunity={selectedOpportunity()!} 
                        onCancel={() => setShowEditModal(false)} 
                        onSuccess={handleEditSuccess} 
                    />
                </Modal>
                <Modal isOpen={mode() === "editAssessment" && showEditModal()} onClose={() => setShowEditModal(false)}>
                    <OpportunityAssessmentForm
                        opportunity={selectedOpportunity()!} 
                        onCancel={() => setShowEditModal(false)} 
                        onSuccess={handleEditSuccess} 
                    />
                </Modal>
            </Show>
        </div>
    );
}