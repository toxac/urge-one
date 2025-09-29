import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "src/stores/auth";
import { opportunitiesStore } from "src/stores/userAssets/opportunities";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "src/stores/userAssets/opportunities";
import { type DiscoveryMethodOption, discoveryMethodOptions, categoryOptions, alignmentWithGoalsOptions } from "../../../constants/exercises/opportunities"
import type { Database } from "../../../../database.types";
import type { UserOpportunitiesStatus, UserOpportunitiesDiscoveryMethod } from "../../../../types/urgeTypes";

type UserOpportunity = Database['public']['Tables']['user_opportunities']['Row'];
type UserOpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Schema for update (same as create but all fields optional except title)
const schema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    discovery_method: z.string().min(1, "Discovery method is required"),
    observation_type: z.string().optional(),
    category: z.string().optional(),
    goal_alignment: z.string().optional(),
});

interface ComponentProps {
    opportunityId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function UpdateOpportunityForm(props: ComponentProps) {
    // Stores
    const $session = useStore(authStore);
    const $opportunities = useStore(opportunitiesStore);
    const [userId, setUserId] = createSignal<string | null>(null);
    const [discoveryMethod, setDiscoveryMethod] = createSignal<DiscoveryMethodOption | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [observationTypes, setObservationTypes] = createSignal<{ value: string; label: string; helperText: string, example?: string }[]>([]);
    const [currentOpportunity, setCurrentOpportunity] = createSignal<UserOpportunity | null>(null);
    const [fetchError, setFetchError] = createSignal<string | null>(null);

    const getDiscoveryMethod = (discoveryMethodValue: UserOpportunitiesDiscoveryMethod) => {
        const approach = discoveryMethodOptions.find(option => option.value === discoveryMethodValue);
        if (approach) {
            setDiscoveryMethod(approach);
            setObservationTypes(approach.observationType || []);
        } else {
            setDiscoveryMethod(null);
            setObservationTypes([]);
        }
    }

    // Fetch opportunity data when component mounts or opportunityId changes
    createEffect(() => {
        // Get user
        if (!$session() || !$session().loading) return;
        const user = $session().user;
        if (user) {
            setUserId(user.id);
        }

        // Find opportunity in store
        if (props.opportunityId && $opportunities().length > 0) {
            const opportunity = $opportunities().find(opp => opp.id === props.opportunityId);
            if (opportunity) {
                setCurrentOpportunity(opportunity);
                setFetchError(null);

                // Set discovery method and observation types based on current data
                if (opportunity.discovery_method) {
                    getDiscoveryMethod(opportunity.discovery_method as UserOpportunitiesDiscoveryMethod);
                }
            } else {
                setFetchError("Opportunity not found");
            }
        }
    });

    const { form, errors, isSubmitting, touched, reset } = createForm({
        initialValues: {
            category: "",
            description: "",
            discovery_method: "",
            goal_alignment: "",
            observation_type: "",
            title: "",
        },
        onSubmit: async (values) => {
            setLoading(true);
            const supabase = supabaseBrowserClient;
            try {
                if (userId() && currentOpportunity()) {
                    const currentDate = new Date();
                    const updatedOpportunityPayload: UserOpportunityUpdate = {
                        category: values.category || null,
                        description: values.description || null,
                        discovery_method: values.discovery_method as UserOpportunitiesDiscoveryMethod,
                        goal_alignment: values.goal_alignment || null,
                        observation_type: values.observation_type || null,
                        title: values.title,
                        updated_at: currentDate.toISOString(),
                    };
                    const { success, data, error } = await updateOpportunity(props.opportunityId, updatedOpportunityPayload);

                    if (success && data) {
                        setSuccess(true);
                    }

                    if (error) {
                        throw error;
                    }

                } else {
                    notify.error("No user found! Please retry after logging in", "Fail");
                }

            } catch (error) {
                console.error("Error updating opportunity:", error);
                notify.error("Something went wrong at our end. Please try updating the opportunity again", "Failed");
            } finally {
                setLoading(false);
            }
        },
        extend: validator({ schema })
    });

    // Reset form with current opportunity data when it's loaded
    createEffect(() => {
        const opportunity = currentOpportunity();
        // setfields
    });

    const handleDiscoveryMethodChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        getDiscoveryMethod(target.value as UserOpportunitiesDiscoveryMethod);
    }

