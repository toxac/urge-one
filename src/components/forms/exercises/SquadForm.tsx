import { createEffect, createSignal, Show, For } from 'solid-js';
import { createForm } from '@felte/solid';
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { createSquadMember,updateSquadMember} from '../../../stores/userAssets/squad';
import { saveFormAndMarkCompleted } from '../../../stores/progress';
import { useStore } from '@nanostores/solid';
import { authStore } from '../../../stores/auth';
import * as z from "zod";
import type { Database } from '../../../../database.types';



type CheerSquad = Database['public']['Tables']['user_cheer_squad']['Row'];
type CheerSquadUpdate = Database['public']['Tables']['user_cheer_squad']['Update'];
type CheerSquadInsert = Database['public']['Tables']['user_cheer_squad']['Insert'];

const supabase = supabaseBrowserClient;

// Status options for dropdown
const statusOptions = [
    { value: 'added', label: 'Added' },
    { value: 'invited', label: 'Invite Sent' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' }
];

const schema = z.object({
    id: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(1, "Name is required"),
    relationship: z.string().min(1, "Please select a relationship"),
    status: z.enum(['added', 'invited', 'confirmed', 'declined']),
    user_id: z.string().min(1, "User ID is required")
});

interface SquadFormProps {
    member?: CheerSquad | null;
    contentMetaId: string;
    userId: string;
}

export default function SquadForm(props: SquadFormProps) {
    const $session = useStore(authStore);
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [markedCompleted, setMarkedCompleted] = createSignal(false);
    const [error, setError] = createSignal("");

    createEffect(() => {
        //
    });

    const { form, errors, setFields } = createForm({
        initialValues: {
            id: props.member?.id ?? '',
            email: props.member?.email ?? '',
            name: props.member?.name ?? '',
            relationship: props.member?.relationship ?? '',
            status: props.member?.status ?? 'added',
            user_id: props.userId || ''
        },
        onSubmit: async (values) => {
            console.log("submitting", values);

            // Check if user_id is available
            if (!props.userId) {
                setError("User authentication required");
                return;
            }

            setLoading(true);
            setError("");

            try {
                if (values.id && props.userId) {
                    // Update existing record
                    const updatePayload: CheerSquadUpdate = {
                        email: values.email,
                        name: values.name,
                        relationship: values.relationship,
                        status: values.status,
                        user_id: props.userId
                    };

                    const { data, error } = await supabase
                        .from('user_cheer_squad')
                        .update(updatePayload)
                        .eq('id', values.id)
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        const {success, error} = await updateSquadMember(props.userId, data);

                        if(success){
                            notify.success(`Information for ${data.name} has been updated.`, "Success!");
                        } else {
                            console.error(`Squad store could not be updated - ${error}`)
                        }
                        setSuccess(true);
                    }
                } else {
                    // Create new record
                    const insertPayload: CheerSquadInsert = {
                        email: values.email,
                        name: values.name,
                        relationship: values.relationship,
                        status: "invited",
                        user_id: props.userId
                    };

                    const { data, error } = await supabase
                        .from('user_cheer_squad')
                        .insert(insertPayload)
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        const {success, error} = await createSquadMember(insertPayload);

                        if (success){
                            notify.success(`${data.name} has been addedd to your squad.`, "Success!");

                        }
                        
                        if (!markedCompleted()) {
                            await saveFormAndMarkCompleted(props.contentMetaId);
                        }
                        notify.success(` ${data.name} has been added to your squad.`, "Success!");
                        setSuccess(true);
                    }
                }
            } catch (err) {
                console.error("Error saving squad member:", err);
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(errorMessage);
                notify.error("Something went wrong", "Failed!");
            } finally {
                setMarkedCompleted(true);
                setLoading(false);
            }
        },
        extend: validator({ schema }),
    });


    return (
        <section class="w-full bg-white border-1 border-primary rounded-lg p-8">
            <Show when={success()}>
                <div class="w-full">
                    <h3>Success!</h3>
                    <p>{props.member ? 'Member updated successfully!' : 'Member added successfully!'}</p>
                    <div class="flex justify-end">
                        <button class="btn btn-primary btn-outline" onClick={() => setSuccess(false)}>Add another member</button>
                    </div>
                </div>
            </Show>

            <Show when={!success()}>
                <Show when={error()}>
                    <div class="alert alert-error mb-4">
                        <p>{error()}</p>
                    </div>
                </Show>

                <form use:form class="space-y-4">
                    <h3>Add a member to your squad</h3>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-neutral">Email*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            class="input input-neutral w-full"
                            placeholder="friend@example.com"
                        />
                        <Show when={errors().email}>
                            <span class="text-sm text-red-700">{errors().email}</span>
                        </Show>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-neutral">Name*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            class="input input-neutral w-full"
                            placeholder="John Doe"
                        />
                        <Show when={errors().name}>
                            <span class="text-sm text-red-700">{errors().name}</span>
                        </Show>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-neutral">Relationship*</span>
                        </label>
                        <select
                            name="relationship"
                            class="select select-neutral w-full"
                        >
                            <option value="">Select relationship</option>
                            <option value="friend">Friend</option>
                            <option value="family">Family</option>
                            <option value="mentor">Mentor</option>
                            <option value="colleague">Colleague</option>
                        </select>
                        <Show when={errors().relationship}>
                            <span class="text-sm text-red-700">{errors().relationship}</span>
                        </Show>
                    </div>

                    <div class="modal-action">
                        <button
                            type="submit"
                            class="btn btn-primary btn-outline"
                            disabled={loading() || !props.userId}
                        >
                            {loading() ? (
                                <span class="loading loading-spinner loading-xs mr-2"></span>
                            ) : null}
                            {props.member ? 'Update' : 'Add'} Member
                        </button>
                    </div>
                </form>
            </Show>
        </section>
    );
}