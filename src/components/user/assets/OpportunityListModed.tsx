// OpportunitiesApp.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../../stores/userAssets/opportunities";
import Modal from "../../appFeedback/Modal";
import OpportunityForm from "../../forms/exercises/OpportunityForm";
import OpportunityMarketExploration from "../../forms/exercises/OpportunityMarketExploration";
import OpportunityCustomerResearch from "../../forms/exercises/OpportunityCustomerResearch";
import OpportunityMarketSize from "../../forms/exercises/OpportunityMarketSize";
import OpportunityAssessmentForm from "../../forms/exercises/OpportunityAssessment";
import OpportunityCard from "../../user/assets/OpportunityCard";
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
}

export default function OpportunitiesList(props: OpportunitiesListProps) {
    const mode = () => props.mode || "viewOnly";

    const $opportunities = useStore(opportunitiesStore);
    const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

    const [showAddModal, setShowAddModal] = createSignal(false);
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
        setSelectedOpportunity(currentOpportunity)
        if(props.mode === "editAll"){
            // navigate to edit page its better to open that up in separate page as there are so many fields
        } else {
            setShowEditModal(true);
        }
    }

    const handleEditSuccess = () =>{
        setShowEditModal(false);
    }





    return (
        <div>
            <For each={savedOpportunities()}>
                {opportunity => {
                    return (
                        <div class="flex">
                            <h4>{opportunity.title}</h4>
                            <button class="btn btn-primary btn-outline" onClick={() => handleSelectOpportunity(opportunity)}>Edit</button>
                        </div>
                    )
                }}
            </For>

            <Modal isOpen={props.mode == "editExploration" && showEditModal()} onClose={()=> setShowEditModal(false)}>
                <div>Editing Market Exploration for {selectedOpportunity()?.title}</div>
            </Modal>
            <Modal isOpen={props.mode == "editCustomerResearch" && showEditModal()} onClose={()=> setShowEditModal(false)}>
                <div>Editing Customer Research for {selectedOpportunity()?.title}</div>
            </Modal>
            <Modal isOpen={props.mode == "editMarketSize" && showEditModal()} onClose={()=> setShowEditModal(false)}>
                <div>Editing Market Size for {selectedOpportunity()?.title}</div>
            </Modal>
            <Modal isOpen={props.mode == "editAssessment" && showEditModal()} onClose={()=> setShowEditModal(false)}>
                <div>Editing Assessment for {selectedOpportunity()?.title}</div>
            </Modal>





        </div>
    );
}