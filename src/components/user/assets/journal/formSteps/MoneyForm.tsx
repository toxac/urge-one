import { Show } from "solid-js";
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import * as z from 'zod';

const moneySchema = z.object({
  financial_activity: z.string().optional(),
  amount_involved: z.number().optional(),
  currency: z.string().optional(),
  financial_metrics: z.object({
    runway_extension: z.number().optional(),
    revenue_change: z.number().optional(),
    cost_reduction: z.number().optional(),
    valuation_impact: z.number().optional(),
  }).optional(),
  decision_factors: z.array(z.string()).optional(),
  risk_assessment: z.string().optional(),
});

interface MoneyFormProps {
  initialData: any;
  onNext: (data: any) => void;
}

export default function MoneyForm(props: MoneyFormProps) {
  const { form, errors, isSubmitting } = createForm({
    initialValues: props.initialData,
    onSubmit: props.onNext,
    extend: validator({ schema: moneySchema }),
  });

  return (
    <form use:form class="space-y-4">
      <div>
        <label>Financial Activity</label>
        <input name="financial_activity" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Amount Involved</label>
        <input name="amount_involved" type="number" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Currency</label>
        <input name="currency" type="text" class="input input-bordered w-full" />
      </div>

      <details>
        <summary>Financial Metrics (optional)</summary>
        <div>
          <label>Runway Extension</label>
          <input name="financial_metrics.runway_extension" type="number" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Revenue Change</label>
          <input name="financial_metrics.revenue_change" type="number" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Cost Reduction</label>
          <input name="financial_metrics.cost_reduction" type="number" class="input input-bordered w-full" />
        </div>
        <div>
          <label>Valuation Impact</label>
          <input name="financial_metrics.valuation_impact" type="number" class="input input-bordered w-full" />
        </div>
      </details>

      <div>
        <label>Decision Factors (comma separated)</label>
        <input name="decision_factors" type="text" class="input input-bordered w-full" />
      </div>

      <div>
        <label>Risk Assessment</label>
        <textarea name="risk_assessment" class="textarea textarea-bordered w-full" rows={3} />
      </div>

      <button type="submit" disabled={isSubmitting()} class="btn btn-primary w-full mt-4">Next</button>
    </form>
  );
}
