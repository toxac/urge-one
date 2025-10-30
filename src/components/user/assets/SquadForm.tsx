import { createSignal, Show } from "solid-js";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";
import { notify } from "../../../stores/notifications";
import { createSquadMember } from "../../../stores/userAssets/squad";
import type { Database } from "../../../../database.types";

type SquadMemberInsert = Database["public"]["Tables"]["user_cheer_squad"]["Insert"];

interface Props {
  userId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const squadMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

export default function SquadForm (props: Props) {
    const [error, setError] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  const { form, errors, isValid, handleSubmit, touched } = createForm({
    initialValues: {
      name: "",
      email: "",
      relationship: "",
    },
    extend: validator({ schema: squadMemberSchema }),
    onSubmit: async (values) => {
      setSubmitting(true);
      setError("");

      const insertPayload: SquadMemberInsert = {
        user_id: props.userId,
        name: values.name,
        email: values.email,
        relationship: values.relationship,
        status: "request pending", // default status when invite sent
        created_at: new Date().toISOString(),
      };

      try {
        const { data, error } = await createSquadMember(insertPayload);
        if (error) throw error;
        notify.success("Squad member added", "Success!");
        if (props.onSuccess) props.onSuccess();
      } catch (err) {
        console.error("Failed to add squad member:", err);
        setError("Failed to add squad member");
        notify.error("Failed to add squad member", "Error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div class="w-full">
      <div class="flex flex-col justify-start text-left mb-6">
        <h3>Add Squad Member</h3>
        <p class="text-sm text-gray-600">Add a person to your cheer squad to stay connected and accountable.</p>
      </div>

      <form use:form>
        <div class="form-control mb-4">
          <input
            type="text"
            id="name"
            name="name"
            class="input input-neutral w-full"
            placeholder="Name"
          />
          <Show when={errors().name && touched().name}>
            <label class="label">
              <span class="label-text-alt text-error">{errors().name}</span>
            </label>
          </Show>
        </div>

        <div class="form-control mb-4">
          <input
            type="email"
            id="email"
            name="email"
            class="input input-neutral w-full"
            placeholder="Email"
          />
          <Show when={errors().email && touched().email}>
            <label class="label">
              <span class="label-text-alt text-error">{errors().email}</span>
            </label>
          </Show>
        </div>

        <div class="form-control mb-4">
          <input
            type="text"
            id="relationship"
            name="relationship"
            class="input input-neutral w-full"
            placeholder="Relationship (e.g. Friend, Family)"
          />
          <Show when={errors().relationship && touched().relationship}>
            <label class="label">
              <span class="label-text-alt text-error">{errors().relationship}</span>
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

        <div class="flex justify-end py-8 gap-4">
          <button type="button" class="btn btn-outline btn-neutral" onClick={props.onClose}>Close</button>
          <button type="submit" class="btn btn-primary btn-outline" disabled={!isValid() || submitting()}>
            {submitting() ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}