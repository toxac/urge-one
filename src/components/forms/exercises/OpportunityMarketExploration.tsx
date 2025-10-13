import { createSignal, createEffect, For, Show } from "solid-js";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "../../../stores/userAssets/opportunities";
import { broadMarketResearch } from "../../../constants/exercises/opportunityEvaluation";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Updated schema for market exploration fields
const schema = z.object({
    market_trend: z.string().min(1, "Market trend is required"),
    top_pain_point: z.string().min(1, "Top pain point is required").max(200, "Must be less than 200 characters"),
    barriers_to_entry: z.array(z.string()).min(1, "Select at least one barrier"),
    competitors: z.array(z.string()).min(1, "At least one competitor is required")
});

interface ComponentProps {
    opportunity: Opportunity;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function OpportunityMarketExploration(props: ComponentProps) {
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [competitors, setCompetitors] = createSignal<string[]>(
        props.opportunity.competitors as string[] || []
    );
    const [newCompetitor, setNewCompetitor] = createSignal("");

    const { form, errors, isSubmitting, touched, setFields } = createForm({
        initialValues: {
            market_trend: props.opportunity.market_trend || "",
            top_pain_point: props.opportunity.top_pain_point || "",
            barriers_to_entry: props.opportunity.barriers_to_entry || [],
            competitors: props.opportunity.competitors as string[] || []
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const currentDate = new Date();
                const updates: OpportunityUpdate = {
                    market_trend: values.market_trend,
                    top_pain_point: values.top_pain_point,
                    barriers_to_entry: values.barriers_to_entry,
                    competitors: competitors(),
                    updated_at: currentDate.toISOString(),
                };

                const { success, data, error } = await updateOpportunity(props.opportunity.id, updates);

                if (data && success) {
                    notify.success("Market exploration data was successfully updated.", "Success!");
                    setSuccess(true);
                    if (props.onSuccess) {
                        setTimeout(() => props.onSuccess!(), 1500);
                    }
                }
                if (error) {
                    throw error;
                }
            } catch (error) {
                console.error('Error updating market exploration:', error);
                notify.error("Something went wrong while updating market exploration data.", "Failed");
            } finally {
                setLoading(false);
            }
        },
        extend: validator({ schema })
    });

    // Simplified competitor management functions
    const addCompetitor = () => {
        if (newCompetitor().trim()) {
            setCompetitors(prev => [...prev, newCompetitor().trim()]);
            setNewCompetitor("");
        }
    };

    const removeCompetitor = (index: number) => {
        setCompetitors(prev => prev.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCompetitor();
        }
    };

    return (
        <div class="w-full bg-white rounded-lg">
            <Show when={success()}>
                <div class="w-full text-center py-8">
                    <div class="text-green-600 mb-4">
                        <Icon icon="mdi:check-circle" width={48} height={48} />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p class="text-gray-600">
                        Market exploration data has been updated successfully.
                    </p>
                </div>
            </Show>

            <Show when={!success()}>
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">
                        Market Exploration: {props.opportunity.title}
                    </h2>
                    <p class="text-gray-600 text-sm">
                        Add market research data to better understand this opportunity's landscape.
                    </p>
                </div>

                <form use:form class="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                    {/* Market Trend */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">General Market Trend</span>
                        </label>
                        <select
                            class="select select-bordered w-full"
                            name="market_trend"
                            aria-label="Select the current market trend"
                        >
                            <option disabled value="">Select market trend</option>
                            <For each={broadMarketResearch.market_trend}>
                                {(trend) => (
                                    <option value={trend} selected={trend === props.opportunity.market_trend}>
                                        {trend}
                                    </option>
                                )}
                            </For>
                        </select>
                        <Show when={errors().market_trend && touched().market_trend}>
                            <span class="text-sm text-red-600 mt-1">{errors().market_trend}</span>
                        </Show>
                    </div>

                    {/* Top Pain Point */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Top Customer Pain Point</span>
                        </label>
                        <textarea
                            name="top_pain_point"
                            class="textarea textarea-bordered w-full h-20"
                            placeholder="What is the most significant problem customers face in this market?"
                            aria-label="Describe the top customer pain point"
                            value={props.opportunity.top_pain_point || ""}
                        />
                        <Show when={errors().top_pain_point && touched().top_pain_point}>
                            <span class="text-sm text-red-600 mt-1">{errors().top_pain_point}</span>
                        </Show>
                    </div>

                    {/* Barriers to Entry */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Barriers to Entry</span>
                            <span class="label-text-alt">Select all that apply</span>
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                            <For each={broadMarketResearch.barriers}>
                                {(barrier) => (
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="barriers_to_entry"
                                            value={barrier}
                                            class="checkbox checkbox-sm"
                                            checked={props.opportunity.barriers_to_entry?.includes(barrier)}
                                        />
                                        <span class="text-sm">{barrier}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                        <Show when={errors().barriers_to_entry && touched().barriers_to_entry}>
                            <span class="text-sm text-red-600 mt-1">{errors().barriers_to_entry}</span>
                        </Show>
                    </div>

                    {/* Competitor Analysis - Simplified */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Competitors</span>
                            <span class="label-text-alt">Add competitor names</span>
                        </label>
                        
                        {/* Existing Competitors */}
                        <Show when={competitors().length > 0}>
                            <div class="space-y-2 mb-4">
                                <For each={competitors()}>
                                    {(competitor, index) => (
                                        <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border">
                                            <span>{competitor}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeCompetitor(index())}
                                                class="btn btn-xs btn-ghost text-error"
                                            >
                                                <Icon icon="mdi:delete" />
                                            </button>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>

                        {/* Add New Competitor */}
                        <div class="flex gap-2">
                            <input
                                type="text"
                                class="input input-bordered flex-1"
                                placeholder="Enter competitor name"
                                value={newCompetitor()}
                                onInput={(e) => setNewCompetitor(e.currentTarget.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                type="button"
                                onClick={addCompetitor}
                                disabled={!newCompetitor().trim()}
                                class="btn btn-primary"
                            >
                                <Icon icon="mdi:plus" />
                            </button>
                        </div>
                        <Show when={errors().competitors && touched().competitors}>
                            <span class="text-sm text-red-600 mt-1">{errors().competitors}</span>
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
                                    Save Market Research
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