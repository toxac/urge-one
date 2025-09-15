import { createSignal, createEffect, Show, createMemo } from "solid-js";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { supabaseBrowserClient } from "../../../lib/supabase/client.ts";
import { z } from "zod";
import { notify } from "../../../stores/notifications.ts";
import { useStore } from "@nanostores/solid";
import { profileStore } from "../../../stores/profile.ts";
import { saveFormAndMarkCompleted } from "../../../stores/progress.ts";
import { authStore } from "../../../stores/auth.ts";
import { type User } from "@supabase/supabase-js";


const supabase = supabaseBrowserClient;

// Zod schema for validation
const schema = z.object({
    motivation_statement: z.string()
        .min(10, "Must complete the sentence with at least 10 characters")
        .max(200, "Keep it concise (under 200 characters)"),
    motivation_emotions: z.array(z.string())
        .min(1, "Select at least one emotional driver")
        .max(3, "Select no more than 3 drivers"),
    motivation_perfect_day: z.string()
        .min(50, "Describe at least 50 characters to paint a clear picture")
        .max(500, "Keep it under 500 characters"),
    motivation_deal_breakers: z.string()
        .min(20, "Describe at least 20 characters")
        .max(300, "Keep it under 300 characters")
});

type FormValues = z.infer<typeof schema>;

// Emotion options array
const emotionOptions = [
    "Freedom", "Achievement", "Security", "Recognition",
    "Growth", "Belonging", "Impact", "Other"
] as const;

interface FormProps {
    contentMetaId: string;
}

