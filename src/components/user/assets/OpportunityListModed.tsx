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
  mode?: ActionMode;
  title?: string;
  description?: string;
}

export default function OpportunitiesList(props: OpportunitiesListProps) {
  const mode = () => props.mode || "viewOnly";
  
  const $opportunities = useStore(opportunitiesStore);
  const $opportunitiesLoading = useStore(opportunitiesStoreLoading);

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [showExplorationModal, setShowExplorationModal] = createSignal(false);
  const [showCustomerResearchModal, setShowCustomerResearchModal] = createSignal(false);
  const [showMarketSizeModal, setShowMarketSizeModal] = createSignal(false);
  const [showAssessmentModal, setShowAssessmentModal] = createSignal(false);
  
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





  return (
    <div>
        <For each={savedOpportunities()}>
            {opportunity => {
                return (
                    <div>
                        {opportunity.title}
                    </div>
                )
            }}
        </For>

    </div>
  );
}