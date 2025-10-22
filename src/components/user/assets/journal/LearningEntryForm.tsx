// src/components/forms/journal/category-forms/LearningEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalLearningEntryData } from "../../../../../types/journalTypes";

interface LearningEntryFormProps {
  data?: JournalLearningEntryData;
  onUpdate: (data: JournalLearningEntryData) => void;
}

export default function LearningEntryForm(props: LearningEntryFormProps) {
  const [source, setSource] = createSignal(props.data?.source || "");
  const [keyTakeaways, setKeyTakeaways] = createSignal(props.data?.key_takeaways || [""]);
  const [appliedInProject, setAppliedInProject] = createSignal(props.data?.applied_in_project || false);
  const [applicationNotes, setApplicationNotes] = createSignal(props.data?.application_notes || "");

  createEffect(() => {
    props.onUpdate({
      source: source(),
      key_takeaways: keyTakeaways().filter(takeaway => takeaway.trim() !== ""),
      applied_in_project: appliedInProject(),
      application_notes: applicationNotes()
    });
  });

  const addTakeaway = () => {
    setKeyTakeaways([...keyTakeaways(), ""]);
  };

  const updateTakeaway = (index: number, value: string) => {
    const newTakeaways = [...keyTakeaways()];
    newTakeaways[index] = value;
    setKeyTakeaways(newTakeaways);
  };

  const removeTakeaway = (index: number) => {
    if (keyTakeaways().length > 1) {
      setKeyTakeaways(keyTakeaways().filter((_, i) => i !== index));
    }
  };

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:book-education" class="text-info" />
        Learning Details
      </h4>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Learning Source</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="Where did you learn this? (book, course, experience, conversation...)"
          value={source()}
          onInput={(e) => setSource(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Key Takeaways</span>
        </label>
        <For each={keyTakeaways()}>
          {(takeaway, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Key takeaway ${index() + 1}`}
                value={takeaway}
                onInput={(e) => updateTakeaway(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeTakeaway(index())}
                disabled={keyTakeaways().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addTakeaway}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Takeaway
        </button>
      </div>

      <div class="form-control">
        <label class="cursor-pointer label justify-start gap-4">
          <input
            type="checkbox"
            class="checkbox checkbox-primary"
            checked={appliedInProject()}
            onChange={(e) => setAppliedInProject(e.currentTarget.checked)}
          />
          <span class="label-text">Applied in my project/business</span>
        </label>
      </div>

      <Show when={appliedInProject()}>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Application Notes</span>
          </label>
          <textarea
            class="textarea textarea-bordered"
            placeholder="How did you apply this learning? What was the result?"
            value={applicationNotes()}
            onInput={(e) => setApplicationNotes(e.currentTarget.value)}
          />
        </div>
      </Show>
    </div>
  );
}