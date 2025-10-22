// src/components/forms/journal/category-forms/ChallengeEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalChallengeEntryData } from "../../../../../types/urgeTypes";

interface ChallengeEntryFormProps {
  data?: JournalChallengeEntryData;
  onUpdate: (data: JournalChallengeEntryData) => void;
}

export default function ChallengeEntryForm(props: ChallengeEntryFormProps) {
  const [challengeArea, setChallengeArea] = createSignal(props.data?.challenge_area || "");
  const [description, setDescription] = createSignal(props.data?.description || "");
  const [severity, setSeverity] = createSignal(props.data?.severity || "moderate");
  const [attemptedSolutions, setAttemptedSolutions] = createSignal(props.data?.attempted_solutions || [""]);
  const [helpNeeded, setHelpNeeded] = createSignal(props.data?.help_needed || "");

  createEffect(() => {
    props.onUpdate({
      challenge_area: challengeArea(),
      description: description(),
      severity: severity(),
      attempted_solutions: attemptedSolutions().filter(solution => solution.trim() !== ""),
      help_needed: helpNeeded()
    });
  });

  const addAttemptedSolution = () => {
    setAttemptedSolutions([...attemptedSolutions(), ""]);
  };

  const updateAttemptedSolution = (index: number, value: string) => {
    const newSolutions = [...attemptedSolutions()];
    newSolutions[index] = value;
    setAttemptedSolutions(newSolutions);
  };

  const removeAttemptedSolution = (index: number) => {
    if (attemptedSolutions().length > 1) {
      setAttemptedSolutions(attemptedSolutions().filter((_, i) => i !== index));
    }
  };

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="text-warning" />
        Challenge Details
      </h4>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Challenge Area</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="What area are you facing challenges in?"
          value={challengeArea()}
          onInput={(e) => setChallengeArea(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          class="textarea textarea-bordered h-24"
          placeholder="Describe the challenge in detail..."
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Severity Level</span>
        </label>
        <div class="flex flex-wrap gap-2">
          <For each={[
            { value: "minor", label: "Minor", color: "badge-success" },
            { value: "moderate", label: "Moderate", color: "badge-warning" },
            { value: "major", label: "Major", color: "badge-warning" },
            { value: "critical", label: "Critical", color: "badge-error" }
          ]}>
            {(option) => (
              <label class="cursor-pointer label">
                <input
                  type="radio"
                  name="severity"
                  class="radio radio-primary mr-2"
                  value={option.value}
                  checked={severity() === option.value}
                  onChange={() => setSeverity(option.value as any)}
                />
                <span class={`badge ${option.color} gap-2`}>
                  {option.label}
                </span>
              </label>
            )}
          </For>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Attempted Solutions</span>
        </label>
        <For each={attemptedSolutions()}>
          {(solution, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Solution attempted ${index() + 1}`}
                value={solution}
                onInput={(e) => updateAttemptedSolution(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeAttemptedSolution(index())}
                disabled={attemptedSolutions().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addAttemptedSolution}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Attempted Solution
        </button>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">What Help Do You Need?</span>
        </label>
        <textarea
          class="textarea textarea-bordered"
          placeholder="Describe what kind of help or support would be useful..."
          value={helpNeeded()}
          onInput={(e) => setHelpNeeded(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}