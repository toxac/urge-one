// JournalList.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { journalsStore, journalsStoreLoading, initializeJournals, deleteJournal } from "../../../../stores/userAssets/journals";
import JournalCard from "./JournalCard";
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalListProps {
  userId: string;
}

export default function JournalList(props: JournalListProps) {
  const $journals = useStore(journalsStore);
  const $loading = useStore(journalsStoreLoading);
  const [loading, setLoading] = createSignal(true);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);

  // Initialize journals when userId changes
  createEffect(() => {
    if($loading()){
        return;
    } else {
        setLoading(false);
    }
  });

  // Delete handler
  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteJournal(id);
    setDeletingId(null);
  }

  return (
    <div class="w-full mx-auto px-4 py-8">
      <h4 class="mb-4">Your Journal Entries</h4>

      <Show when={!loading()} fallback={
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }>
        <Show when={$journals().length > 0} fallback={
          <div class="text-center py-12 text-gray-600">
            <p>No journal entries found. Start your first journal!</p>
          </div>
        }>
          <div class="grid grid-cols-1 gap-4">
            <For each={$journals()}>
              {(journal) => (
                <JournalCard 
                  journal={journal} 
                  onDelete={() => handleDelete(journal.id)} 
                  deleting={deletingId() === journal.id}
                />
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
