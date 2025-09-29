import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "src/stores/auth";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { saveFormAndMarkCompleted } from '../../../stores/progress';
import { createOpportunity } from "src/stores/userAssets/opportunities";
import { type DiscoveryMethodOption, discoveryMethodOptions, categoryOptions, alignmentWithGoalsOptions } from "../../../constants/exercises/opportunities"
import type { Database } from "../../../../database.types";
import type { UserOpportunitiesStatus, UserOpportunitiesDiscoveryMethod } from "../../../../types/urgeTypes";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['user_opportunities']['Insert'];

// Refined schema with proper validation
const schema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
    discovery_method: z.string().min(1, "Discovery method is required"),
    observation_type: z.string().min(1, "Observation type is required"),
    category: z.string().min(1, "Category is required"),
    goal_alignment: z.string().min(1, "Goal alignment is required"),
});

interface ComponentProps {
    contentMetaId?: string;
    approach?: UserOpportunitiesDiscoveryMethod;
    onSuccess?: () => void;
}

export default function OpportunityForm(props: ComponentProps) {
    // Store
    const $session = useStore(authStore);
    const [userId, setUserId] = createSignal<string | null>(null);
    const [discoveryMethod, setDiscoveryMethod] = createSignal<DiscoveryMethodOption | null>(null)
    const [savedOpportunity, setSavedOpportunity] = createSignal<Opportunity | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [observationTypes, setObservationTypes] = createSignal<{ value: string; label: string; helperText: string, example?: string }[]>([]);

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

    createEffect(() => {
        //get and set discovery method
        if (props.approach) {
            getDiscoveryMethod(props.approach)
        }
        // get User
        if (!$session() || !$session().loading) return;
        const user = $session().user;
        if (user) {
            setUserId(user.id)
        }
    })

    const { form, data, errors, isSubmitting, touched, reset } = createForm({
        initialValues: {
            category: "",
            description: "",
            discovery_method: props.approach || "",
            goal_alignment: "",
            observation_type: "",
            title: "",
        },
        onSubmit: async (values) => {
            setLoading(true);
            const supabase = supabaseBrowserClient;
            try {
                if (userId()) {
                    const currentDate = new Date();
                    const status: UserOpportunitiesStatus = "added";
                    const newOpportunityPayload: OpportunityInsert = {
                        category: values.category,
                        description: values.description,
                        discovery_method: values.discovery_method as UserOpportunitiesDiscoveryMethod,
                        goal_alignment: values.goal_alignment,
                        observation_type: values.observation_type,
                        title: values.title,
                        created_at: currentDate.toISOString(),
                        status: status,
                        user_id: userId()
                    }
                    const { success, data, error } = await createOpportunity(newOpportunityPayload);

                    if (data && success) {
                        setSavedOpportunity(data);
                        notify.success("A new opportunity was added.", "Success!");
                        if (props.onSuccess) {
                            props.onSuccess();
                        }
                    }
                    if (error) {
                        throw error;
                    }

                } else {
                    notify.error("No user found! Please retry after logging in", "Fail");
                }

            } catch (error) {
                console.error("Error saving opportunity:", error);
                notify.error("Something went wrong at our end. Please try saving the opportunity again", "Failed");
            } finally {
                setLoading(false);
            }
        },
        extend: validator({ schema })
    })

    const resetForm = () => {
        setSuccess(false);
        reset();
        setDiscoveryMethod(null);
        setSavedOpportunity(null);
        setObservationTypes([]);
    }

    const handleDiscoveryMethodChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        getDiscoveryMethod(target.value as UserOpportunitiesDiscoveryMethod);
    }

    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg px-8 py-6">
            <Show when={success()}>
                <div class="w-full text-center py-8">
                    <div class="text-green-600 mb-4">
                        <Icon icon="mdi:check-circle" width={64} height={64} />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p class="text-gray-600 mb-6">New opportunity has been added successfully. We will be working further on opportunities you have saved in future milestones. You can find saved opportunities <a href="/assets/opportunities/" target="_blank">here</a></p>
                    <div class="flex justify-center">
                        <button class="btn btn-primary btn-outline" onClick={resetForm}>
                            <Icon icon="mdi:plus" width={20} height={20} class="mr-2" />
                            Add Another Opportunity
                        </button>
                    </div>
                </div>
            </Show>

            <Show when={!success()}>
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Add a New Opportunity</h2>
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
                            />
                        </label>
                        <Show when={errors().title && touched().title}>
                            <span class="text-sm text-red-600 mt-1">{errors().title}</span>
                        </Show>
                    </div>

                    {/* Description Field */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Add a decsription</span>
                        </label>
                        <textarea
                            name="description"
                            class="textarea textarea-neutral w-full h-24"
                            placeholder="Describe the opportunity in detail..."
                        />
                        <Show when={errors().description && touched().description}>
                            <span class="text-sm text-red-600 mt-1">{errors().description}</span>
                        </Show>
                    </div>

                    <Show when={!props.approach}>
                        {/* Discovery Method Field */}
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Method of discovery</span>
                            </label>
                            <select
                                class="select select-neutral w-full"
                                name="discovery_method"
                                onChange={handleDiscoveryMethodChange}
                            >
                                <option disabled selected value="">Select a discovery method</option>
                                <For each={discoveryMethodOptions}>
                                    {option => <option value={option.value} selected={option.value === props.approach}>{option.label}</option>}
                                </For>
                            </select>
                            <Show when={errors().discovery_method && touched().discovery_method}>
                                <span class="text-sm text-red-600 mt-1">{errors().discovery_method}</span>
                            </Show>
                        </div>
                    </Show>

                    {/* Observation Type Field - Conditionally shown */}
                    <Show when={observationTypes().length > 0}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Observation Type</span>
                            </label>
                            <select class="select select-neutral w-full" name="observation_type">
                                <option disabled selected value="">Select observation type</option>
                                <For each={observationTypes()}>
                                    {type => <option value={type.value}>{type.label}</option>}
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
                        <select class="select select-neutral w-full" name="category">
                            <option disabled selected value="">Select a category</option>
                            <For each={categoryOptions}>
                                {category => (
                                    <option value={category.value}>
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
                        <select class="select select-neutral w-full" name="goal_alignment">
                            <option disabled selected value="">Select level of alignment</option>
                            <For each={alignmentWithGoalsOptions}>
                                {alignment => (
                                    <option value={alignment.value}>
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

                    {/* Submit Button */}
                    <div class="flex justify-end pt-4">
                        <button
                            type="submit"
                            class="btn btn-primary btn-outline"
                            disabled={isSubmitting()}
                        >
                            <Show when={isSubmitting()} fallback={
                                <>
                                    <Icon icon="mdi:content-save" width={20} height={20} class="mr-2" />
                                    Save Opportunity
                                </>
                            }>
                                <span class="loading loading-spinner loading-sm mr-2"></span>
                                Saving...
                            </Show>
                        </button>
                    </div>
                </form>
            </Show>
        </section>
    )
}