// OpportunitiesApp.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { questionsStore, deleteQuestion, questionsStoreLoading } from "../../../stores/userAssets/questions";
import { notify } from "../../../stores/notifications";
import { getTimeDifference } from "../../../lib/content/dateUtils";
import AddNote from "../actions/AddNote";
import Modal from "../../appFeedback/Modal";

import type { Database } from "../../../../database.types";

type Question = Database['public']['Tables']['user_questions']['Row'];

export default function NoteList() {

    const $questions = useStore(questionsStore);
    const $questionsLoading = useStore(questionsStoreLoading);

    const [showModal, setShowModal] = createSignal(false);
    const [questions, setQuestions] = createSignal<Question[] | []>([]);
    const [editingQuestion, setEditingQuestion] = createSignal<Question | null> (null)
    const [loading, setLoading] = createSignal(false);

    createEffect(() => {
        if ($questionsLoading()) {
            setLoading(true)
            return;
        } else {
            const loadedQuestions = $questions();
            setQuestions(loadedQuestions)
            setLoading(false);
        }
    })

    const handleEdit = async(selectedQuestion: Question) =>{
        setEditingQuestion(selectedQuestion);
        setShowModal(true);

    }

    const handleDelete = async(selectedQuestion: Question) =>{
        try {
            const {success, error} = await deleteQuestion(selectedQuestion.id);
            if(error) throw error;
            if(success){
                notify.success(`Note: ${selectedQuestion.title} deleted`, "Success");
            }
        } catch (error) {
            console.error(error);
            notify.error("Note could not be deleted", "Failed.");
        }
    }


    const handleFormSuccess = () => {
        setShowModal(false);
    };

    return (
        <div class="w-full mx-auto px-4 py-8">
            {/* Loading State */}
            <Show when={loading()}>
                <div class="flex justify-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </Show>
            {/* No Notes */}
            <Show when={questions().length == 0 && !loading()}>
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} />
                    </div>
                    <h3 class="text-xl font-semibold mb-2">You have no notes saved.</h3>
                    <p class="text-gray-600 mb-6">You can add notes to program content or resources. Note button is on top right of all the pages.</p>
                </div>
            </Show>
            {/* Notes Grid {
    content: string | null;
    content_type: string | null;
    created_at: string;
    id: number;
    is_public: boolean | null;
    reference_table: string | null;
    reference_url: string | null;
    related_content_id: string | null;
    status: string | null;
    title: string | null;
    user_id: string | null;
} */}
            <Show when={questions().length > 0 && !loading()}>
                <div class="grid grid-cols-1 gap-4">
                    <For each={questions()}>
                        {(note) => (
                            <div class="shadow-lg px-8 py-4 mt-8">
                                <div class="flex justify-between items-start">
                                    <div class="badge badge-sm badge-outline capitalize mb-4">{note.content_type}</div>
                                    <div class="text-sm">{getTimeDifference(note.created_at)}</div>
                                </div>

                                <p class="text-md mb-2 capitalize">{note.title}</p>
                                <p class="text-sm">{note.content}</p>
                                <div class="flex justify-end items-end mt-4">
                                    <button class="btn btn-ghost btn-circle" onClick={() => handleDelete(note)}>
                                        <Icon icon="mdi-delete-outline" class="text-lg" />
                                    </button>
                                    <button class="btn btn-ghost btn-circle" onClick={()=> handleEdit(note)}>
                                                    <Icon icon="mdi-edit-outline" class="text-lg" />
                                                </button>
                                    <a class="btn btn-ghost btn-circle" href={note.reference_url}>
                                        <Icon icon="mdi:arrow-top-right-thick" class="text-lg" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </For>
                </div>

            </Show>
        </div>
    );
}