import { Show, createSignal, For } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from 'zod';
import { CTA_TYPES } from "../../../../../constants/journalOptions";

const ctaSchema = z.object({
  has_cta: z.boolean(),
  cta_type: z.string().optional(),
  cta_title: z.string().max(100, "CTA title too long").optional(),
  cta_description: z.string().max(250, "CTA description too long").optional(),
  response_deadline: z.string().optional(),
  should_email_followers: z.boolean().optional(),
});

type CTAInitialData = {
  has_cta: boolean;
  cta_type?: string;
  cta_title?: string;
  cta_description?: string;
  response_deadline?: string;
  should_email_followers?: boolean;
};

interface CTAFormProps {
  initialData: CTAInitialData;
  onNext: (data: CTAInitialData) => void;
}

export default function CTAForm(props: CTAFormProps) {
  const [showFields, setShowFields] = createSignal(props.initialData.has_cta ?? false);

  const { form, data, errors, isSubmitting, touched } = createForm({
    initialValues: { ...props.initialData, has_cta: showFields() },
    onSubmit: (values) => props.onNext(values),
    extend: validator({ schema: ctaSchema }),
    onChange: (values: CTAInitialData) => setShowFields(values.has_cta),
  });

  return (
    <form use:form class="space-y-6">
      <div class="mb-4">
        <label class="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="has_cta"
            checked={showFields()}
            onInput={e => setShowFields(e.currentTarget.checked)}
            class="checkbox"
          />
          <span class="font-semibold">I'd like to add a Call To Action (CTA)</span>
        </label>
        <Show when={!showFields()}>
          <div class="text-xs text-gray-600 mt-2">
            A <strong>CTA</strong> lets you request something from your Cheer Squad, community, or followers –
            like feedback, a connection, testers, partnership, or amplification. It's a powerful way to involve others, get help, and keep your journey actionable.
            <br />
            <br />
            Enable this to ask for support, feedback, resources, or action from others!
          </div>
        </Show>
      </div>
      <Show when={showFields()}>
        <>
          <div>
            <label class="block mb-1 font-semibold">CTA Type</label>
            <select name="cta_type" class="select select-bordered w-full">
              <option value="">Select CTA type (optional)</option>
              <For each={CTA_TYPES}>
                {item => <option value={item.value}>{item.label}</option>}
              </For>
            </select>
            <Show when={errors().cta_type && touched().cta_type}>
              <span class="text-error text-xs mt-1">{errors().cta_type}</span>
            </Show>
          </div>
          <div>
            <label class="block mb-1 font-semibold">CTA Title</label>
            <input
              name="cta_title"
              type="text"
              class="input input-bordered w-full"
              placeholder="Title for CTA (optional)"
            />
            <Show when={errors().cta_title && touched().cta_title}>
              <span class="text-error text-xs mt-1">{errors().cta_title}</span>
            </Show>
          </div>
          <div>
            <label class="block mb-1 font-semibold">CTA Description</label>
            <textarea
              name="cta_description"
              class="textarea textarea-bordered w-full"
              rows={2}
              placeholder="Describe what you need, offer, or amplify (optional)"
            />
            <Show when={errors().cta_description && touched().cta_description}>
              <span class="text-error text-xs mt-1">{errors().cta_description}</span>
            </Show>
          </div>
          <div>
            <label class="block mb-1 font-semibold">Response Deadline</label>
            <input
              name="response_deadline"
              type="date"
              class="input input-bordered w-full"
            />
            <Show when={errors().response_deadline && touched().response_deadline}>
              <span class="text-error text-xs mt-1">{errors().response_deadline}</span>
            </Show>
          </div>
          <div>
            <label class="inline-flex gap-2 items-center font-semibold">
              <input
                name="should_email_followers"
                type="checkbox"
                class="checkbox"
              />
              Email followers about this CTA (optional)
            </label>
            <Show when={errors().should_email_followers && touched().should_email_followers}>
              <span class="text-error text-xs mt-1">{errors().should_email_followers}</span>
            </Show>
          </div>
        </>
      </Show>
      <button
        type="submit"
        class="btn btn-primary w-full mt-4"
        disabled={isSubmitting()}
      >
        Next
      </button>
    </form>
  );
}
