// OpportunitiesApp.tsx
import { createSignal, createEffect, onMount, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { 
  questionsStore, 
  deleteQuestion, 
  questionsStoreLoading, 
  questionResponsesStoreLoading, 
  initializeQuestionResponses, 
  questionResponsesStore,
  getResponsesByQuestionId 
} from "../../../stores/userAssets/questions";
import { notify } from "../../../stores/notifications";
import { getTimeDifference } from "../../../lib/content/dateUtils";
import Modal from "../../appFeedback/Modal";

import type { Database } from "../../../../database.types";

type Question = Database['public']['Tables']['user_questions']['Row'];
type QuestionResponse = Database['public']['Tables']['user_question_responses']['Row'];

interface ComponentProps {
    userId: string;
}

export default function NoteList(props: ComponentProps) {
    const $questions = useStore(questionsStore);
    const $questionsLoading = useStore(questionsStoreLoading);
    const $responses = useStore(questionResponsesStore);
    const $responseLoading = useStore(questionResponsesStoreLoading);

    const [showModal, setShowModal] = createSignal(false);
    const [questions, setQuestions] = createSignal<Question[] | []>([]);
    const [editingQuestion, setEditingQuestion] = createSignal<Question | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [expandedQuestions, setExpandedQuestions] = createSignal<Set<number>>(new Set());

    createEffect(() => {
        if ($questionsLoading()) {
            setLoading(true);
            return;
        } else {
            const loadedQuestions = $questions();
            setQuestions(loadedQuestions);
            setLoading(false);
        }
    });

    // Load all responses when component mounts
    onMount(async () => {
        try {
            await initializeQuestionResponses(props.userId);
        } catch (error) {
            console.error("Failed to load responses:", error);
            notify.error("Failed to load responses", "Error");
        }
    });

    // Get responses for a specific question
    const getQuestionResponses = (questionId: number): QuestionResponse[] => {
        return getResponsesByQuestionId(questionId);
    };

    // Toggle question expansion to show/hide responses
    const toggleQuestionExpansion = (questionId: number) => {
        const expanded = new Set(expandedQuestions());
        if (expanded.has(questionId)) {
            expanded.delete(questionId);
        } else {
            expanded.add(questionId);
        }
        setExpandedQuestions(expanded);
    };

    const handleEdit = async (selectedQuestion: Question) => {
        setEditingQuestion(selectedQuestion);
        setShowModal(true);
    };

    const handleDelete = async (selectedQuestion: Question) => {
        try {
            const { success, error } = await deleteQuestion(selectedQuestion.id);
            if (error) throw error;
            if (success) {
                notify.success(`Note: ${selectedQuestion.title} deleted`, "Success");
            }
        } catch (error) {
            console.error(error);
            notify.error("Note could not be deleted", "Failed.");
        }
    };

    const handleFormSuccess = () => {
        setShowModal(false);
    };

    return (
        <div class="w-full mx-auto px-4 py-8">
            {/* Loading State */}
            <Show when={loading() || $responseLoading()}>
                <div class="flex justify-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </Show>

            {/* No Questions */}
            <Show when={questions().length == 0 && !loading()}>
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} />
                    </div>
                    <h3 class="text-xl font-semibold mb-2">You have no questions saved.</h3>
                    <p class="text-gray-600 mb-6">You can add questions to program content or resources.</p>
                </div>
            </Show>

            {/* Questions Grid */}
            <Show when={questions().length > 0 && !loading()}>
                <div class="grid grid-cols-1 gap-6">
                    <For each={questions()}>
                        {(question) => {
                            const responses = () => getQuestionResponses(question.id);
                            const isExpanded = () => expandedQuestions().has(question.id);
                            const hasResponses = () => responses().length > 0;

                            return (
                                <div class="shadow-lg px-8 py-6 mt-4 border border-gray-200 rounded-lg">
                                    {/* Question Header */}
                                    <div class="flex justify-between items-start mb-4">
                                        <div class="flex items-center gap-2">
                                            <div class="badge badge-sm badge-outline capitalize">
                                                {question.content_type}
                                            </div>
                                            <Show when={hasResponses()}>
                                                <div class="badge badge-sm badge-primary">
                                                    {responses().length} response{responses().length !== 1 ? 's' : ''}
                                                </div>
                                            </Show>
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            {getTimeDifference(question.created_at)}
                                        </div>
                                    </div>

                                    {/* Question Content */}
                                    <p class="text-md font-semibold mb-2 capitalize">{question.title}</p>
                                    <p class="text-sm text-gray-700 mb-4">{question.content}</p>

                                    {/* Responses Section */}
                                    <Show when={hasResponses()}>
                                        <div class="mt-4 border-t pt-4">
                                            <div class="flex items-center justify-between mb-3">
                                                <h4 class="text-sm font-semibold text-gray-700">Responses</h4>
                                                <button 
                                                    class="btn btn-ghost btn-xs"
                                                    onClick={() => toggleQuestionExpansion(question.id)}
                                                >
                                                    <Icon 
                                                        icon={isExpanded() ? "mdi:chevron-up" : "mdi:chevron-down"} 
                                                        class="text-lg" 
                                                    />
                                                    {isExpanded() ? 'Hide' : 'Show'} Responses
                                                </button>
                                            </div>

                                            <Show when={isExpanded()}>
                                                <div class="space-y-3">
                                                    <For each={responses()}>
                                                        {(response) => (
                                                            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                <div class="flex justify-between items-start mb-2">
                                                                    <div class="text-sm font-medium text-gray-700">
                                                                        Response
                                                                    </div>
                                                                    <div class="text-xs text-gray-500">
                                                                        {getTimeDifference(response.created_at)}
                                                                    </div>
                                                                </div>
                                                                <p class="text-sm text-gray-800 mb-2">
                                                                    {response.content}
                                                                </p>
                                                                <Show when={response.feedback_rating}>
                                                                    <div class="flex items-center gap-1">
                                                                        <span class="text-xs text-gray-600">Rating:</span>
                                                                        <div class="flex">
                                                                            {Array.from({ length: 5 }, (_, i) => (
                                                                                <Icon 
                                                                                    icon={i < (response.feedback_rating || 0) ? "mdi:star" : "mdi:star-outline"} 
                                                                                    class="text-yellow-500 text-sm" 
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </Show>
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </Show>
                                        </div>
                                    </Show>

                                    {/* Question Actions */}
                                    <div class="flex justify-end items-center mt-4 pt-4 border-t">
                                        <Show when={hasResponses()}>
                                            <button 
                                                class="btn btn-ghost btn-sm mr-2"
                                                onClick={() => toggleQuestionExpansion(question.id)}
                                            >
                                                <Icon 
                                                    icon={isExpanded() ? "mdi:eye-off" : "mdi:eye"} 
                                                    class="text-lg" 
                                                />
                                                {isExpanded() ? 'Hide' : 'Show'} Responses
                                            </button>
                                        </Show>
                                        <button 
                                            class="btn btn-ghost btn-circle btn-sm" 
                                            onClick={() => handleDelete(question)}
                                        >
                                            <Icon icon="mdi-delete-outline" class="text-lg" />
                                        </button>
                                        <button 
                                            class="btn btn-ghost btn-circle btn-sm" 
                                            onClick={() => handleEdit(question)}
                                        >
                                            <Icon icon="mdi-edit-outline" class="text-lg" />
                                        </button>
                                        <a 
                                            class="btn btn-ghost btn-circle btn-sm" 
                                            href={question.reference_url}
                                        >
                                            <Icon icon="mdi:arrow-top-right-thick" class="text-lg" />
                                        </a>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>

        </div>
    );
}