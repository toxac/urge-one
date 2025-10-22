// src/components/forms/journal/JournalForm.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { manageJournals } from "../../../../stores/userAssets/journals";
import { supabaseBrowserClient } from "../../../../lib/supabase/client";
import type { Database } from "../../../../../database.types";
import type { 
  JournalCategory,
  JournalProgressEntryData,
  JournalChallengeEntryData,
  JournalLearningEntryData,
  JournalInsightEntryData,
  JournalBuildLogEntryData,
  JournalReflectionEntryData
} from "../../../../../types/urgeTypes";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalFormProps {
  onSuccess: () => void;
  userId: string;
  journal?: Journal; // For edit mode
}

const JOURNAL_CATEGORIES: { value: JournalCategory; label: string; icon: string }[] = [
  { value: "learning", label: "Learning", icon: "mdi:book-education" },
  { value: "progress", label: "Progress", icon: "mdi:progress-check" },
  { value: "insights", label: "Insights", icon: "mdi:lightbulb-on" },
  { value: "build-log", label: "Build Log", icon: "mdi:hammer-wrench" },
  { value: "reflection", label: "Reflection", icon: "mdi:account-heart" }
];

const CTA_TYPES = [
  "help",
  "feedback", 
  "guidance",
  "emotional_support",
  "collaboration",
  "resources",
  "other"
];

const MOOD_OPTIONS = [
  "excited",
  "motivated",
  "challenged",
  "frustrated",
  "proud",
  "uncertain",
  "grateful",
  "overwhelmed"
];

