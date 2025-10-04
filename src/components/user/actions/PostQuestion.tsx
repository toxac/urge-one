import { createSignal} from "solid-js";
import { notify } from "../../../stores/notifications";
import { createQuestion } from "../../../stores/userAssets/questions";
import { createForm } from "@felte/solid";
import { validator } from '@felte/validator-zod';
import { z } from 'zod';
import type { Database } from "../../../../database.types";

type QuestionInsert = Database['public']['Tables']['user_questions']['Insert'];

interface QuestionProps {
    contentType: string;
    referenceTable: string;
    referenceUrl: string;
    relatedContentId: string;
    userId: string;
    onSuccess?: () => void;
    onClose?: ()=> void;
}

const questionSchema = z.object({
    question: z.string().min(3, "Question is required"),
    content: z.string().min(10, "Content is required and should be of minimum 10 characters"),
    is_public: z.boolean().default(false),
});

export default function PostQuestion(props: QuestionProps) {
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    
    const handleModalClose = () => {
        if(props.onClose){
            props.onClose?.();
        }
    }

    const { form, errors, isValid, handleSubmit } = createForm({
        initialValues: {
            question: "",
            content: "",
            is_public: false
        },
        extend: validator({ schema: questionSchema }),
        onSubmit: async (values) => {
            setIsSubmitting(true);

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
                    user_id: props.userId,
                    is_public: values.is_public,
                    status: "pending"

                }
                const { success, error } = await createQuestion(payload);

                if (error) throw error;
                if (success) {
                    notify.success("Success, question was posted.", "Success!");
                }

            } catch (err) {
                notify.error("Failed, question could not be posted.")
                console.error(err);
            } finally {
                setIsSubmitting(false);
                props.onSuccess?.();
            }
        },
    });

    return (
        <div>

            <h3>Ask a Question</h3>
            <p class="text-sm text-gray-600 text-left mb-3">Stuck on this step? Ask us your question here, and we'll help you get unstuck and keep moving forward.</p>

            <form use:form>
                <div class="form-control">
                    <input
                        type="text"
                        id="question"
                        name="question"
                        class="input input-neutral w-full"
                        placeholder="Title of the question"
                    />
                    {errors().question && (
                        <label class="label">
                            <span class="label-text-alt text-error">{errors().question}</span>
                        </label>
                    )}
                </div>

                <div class="form-control mt-4">
                    <textarea
                        id="content"
                        name="content"
                        rows={8}
                        class="textarea textarea-neutral w-full"
                        placeholder="Describe your question in detail."
                    />
                    {errors().content && (
                        <label class="label">
                            <span class="label-text-alt text-error">{errors().content}</span>
                        </label>
                    )}
                </div>
                {/* Public Toggle */}
                <div class="form-control mt-4">
                    <label class="label cursor-pointer justify-start gap-4">
                        <span class="label-text">Make this question public?</span>
                        <input 
                            type="checkbox" 
                            id="is_public"
                            name="is_public"
                            class="toggle toggle-primary" 
                        />
                    </label>
                    <div class="text-xs text-gray-500 mt-1">
                        {errors().is_public ? (
                            <span class="text-error">{errors().is_public}</span>
                        ) : (
                            "Public questions are visible to other users and can be answered by any user, while private questions are only visible to you and administrators."
                        )}
                    </div>
                </div>

                <div class="flex justify-end py-8 gap-4">
                    <button class="btn btn-neutral btn-outline" onClick={handleModalClose}>Close</button>
                    <button class="btn btn-primary btn-outline" type="submit" >Post Question</button>
                </div>
            </form>

        </div>
    );
}