import { Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { Database } from "../../../../database.types";
import { getCommentsCount } from "../../../stores/userAssets/opportunityComments";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (opportunity: Opportunity) => void;
}

export default function OpportunityCard(props: OpportunityCardProps) {

  const commentsCount = () => getCommentsCount(props.opportunity.id);

  return (
    <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
      <div class="card-body">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="card-title text-lg font-semibold mb-2">
              {props.opportunity.title}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {props.opportunity.description}
            </p>

            <div class="flex flex-wrap gap-2 mb-3">
              <span class="badge badge-outline badge-primary">
                {props.opportunity.discovery_method}
              </span>
              <Show when={props.opportunity.category}>
                <span class="badge badge-outline badge-secondary">
                  {props.opportunity.category}
                </span>
              </Show>
              <Show when={props.opportunity.status}>
                <span class="badge badge-ghost">
                  {props.opportunity.status}
                </span>
              </Show>
            </div>
          </div>
        </div>

        <div class="card-actions justify-between items-center">
          <div class="flex items-center gap-4 text-sm text-gray-500">

              <Icon icon="mdi:comment" />
              {commentsCount()} Comments

          </div>

          <button
            class="btn btn-primary btn-sm"
            onClick={() => props.onViewDetails(props.opportunity)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}