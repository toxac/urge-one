import { createSignal, Show } from "solid-js";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "../../../stores/userAssets/opportunities";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Schema for market size fields
const schema = z.object({
  tam: z.number().min(0, "TAM must be a positive number").optional(),
  sam: z.number().min(0, "SAM must be a positive number").optional(),
  som: z.number().min(0, "SOM must be a positive number").optional(),
  market_size_rationale: z.string().min(1, "Rationale is required").max(1000, "Must be less than 1000 characters")
});

interface ComponentProps {
  opportunity: Opportunity;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OpportunityMarketSize(props: ComponentProps) {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);

  // Parse existing market size data
  const existingMarketSize = props.opportunity.market_size as any || {};
  const existingRationale = props.opportunity.market_size_rationale || "";

  const { form, errors, isSubmitting, touched } = createForm({
    initialValues: {
      tam: existingMarketSize.TAM || "",
      sam: existingMarketSize.SAM || "",
      som: existingMarketSize.SOM || "",
      market_size_rationale: existingRationale
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const currentDate = new Date();
        
        // Prepare market_size JSON object
        const marketSizeData = {
          TAM: values.tam ? Number(values.tam) : null,
          SAM: values.sam ? Number(values.sam) : null,
          SOM: values.som ? Number(values.som) : null
        };

        const updates: OpportunityUpdate = {
          market_size: marketSizeData,
          market_size_rationale: values.market_size_rationale,
          updated_at: currentDate.toISOString(),
        };

        const { success, data, error } = await updateOpportunity(props.opportunity.id, updates);

        if (data && success) {
          notify.success("Market size data was successfully updated.", "Success!");
          setSuccess(true);
          if (props.onSuccess) {
            setTimeout(() => props.onSuccess!(), 1500);
          }
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error updating market size:', error);
        notify.error("Something went wrong while updating market size data.", "Failed");
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema })
  });

  return (
    <div class="w-full bg-white rounded-lg">
      <Show when={success()}>
        <div class="w-full text-center py-8">
          <div class="text-green-600 mb-4">
            <Icon icon="mdi:check-circle" width={48} height={48} />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Success!</h3>
          <p class="text-gray-600">
            Market size data has been updated successfully.
          </p>
        </div>
      </Show>

      <Show when={!success()}>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Market Size Analysis: {props.opportunity.title}
          </h2>
          <p class="text-gray-600 text-sm">
            Estimate the market size for this opportunity using TAM, SAM, and SOM metrics.
          </p>
        </div>

        <form use:form class="space-y-6">
          {/* Market Size Metrics */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TAM - Total Addressable Market */}
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">TAM (Total Addressable Market)</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  class="input input-bordered w-full pl-8"
                  name="tam"
                  placeholder="0"
                  min="0"
                  step="1000000"
                />
              </div>
              <label class="label">
                <span class="label-text-alt text-gray-500">Total market demand</span>
              </label>
              <Show when={errors().tam && touched().tam}>
                <span class="text-sm text-red-600 mt-1">{errors().tam}</span>
              </Show>
            </div>

            {/* SAM - Serviceable Addressable Market */}
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">SAM (Serviceable Addressable Market)</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  class="input input-bordered w-full pl-8"
                  name="sam"
                  placeholder="0"
                  min="0"
                  step="1000000"
                />
              </div>
              <label class="label">
                <span class="label-text-alt text-gray-500">Segment you can serve</span>
              </label>
              <Show when={errors().sam && touched().sam}>
                <span class="text-sm text-red-600 mt-1">{errors().sam}</span>
              </Show>
            </div>

            {/* SOM - Serviceable Obtainable Market */}
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">SOM (Serviceable Obtainable Market)</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  class="input input-bordered w-full pl-8"
                  name="som"
                  placeholder="0"
                  min="0"
                  step="1000000"
                />
              </div>
              <label class="label">
                <span class="label-text-alt text-gray-500">Realistic market share</span>
              </label>
              <Show when={errors().som && touched().som}>
                <span class="text-sm text-red-600 mt-1">{errors().som}</span>
              </Show>
            </div>
          </div>

          {/* Market Size Explanation */}
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <Icon icon="mdi:information" class="text-blue-500 mt-0.5 flex-shrink-0" />
              <div class="text-sm text-blue-700">
                <strong class="font-semibold">Understanding TAM, SAM, SOM:</strong>
                <ul class="list-disc list-inside mt-1 space-y-1">
                  <li><strong>TAM</strong>: Total market demand for your product/service</li>
                  <li><strong>SAM</strong>: Segment of TAM you can realistically target</li>
                  <li><strong>SOM</strong>: Portion of SAM you can capture in near-term</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Market Size Rationale</span>
              <span class="label-text-alt">{existingRationale.length}/1000</span>
            </label>
            <textarea
              name="market_size_rationale"
              class="textarea textarea-bordered w-full h-32"
              placeholder="Explain how you calculated these numbers. Include data sources, assumptions, market research, or any other relevant information that supports your market size estimates..."
              aria-label="Market size calculation rationale"
            />
            <label class="label">
              <span class="label-text-alt text-gray-500">
                Describe your methodology, data sources, and assumptions
              </span>
            </label>
            <Show when={errors().market_size_rationale && touched().market_size_rationale}>
              <span class="text-sm text-red-600 mt-1">{errors().market_size_rationale}</span>
            </Show>
          </div>

          {/* Action Buttons */}
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              class="btn btn-ghost"
              onClick={props.onCancel}
              disabled={isSubmitting()}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting()}
            >
              <Show when={isSubmitting()} fallback={
                <>
                  <Icon icon="mdi:content-save" width={16} height={16} class="mr-2" />
                  Save Market Size Data
                </>
              }>
                <span class="loading loading-spinner loading-sm mr-2"></span>
                Saving...
              </Show>
            </button>
          </div>
        </form>
      </Show>
    </div>
  );
}