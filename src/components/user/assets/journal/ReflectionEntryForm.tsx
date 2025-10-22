// src/components/forms/journal/category-forms/ReflectionEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalReflectionEntryData } from "../../../../../types/urgeTypes";

interface ReflectionEntryFormProps {
  data?: JournalReflectionEntryData;
  onUpdate: (data: JournalReflectionEntryData) => void;
}

export default function ReflectionEntryForm(props: ReflectionEntryFormProps) {
  const [reflectionPrompt, setReflectionPrompt] = createSignal(props.data?.reflection_prompt || "");
  const [personalInsight, setPersonalInsight] = createSignal(props.data?.personal_insight || "");
  const [gratitudeNote, setGratitudeNote] = createSignal(props.data?.gratitude_note || "");

  createEffect(() => {
    props.onUpdate({
      reflection_prompt: reflectionPrompt(),
      personal_insight: personalInsight(),
      gratitude_note: gratitudeNote()
    });
  });

  const reflectionPrompts = [
    "What surprised me today?",
    "What would I do differently?",
    "What am I learning about myself?",
    "What's getting in my way?",
    "What am I grateful for in this journey?",
    "What courage did I show today?",
    "What's becoming clearer to me?"
  ];

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:account-heart" class="text-secondary" />
        Reflection Details
      </h4>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Reflection Prompt</span>
        </label>
        <select
          class="select select-bordered"
          value={reflectionPrompt()}
          onChange={(e) => setReflectionPrompt(e.currentTarget.value)}
        >
          <option value="">Choose a prompt (optional)</option>
          <For each={reflectionPrompts}>
            {(prompt) => (
              <option value={prompt}>{prompt}</option>
            )}
          </For>
        </select>
        <label class="label">
          <span class="label-text-alt">Or write your own prompt below</span>
        </label>
        <input
          type="text"
          class="input input-bordered mt-2"
          placeholder="Or write your own reflection prompt..."
          value={reflectionPrompt()}
          onInput={(e) => setReflectionPrompt(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Personal Insight</span>
        </label>
        <textarea
          class="textarea textarea-bordered h-32"
          placeholder="What did you discover about yourself, your business, or your approach?"
          value={personalInsight()}
          onInput={(e) => setPersonalInsight(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Gratitude Note</span>
        </label>
        <textarea
          class="textarea textarea-bordered"
          placeholder="What are you grateful for in your entrepreneurial journey today?"
          value={gratitudeNote()}
          onInput={(e) => setGratitudeNote(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}