export default function MotivationForm(props: FormProps) {
    // Application store
    const session = useStore(authStore);
    const profile = useStore(profileStore);
    // Component store
    const [customEmotion, setCustomEmotion] = createSignal("");
    const [error, setError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [user, setUser] = createSignal<User | null>(null)

    createEffect(() => {
        const user = session().user;
        if (user) {
            setUser(user);
        }
    })


    const hasExistingValues = createMemo(() => {
        const currentProfile = profile();
        return (
            currentProfile?.motivation_statement ||
            currentProfile?.motivation_emotions?.length ||
            currentProfile?.motivation_perfect_day ||
            currentProfile?.motivation_deal_breakers
        );
    });

    const { form, data, errors, setFields } = createForm<FormValues>({
        initialValues: {
            motivation_statement: profile()?.motivation_statement || "",
            motivation_emotions: profile()?.motivation_emotions || [],
            motivation_perfect_day: profile()?.motivation_perfect_day || "",
            motivation_deal_breakers: profile()?.motivation_deal_breakers || ""
        },
        onSubmit: async (values: FormValues) => {
            setIsSubmitting(true);
            try {
                // update the user_profiles tables
                console.log({ values: values, user: user()?.id })
                const { data: profileData, error: updateError } = await supabase
                    .from("user_profiles")
                    .update(values)
                    .eq('user_id', user()?.id)
                    .select()
                    .single()
                if (updateError) {
                    throw updateError;
                }
                // Updated Form Status and Mark progress Status complete
                const { data: progressData, error: progressError } = await saveFormAndMarkCompleted(props.contentMetaId);

                if (progressError) {
                    throw progressError;
                }
                if (progressData) {
                    console.log(progressData)
                }
                // sync profileStore with updated profile data
                profileStore.set(profileData);
                setIsSubmitting(false);
                setSuccess(true);
                notify.success("Your motivations have been saved!", "Success!");
            } catch (error: unknown) {
                let errorMessage: string;
                // Type guard to check if it's an Error object
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                // Additional check for Supabase errors which might have a different structure
                else if (typeof error === 'object' && error !== null && 'message' in error) {
                    errorMessage = (error as { message: string }).message;
                }
                else {
                    errorMessage = 'An unknown error occurred while updating the profile';
                }
                console.error('Update error:', JSON.stringify(error, null, 2));
                setError(errorMessage);
                notify.error("Something went wrong", "Failed!");
                setIsSubmitting(false);
            }
        },
        extend: validator({ schema }),
    });

    // initialize data from profileStore
    createEffect(() => {
        const currentProfile = profile();
        if (currentProfile) {
            setFields({
                motivation_statement: currentProfile.motivation_statement || "",
                motivation_emotions: currentProfile.motivation_emotions || [],
                motivation_perfect_day: currentProfile.motivation_perfect_day || "",
                motivation_deal_breakers: currentProfile.motivation_deal_breakers || ""
            });
        }
    })

    // Handle custom emotion addition
    const addCustomEmotion = () => {
        if (customEmotion().trim()) {
            setFields("motivation_emotions", (prev: string[]) => [...prev, customEmotion().trim()]);
            setCustomEmotion("");
        }
    };

    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg p-8">
            <Show when={success()}>
                <h3>Success!</h3>
                <p class="prose prose-lg">
                    Your motivations have been saved. These motivations will be listed and your profile and are private. To continue to next step in this milestone click on next button.
                </p>
            </Show>
            <Show when={!success()}>
                <h3>Discover Your Motivation</h3>
                <form use:form class="flex flex-col gap-8">
                    {/* Core Statement */}
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-neutral">
                                "I want to start a business because fundamentally I need to ______."
                            </span>
                        </div>
                        <input
                            type="text"
                            class="input input-neutral w-full"
                            name="motivation_statement"
                            placeholder="Complete this sentence..."
                        />
                        {errors().motivation_statement && (
                            <div class="label">
                                <span class="label-text-alt text-sm text-red-700">
                                    {errors().motivation_statement}
                                </span>
                            </div>
                        )}
                    </label>

                    {/* Emotional Drivers */}
                    <fieldset class="form-control">
                        <legend class="label">
                            <span class="label-text text-neutral">
                                When you imagine succeeding, which emotions feel most important to you? (Select up to 3)
                            </span>
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {emotionOptions.map((opt) => (
                                <label class="label cursor-pointer justify-start gap-2">
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-neutral checkbox-sm"
                                        name="motivation_emotions"
                                        value={opt}
                                        checked={data().motivation_emotions?.includes(opt)}
                                    />
                                    <span class="label-text text-neutral">{opt}</span>
                                </label>
                            ))}
                        </div>
                        {errors().motivation_emotions && (
                            <div class="label">
                                <span class="label-text-alt text-sm text-red-700">
                                    {errors().motivation_emotions}
                                </span>
                            </div>
                        )}

                        {/* Custom Emotion */}
                        {data().motivation_emotions?.includes("Other") && (
                            <div class="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    class="input input-neutral"
                                    placeholder="Specify your emotion"
                                    value={customEmotion()}
                                    onInput={(e) => setCustomEmotion(e.currentTarget.value)}
                                />
                                <button
                                    type="button"
                                    class="btn btn-sm btn-neutral"
                                    onClick={addCustomEmotion}
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </fieldset>

                    {/* Perfect Day Visualization */}
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-neutral">
                                Describe what a perfect day looks like 5 years after starting your business:
                            </span>
                        </div>
                        <textarea
                            class="textarea textarea-neutral h-32 w-full"
                            name="motivation_perfect_day"
                            placeholder="Focus on how you feel and what you're doing, not what the business is..."
                        ></textarea>
                        {errors().motivation_perfect_day && (
                            <div class="label">
                                <span class="label-text-alt text-sm text-red-700">
                                    {errors().motivation_perfect_day}
                                </span>
                            </div>
                        )}
                    </label>

                    {/* Dealbreakers */}
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-neutral">
                                What would make you walk away from a business idea, regardless of profitability?
                            </span>
                        </div>
                        <textarea
                            class="textarea textarea-neutral h-32 w-full"
                            name="motivation_deal_breakers"
                            placeholder="List your non-negotiables..."
                        ></textarea>
                        {errors().motivation_deal_breakers && (
                            <div class="label">
                                <span class="label-text-alt text-sm text-red-700">
                                    {errors().motivation_deal_breakers}
                                </span>
                            </div>
                        )}
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        class="btn btn-primary btn-outline mt-4 ml-auto mb-6"
                        disabled={isSubmitting()}
                    >
                        {isSubmitting() ? (
                            <p><span class="loading loading-spinner loading-xs mr-3"></span>
                                {hasExistingValues() ? 'Updating' : 'Saving'}
                            </p>
                        ) : (
                            <p>{hasExistingValues() ? 'Update My Motivations' : 'Save My Motivations'}</p>
                        )}
                    </button>
                </form>
            </Show>

        </section>
    );
}
