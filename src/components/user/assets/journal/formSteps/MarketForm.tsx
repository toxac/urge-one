import { Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from 'zod';

const marketSchema = z.object({
  activity_type: z.string().optional(),
  target_audience: z.string().optional(),
  channels_used: z.array(z.string()).optional(),
  results: z.object({
    leads_generated: z.number().optional(),
    conversions: z.number().optional(),
    feedback_received: z.array(z.string()).optional(),
    insights_gained: z.array(z.string()).optional(),
    cost_per_acquisition: z.number().optional(),
  }).optional(),
});

interface MarketFormProps {
  initialData: any;
  onNext: (data: any) => void;
}

export default function MarketForm(props: MarketFormProps) {
  const { form, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: props.onNext,
    extend: validator({ schema: marketSchema }),
  });

  return (
    <form use:form class="space-y-4">
      <div>
        <label>Activity Type</label>
        <input name="activity_type" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Target Audience</label>
        <input name="target_audience" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Channels Used (comma separated)</label>
        <input name="channels_used" type="text" class="input input-bordered w-full" />
      </div>

      <details>
        <summary>Results (optional)</summary>
        <div>
          <label>Leads Generated</label>
          <input name="results.leads_generated" type="number" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Conversions</label>
          <input name="results.conversions" type="number" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Feedback Received (comma separated)</label>
          <input name="results.feedback_received" type="text" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Insights Gained (comma separated)</label>
          <input name="results.insights_gained" type="text" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Cost per Acquisition</label>
          <input name="results.cost_per_acquisition" type="number" class="input input-bordered w-full" />
        </div>
      </details>

      <button type="submit" disabled={isSubmitting()} class="btn btn-primary w-full mt-4">Next</button>
    </form>
  );
}
