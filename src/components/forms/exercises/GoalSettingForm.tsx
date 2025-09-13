import { createSignal } from 'solid-js';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { z } from 'zod';

// Zod schema for validation
const schema = z.object({
    description_of_goal: z.string().min(10, 'Description must be at least 10 characters'),
    financial_goal: z.number().min(0, 'Financial goal must be a positive number'),
    spending_budget: z.number().min(0, 'Spending budget must be a positive number'),
    weekly_time_commitment: z.number().min(0, 'Weekly time commitment must be a positive number'),
    time_to_launch: z.number().min(0, 'Time to launch must be a positive number'),
    weekly_survival_budget: z.number().min(0, 'Weekly survival budget must be a positive number'),
    currency: z.string().min(1, 'Currency is required'),
});

interface FormProps {
    contentMetaid: string;
}

function GoalSettingForm(props: FormProps) {
    const [error, setError] = createSignal('');

    const { form, data, errors, isValid } = createForm({
        initialValues: {
            description_of_goal: '',
            financial_goal: 0,
            spending_budget: 0,
            weekly_time_commitment: 0,
            time_to_launch: 0,
            weekly_survival_budget: 0,
            currency: '',
        },
        onSubmit: async (values) => {
            console.log('Form submitted:', values);
            // Add your submission logic here (e.g., API call)
        },
        extend: validator({ schema }),
    });

    return (
        <section class="w-full p-6 bg-white rounded-lg">
            <form use:form class="flex flex-col gap-3 md:gap-6">
                {/* Description of Goal */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Description of Goal</span>
                    </div>
                    <textarea
                        class="textarea textarea-bordered h-24"
                        name="description_of_goal"
                        placeholder="Describe your goal"
                    ></textarea>
                    {errors().description_of_goal && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().description_of_goal}</span>
                        </div>
                    )}
                </label>

                {/* Financial Goal */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Financial Goal</span>
                    </div>
                    <input
                        type="number"
                        name="financial_goal"
                        placeholder="Enter financial goal"
                        class="input input-bordered w-full"
                    />
                    {errors().financial_goal && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().financial_goal}</span>
                        </div>
                    )}
                </label>

                {/* Spending Budget */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Spending Budget</span>
                    </div>
                    <input
                        type="number"
                        name="spending_budget"
                        placeholder="Enter spending budget"
                        class="input input-bordered w-full"
                    />
                    {errors().spending_budget && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().spending_budget}</span>
                        </div>
                    )}
                </label>

                {/* Weekly Time Commitment */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Weekly Time Commitment (hours)</span>
                    </div>
                    <input
                        type="number"
                        name="weekly_time_commitment"
                        placeholder="Enter weekly time commitment"
                        class="input input-bordered w-full"
                    />
                    {errors().weekly_time_commitment && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().weekly_time_commitment}</span>
                        </div>
                    )}
                </label>

                {/* Time to Launch */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Time to Launch (weeks)</span>
                    </div>
                    <input
                        type="number"
                        name="time_to_launch"
                        placeholder="Enter time to launch"
                        class="input input-bordered w-full"
                    />
                    {errors().time_to_launch && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().time_to_launch}</span>
                        </div>
                    )}
                </label>

                {/* Weekly Survival Budget */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Weekly Survival Budget</span>
                    </div>
                    <input
                        type="number"
                        name="weekly_survival_budget"
                        placeholder="Enter weekly survival budget"
                        class="input input-bordered w-full"
                    />
                    {errors().weekly_survival_budget && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().weekly_survival_budget}</span>
                        </div>
                    )}
                </label>

                {/* Currency */}
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Currency</span>
                    </div>
                    <input
                        type="text"
                        name="currency"
                        placeholder="Enter currency (e.g., USD, EUR)"
                        class="input input-bordered w-full"
                    />
                    {errors().currency && (
                        <div class="label">
                            <span class="label-text-alt text-red-500">{errors().currency}</span>
                        </div>
                    )}
                </label>

                {/* Submit Button */}
                <button type="submit" class="btn btn-neutral" disabled={!isValid()}>
                    Submit
                </button>
            </form>
        </section>
    );
}

export default GoalSettingForm;
