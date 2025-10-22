// src/components/user/assets/JournalCard.tsx
import { createSignal, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { manageJournals } from "../../../../stores/userAssets/journals";
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalCardProps {
  journal: Journal;
  onViewDetails: (journal: Journal) => void;
  categoryIcon: string;
  categoryLabel: string;
}

export default function JournalCard(props: JournalCardProps) {
  const [isDeleting, setIsDeleting] = createSignal(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;
    
    setIsDeleting(true);
    try {
      manageJournals('delete', { id: props.journal.id });
      // TODO: Add actual Supabase delete call
    } catch (error) {
      console.error("Failed to delete journal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasCTA = props.journal.cta_type || props.journal.cta_description;

  return (
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200">
      <div class="card-body p-6">
        {/* Header */}
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <Icon 
              icon={props.categoryIcon} 
              class="text-primary text-lg" 
            />
            <span class="badge badge-outline badge-sm">
              {props.categoryLabel}
            </span>
          </div>
          <Show when={props.journal.is_public}>
            <span class="badge badge-success badge-sm">Public</span>
          </Show>
        </div>

        {/* Title */}
        <h3 class="card-title text-lg font-semibold line-clamp-2 mb-2">
          {props.journal.title || "Untitled Entry"}
        </h3>

        {/* Content Preview */}
        <Show when={props.journal.content}>
          <p class="text-gray-600 text-sm line-clamp-3 mb-4">
            {props.journal.content}
          </p>
        </Show>

        {/* CTA Badge */}
        <Show when={hasCTA}>
          <div class="mb-4">
            <span class="badge badge-warning badge-sm">
              <Icon icon="mdi:bullhorn" class="mr-1" />
              CTA: {props.journal.cta_type}
            </span>
          </div>
        </Show>

        {/* Mood & Tags */}
        <div class="flex flex-wrap gap-2 mb-4">
          <Show when={props.journal.mood}>
            <span class="badge badge-ghost badge-sm">
              <Icon icon="mdi:emotion" class="mr-1" />
              {props.journal.mood}
            </span>
          </Show>
          <Show when={props.journal.tags && props.journal.tags.length > 0}>
            <For each={props.journal.tags?.slice(0, 2)}>
              {(tag) => (
                <span class="badge badge-outline badge-sm">#{tag}</span>
              )}
            </For>
          </Show>
        </div>

        {/* Footer */}
        <div class="card-actions justify-between items-center">
          <div class="text-xs text-gray-500">
            {formatDate(props.journal.created_at)}
          </div>
          <div class="flex space-x-2">
            <button
              class="btn btn-ghost btn-sm"
              onClick={() => props.onViewDetails(props.journal)}
            >
              <Icon icon="mdi:eye" />
            </button>
            <button
              class="btn btn-ghost btn-sm text-error"
              onClick={handleDelete}
              disabled={isDeleting()}
            >
              <Show when={!isDeleting()} fallback={
                <span class="loading loading-spinner loading-xs"></span>
              }>
                <Icon icon="mdi:delete" />
              </Show>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}