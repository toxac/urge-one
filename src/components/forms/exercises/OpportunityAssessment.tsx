import { createSignal, Show } from "solid-js";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "../../../stores/userAssets/opportunities";
import { assessment_options } from "../../../constants/exercises/opportunityEvaluation";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Risk comfort options
const riskComfortOptions = [
  "Very uncomfortable - High risk aversion, would avoid this level of risk",
  "Somewhat uncomfortable - Prefer lower risk, but can tolerate some",
  "Neutral - Comfortable with typical business risks",
  "Comfortable - Willing to take on above-average risks for potential returns",
  "Very comfortable - High risk tolerance, seek out high-risk opportunities"
];

type AssessmentField = 
  | 'skill_assessment_score'
  | 'capital_assessment_score'
  | 'resource_assessment_score'
  | 'alignment_assessment_score'
  | 'risk_comfort_score'
  | 'assessment_rationale';

// Schema for assessment fields
const schema = z.object({
  skill_assessment_score: z.number().min(1, "Skill assessment is required").max(5),
  capital_assessment_score: z.number().min(1, "Capital assessment is required").max(5),
  resource_assessment_score: z.number().min(1, "Resource assessment is required").max(5),
  alignment_assessment_score: z.number().min(1, "Alignment assessment is required").max(5),
  risk_comfort_score: z.number().min(1, "Risk comfort assessment is required").max(5),
  assessment_rationale: z.string().min(1, "Assessment rationale is required").max(1000, "Must be less than 1000 characters")
});

interface ComponentProps {
  opportunity: Opportunity;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OpportunityAssessmentForm(props: ComponentProps) {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);

  const { form, errors, isSubmitting, touched } = createForm({
    initialValues: {
      skill_assessment_score: props.opportunity.skill_assessment_score || "",
      capital_assessment_score: props.opportunity.capital_assessment_score || "",
      resource_assessment_score: props.opportunity.resource_assessment_score || "",
      alignment_assessment_score: props.opportunity.alignment_assessment_score || "",
      risk_comfort_score: props.opportunity.risk_comfort_score || "",
      assessment_rationale: props.opportunity.assessment_rationale || ""
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const updates: OpportunityUpdate = {
          skill_assessment_score: Number(values.skill_assessment_score),
          capital_assessment_score: Number(values.capital_assessment_score),
          resource_assessment_score: Number(values.resource_assessment_score),
          alignment_assessment_score: Number(values.alignment_assessment_score),
          risk_comfort_score: Number(values.risk_comfort_score),
          assessment_rationale: values.assessment_rationale,
          updated_at: currentDate.toISOString(),
        };

        const { success, data, error } = await updateOpportunity(props.opportunity.id, updates);

        if (data && success) {
          notify.success("Self-assessment data was successfully updated.", "Success!");
          setSuccess(true);
          if (props.onSuccess) {
            setTimeout(() => props.onSuccess!(), 1500);
          }
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error updating self-assessment:', error);
        notify.error("Something went wrong while updating self-assessment data.", "Failed");
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema })
  });

  // Helper function to render assessment select with options
  const renderAssessmentSelect = (fieldName: AssessmentField, label: string, options: string[], currentValue: number | null) => {
    const score = currentValue ? Number(currentValue) : null;
    return (
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">{label}</span>
        </label>
        <select
          class="select select-bordered w-full"
          name={fieldName}
          aria-label={`Select ${label.toLowerCase()}`}
        >
          <option disabled value="">Select score (1-5)</option>
          {options.map((option, index) => (
            <option 
              value={index + 1} 
              selected={score === index + 1}
            >
              {index + 1} - {option}
            </option>
          ))}
        </select>
        <Show when={errors()[fieldName] && touched()[fieldName]}>
          <span class="text-sm text-red-600 mt-1">{errors()[fieldName]}</span>
        </Show>
      </div>
    );
  };

  return (
    <div class="w-full bg-white rounded-lg">
      <Show when={success()}>
        <div class="w-full text-center py-8">
          <div class="text-green-600 mb-4">
            <Icon icon="mdi:check-circle" width={48} height={48} />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Success!</h3>
          <p class="text-gray-600">
            Self-assessment data has been updated successfully.
          </p>
        </div>
      </Show>

      <Show when={!success()}>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Self-Assessment: {props.opportunity.title}
          </h2>
          <p class="text-gray-600 text-sm">
            Evaluate your personal readiness and fit for pursuing this opportunity.
          </p>
        </div>

        <form use:form class="space-y-6">
          {/* Assessment Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Assessment */}
            {renderAssessmentSelect(
              "skill_assessment_score",
              "Skills Assessment",
              assessment_options.skills,
              props.opportunity.skill_assessment_score
            )}

            {/* Capital Assessment */}
            {renderAssessmentSelect(
              "capital_assessment_score",
              "Capital Assessment",
              assessment_options.capital,
              props.opportunity.capital_assessment_score
            )}

            {/* Resources Assessment */}
            {renderAssessmentSelect(
              "resource_assessment_score",
              "Resources Assessment",
              assessment_options.resources,
              props.opportunity.resource_assessment_score
            )}

            {/* Alignment Assessment */}
            {renderAssessmentSelect(
              "alignment_assessment_score",
              "Alignment Assessment",
              assessment_options.alignment,
              props.opportunity.alignment_assessment_score
            )}
          </div>

          {/* Risk Comfort Assessment */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Risk Comfort Level</span>
            </label>
            <select
              class="select select-bordered w-full"
              name="risk_comfort_score"
              aria-label="Select risk comfort level"
            >
              <option disabled value="">Select risk comfort level (1-5)</option>
              {riskComfortOptions.map((option, index) => (
                <option 
                  value={index + 1} 
                  selected={props.opportunity.risk_comfort_score === index + 1}
                >
                  {index + 1} - {option}
                </option>
              ))}
            </select>
            <Show when={errors().risk_comfort_score && touched().risk_comfort_score}>
              <span class="text-sm text-red-600 mt-1">{errors().risk_comfort_score}</span>
            </Show>
          </div>

          {/* Assessment Explanation */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Assessment Rationale</span>
              <span class="label-text-alt">{(props.opportunity.assessment_rationale?.length || 0)}/1000</span>
            </label>
            <textarea
              name="assessment_rationale"
              class="textarea textarea-bordered w-full h-40"
              placeholder="Explain your self-assessment scores. Discuss your strengths, weaknesses, risk tolerance, and any other factors that influenced your ratings. Consider: Why these scores? What gaps need to be addressed? How does your personal situation affect your ability to pursue this opportunity?"
              aria-label="Self-assessment rationale and explanation"
            />
            <label class="label">
              <span class="label-text-alt text-gray-500">
                Provide detailed reasoning for your self-assessment scores
              </span>
            </label>
            <Show when={errors().assessment_rationale && touched().assessment_rationale}>
              <span class="text-sm text-red-600 mt-1">{errors().assessment_rationale}</span>
            </Show>
          </div>

          {/* Action Buttons */}
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              class="btn btn-ghost"
              onClick={props.onCancel}
              disabled={isSubmitting()}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting()}
            >
              <Show when={isSubmitting()} fallback={
                <>
                  <Icon icon="mdi:content-save" width={16} height={16} class="mr-2" />
                  Save Self-Assessment
                </>
              }>
                <span class="loading loading-spinner loading-sm mr-2"></span>
                Saving...
              </Show>
            </button>
          </div>
        </form>
      </Show>
    </div>
  );
}