    const handleCancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
    }

    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg px-8 py-6">
            <Show when={fetchError()}>
                <div class="w-full text-center py-8">
                    <div class="text-red-600 mb-4">
                        <Icon icon="mdi:alert-circle" width={64} height={64} />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Error</h3>
                    <p class="text-gray-600 mb-6">{fetchError()}</p>
                    <div class="flex justify-center">
                        <button class="btn btn-primary" onClick={handleCancel}>
                            Go Back
                        </button>
                    </div>
                </div>
            </Show>

            <Show when={success()}>
                <div class="w-full text-center py-8">
                    <div class="text-green-600 mb-4">
                        <Icon icon="mdi:check-circle" width={64} height={64} />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p class="text-gray-600 mb-6">Opportunity has been updated successfully.</p>
                    <div class="flex justify-center gap-4">
                        <button class="btn btn-primary" onClick={handleCancel}>
                            Close
                        </button>
                    </div>
                </div>
            </Show>

            <Show when={!fetchError() && !success() && currentOpportunity()}>
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Update Opportunity</h2>
                    <Show when={discoveryMethod()}>
                        <p class="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                            {discoveryMethod()?.helperText}
                        </p>
                    </Show>
                </div>

                <form use:form class="space-y-8">
                    {/* Title Field */}
                    <div class="form-control">
                        <label class="input input-neutral flex w-full items-center gap-2">
                            <Icon icon="mdi:format-title" width={20} height={20} class="text-gray-400" />
                            <input
                                type="text"
                                name="title"
                                class="grow"
                                placeholder="Name of the opportunity"
                                aria-label="Give this opportunity a name"
                            />
                        </label>
                        <Show when={errors().title && touched().title}>
                            <span class="text-sm text-red-600 mt-1">{errors().title}</span>
                        </Show>
                    </div>

                    {/* Description Field */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Add a description</span>
                        </label>
                        <textarea
                            name="description"
                            class="textarea textarea-neutral w-full h-24"
                            placeholder="Describe the opportunity in detail..."
                            aria-label="describe the opportunity"
                        />
                        <Show when={errors().description && touched().description}>
                            <span class="text-sm text-red-600 mt-1">{errors().description}</span>
                        </Show>
                    </div>

                    {/* Discovery Method Field */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Method of discovery</span>
                        </label>
                        <select
                            class="select select-neutral w-full"
                            name="discovery_method"
                            onChange={handleDiscoveryMethodChange}
                            aria-label="Approach for discovering this opportunity, select one"
                        >
                            <option disabled value="">Select a discovery method</option>
                            <For each={discoveryMethodOptions}>
                                {option => (
                                    <option
                                        value={option.value}
                                        selected={option.value === currentOpportunity()?.discovery_method}
                                    >
                                        {option.label}
                                    </option>
                                )}
                            </For>
                        </select>
                        <Show when={errors().discovery_method && touched().discovery_method}>
                            <span class="text-sm text-red-600 mt-1">{errors().discovery_method}</span>
                        </Show>
                    </div>

                    {/* Observation Type Field - Conditionally shown */}
                    <Show when={observationTypes().length > 0}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Observation Type</span>
                            </label>
                            <select class="select select-neutral w-full" name="observation_type" aria-label="what type of opportunity is this, select most relevant">
                                <option disabled value="">Select observation type</option>
                                <For each={observationTypes()}>
                                    {type => (
                                        <option
                                            value={type.value}
                                            selected={type.value === currentOpportunity()?.observation_type}
                                        >
                                            {type.label}
                                        </option>
                                    )}
                                </For>
                            </select>
                            <Show when={errors().observation_type && touched().observation_type}>
                                <span class="text-sm text-red-600 mt-1">{errors().observation_type}</span>
                            </Show>
                        </div>
                    </Show>

                    {/* Category Field */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Select the most relevant problem category</span>
                        </label>
                        <select class="select select-neutral w-full" name="category" aria-label="Slect a problem category related to the opportunity">
                            <option disabled value="">Select a category</option>
                            <For each={categoryOptions}>
                                {category => (
                                    <option
                                        value={category.value}
                                        selected={category.value === currentOpportunity()?.category}
                                    >
                                        {category.label}
                                        <Show when={category.helperText}>
                                            <span class="text-xs text-gray-500 ml-2">- {category.helperText}</span>
                                        </Show>
                                    </option>
                                )}
                            </For>
                        </select>
                        <Show when={errors().category && touched().category}>
                            <span class="text-sm text-red-600 mt-1">{errors().category}</span>
                        </Show>
                    </div>

                    {/* Goal Alignment Field */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">How aligned is this opportunity with your goals?</span>
                        </label>
                        <select class="select select-neutral w-full" name="goal_alignment" aria-label="How aligned is this opportunity with your goals, Select relevant option">
                            <option disabled value="">Select level of alignment</option>
                            <For each={alignmentWithGoalsOptions}>
                                {alignment => (
                                    <option
                                        value={alignment.value}
                                        selected={alignment.value === currentOpportunity()?.goal_alignment}
                                    >
                                        {alignment.label}
                                        <Show when={alignment.helperText}>
                                            <span class="text-xs text-gray-500 ml-2">- {alignment.helperText}</span>
                                        </Show>
                                    </option>
                                )}
                            </For>
                        </select>
                        <Show when={errors().goal_alignment && touched().goal_alignment}>
                            <span class="text-sm text-red-600 mt-1">{errors().goal_alignment}</span>
                        </Show>
                    </div>

                    {/* Action Buttons */}
                    <div class="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            class="btn btn-outline"
                            onClick={handleCancel}
                            disabled={isSubmitting()}
                            aria-label="cancel form"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isSubmitting()}
                            aria-label="submit form data"
                        >
                            <Show when={isSubmitting()} fallback={
                                <>
                                    <Icon icon="mdi:content-save" width={20} height={20} class="mr-2" />
                                    Update Opportunity
                                </>
                            }>
                                <span class="loading loading-spinner loading-sm mr-2"></span>
                                Updating...
                            </Show>
                        </button>
                    </div>
                </form>
            </Show>

            <Show when={!fetchError() && !success() && !currentOpportunity()}>
                <div class="w-full text-center py-8">
                    <div class="loading loading-spinner loading-lg text-primary"></div>
                    <p class="text-gray-600 mt-4">Loading opportunity data...</p>
                </div>
            </Show>
        </section>
    );
}