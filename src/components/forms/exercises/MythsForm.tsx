// components/forms/exercises/MythsForm.tsx
import { createSignal, Show, onMount } from "solid-js";
import { For } from "solid-js";
import { myths } from "../../../constants/exercises/myths.ts";
import { supabaseBrowserClient } from "../../../lib/supabase/client.ts";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth.ts";
import { profileStore } from "../../../stores/profile.ts";
import { notify } from "../../../stores/notifications.ts";
import { saveFormAndMarkCompleted } from "../../../stores/progress.ts";

interface ComponentProps {
    contentMetaId: string;
}
const supabase = supabaseBrowserClient;

const MythBustingForm = (props: ComponentProps) => {
    const session = useStore(authStore);
    const [responses, setResponses] = createSignal<{ [key: string]: boolean }>({});
    const [submitted, setSubmitted] = createSignal(false);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal("");
    const [success, setSuccess] = createSignal(false);

    // Initialize all responses to false
    onMount(() => {
        const initialResponses: { [key: string]: boolean } = {};
        myths.forEach(myth => {
            initialResponses[myth.statement] = false;
        });
        setResponses(initialResponses);
    });

    const handleResponseChange = (statement: string, isTrue: boolean) => {
        setResponses({ ...responses(), [statement]: isTrue });
    };

    const submitResponses = async () => {
        setLoading(true);
        setError("");

        try {
            const user = session()?.user;
            if (!user) throw new Error("You must be logged in to save your responses");

            const { data: updatedProfile, error: uploadError } = await supabase
                .from("user_profiles")
                .update({
                    myths: responses(),
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", user.id).select().single();

            if (uploadError) throw uploadError;

            if (updatedProfile) {
                profileStore.set(updatedProfile);
                notify.success("Your myths have been added to your profile", "Success!")
            }

            // Save progress if needed (similar to your reference component)
            await saveFormAndMarkCompleted(props.contentMetaId);

            setSubmitted(true);
            setSuccess(true);
        } catch (err) {
            console.error("Error saving myth responses:", err);
            setError(err instanceof Error ? err.message : JSON.stringify(err));
            notify.error("Something went wrong", "Failed!")
        } finally {
            setLoading(false);
        }
    };

    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg p-8">

            <Show
                when={!success()}
                fallback={
                    <div class="p-6 text-center">
                        <div class="text-green-500 text-2xl mb-4">✓</div>
                        <h3 class="text-xl font-bold mb-2">Success!</h3>
                        <p class="mb-4">Your myth responses have been saved.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            class="btn btn-neutral"
                        >
                            Edit Again
                        </button>
                    </div>
                }
            >
                <h2 class="text-2xl font-bold">Entrepreneurship Myths</h2>
                <For each={myths}>
                    {(myth) => (
                        <div class="card py-4">
                            <div class="form-control">
                                <label class="label cursor-pointer flex justify-between gap-4">
                                    <span class="label-text text-neutral text-lg">{myth.statement}</span>
                                    <div class="flex items-center gap-2">
                                        <span>False</span>
                                        <input
                                            type="checkbox"
                                            class="toggle toggle-primary"
                                            checked={responses()[myth.statement]}
                                            onChange={(e) =>
                                                handleResponseChange(myth.statement, e.target.checked)
                                            }
                                            disabled={submitted()}
                                        />
                                        <span>True</span>
                                    </div>
                                </label>

                                <Show when={submitted()}>
                                    <div class="mt-4">
                                        <div class={`alert ${responses()[myth.statement] === myth.isTrue ? 'alert-success' : 'alert-error'}`}>
                                            {responses()[myth.statement] === myth.isTrue ? (
                                                <span>✓ Correct!</span>
                                            ) : (
                                                <span>✗ Incorrect</span>
                                            )}
                                        </div>
                                        <div class="mt-2 p-4 bg-base-200 rounded-lg">
                                            <p class="font-medium">Explanation:</p>
                                            <p>{myth.explanation}</p>
                                        </div>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    )}
                </For>

                <button
                    onClick={submitResponses}
                    class="btn btn-primary btn-outline w-full mt-4"
                    disabled={loading()}
                >
                    {loading() ? (
                        <span class="loading loading-spinner loading-xs mr-3"></span>
                    ) : null}
                    Submit Answers
                </button>
            </Show>
        </section>
    );
};

export default MythBustingForm;