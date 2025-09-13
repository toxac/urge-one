import { createSignal, Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import { notify } from "../../../stores/notifications";
import { manageQuestions } from "../../../stores/userAssets/questions";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import { createForm } from "@felte/solid";
import { validator } from '@felte/validator-zod';
import { z } from 'zod';
import type { Database } from "../../../../database.types";

type QuestionInsert = Database['public']['Tables']['user_notes']['Insert'];

interface QuestionProps {
    contentType: string | null;
    referenceTable: string | null;
    referenceUrl: string | null;
    relatedContentId: string | null;
    userId: string;
}

const questionSchema = z.object({
    question: z.string().min(1, "Question is required"),
    content: z.string().min(1, "Content is required"),
});


const supabase = supabaseBrowserClient;

export default function QuestionAction(props: QuestionProps) {
    const [isOpen, setIsOpen] = createSignal(false);
    const [error, setError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    const { form, errors, isValid, handleSubmit } = createForm({
        initialValues: {
            question: "",
            content: ""
        },
        extend: validator({ schema: questionSchema }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            setError("");

            try {
                const currentDate = new Date().toISOString();
                const payload: QuestionInsert = {
                    title: values.question,
                    content: values.content,
                    content_type: props.contentType,
                    created_at: currentDate,
                    reference_table: props.referenceTable,
                    reference_url: props.referenceUrl,
                    related_content_id: props.relatedContentId,
                    user_id: props.userId
                }
                const { data: questionData, error: questionInsertError } = await supabase.from("user_questions")
                    .insert(payload)
                    .select('*')
                    .single();

                if (questionInsertError) {
                    throw new Error(questionInsertError.message);
                }
                if (questionData) {
                    notify.success("Success, question was posted.")
                    manageQuestions('create', questionData);
                    setIsOpen(false);
                }

            } catch (err) {
                notify.error("Failed, question could not be posted.")
                console.error(err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                class="p-2 bg-white shadow-md rounded-full flex justify-center items-center hover:bg-base-100"
                aria-label="Ask question"
            >
                <Icon icon="mdi:comment-help" class="text-primary text-xl" />
            </button>

            <Modal
                isOpen={isOpen()}
                onClose={() => !isSubmitting() && setIsOpen(false)}
            >
                <h3>Ask a Question</h3>
                <p class="text-sm text-gray-600 text-left mb-3">Stuck on this step? Ask us your question here, and we'll help you get unstuck and keep moving forward.</p>

                <form use:form>
                    <div class="form-control">
                        <label class="label" for="question">
                            <span class="label-text">Your Question</span>
                        </label>
                        <input
                            type="text"
                            id="question"
                            name="question"
                            class="input input-bordered"
                            disabled={isSubmitting()}
                        />
                        {errors().question && (
                            <label class="label">
                                <span class="label-text-alt text-error">{errors().question}</span>
                            </label>
                        )}
                    </div>

                    <div class="form-control mt-4">
                        <label class="label" for="content">
                            <span class="label-text">Details</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={8}
                            class="textarea textarea-bordered"
                            disabled={isSubmitting()}
                        />
                        {errors().content && (
                            <label class="label">
                                <span class="label-text-alt text-error">{errors().content}</span>
                            </label>
                        )}
                    </div>

                    {error() && (
                        <div class="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error()}</span>
                        </div>
                    )}
                    <div class="flex justify-end py-5">
                        <button class="btn btn-primary" type="submit" >Post</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}