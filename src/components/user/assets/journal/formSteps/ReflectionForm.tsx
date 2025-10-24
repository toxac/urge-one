import { Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from 'zod';

const reflectionSchema = z.object({
  program_satisfaction: z.number().min(1, "Must be between 1 and 5").max(5).optional(),
  applied_learnings: z.array(z.string()).optional(),
  confidence_change: z.enum(["increased", "decreased", "same"]).optional(),
  questions: z.array(z.string()).optional(),
});

interface ReflectionFormProps {
  initialData: any;
  onNext: (data: any) => void;
}

export default function ReflectionForm(props: ReflectionFormProps) {
  const { form, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: props.onNext,
    extend: validator({ schema: reflectionSchema }),
  });

  return (
    <form use:form class="space-y-4">
      <div>
        <label>Program Satisfaction (1-5)</label>
        <input name="program_satisfaction" type="number" min={1} max={5} class="input input-bordered w-full" />
        <Show when={errors().program_satisfaction}>
          <p class="text-error">{errors().program_satisfaction}</p>
        </Show>
      </div>

      <div>
        <label>Applied Learnings (comma separated)</label>
        <input name="applied_learnings" type="text" class="input input-bordered w-full" placeholder="e.g., MVP, Customer research" />
      </div>

      <div>
        <label>Confidence Change</label>
        <select name="confidence_change" class="select select-bordered w-full">
          <option value="">Select</option>
          <option value="increased">Increased</option>
          <option value="decreased">Decreased</option>
          <option value="same">Same</option>
        </select>
      </div>

      <div>
        <label>Questions (comma separated)</label>
        <input name="questions" type="text" class="input input-bordered w-full" placeholder="e.g., Pricing model? Funding options?" />
      </div>

      <button type="submit" disabled={isSubmitting()} class="btn btn-primary w-full mt-4">Next</button>
    </form>
  );
}

