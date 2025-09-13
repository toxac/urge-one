import { createSignal, createEffect, createMemo, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth.ts";
import { accomplishmentStore, manageAccomplishments } from "../../../stores/userAssets.ts";
import { supabaseBrowserClient } from "../../../lib/supabase/client.ts";
import { type Database } from "../../../../database.types.ts";

type AccomplishmentRow = Database['public']['Tables']['accomplishments']['Row'];
type UserAccomplishmentRow = Database['public']['Tables']['user_accomplishments']['Row'];
type UserAccomplishmentInsert = Database['public']['Tables']['user_accomplishments']['Insert'];

interface AccomplishmentProps {
    accomplishmentId: number;
    contentMetaId: string;
}

const supabase = supabaseBrowserClient;

export default function Accomplishments(props: AccomplishmentProps) {

    const $session = useStore(authStore);
    const $userAccomplishments = useStore(accomplishmentStore)
    const user = $session()?.user;

    const [showAccomplishmentModal, setShowAccomplishmentModal] = createSignal(false);
    const [accomplishmentDetails, setAccomplishmentDetails] = createSignal<AccomplishmentRow | null>(null);
    const [isLoading, setIsLoading] = createSignal(!!props.accomplishmentId);
    const [error, setError] = createSignal<string | null>(null);
    const [hasRecorded, setHasRecorded] = createSignal(false); // To prevent duplicate recording

    const currentAccomplishment = createMemo(() => $userAccomplishments().find(c => c.accomplishment_id === props.accomplishmentId));

    // fetch accomplishment details from accomplishments
    createEffect(async () => {
        if (user && !accomplishmentDetails()) {
            setIsLoading(true);
            // fetch the acc
            try {
                const { data: accomplishmentData, error: fetchError } = await supabase
                    .from('accomplishments')
                    .select('*')
                    .eq('id', props.accomplishmentId)
                    .single();

                if (fetchError) {
                    throw new Error(`Failed to fetch accomplishment details: ${fetchError.message}`);
                }

                setAccomplishmentDetails(accomplishmentData);

            } catch (error) {
                console.error("Accomplishment component error:", error);
                setError("Failed to fetch accomplishment details from the database!");
            } finally {
                setIsLoading(false)
            }

        }
    })

    // Add accomplishment to user_accomplishments
    createEffect(async () => {
        if (accomplishmentDetails() && !hasRecorded()) {
            setIsLoading(true);
            // Add accomplishment to user_accomplishments
            const userAccomplishmentData: UserAccomplishmentInsert = {
                accomplishment_id: props.accomplishmentId,
                context_data: {
                    reference_id: props.contentMetaId,
                    reference_type: "content",
                    accomplishment_name: accomplishmentDetails()?.name,
                    accomplishment_points: accomplishmentDetails()?.points,
                    image_url: accomplishmentDetails()?.image_url,
                    description: accomplishmentDetails()?.description,
                    type: accomplishmentDetails()?.type
                },
                earned_at: new Date().toISOString(),
                user_id: user?.id
            }
            // check if user has not already earned this accomplishment
            if (!currentAccomplishment()) {
                try {
                    const { data: newUserAccomplishment, error: newUserAccomplishmentError } = await supabase.from('user_accomplishments')
                        .insert(userAccomplishmentData)
                        .select()
                        .single()

                    if (newUserAccomplishmentError) {
                        throw new Error(`Failed to fetch accomplishment details: ${newUserAccomplishmentError.message}`);
                    }

                    setHasRecorded(true);
                    manageAccomplishments("create", newUserAccomplishment);

                } catch (error) {
                    console.error("Accomplishment component error:", error);
                    setError("Failed to save accomplishment to the database!");
                } finally {
                    setShowAccomplishmentModal(true);
                    setIsLoading(false);
                }
            }
        }
    })

    const handleCloseModal = () => {
        setShowAccomplishmentModal(false);
    };

    return (
        <Show when={props.accomplishmentId}>
            <div class="accomplishment-container text-center my-8 p-4">
                <Show when={isLoading()}>
                    <p class="text-gray-600">Loading accomplishment...</p>
                </Show>
                <Show when={error()}>
                    <p class="text-red-500">Error: {error()}</p>
                </Show>

                {/* Accomplishment Modal */}
                <Show when={showAccomplishmentModal() && accomplishmentDetails()}>
                    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative transform transition-all duration-500 scale-100 opacity-100">
                            {/* Confetti effect placeholder */}
                            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                                {/* You'd integrate a confetti library here, e.g., react-confetti or a custom animation */}
                                <span class="text-9xl absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">🎉</span>
                                <span class="text-8xl absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 animate-pulse delay-100">✨</span>
                                <span class="text-7xl absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-200">🏆</span>
                            </div>

                            <button
                                onClick={handleCloseModal}
                                class="absolute top-4 right-4 bg-transparent border-none text-gray-600 text-3xl cursor-pointer hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full z-10"
                                aria-label="Close accomplishment modal"
                            >
                                &times;
                            </button>
                            <h2 class="text-5xl font-extrabold text-purple-700 mb-4 drop-shadow-lg">
                                Accomplishment Unlocked!
                            </h2>
                            <h3 class="text-3xl font-bold text-gray-800 mb-6">
                                {accomplishmentDetails()?.name}
                            </h3>
                            <div class="mb-6">
                                {/* Placeholder for accomplishment image */}
                                <img
                                    src={accomplishmentDetails()?.image_url || `https://placehold.co/150x150/8a2be2/ffffff?text=Badge`}
                                    alt={accomplishmentDetails()?.name || "Accomplishment Badge"}
                                    class="mx-auto w-36 h-36 rounded-full object-cover border-4 border-purple-400 shadow-lg"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/150x150/8a2be2/ffffff?text=Badge`;
                                    }}
                                />
                            </div>
                            <p class="text-lg text-gray-700 leading-relaxed">
                                {accomplishmentDetails()?.description || "You've achieved something great!"}
                            </p>
                        </div>
                    </div>
                </Show>

                {/* Inline Accomplishment Summary (after modal is closed) */}
                <Show when={!showAccomplishmentModal() && accomplishmentDetails()}>
                    <div class="inline-accomplishment-summary mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-center space-x-3">
                        <img
                            src={accomplishmentDetails()?.image_url || `https://placehold.co/40x40/8a2be2/ffffff?text=B`}
                            alt={accomplishmentDetails()?.name || "Accomplishment Badge"}
                            class="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/40x40/8a2be2/ffffff?text=B`;
                            }}
                        />
                        <p class="text-lg font-semibold text-purple-800">
                            You earned: {accomplishmentDetails()?.name}
                        </p>
                    </div>
                </Show>
            </div>
        </Show>
    );
}