import { createSignal, createEffect, For, Show } from "solid-js";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "../../../stores/userAssets/opportunities";
import { broadMarketResearch } from "../../../constants/exercises/opportunityEvaluation";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Schema for market exploration fields
const schema = z.object({
    market_trend: z.string().min(1, "Market trend is required"),
    top_pain_point: z.string().min(1, "Top pain point is required").max(200, "Must be less than 200 characters"),
    barriers_to_entry: z.array(z.string()).min(1, "Select at least one barrier"),
    competitors: z.array(z.object({
        name: z.string().min(1, "Competitor name is required"),
        solutions: z.array(z.string()).min(1, "At least one solution is required"),
        gaps: z.array(z.string()).min(1, "At least one gap is required"),
        position: z.string().min(1, "Market position is required")
    })).optional().default([])
});

interface ComponentProps {
    opportunity: Opportunity;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function OpportunityMarketExploration(props: ComponentProps) {
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [competitors, setCompetitors] = createSignal<Array<{name: string; solutions: string[]; gaps: string[]; position: string}>>(
        props.opportunity.competitors as any || []
    );
    const [newCompetitor, setNewCompetitor] = createSignal({
        name: "",
        solutions: [""],
        gaps: [""],
        position: ""
    });

    const { form, errors, isSubmitting, touched, setFields } = createForm({
        initialValues: {
            market_trend: props.opportunity.market_trend || "",
            top_pain_point: props.opportunity.primary_pain_points?.[0] || "", // Using primary_pain_points[0] as top_pain_point
            barriers_to_entry: props.opportunity.barriers_to_entry || [],
            competitors: props.opportunity.competitors || []
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const currentDate = new Date();
                const updates: OpportunityUpdate = {
                    market_trend: values.market_trend,
                    primary_pain_points: values.top_pain_point ? [values.top_pain_point] : null,
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

    // Competitor management functions
    const addCompetitor = () => {
        if (newCompetitor().name && newCompetitor().position) {
            setCompetitors(prev => [...prev, { ...newCompetitor() }]);
            setNewCompetitor({ name: "", solutions: [""], gaps: [""], position: "" });
        }
    };

    const removeCompetitor = (index: number) => {
        setCompetitors(prev => prev.filter((_, i) => i !== index));
    };

    const updateNewCompetitorField = (field: string, value: any) => {
        setNewCompetitor(prev => ({ ...prev, [field]: value }));
    };

    const addSolution = () => {
        setNewCompetitor(prev => ({ 
            ...prev, 
            solutions: [...prev.solutions, ""] 
        }));
    };

    const updateSolution = (index: number, value: string) => {
        setNewCompetitor(prev => ({
            ...prev,
            solutions: prev.solutions.map((sol, i) => i === index ? value : sol)
        }));
    };

    const removeSolution = (index: number) => {
        setNewCompetitor(prev => ({
            ...prev,
            solutions: prev.solutions.filter((_, i) => i !== index)
        }));
    };

    const addGap = () => {
        setNewCompetitor(prev => ({ 
            ...prev, 
            gaps: [...prev.gaps, ""] 
        }));
    };

    const updateGap = (index: number, value: string) => {
        setNewCompetitor(prev => ({
            ...prev,
            gaps: prev.gaps.map((gap, i) => i === index ? value : sol)
        }));
    };

    const removeGap = (index: number) => {
        setNewCompetitor(prev => ({
            ...prev,
            gaps: prev.gaps.filter((_, i) => i !== index)
        }));
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

                    {/* Competitor Analysis */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Competitor Analysis</span>
                        </label>
                        
                        {/* Existing Competitors */}
                        <Show when={competitors().length > 0}>
                            <div class="space-y-4 mb-4">
                                <For each={competitors()}>
                                    {(competitor, index) => (
                                        <div class="border rounded-lg p-4 bg-gray-50">
                                            <div class="flex justify-between items-start mb-2">
                                                <h4 class="font-semibold">{competitor.name}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCompetitor(index())}
                                                    class="btn btn-xs btn-ghost text-error"
                                                >
                                                    <Icon icon="mdi:delete" />
                                                </button>
                                            </div>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <strong>Solutions:</strong>
                                                    <ul class="list-disc list-inside">
                                                        <For each={competitor.solutions}>
                                                            {(solution) => <li>{solution}</li>}
                                                        </For>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong>Gaps:</strong>
                                                    <ul class="list-disc list-inside">
                                                        <For each={competitor.gaps}>
                                                            {(gap) => <li>{gap}</li>}
                                                        </For>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <strong>Position:</strong> {competitor.position}
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>

                        {/* Add New Competitor */}
                        <div class="border-2 border-dashed rounded-lg p-4">
                            <h4 class="font-semibold mb-3">Add New Competitor</h4>
                            
                            {/* Competitor Name */}
                            <div class="form-control mb-3">
                                <label class="label">
                                    <span class="label-text">Competitor Name</span>
                                </label>
                                <input
                                    type="text"
                                    class="input input-bordered input-sm"
                                    placeholder="Company name"
                                    value={newCompetitor().name}
                                    onInput={(e) => updateNewCompetitorField('name', e.currentTarget.value)}
                                />
                            </div>

                            {/* Solutions */}
                            <div class="form-control mb-3">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="label">
                                        <span class="label-text">Solutions Offered</span>
                                    </label>
                                    <button type="button" onClick={addSolution} class="btn btn-xs btn-outline">
                                        <Icon icon="mdi:plus" class="mr-1" /> Add Solution
                                    </button>
                                </div>
                                <For each={newCompetitor().solutions}>
                                    {(solution, index) => (
                                        <div class="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                class="input input-bordered input-sm flex-1"
                                                placeholder="Solution description"
                                                value={solution}
                                                onInput={(e) => updateSolution(index(), e.currentTarget.value)}
                                            />
                                            <Show when={newCompetitor().solutions.length > 1}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSolution(index())}
                                                    class="btn btn-xs btn-ghost text-error"
                                                >
                                                    <Icon icon="mdi:delete" />
                                                </button>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>

                            {/* Gaps */}
                            <div class="form-control mb-3">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="label">
                                        <span class="label-text">Market Gaps</span>
                                    </label>
                                    <button type="button" onClick={addGap} class="btn btn-xs btn-outline">
                                        <Icon icon="mdi:plus" class="mr-1" /> Add Gap
                                    </button>
                                </div>
                                <For each={newCompetitor().gaps}>
                                    {(gap, index) => (
                                        <div class="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                class="input input-bordered input-sm flex-1"
                                                placeholder="Market gap or weakness"
                                                value={gap}
                                                onInput={(e) => updateGap(index(), e.currentTarget.value)}
                                            />
                                            <Show when={newCompetitor().gaps.length > 1}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeGap(index())}
                                                    class="btn btn-xs btn-ghost text-error"
                                                >
                                                    <Icon icon="mdi:delete" />
                                                </button>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>

                            {/* Market Position */}
                            <div class="form-control mb-3">
                                <label class="label">
                                    <span class="label-text">Market Position</span>
                                </label>
                                <select
                                    class="select select-bordered select-sm"
                                    value={newCompetitor().position}
                                    onChange={(e) => updateNewCompetitorField('position', e.currentTarget.value)}
                                >
                                    <option disabled value="">Select position</option>
                                    <For each={broadMarketResearch.competitor_market_position}>
                                        {(position) => (
                                            <option value={position}>{position}</option>
                                        )}
                                    </For>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={addCompetitor}
                                disabled={!newCompetitor().name || !newCompetitor().position}
                                class="btn btn-sm btn-primary w-full"
                            >
                                <Icon icon="mdi:plus" class="mr-1" /> Add Competitor
                            </button>
                        </div>
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