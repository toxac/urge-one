// src/components/forms/journal/category-forms/ProgressEntryForm.tsx
import { createSignal, createEffect, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { JournalProgressEntryData } from "../../../../../types/urgeTypes";

interface ProgressEntryFormProps {
  data?: JournalProgressEntryData;
  onUpdate: (data: JournalProgressEntryData) => void;
}

export default function ProgressEntryForm(props: ProgressEntryFormProps) {
  const [progressDate, setProgressDate] = createSignal(props.data?.progress_date || new Date().toISOString().split('T')[0]);
  const [milestone, setMilestone] = createSignal(props.data?.milestone || "");
  const [progressPercent, setProgressPercent] = createSignal(props.data?.progress_percent || 0);
  const [keyActivities, setKeyActivities] = createSignal(props.data?.key_activities || [""]);
  const [nextSteps, setNextSteps] = createSignal(props.data?.next_steps || [""]);

  // Update parent when form changes
  createEffect(() => {
    props.onUpdate({
      progress_date: progressDate(),
      milestone: milestone(),
      progress_percent: progressPercent(),
      key_activities: keyActivities().filter(activity => activity.trim() !== ""),
      next_steps: nextSteps().filter(step => step.trim() !== "")
    });
  });

  const addKeyActivity = () => {
    setKeyActivities([...keyActivities(), ""]);
  };

  const updateKeyActivity = (index: number, value: string) => {
    const newActivities = [...keyActivities()];
    newActivities[index] = value;
    setKeyActivities(newActivities);
  };

  const removeKeyActivity = (index: number) => {
    if (keyActivities().length > 1) {
      setKeyActivities(keyActivities().filter((_, i) => i !== index));
    }
  };

  const addNextStep = () => {
    setNextSteps([...nextSteps(), ""]);
  };

  const updateNextStep = (index: number, value: string) => {
    const newSteps = [...nextSteps()];
    newSteps[index] = value;
    setNextSteps(newSteps);
  };

  const removeNextStep = (index: number) => {
    if (nextSteps().length > 1) {
      setNextSteps(nextSteps().filter((_, i) => i !== index));
    }
  };

  return (
    <div class="bg-base-200 p-4 rounded-lg space-y-4">
      <h4 class="font-semibold flex items-center gap-2">
        <Icon icon="mdi:progress-check" class="text-primary" />
        Progress Details
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Progress Date</span>
          </label>
          <input
            type="date"
            class="input input-bordered"
            value={progressDate()}
            onInput={(e) => setProgressDate(e.currentTarget.value)}
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Progress: {progressPercent()}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercent()}
            onInput={(e) => setProgressPercent(parseInt(e.currentTarget.value))}
            class="range range-primary"
          />
          <div class="flex justify-between text-xs px-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Milestone Reached</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="What significant milestone did you achieve?"
          value={milestone()}
          onInput={(e) => setMilestone(e.currentTarget.value)}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Key Activities</span>
        </label>
        <For each={keyActivities()}>
          {(activity, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Activity ${index() + 1}`}
                value={activity}
                onInput={(e) => updateKeyActivity(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeKeyActivity(index())}
                disabled={keyActivities().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addKeyActivity}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Activity
        </button>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Next Steps</span>
        </label>
        <For each={nextSteps()}>
          {(step, index) => (
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder={`Next step ${index() + 1}`}
                value={step}
                onInput={(e) => updateNextStep(index(), e.currentTarget.value)}
              />
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                onClick={() => removeNextStep(index())}
                disabled={nextSteps().length === 1}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          )}
        </For>
        <button
          type="button"
          class="btn btn-outline btn-sm self-start"
          onClick={addNextStep}
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Add Next Step
        </button>
      </div>
    </div>
  );
}