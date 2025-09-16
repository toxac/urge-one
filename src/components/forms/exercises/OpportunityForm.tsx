/** @jsxImportSource solid-js */

import { createSignal, createEffect, Show, For } from "solid-js";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";
import { useStore } from "@nanostores/solid";
import { notify } from "../../../stores/notifications";
import { Icon } from "@iconify-icon/solid";
import { saveFormAndMarkCompleted } from "../../../stores/progress";
import {
  opportunitiesStore,
  manageOpportunities,
  opportunitiesStoreLoading,
} from "../../../stores/userAssets/opportunities";
import { authStore } from "../../../stores/auth";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import {
  discoveryMethodOptions,
  categoryOptions,
  alignmentWithGoalsOptions,
} from "../../../constants/exercises/opportunities";
import { type Database } from "../../../../database.types";


type OpportunityRow = Database["public"]["Tables"]["user_opportunities"]["Row"];
type OpportunityInsert =
  Database["public"]["Tables"]["user_opportunities"]["Insert"];
type OpportunityUpdate =
  Database["public"]["Tables"]["user_opportunities"]["Update"];

interface Props {
  opportunityId?: string;
  contentMetaId: string;
  onSuccess?: () => void;
  approach?:
    | "personal-problems"
    | "skill-based"
    | "zone-of-influence"
    | "broader-search";
}

const schema = z.object({
  category: z.string(),
  description: z
    .string()
    .min(20, "Describe at least 20 characters")
    .max(300, "Keep it under 300 characters"),
  discovery_method: z.string(),
  goal_alignment: z.string(),
  observation_type: z.string(),
  title: z
    .string()
    .min(3, "Must complete the sentence with at least 10 characters")
    .max(200, "Keep it concise (under 200 characters)"),
});

const supabase = supabaseBrowserClient;

export default function OpportunityForm(props: Props) {
  //Stores
  const $session = useStore(authStore);
  const $opportunities = useStore(opportunitiesStore);
  const $opportunityStoreLoading = useStore(opportunitiesStoreLoading);
  //States
  const [success, setSuccess] = createSignal(false);
  const [userId, setUserId] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [observationType, setObservationType] = createSignal<string | null>(
    null
  );
  const [opportunity, setOpportunity] = createSignal<OpportunityRow | null>(
    null
  );

  // Load and set User
  createEffect(() => {
    const session = $session();
    if (session.loading) return;
    if (session.user) {
      setUserId(session.user.id);
    }
  });
  

  const { form, data, errors, setFields } = createForm({
    initialValues: {
      category: "",
      description: "",
      discovery_method: "",
      goal_alignment: "",
      observation_type: "",
      title: "",
    },
    onSubmit: async () => {},
    validate: validator({ schema }),
  });

  // load and set opportunity 
  createEffect(()=>{
    if(props.opportunityId){
      
    }
  })

  return (
    <section class="w-full bg-white border-1 border-primary rounded-lg p-8">
      <form use:form class="flex flex-col gap-8">
        <label class="input input-neutral w-full">
          <Icon icon="mdi:format-title" />
          <input
            type="text"
            name="title"
            placeholder="Name of the opoprtunity"
          />
        </label>

        <select class="select select-neutral w-full" name="discovery_method">
          <option value="" disabled selected>
            Select appropriate discovery method
          </option>
          <For each={discoveryMethodOptions}>
            {(item) => <option value={item.value}>{item.label}</option>}
          </For>
        </select>

        <select class="select select-neutral w-full" name="category">
          <option value="" disabled selected>
            Select a category of problem
          </option>
          <For each={categoryOptions}>
            {(item) => <option value={item.value}>{item.label}</option>}
          </For>
        </select>

        <textarea
          class="textarea textarea-neutral w-full"
          rows={6}
          placeholder="Describe your opportunity"
          name="description"
        ></textarea>

        <select class="select select-neutral w-full" name="goal_alignment">
          <option value="" disabled selected>
            How aligned is this opportunity with your goals
          </option>
          <For each={alignmentWithGoalsOptions}>
            {(item) => <option value={item.value}>{item.label}</option>}
          </For>
        </select>

        {/* Submit Button */}
        <div class="pt-4 flex justify-end">
          <button
            type="submit"
            class="btn btn-primary btn-outline"
            onClick={handleSubmit}
            disabled={loading()}
          >
            {loading() ? "Saving..." : "Save Opportunity"}
          </button>
        </div>
      </form>
    </section>
  );
}
