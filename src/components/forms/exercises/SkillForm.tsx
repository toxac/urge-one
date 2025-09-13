import { createSignal } from "solid-js";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";
import { For } from 'solid-js';
import { skillsData } from "../../../constants/exercises/skills"; // Import your skills data

const proficiencyLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Intermediate" },
    { value: 3, label: "Advanced" },
    { value: 4, label: "Expert" },
];

// Zod schema for validation
const schema = z.object({
    name: z.string().min(1, "Skill name is required"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string(),
    level: z.number().min(1, "Please select a proficiency level"),
    description: z.string().optional(),
    yearsOfExperience: z
        .number()
        .min(0, "Years of experience must be a positive number")
        .optional(),
    professionalTraining: z.string().optional(),
    projectExamples: z.string().optional(),
});

interface FormProps {
    contentMetaId: string;
}

export default function SkillsAssessmentForm(props: FormProps) {
    const [selectedCategory, setSelectedCategory] = createSignal<string>("");
    const { form, data, errors, isValid, reset } = createForm({
        initialValues: {
            name: "",
            category: "",
            subcategory: "",
            level: 1,
            description: "",
            yearsOfExperience: undefined,
            professionalTraining: "",
            projectExamples: "",
        },
        onSubmit: async (values) => {
            console.log("Form submitted:", values);
            // Add your submission logic here (e.g., API call to save the data)
            reset(); // Reset the form after successful submission
            setSelectedCategory(""); // Reset the selected category
        },
        extend: validator({ schema }),
    });

    return (
        <section class="w-full p-6 bg-white rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Skills Assessment</h2>
            <form use:form class="flex flex-col gap-3 md:gap-6">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">Category</span>
                    </label>
                    <select
                        class="select select-bordered w-full"
                        name="category"
                        value={selectedCategory()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        <For each={skillsData}>
                            {(categoryData) => (
                                <option value={categoryData.category}>
                                    {categoryData.category}
                                </option>
                            )}
                        </For>
                    </select>
                </div>

                {selectedCategory() && (
                    <div>
                        {/* Conditionally render subcategory dropdown or input field */}
                        {selectedCategory() !== "Other" ? (
                            <div class="form-control w-full">
                                <label class="label">
                                    <span class="label-text">Subcategory</span>
                                </label>
                                <select class="select select-bordered w-full" name="subcategory">
                                    <option value="">Select a subcategory</option>
                                    <For each={skillsData.find(
                                        (categoryData) =>
                                            categoryData.category === selectedCategory()
                                    )?.subcategories}>
                                        {(subcategory) => (
                                            <option value={subcategory.name}>
                                                {subcategory.name}
                                            </option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        ) : (
                            <div class="form-control w-full">
                                <label class="label">
                                    <span class="label-text">Skill Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your skill"
                                    class="input input-bordered w-full"
                                />
                            </div>
                        )}

                        {/* Skill Proficiency */}
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Proficiency Level</span>
                            </label>
                            <select class="select select-bordered w-full" name="level">
                                <option value="">Select a proficiency level</option>
                                <For each={proficiencyLevels}>
                                    {(level) => (
                                        <option value={level.value}>
                                            {level.label}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </div>

                        {/* Description */}
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Remarks/Description (optional)</span>
                            </label>
                            <textarea
                                class="textarea textarea-bordered h-24"
                                name="description"
                                placeholder="Add any remarks or descriptions about your skill"
                            ></textarea>
                        </div>

                        {/* Years of Experience */}
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Years of Experience (optional)</span>
                            </label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                placeholder="Enter your years of experience"
                                class="input input-bordered w-full"
                            />
                        </div>

                        {/* Professional Training */}
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Professional Training (optional)</span>
                            </label>
                            <select class="select select-bordered w-full" name="professionalTraining">
                                <option value="">Select an option</option>
                                <option value="none">None</option>
                                <option value="certification">Certification</option>
                                <option value="degree">Degree</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Project Examples */}
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">
                                    Project Examples/Portfolio (optional)
                                </span>
                            </label>
                            <textarea
                                class="textarea textarea-bordered h-24"
                                name="projectExamples"
                                placeholder="Provide links or descriptions of your projects"
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" class="btn btn-neutral" disabled={!isValid()}>
                    Save & Add Another
                </button>
            </form>
        </section>
    );
}

