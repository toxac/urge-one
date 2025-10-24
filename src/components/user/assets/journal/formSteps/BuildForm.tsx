import { Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from 'zod';

const buildSchema = z.object({
  build_phase: z.string().optional(),
  is_launch: z.boolean().optional(),
  time_invested: z.number().optional(),
  technical_challenges: z.array(z.string()).optional(),
  validation_results: z.string().optional(),
  launch_type: z.string().optional(),
  metrics_tracked: z.array(z.string()).optional(),
});

interface BuildFormProps {
  initialData: any;
  onNext: (data: any) => void;
}

export default function BuildForm(props: BuildFormProps) {
  const { form, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: props.onNext,
    extend: validator({ schema: buildSchema }),
  });

  return (
    <form use:form class="space-y-4">
      <div>
        <label>Build Phase</label>
        <input name="build_phase" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Is Launch?</label>
        <input name="is_launch" type="checkbox" class="checkbox" />
      </div>

      <div>
        <label>Time Invested (hours)</label>
        <input name="time_invested" type="number" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Technical Challenges (comma separated)</label>
        <input name="technical_challenges" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Validation Results</label>
        <textarea name="validation_results" class="textarea textarea-bordered w-full" rows={3} />
      </div>

      <div>
        <label>Launch Type</label>
        <input name="launch_type" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Metrics Tracked (comma separated)</label>
        <input name="metrics_tracked" type="text" class="input input-bordered w-full" />
      </div>

      <button type="submit" disabled={isSubmitting()} class="btn btn-primary w-full mt-4">Next</button>
    </form>
  );
}
