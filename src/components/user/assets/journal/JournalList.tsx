// src/components/user/assets/JournalList.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { navigate } from "astro:transitions/client";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { journalsStore, journalsStoreLoading, initializeJournals } from "../../../../stores/userAssets/journals";
import Modal from "../../../appFeedback/Modal";
import JournalForm from "./JournalForm";
import JournalCard from "./JournalCard";
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalListProps {
  userId: string;
}

export default function JournalList(props: JournalListProps) {
  const $journals = useStore(journalsStore);
  const $journalsLoading = useStore(journalsStoreLoading);

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [userJournals, setUserJournals] = createSignal<Journal[] | []>([]);
  const [loading, setLoading] = createSignal(false);
  
  // Initialize journals when component mounts or userId changes
  createEffect(async () => {
    if (props.userId) {
      setLoading(true);
      await initializeJournals(props.userId);
      setLoading(false);
    }
  });

  // Update local state when store changes
  createEffect(() => {
    const journals = $journals();
    setUserJournals(journals);
  });

  const handleViewDetails = (journal: Journal) => {
    navigate(`/assets/journal/${journal.id}`);
  };

  const handleFormSuccess = () => {
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'learning':
        return 'mdi:book-education';
      case 'progress':
        return 'mdi:progress-check';
      case 'insights':
        return 'mdi:lightbulb-on';
      case 'build-log':
        return 'mdi:hammer-wrench';
      case 'reflection':
        return 'mdi:account-heart';
      default:
        return 'mdi:notebook';
    }
  };

  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case 'learning':
        return 'Learning';
      case 'progress':
        return 'Progress';
      case 'insights':
        return 'Insights';
      case 'build-log':
        return 'Build Log';
      case 'reflection':
        return 'Reflection';
      default:
        return 'Journal';
    }
  };

  return (
    <div class="w-full mx-auto px-4 py-8">
      {/* Header */}
      <div class="flex justify-between items-center mb-8">
        <div>
          <h4 class="text-2xl font-bold text-gray-900">My Journal</h4>
          <p class="text-gray-600">Record your entrepreneurial journey and reflections</p>
        </div>
        <button
          class="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Icon icon="mdi:plus" class="mr-2" />
          New Journal Entry
        </button>
      </div>

      {/* Journals Grid */}
      <Show when={!loading()} fallback={
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }>
        <Show when={userJournals().length > 0} fallback={
          <div class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <Icon icon="mdi:notebook-outline" width={64} height={64} />
            </div>
            <h3 class="text-xl font-semibold mb-2">No journal entries yet</h3>
            <p class="text-gray-600 mb-6">Start documenting your entrepreneurial journey with your first journal entry</p>
            <button
              class="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Create Your First Entry
            </button>
          </div>
        }>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={userJournals()}>
              {(journal) => (
                <JournalCard
                  journal={journal}
                  onViewDetails={handleViewDetails}
                  categoryIcon={getCategoryIcon(journal.category)}
                  categoryLabel={getCategoryLabel(journal.category)}
                />
              )}
            </For>
          </div>
        </Show>
      </Show>

      {/* Add Journal Modal */}
      <Modal
        isOpen={showAddModal()}
        onClose={() => setShowAddModal(false)}
        size="lg"
      >
        <JournalForm 
          onSuccess={handleFormSuccess}
          userId={props.userId}
        />
      </Modal>
    </div>
  );
}