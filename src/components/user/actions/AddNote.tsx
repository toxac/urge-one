import { createSignal, Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import { notify } from "../../../stores/notifications";
import { createNote, updateNote } from "../../../stores/userAssets/notes";
import type { Database } from "../../../../database.types";
import { supabaseBrowserClient } from "../../../lib/supabase/client";
import { createForm } from "@felte/solid";
import { validator } from '@felte/validator-zod';
import { z } from 'zod';

type Note = Database['public']['Tables']['user_notes']['Row'];
type NoteInsert = Database['public']['Tables']['user_notes']['Insert'];
type NoteUpdate = Database['public']['Tables']['user_notes']['Update'];


interface NoteProps {
    userId: string;
    contentType: string; // type of content maps to content_type
    relatedContentId: string; // maps to related_content_id
    referenceUrl: string; // maps to reference_url
    referenceTable: string; // maps to reference_table
    note?: Note;
    onSuccess?: () => void;
}

const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});



export default function AddNote(props: NoteProps) {
    const [isOpen, setIsOpen] = createSignal(false);
    const [error, setError] = createSignal("");
    const [submitting, setSubmitting] = createSignal(false);

    const { form, errors, isValid, handleSubmit, touched } = createForm({
        initialValues: {
            title: props.note?.title || "",
            content: props.note?.content || ""
        },
        extend: validator({ schema: noteSchema }),
        onSubmit: async (values) => {
            setSubmitting(true);
            setError("");

            try {
                if (props.note) {
                    const updatePayload: NoteUpdate = {
                        title: values.title,
                        content: values.content,
                        updated_at: new Date().toISOString()
                    }

                    // update store and table
                    const { success, data, error } = await updateNote(props.note.id, updatePayload)
                    if (error) throw error;
                    if (data) {
                        notify.success("Note was added", "Success!")
                        if (props.onSuccess) {
                            props.onSuccess?.();
                        }
                    }
                } else {
                    const insertPayload: NoteInsert = {
                        content: values.content,
                        content_type: props.contentType,
                        created_at: new Date().toISOString(),
                        reference_table: props.referenceTable,
                        reference_url: props.referenceUrl,
                        related_content_id: props.relatedContentId,
                        title: values.title,
                        user_id: props.userId
                    }

                    // insert new note
                    const { data, success, error } = await createNote(insertPayload)
                    if (error) throw error;
                    if (data) {
                        notify.success("Note was updated", "Success!")
                        if (props.onSuccess) {
                            props.onSuccess?.();
                        }

                    }

                }

            } catch (err) {
                console.error("Submission error:", err);
                setError("Failed to save note");
                notify.error("Falied to save the note.", "Failed.")
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div class="w-full">

            <div class="flex flex-col justify-start text-left mb-6">
                <h3>{props.note? "Update note" : "Save A Note"}</h3>
                <p class="text-sm text-gray-600">Use this form to jot down your thoughts, ideas, and key takeaways. Your notes will be saved and associated with this content for future reference.</p>
            </div>

            <form use:form>
                <div class="form-control">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        class="input input-bordered"
                        placeholder="Title"
                    />
                    <Show when={errors().title && touched().title}>
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
                        placeholder="Write your note"
                    />
                    <Show when={errors().content && touched().content}>
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
                    <button class="btn btn-primary" type="submit" >{props.note? "Update" : "Save"}</button>
                </div>
            </form>
        </div>
    );
}