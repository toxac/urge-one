// src/components/forms/journal/category-forms/BuildLogEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalBuildLogEntryData } from "../../../../../types/urgeTypes";

interface BuildLogEntryFormProps {
  data?: JournalBuildLogEntryData;
  onUpdate: (data: JournalBuildLogEntryData) => void;
}

export default function BuildLogEntryForm(props: BuildLogEntryFormProps) {
  const [version, setVersion] = createSignal(props.data?.version || "");
  const [environment, setEnvironment] = createSignal(props.data?.environment || "beta");
  const [changes, setChanges] = createSignal(props.data?.changes || [""]);
  const [feedbackCount, setFeedbackCount] = createSignal(props.data?.feedback_count || 0);
  const [issuesReported, setIssuesReported] = createSignal(props.data?.issues_reported || 0);
  const [plannedHotfixes, setPlannedHotfixes] = createSignal(props.data?.planned_hotfixes || [""]);

  createEffect(() => {
    props.onUpdate({
      version: version(),
      environment: environment(),
      changes: changes().filter(change => change.trim() !== ""),
      feedback_count: feedbackCount(),
      issues_reported: issuesReported(),
      planned_hotfixes: plannedHotfixes().filter(hotfix => hotfix.trim() !== "")
    });
  });

  const addChange = () => {
    setChanges([...changes(), ""]);
  };

  const updateChange = (index: number, value: string) => {
    const newChanges = [...changes()];
    newChanges[index] = value;
    setChanges(newChanges);
  };

  const removeChange = (index: number) => {
    if (changes().length > 1) {
      setChanges(changes().filter((_, i) => i !== index));
    }
  };

  const addHotfix = () => {
    setPlannedHotfixes([...plannedHotfixes(), ""]);
  };

  const updateHotfix = (index: number, value: string) => {
    const newHotfixes = [...plannedHotfixes()];
    newHotfixes[index] = value;
    setPlannedHotfixes(newHotfixes);
  };

  const removeHotfix = (index: number) => {
    if (plannedHotfixes().length > 1) {
      setPlannedHotfixes(plannedHotfixes().filter((_, i) => i !== index));
    }
  };

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:hammer-wrench" class="text-success" />
        Build Log Details
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Version</span>
          </label>
          <input
            type="text"
            class="input input-bordered"
            placeholder="e.g., v1.2.3"
            value={version()}
            onInput={(e) => setVersion(e.currentTarget.value)}
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Environment</span>
          </label>
          <select
            class="select select-bordered"
            value={environment()}
            onChange={(e) => setEnvironment(e.currentTarget.value as any)}
          >
            <option value="beta">Beta</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Changes Made</span>
        </label>
        <For each={changes()}>
          {(change, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Change ${index() + 1}`}
                value={change}
                onInput={(e) => updateChange(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeChange(index())}
                disabled={changes().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addChange}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Change
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Feedback Received</span>
          </label>
          <input
            type="number"
            class="input input-bordered"
            min="0"
            value={feedbackCount()}
            onInput={(e) => setFeedbackCount(parseInt(e.currentTarget.value) || 0)}
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Issues Reported</span>
          </label>
          <input
            type="number"
            class="input input-bordered"
            min="0"
            value={issuesReported()}
            onInput={(e) => setIssuesReported(parseInt(e.currentTarget.value) || 0)}
          />
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Planned Hotfixes</span>
        </label>
        <For each={plannedHotfixes()}>
          {(hotfix, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Hotfix ${index() + 1}`}
                value={hotfix}
                onInput={(e) => updateHotfix(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeHotfix(index())}
                disabled={plannedHotfixes().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addHotfix}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Hotfix
        </button>
      </div>
    </div>
  );
}