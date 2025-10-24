import { Show, For } from 'solid-js';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from "zod";
import {JOURNAL_CATEGORIES, JOURNAL_TYPES, URGENCY_LEVELS} from "../../../../../constants/journalOptions";

const baseSchema = z.object({
  title: z.string().max(100, "Title must be less than 100 characters").optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  urgency: z.string().min(1, "Urgency is required"),
  tags: z.array(z.string()).optional(),
});

type InitialData = {
  title?: string;
  content?: string;
  category?: string;
  type?: string;
  urgency?: string;
  tags?: string[];
};

interface BaseDataFormProps {
  initialData: InitialData;
  onNext: (data: InitialData) => void;
}

export default function BaseDataForm(props: BaseDataFormProps) {
  const { form, data, errors, isSubmitting, touched } = createForm({
    initialValues: props.initialData,
    onSubmit: (values) => props.onNext(values),
    extend: validator({ schema: baseSchema }),
  });

  return (
    <form use:form class="space-y-6">
      <div>
        <label class="block mb-1 font-semibold">Title</label>
        <input
          name="title"
          type="text"
          class="input input-bordered w-full"
          placeholder="Journal title (optional)"
        />
        <Show when={errors().title && touched().title}>
          <span class="text-error text-xs mt-1">{errors().title}</span>
        </Show>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Content</label>
        <textarea
          name="content"
          class="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Write your reflection, experience or update..."
        />
        <Show when={errors().content && touched().content}>
          <span class="text-error text-xs mt-1">{errors().content}</span>
        </Show>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Category</label>
        <select name="category" class="select select-bordered w-full">
          <option value="">Select a category</option>
          <For each={JOURNAL_CATEGORIES}>
            {(item)=> <option value={item.value}>{item.label}</option>}
          </For>
        </select>
        <Show when={errors().category && touched().category}>
          <span class="text-error text-xs mt-1">{errors().category}</span>
        </Show>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Type</label>
        <select name="type" class="select select-bordered w-full">
          <option value="">Select journal type</option>
          <For each={JOURNAL_TYPES}>
            {(item)=> <option value={item.value}>{item.label}</option>}
          </For>
        </select>
        <Show when={errors().type && touched().type}>
          <span class="text-error text-xs mt-1">{errors().type}</span>
        </Show>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Urgency</label>
        <select name="urgency" class="select select-bordered w-full">
          <option value="">Select urgency level</option>
          <For each={URGENCY_LEVELS}>
            {(item)=> <option value={item.value}>{item.label}</option>}
          </For>
        </select>
        <Show when={errors().urgency && touched().urgency}>
          <span class="text-error text-xs mt-1">{errors().urgency}</span>
        </Show>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Tags</label>
        <input
          name="tags"
          type="text"
          class="input input-bordered w-full"
          placeholder="Comma separated tags (optional)"
        />
        {/* Optional: Implement custom tag input or split to array */}
        <Show when={errors().tags && touched().tags}>
          <span class="text-error text-xs mt-1">{errors().tags}</span>
        </Show>
      </div>
      <button type="submit" class="btn btn-primary w-full mt-4" disabled={isSubmitting()}>
        Next
      </button>
    </form>
  );
}

