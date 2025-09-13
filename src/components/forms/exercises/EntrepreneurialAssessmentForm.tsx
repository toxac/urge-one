// components/forms/exercises/EntrepreneurialAssessmentForm.tsx
import { createSignal, Show, onMount } from "solid-js";
import { For } from "solid-js";
import { supabaseBrowserClient } from "@lib/supabase/client.ts";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth.ts";
import { profileStore } from "../../../stores/profile.ts";
import { notify } from "../../../stores/notifications.ts";
import { saveFormAndMarkCompleted } from "../../../stores/progress.ts";
import { assessmentQuestions } from '../../../constants/exercises/assessmentQuestions';
import { type Database } from "../../../../database.types";

type ProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

interface ComponentProps {
    contentMetaId: string;
}

const supabase = supabaseBrowserClient;

const EntrepreneurialAssessmentForm = (props: ComponentProps) => {
    const session = useStore(authStore);
    const [responses, setResponses] = createSignal<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal("");
    const [success, setSuccess] = createSignal(false);

    // Initialize all responses to default value (3)
    onMount(() => {
        const initialResponses: { [key: number]: number } = {};
        assessmentQuestions.forEach(question => {
            initialResponses[question.id] = 3; // Default rating of 3
        });
        setResponses(initialResponses);
    });

    const handleResponseChange = (questionId: number, rating: number) => {
        setResponses({ ...responses(), [questionId]: rating });
    };

    // Calculate total scores by attribute
    const calculateAttributeScores = () => {
        const attributeScores: { [key: string]: { total: number; count: number; average: number } } = {};

        assessmentQuestions.forEach(question => {
            if (!attributeScores[question.attribute]) {
                attributeScores[question.attribute] = { total: 0, count: 0, average: 0 };
            }
            attributeScores[question.attribute].total += responses()[question.id] || 0;
            attributeScores[question.attribute].count += 1;
        });

        // Calculate averages
        Object.keys(attributeScores).forEach(attribute => {
            const scoreData = attributeScores[attribute];
            scoreData.average = Math.round((scoreData.total / scoreData.count) * 10) / 10;
        });

        return attributeScores;
    };

    // Format the scores for saving to database (only totals and averages)
    const formatScoresForDatabase = () => {
        const attributeScores = calculateAttributeScores();
        const formattedScores: { [key: string]: { total: number; average: number } } = {};

        Object.keys(attributeScores).forEach(attribute => {
            const { total, average } = attributeScores[attribute];
            formattedScores[attribute] = { total, average };
        });

        return formattedScores;
    };

    const submitResponses = async () => {
        setLoading(true);
        setError("");

        try {
            const user = session()?.user;
            if (!user) throw new Error("You must be logged in to save your responses");

            // Calculate and format the attribute scores for saving
            const attributeScores = formatScoresForDatabase();

            const assessmentPayload: ProfileUpdate = {
                entrepreneurial_assessment: attributeScores, // Save only attribute scores, not individual responses
                updated_at: new Date().toISOString()
            }

            const { data: updatedProfile, error: uploadError } = await supabase
                .from("user_profiles")
                .update(assessmentPayload)
                .eq("user_id", user.id)
                .select()
                .single();

            if (uploadError) throw uploadError;

            if (updatedProfile) {
                profileStore.set(updatedProfile);
                notify.success("Your assessment scores have been saved to your profile", "Success!");
            }

            // Save progress
            await saveFormAndMarkCompleted(props.contentMetaId);

            setSubmitted(true);
            setSuccess(true);
        } catch (err) {
            console.error("Error saving assessment responses:", err);
            setError(err instanceof Error ? err.message : JSON.stringify(err));
            notify.error("Something went wrong", "Failed!");
        } finally {
            setLoading(false);
        }
    };

    // Format attribute names for display
    const formatAttributeName = (attribute: string) => {
        return attribute.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get rating description for display
    const getRatingDescription = (rating: number) => {
        const descriptions = {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Neutral",
            4: "Agree",
            5: "Strongly Agree"
        };
        return descriptions[rating as keyof typeof descriptions] || "Not rated";
    };

    // Get display scores for the success screen
    const getDisplayScores = () => {
        const attributeScores = calculateAttributeScores();
        const displayScores: { [key: string]: number } = {};

        Object.keys(attributeScores).forEach(attribute => {
            displayScores[attribute] = attributeScores[attribute].average;
        });

        return displayScores;
    };

    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg p-8">

            <Show
                when={!success()}
                fallback={
                    <div class="p-6">
                        <div class="text-center">
                            <div class="text-green-500 text-2xl mb-4">✓</div>
                            <h3 class="text-xl font-bold mb-2">Assessment Complete!</h3>
                            <p class="mb-6">Your entrepreneurial assessment scores have been saved.</p>
                        </div>

                        {/* Attribute Scores Summary */}
                        <div class="mt-6 p-6 bg-base-200 rounded-lg">
                            <h4 class="font-bold text-lg mb-4 text-center">Your Entrepreneurial Attribute Scores</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {Object.entries(getDisplayScores()).map(([attribute, averageScore]) => (
                                    <div class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                                        <span class="font-medium">{formatAttributeName(attribute)}:</span>
                                        <div class="flex items-center gap-2">
                                            <span class="text-lg font-bold">{averageScore}/5</span>
                                            <div class="radial-progress bg-base-200 border-4 border-base-200"
                                                style={`--value:${(averageScore / 5) * 100}; --size:2.5rem; --thickness: 3px;`}>
                                                <span class="text-xs">{Math.round((averageScore / 5) * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Responses */}
                        <div class="mt-6">
                            <h4 class="font-bold text-lg mb-4 text-center">Your Responses</h4>
                            <div class="space-y-4">
                                <For each={assessmentQuestions}>
                                    {(question) => (
                                        <div class="card p-4 bg-base-100 shadow-sm">
                                            <div class="flex justify-between items-start">
                                                <div class="flex-1">
                                                    <p class="font-medium text-sm mb-1">{question.text}</p>
                                                    <span class="text-xs text-gray-500 capitalize">
                                                        {formatAttributeName(question.attribute)}
                                                    </span>
                                                </div>
                                                <div class="text-right ml-4">
                                                    <div class="badge badge-primary badge-lg">
                                                        {responses()[question.id]}/5
                                                    </div>
                                                    <p class="text-xs text-gray-600 mt-1">
                                                        {getRatingDescription(responses()[question.id])}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>

                        <div class="flex justify-end mt-8">
                            <button
                                onClick={() => setSuccess(false)}
                                class="btn btn-neutral btn-outline"
                            >
                                Edit Assessment
                            </button>
                        </div>
                    </div>
                }
            >
                <h2 class="text-2xl font-bold mb-6">Entrepreneurial Self-Assessment</h2>
                <p class="text-sm text-gray-600 mb-6">
                    Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)
                </p>

                <div class="space-y-6">
                    <For each={assessmentQuestions}>
                        {(question) => (

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-neutral text-lg font-medium">
                                        {question.text}
                                    </span>
                                </label>

                                <div class="flex flex-col gap-4 mt-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={responses()[question.id]}
                                        onInput={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                                        class="range range-primary w-full"
                                        disabled={submitted()}
                                    />
                                    <div class="w-full flex justify-between text-xs px-1">
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                    </div>

                                </div>

                                <div class="mt-2">
                                    <span class="text-xs text-gray-500 capitalize">
                                        Attribute: {formatAttributeName(question.attribute)}
                                    </span>
                                </div>
                            </div>

                        )}
                    </For>
                </div>

                <Show when={error()}>
                    <div class="alert alert-error mt-6">
                        <span>{error()}</span>
                    </div>
                </Show>

                <div class="flex justify-end">
                    <button
                        onClick={submitResponses}
                        class="btn btn-primary btn-outline mt-8"
                        disabled={loading() || submitted()}
                    >
                        {loading() ? (
                            <span class="loading loading-spinner loading-xs mr-3"></span>
                        ) : null}
                        {submitted() ? "Submitted" : "Submit Assessment"}
                    </button>
                </div>
            </Show>
        </section>
    );
};

export default EntrepreneurialAssessmentForm;