import { createSignal, Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import Modal from "@components/appFeedback/Modal";
import { notify } from "../../../stores/notifications";
import { manageNotes } from "../../../stores/userAssets/notes";
import type { Database } from "../../../../database.types";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import { createForm } from "@felte/solid";
import { validator } from '@felte/validator-zod';
import { z } from 'zod';

type UserNoteInsert = Database['public']['Tables']['user_notes']['Insert'];

interface NoteProps {
    userId?: string;
    contentType: string; // type of content maps to content_type
    relatedContentId: string; // maps to related_content_id
    referenceUrl: string; // maps to reference_url
    referenceTable: string; // maps to reference_table
}

const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

type NoteFormValues = z.infer<typeof noteSchema>;

const supabase = supabaseBrowserClient;

export default function NoteAction(props: NoteProps) {
    const [isOpen, setIsOpen] = createSignal(false);
    const [error, setError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    const { form, errors, isValid, handleSubmit } = createForm<NoteFormValues>({
        initialValues: {
            title: "",
            content: ""
        },
        extend: validator({ schema: noteSchema }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            setError("");

            try {
                const currentDate = new Date().toISOString();
                const payload: UserNoteInsert = {
                    content: values.content,
                    content_type: props.contentType,
                    created_at: currentDate,
                    reference_table: props.referenceTable,
                    reference_url: props.referenceUrl,
                    related_content_id: props.relatedContentId,
                    title: values.title,
                    user_id: props.userId
                }
                // Insert into user_notes table
                const { data: noteData, error: insertError } = await supabase
                    .from('user_notes')
                    .insert(payload)
                    .select('*').single();

                if (insertError) {
                    throw new Error(insertError.message);
                }
                if (noteData) {
                    // add note to noteStore
                    manageNotes('create', noteData);
                    // show a toast notification
                    notify.success("Success, note was added!")
                    // close the modal
                    setIsOpen(false);
                }


            } catch (err) {
                console.error("Submission error:", err);
                setError(err instanceof Error ? err.message : "Failed to save note");
                notify.error("Falied to save the note.")
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
                aria-label="Add note"
            >
                <Icon icon="mdi:lead-pencil" class="text-primary text-xl" />
            </button>

            <Modal
                isOpen={isOpen()}
                onClose={() => !isSubmitting() && setIsOpen(false)}
            >
                <div class="flex flex-col justify-start text-left mb-6">
                    <h3>Save A Note</h3>
                    <p class="text-sm text-gray-600">Use this form to jot down your thoughts, ideas, and key takeaways. Your notes will be saved and associated with this content for future reference.</p>
                </div>

                <form use:form>
                    <div class="form-control">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            class="input input-bordered"
                            disabled={isSubmitting()}
                            placeholder="Title"
                        />
                        <Show when={errors().title}>
                            <label class="label">
                                <span class="label-text-alt text-error">{errors().title}</span>
                            </label>
                        </Show>
                    </div>

                    <div class="form-control mt-4">
                        <textarea
                            id="content"
                            name="content"
                            rows={8}
                            class="textarea textarea-bordered"
                            disabled={isSubmitting()}
                            placeholder="Write your note"
                        />
                        <Show when={errors().content}>
                            <label class="label">
                                <span class="label-text-alt text-error">{errors().content}</span>
                            </label>
                        </Show>
                    </div>

                    <Show when={error()}>
                        <div class="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error()}</span>
                        </div>
                    </Show>
                    <div class="flex justify-end py-5">
                        <button class="btn btn-primary" type="submit" >Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}