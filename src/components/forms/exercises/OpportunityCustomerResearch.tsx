import { createSignal, createEffect, For, Show } from "solid-js";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { Icon } from "@iconify-icon/solid";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { updateOpportunity } from "../../../stores/userAssets/opportunities";
import type { Database } from "../../../../database.types";

type Opportunity = Database['public']['Tables']['user_opportunities']['Row'];
type OpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];

// Options for demographic fields
const demographicOptions = {
  age_ranges: [
    "18-24",
    "25-34", 
    "35-44",
    "45-54",
    "55-64",
    "65+",
    "All Ages"
  ],
  income_levels: [
    "Under $30k",
    "$30k - $60k",
    "$60k - $100k", 
    "$100k - $150k",
    "$150k - $250k",
    "$250k+",
    "Prefer not to say"
  ],
  education_levels: [
    "High School or Less",
    "Some College",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate or Professional",
    "Other"
  ]
};

const psychographicOptions = {
  values: [
    "Sustainability/Eco-friendly",
    "Convenience/Time-saving",
    "Health/Wellness",
    "Status/Prestige",
    "Cost-effectiveness/Value",
    "Innovation/Technology",
    "Community/Social Connection",
    "Luxury/Exclusivity",
    "Reliability/Durability",
    "Customization/Personalization"
  ],
  lifestyles: [
    "Urban/Professional",
    "Suburban/Family-oriented",
    "Rural/Outdoor",
    "Digital Nomad",
    "Health Conscious/Active",
    "Luxury/Affluent",
    "Budget Conscious/Frugal",
    "Tech Early Adopter",
    "Traditional/Conservative",
    "Minimalist/Essentialist"
  ]
};

const buyingBehaviorOptions = {
  research_methods: [
    "Online Search/Google",
    "Social Media",
    "Product Reviews",
    "Word of Mouth/Referrals",
    "In-store Research",
    "Industry Reports",
    "Professional Recommendations",
    "Trial/Demos",
    "Comparison Sites",
    "Influencer Content"
  ],
  purchase_triggers: [
    "Price/Discount",
    "Urgent Need",
    "Social Proof",
    "Limited Time Offer",
    "Life Event",
    "Recommendation",
    "Brand Trust",
    "Feature Update",
    "Competitor Dissatisfaction",
    "Convenience Factor"
  ],
  decision_factors: [
    "Price/Value",
    "Quality/Durability",
    "Brand Reputation",
    "Features/Capabilities",
    "Customer Service",
    "Convenience/Ease of Use",
    "Reviews/Ratings",
    "Warranty/Support",
    "Aesthetics/Design",
    "Environmental Impact"
  ]
};

const motivationOptions = [
  "Solve Specific Pain Point",
  "Save Time/Increase Efficiency",
  "Save Money/Cost Reduction",
  "Achieve Personal Goals",
  "Improve Quality of Life",
  "Gain Social Status/Recognition",
  "Reduce Stress/Anxiety",
  "Learn/Grow Skills",
  "Connect with Community",
  "Increase Safety/Security"
];

// Schema for customer research fields
const schema = z.object({
  demographics: z.object({
    age_range: z.string().min(1, "Age range is required"),
    income_level: z.string().min(1, "Income level is required"),
    profession: z.string().min(1, "Profession is required").max(100, "Must be less than 100 characters"),
    location: z.string().min(1, "Location is required").max(100, "Must be less than 100 characters"),
    education: z.string().min(1, "Education level is required")
  }),
  psychographics: z.object({
    values: z.array(z.string()).min(1, "Select at least one value"),
    lifestyle: z.array(z.string()).min(1, "Select at least one lifestyle"),
    pain_points: z.array(z.string()).min(1, "Add at least one pain point")
  }),
  buying_behaviour: z.object({
    research_methods: z.array(z.string()).min(1, "Select at least one research method"),
    purchase_triggers: z.array(z.string()).min(1, "Select at least one purchase trigger"),
    decision_factors: z.array(z.string()).min(1, "Select at least one decision factor")
  }),
  motivations: z.array(z.string()).min(1, "Select at least one motivation")
});