export default function JournalForm(props: JournalFormProps) {
  const isEditMode = () => !!props.journal;

  // Basic journal fields
  const [title, setTitle] = createSignal(props.journal?.title || "");
  const [content, setContent] = createSignal(props.journal?.content || "");
  const [category, setCategory] = createSignal<JournalCategory>(
    (props.journal?.category as JournalCategory) || "reflection"
  );
  const [mood, setMood] = createSignal(props.journal?.mood || "");
  const [tags, setTags] = createSignal(props.journal?.tags || []);
  const [currentTag, setCurrentTag] = createSignal("");
  const [isPublic, setIsPublic] = createSignal(props.journal?.is_public || false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  // CTA fields
  const [hasCTA, setHasCTA] = createSignal(
    !!(props.journal?.cta_type || props.journal?.cta_description)
  );
  const [ctaType, setCtaType] = createSignal(props.journal?.cta_type || "");
  const [ctaDescription, setCtaDescription] = createSignal(props.journal?.cta_description || "");
  const [ctaContactMethod, setCtaContactMethod] = createSignal(props.journal?.cta_contact_method || "");

  // Category-specific data
  const [entryData, setEntryData] = createSignal({});

  const addTag = () => {
    const tag = currentTag().trim();
    if (tag && !tags().includes(tag)) {
      setTags([...tags(), tag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags().filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const journalData = {
        title: title(),
        content: content(),
        category: category(),
        mood: mood(),
        tags: tags(),
        is_public: isPublic(),
        user_id: props.userId,
        cta_type: hasCTA() ? ctaType() : null,
        cta_description: hasCTA() ? ctaDescription() : null,
        cta_contact_method: hasCTA() ? ctaContactMethod() : null,
        entry_data: Object.keys(entryData()).length > 0 ? entryData() : null,
        updated_at: new Date().toISOString()
      };

      if (isEditMode()) {
        // Update existing journal
        const { error } = await supabaseBrowserClient
          .from('user_journals')
          .update(journalData)
          .eq('id', props.journal!.id);

        if (error) throw error;

        manageJournals('update', { ...journalData, id: props.journal!.id });
      } else {
        // Create new journal
        const { data, error } = await supabaseBrowserClient
          .from('user_journals')
          .insert([{ ...journalData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;

        manageJournals('create', data);
      }

      props.onSuccess();
    } catch (error) {
      console.error("Failed to save journal:", error);
      alert("Failed to save journal entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="w-full max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold">
          {isEditMode() ? "Edit Journal Entry" : "New Journal Entry"}
        </h3>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          onClick={props.onSuccess}
        >
          <Icon icon="mdi:close" />
        </button>
      </div>

      <form onSubmit={handleSubmit} class="space-y-6">
        {/* Basic Information */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Category</span>
            </label>
            <select
              class="select select-bordered"
              value={category()}
              onChange={(e) => setCategory(e.currentTarget.value as JournalCategory)}
              required
            >
              <For each={JOURNAL_CATEGORIES}>
                {(cat) => (
                  <option value={cat.value}>
                    <Icon icon={cat.icon} class="mr-2" />
                    {cat.label}
                  </option>
                )}
              </For>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Mood</span>
            </label>
            <select
              class="select select-bordered"
              value={mood()}
              onChange={(e) => setMood(e.currentTarget.value)}
            >
              <option value="">Select mood...</option>
              <For each={MOOD_OPTIONS}>
                {(moodOption) => (
                  <option value={moodOption}>
                    {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                  </option>
                )}
              </For>
            </select>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input
            type="text"
            class="input input-bordered"
            placeholder="Give your journal entry a title..."
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Content</span>
          </label>
          <textarea
            class="textarea textarea-bordered h-32"
            placeholder="Write your thoughts, reflections, or updates..."
            value={content()}
            onInput={(e) => setContent(e.currentTarget.value)}
            required
          />
        </div>

        {/* Tags */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Tags</span>
          </label>
          <div class="flex gap-2 mb-2">
            <input
              type="text"
              class="input input-bordered flex-1"
              placeholder="Add a tag..."
              value={currentTag()}
              onInput={(e) => setCurrentTag(e.currentTarget.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              class="btn btn-outline"
              onClick={addTag}
            >
              Add
            </button>
          </div>
          <Show when={tags().length > 0}>
            <div class="flex flex-wrap gap-2">
              <For each={tags()}>
                {(tag) => (
                  <span class="badge badge-lg gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      class="hover:text-error"
                    >
                      <Icon icon="mdi:close" />
                    </button>
                  </span>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Category-specific Fields */}
        <Show when={category() === "progress"}>
          <ProgressEntryForm 
            data={props.journal?.entry_data as JournalProgressEntryData}
            onUpdate={setEntryData}
          />
        </Show>

        <Show when={category() === "learning"}>
          <LearningEntryForm 
            data={props.journal?.entry_data as JournalLearningEntryData}
            onUpdate={setEntryData}
          />
        </Show>

        {/* Add other category forms similarly */}

        {/* CTA Section */}
        <div class="border-t pt-6">
          <div class="form-control">
            <label class="cursor-pointer label justify-start gap-4">
              <input
                type="checkbox"
                class="checkbox checkbox-primary"
                checked={hasCTA()}
                onChange={(e) => setHasCTA(e.currentTarget.checked)}
              />
              <span class="label-text font-semibold">Add Call to Action (CTA)</span>
            </label>
            <p class="text-sm text-gray-600 ml-12">
              Ask for help, feedback, or support from the community
            </p>
          </div>

          <Show when={hasCTA()}>
            <div class="mt-4 space-y-4 ml-12">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">CTA Type</span>
                </label>
                <select
                  class="select select-bordered"
                  value={ctaType()}
                  onChange={(e) => setCtaType(e.currentTarget.value)}
                >
                  <option value="">Select type...</option>
                  <For each={CTA_TYPES}>
                    {(type) => (
                      <option value={type}>
                        {type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    )}
                  </For>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">CTA Description</span>
                </label>
                <textarea
                  class="textarea textarea-bordered"
                  placeholder="What kind of help or support are you looking for?"
                  value={ctaDescription()}
                  onInput={(e) => setCtaDescription(e.currentTarget.value)}
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Preferred Contact Method</span>
                </label>
                <input
                  type="text"
                  class="input input-bordered"
                  placeholder="e.g., email, Slack, comment on this post..."
                  value={ctaContactMethod()}
                  onInput={(e) => setCtaContactMethod(e.currentTarget.value)}
                />
              </div>
            </div>
          </Show>
        </div>

        {/* Privacy */}
        <div class="form-control">
          <label class="cursor-pointer label justify-start gap-4">
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              checked={isPublic()}
              onChange={(e) => setIsPublic(e.currentTarget.checked)}
            />
            <span class="label-text">Make this entry public</span>
          </label>
          <p class="text-sm text-gray-600 ml-12">
            Public entries can be seen by other entrepreneurs in the network
          </p>
        </div>

        {/* Submit Button */}
        <div class="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            class="btn btn-ghost"
            onClick={props.onSuccess}
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
                <Icon icon={isEditMode() ? "mdi:check" : "mdi:plus"} class="mr-2" />
                {isEditMode() ? "Update Entry" : "Create Entry"}
              </>
            }>
              <span class="loading loading-spinner loading-sm"></span>
              {isEditMode() ? "Updating..." : "Creating..."}
            </Show>
          </button>
        </div>
      </form>
    </div>
  );
}