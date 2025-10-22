// src/components/forms/journal/category-forms/InsightEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalInsightEntryData } from "../../../../../types/urgeTypes";

interface InsightEntryFormProps {
  data?: JournalInsightEntryData;
  onUpdate: (data: JournalInsightEntryData) => void;
}

export default function InsightEntryForm(props: InsightEntryFormProps) {
  const [insightOrigin, setInsightOrigin] = createSignal(props.data?.insight_origin || "");
  const [theme, setTheme] = createSignal(props.data?.theme || "");
  const [impact, setImpact] = createSignal(props.data?.impact || "");
  const [confidenceLevel, setConfidenceLevel] = createSignal(props.data?.confidence_level || "hypothesis");
  const [potentialExperiments, setPotentialExperiments] = createSignal(props.data?.potential_experiments || [""]);

  createEffect(() => {
    props.onUpdate({
      insight_origin: insightOrigin(),
      theme: theme(),
      impact: impact(),
      confidence_level: confidenceLevel(),
      potential_experiments: potentialExperiments().filter(exp => exp.trim() !== "")
    });
  });

  const addExperiment = () => {
    setPotentialExperiments([...potentialExperiments(), ""]);
  };

  const updateExperiment = (index: number, value: string) => {
    const newExperiments = [...potentialExperiments()];
    newExperiments[index] = value;
    setPotentialExperiments(newExperiments);
  };

  const removeExperiment = (index: number) => {
    if (potentialExperiments().length > 1) {
      setPotentialExperiments(potentialExperiments().filter((_, i) => i !== index));
    }
  };

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:lightbulb-on" class="text-warning" />
        Insight Details
      </h4>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Insight Origin</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="Where did this insight come from? (observation, data, conversation...)"
          value={insightOrigin()}
          onInput={(e) => setInsightOrigin(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Theme/Pattern</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="What theme or pattern did you discover?"
          value={theme()}
          onInput={(e) => setTheme(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Potential Impact</span>
        </label>
        <textarea
          class="textarea textarea-bordered"
          placeholder="How could this insight impact your business or approach?"
          value={impact()}
          onInput={(e) => setImpact(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Confidence Level</span>
        </label>
        <div class="flex flex-col gap-2">
          <For each={[
            { value: "hypothesis", label: "Hypothesis", icon: "mdi:flask", desc: "Initial idea needing validation" },
            { value: "validated", label: "Validated", icon: "mdi:check-circle", desc: "Tested and confirmed" },
            { value: "pivot", label: "Pivot", icon: "mdi:swap-horizontal", desc: "Requires significant change" }
          ]}>
            {(option) => (
              <label class="cursor-pointer label justify-start gap-4 p-3 border rounded-lg hover:bg-base-300">
                <input
                  type="radio"
                  name="confidence"
                  class="radio radio-primary"
                  value={option.value}
                  checked={confidenceLevel() === option.value}
                  onChange={() => setConfidenceLevel(option.value as any)}
                />
                <div class="flex items-center gap-2">
                  <Icon icon={option.icon} />
                  <span class="font-medium">{option.label}</span>
                  <span class="text-sm text-gray-600">- {option.desc}</span>
                </div>
              </label>
            )}
          </For>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Potential Experiments to Test</span>
        </label>
        <For each={potentialExperiments()}>
          {(experiment, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Experiment ${index() + 1}`}
                value={experiment}
                onInput={(e) => updateExperiment(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeExperiment(index())}
                disabled={potentialExperiments().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addExperiment}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Experiment
        </button>
      </div>
    </div>
  );
}