interface ComponentProps {
  opportunity: Opportunity;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OpportunityCustomerResearch(props: ComponentProps) {
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [customPainPoints, setCustomPainPoints] = createSignal<string[]>([]);
  const [newPainPoint, setNewPainPoint] = createSignal("");

  // Parse existing data or set defaults
  const existingDemographics = props.opportunity.target_demographics as any || {};
  const existingPsychographics = props.opportunity.target_psychographics as any || {};
  const existingBuyingBehaviour = props.opportunity.target_buying_behaviour as any || {};
  const existingMotivations = props.opportunity.target_motivations as any || [];

  const { form, errors, isSubmitting, touched } = createForm({
    initialValues: {
      demographics: {
        age_range: existingDemographics.age_range || "",
        income_level: existingDemographics.income_level || "",
        profession: existingDemographics.profession || "",
        location: existingDemographics.location || "",
        education: existingDemographics.education || ""
      },
      psychographics: {
        values: existingPsychographics.values || [],
        lifestyle: existingPsychographics.lifestyle || [],
        pain_points: existingPsychographics.pain_points || []
      },
      buying_behaviour: {
        research_methods: existingBuyingBehaviour.research_methods || [],
        purchase_triggers: existingBuyingBehaviour.purchase_triggers || [],
        decision_factors: existingBuyingBehaviour.decision_factors || []
      },
      motivations: existingMotivations || []
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const updates: OpportunityUpdate = {
          target_demographics: values.demographics,
          target_psychographics: values.psychographics,
          target_buying_behaviour: values.buying_behaviour,
          target_motivations: values.motivations,
          updated_at: currentDate.toISOString(),
        };

        const { success, data, error } = await updateOpportunity(props.opportunity.id, updates);

        if (data && success) {
          notify.success("Customer research data was successfully updated.", "Success!");
          setSuccess(true);
          if (props.onSuccess) {
            setTimeout(() => props.onSuccess!(), 1500);
          }
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error updating customer research:', error);
        notify.error("Something went wrong while updating customer research data.", "Failed");
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema })
  });

  // Pain point management
  const addCustomPainPoint = () => {
    if (newPainPoint().trim() && !customPainPoints().includes(newPainPoint().trim())) {
      setCustomPainPoints(prev => [...prev, newPainPoint().trim()]);
      setNewPainPoint("");
    }
  };

  const removeCustomPainPoint = (index: number) => {
    setCustomPainPoints(prev => prev.filter((_, i) => i !== index));
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
            Customer research data has been updated successfully.
          </p>
        </div>
      </Show>

      <Show when={!success()}>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Customer Research: {props.opportunity.title}
          </h2>
          <p class="text-gray-600 text-sm">
            Define your target customer profile and understand their behaviors, motivations, and characteristics.
          </p>
        </div>

        <form use:form class="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
          {/* Demographics Section */}
          <div class="border-b pb-6">
            <h3 class="text-lg font-semibold mb-4">Demographics</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age Range */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Age Range</span>
                </label>
                <select
                  class="select select-bordered"
                  name="demographics.age_range"
                >
                  <option disabled value="">Select age range</option>
                  <For each={demographicOptions.age_ranges}>
                    {(range) => (
                      <option value={range} selected={range === existingDemographics.age_range}>
                        {range}
                      </option>
                    )}
                  </For>
                </select>
                <Show when={errors().demographics?.age_range && touched().demographics?.age_range}>
                  <span class="text-sm text-red-600 mt-1">{errors().demographics.age_range}</span>
                </Show>
              </div>

              {/* Income Level */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Income Level</span>
                </label>
                <select
                  class="select select-bordered"
                  name="demographics.income_level"
                >
                  <option disabled value="">Select income level</option>
                  <For each={demographicOptions.income_levels}>
                    {(income) => (
                      <option value={income} selected={income === existingDemographics.income_level}>
                        {income}
                      </option>
                    )}
                  </For>
                </select>
                <Show when={errors().demographics?.income_level && touched().demographics?.income_level}>
                  <span class="text-sm text-red-600 mt-1">{errors().demographics.income_level}</span>
                </Show>
              </div>

              {/* Profession */}
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text font-medium">Profession/Occupation</span>
                </label>
                <input
                  type="text"
                  class="input input-bordered"
                  name="demographics.profession"
                  placeholder="e.g., Software Engineer, Marketing Manager, Student"
                />
                <Show when={errors().demographics?.profession && touched().demographics?.profession}>
                  <span class="text-sm text-red-600 mt-1">{errors().demographics.profession}</span>
                </Show>
              </div>

              {/* Location */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Location</span>
                </label>
                <input
                  type="text"
                  class="input input-bordered"
                  name="demographics.location"
                  placeholder="e.g., Urban USA, Europe, Global"
                />
                <Show when={errors().demographics?.location && touched().demographics?.location}>
                  <span class="text-sm text-red-600 mt-1">{errors().demographics.location}</span>
                </Show>
              </div>

              {/* Education */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Education Level</span>
                </label>
                <select
                  class="select select-bordered"
                  name="demographics.education"
                >
                  <option disabled value="">Select education level</option>
                  <For each={demographicOptions.education_levels}>
                    {(education) => (
                      <option value={education} selected={education === existingDemographics.education}>
                        {education}
                      </option>
                    )}
                  </For>
                </select>
                <Show when={errors().demographics?.education && touched().demographics?.education}>
                  <span class="text-sm text-red-600 mt-1">{errors().demographics.education}</span>
                </Show>
              </div>
            </div>
          </div>

          {/* Psychographics Section */}
          <div class="border-b pb-6">
            <h3 class="text-lg font-semibold mb-4">Psychographics</h3>
            
            {/* Values */}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Core Values</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                <For each={psychographicOptions.values}>
                  {(value) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="psychographics.values"
                        value={value}
                        class="checkbox checkbox-sm"
                        checked={existingPsychographics.values?.includes(value)}
                      />
                      <span class="text-sm">{value}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().psychographics?.values && touched().psychographics?.values}>
                <span class="text-sm text-red-600 mt-1">{errors().psychographics.values}</span>
              </Show>
            </div>

            {/* Lifestyle */}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Lifestyle</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                <For each={psychographicOptions.lifestyles}>
                  {(lifestyle) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="psychographics.lifestyle"
                        value={lifestyle}
                        class="checkbox checkbox-sm"
                        checked={existingPsychographics.lifestyle?.includes(lifestyle)}
                      />
                      <span class="text-sm">{lifestyle}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().psychographics?.lifestyle && touched().psychographics?.lifestyle}>
                <span class="text-sm text-red-600 mt-1">{errors().psychographics.lifestyle}</span>
              </Show>
            </div>

            {/* Pain Points */}
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Pain Points</span>
              </label>
              <div class="space-y-2">
                {/* Custom Pain Points Input */}
                <div class="flex gap-2 mb-2">
                  <input
                    type="text"
                    class="input input-bordered flex-1"
                    placeholder="Add a specific pain point..."
                    value={newPainPoint()}
                    onInput={(e) => setNewPainPoint(e.currentTarget.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPainPoint())}
                  />
                  <button
                    type="button"
                    onClick={addCustomPainPoint}
                    disabled={!newPainPoint().trim()}
                    class="btn btn-primary btn-outline"
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                </div>
                
                {/* Display Custom Pain Points */}
                <Show when={customPainPoints().length > 0}>
                  <div class="flex flex-wrap gap-2">
                    <For each={customPainPoints()}>
                      {(painPoint, index) => (
                        <div class="badge badge-primary badge-lg gap-1">
                          {painPoint}
                          <button
                            type="button"
                            onClick={() => removeCustomPainPoint(index())}
                            class="hover:text-error"
                          >
                            <Icon icon="mdi:close" width={14} />
                          </button>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
              <Show when={errors().psychographics?.pain_points && touched().psychographics?.pain_points}>
                <span class="text-sm text-red-600 mt-1">{errors().psychographics.pain_points}</span>
              </Show>
            </div>
          </div>

          {/* Buying Behavior Section */}
          <div class="border-b pb-6">
            <h3 class="text-lg font-semibold mb-4">Buying Behavior</h3>
            
            {/* Research Methods */}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Research Methods</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                <For each={buyingBehaviorOptions.research_methods}>
                  {(method) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="buying_behaviour.research_methods"
                        value={method}
                        class="checkbox checkbox-sm"
                        checked={existingBuyingBehaviour.research_methods?.includes(method)}
                      />
                      <span class="text-sm">{method}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().buying_behaviour?.research_methods && touched().buying_behaviour?.research_methods}>
                <span class="text-sm text-red-600 mt-1">{errors().buying_behaviour.research_methods}</span>
              </Show>
            </div>

            {/* Purchase Triggers */}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">Purchase Triggers</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                <For each={buyingBehaviorOptions.purchase_triggers}>
                  {(trigger) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="buying_behaviour.purchase_triggers"
                        value={trigger}
                        class="checkbox checkbox-sm"
                        checked={existingBuyingBehaviour.purchase_triggers?.includes(trigger)}
                      />
                      <span class="text-sm">{trigger}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().buying_behaviour?.purchase_triggers && touched().buying_behaviour?.purchase_triggers}>
                <span class="text-sm text-red-600 mt-1">{errors().buying_behaviour.purchase_triggers}</span>
              </Show>
            </div>

            {/* Decision Factors */}
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Decision Factors</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                <For each={buyingBehaviorOptions.decision_factors}>
                  {(factor) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="buying_behaviour.decision_factors"
                        value={factor}
                        class="checkbox checkbox-sm"
                        checked={existingBuyingBehaviour.decision_factors?.includes(factor)}
                      />
                      <span class="text-sm">{factor}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().buying_behaviour?.decision_factors && touched().buying_behaviour?.decision_factors}>
                <span class="text-sm text-red-600 mt-1">{errors().buying_behaviour.decision_factors}</span>
              </Show>
            </div>
          </div>

          {/* Motivations Section */}
          <div class="pb-6">
            <h3 class="text-lg font-semibold mb-4">Motivations</h3>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Primary Motivations</span>
                <span class="label-text-alt">Select all that apply</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                <For each={motivationOptions}>
                  {(motivation) => (
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="motivations"
                        value={motivation}
                        class="checkbox checkbox-sm"
                        checked={existingMotivations.includes(motivation)}
                      />
                      <span class="text-sm">{motivation}</span>
                    </label>
                  )}
                </For>
              </div>
              <Show when={errors().motivations && touched().motivations}>
                <span class="text-sm text-red-600 mt-1">{errors().motivations}</span>
              </Show>
            </div>
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
                  Save Customer Research
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