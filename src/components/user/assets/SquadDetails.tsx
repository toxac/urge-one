// SquadDetails.tsx
import { createEffect, createSignal, Show, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { Icon } from "@iconify-icon/solid";
import {
  squadStore,
  squadStoreError,
} from "../../../stores/userAssets/squad";
import {
  squadUpdatesStore,
  initializeSquadUpdates,
} from "../../../stores/userAssets/squadUpdates";

interface SquadDetailsProps {
  memberId: string;
  onClose: () => void;
}

export default function SquadDetails(props: SquadDetailsProps) {
  const $store = useStore(squadStore);
  const $error = useStore(squadStoreError);
  const [loadingUpdates, setLoadingUpdates] = createSignal(true);
  const [updates, setUpdates] = createSignal([]);

  // Find the selected member
  const member = () => $store().find((m) => m.id === props.memberId);

  createEffect(() => {
    if (member()) {
      initializeSquadUpdates(member()!.user_id).then(() => {
        const allUpdates = squadUpdatesStore.get();
        // Filter updates related to this particular squad member
        const filtered = allUpdates.filter(
          (update) => update.cheer_squad_id === props.memberId
        );
        setUpdates(filtered);
        setLoadingUpdates(false);
      });
    }
  });

  return (
    <div class="p-4">
      <Show when={member()} fallback={<p>Member details not found.</p>}>
        <h2 class="text-xl font-bold mb-2">{member()!.name || member()!.email}</h2>
        <p class="mb-2">
          <strong>Relationship:</strong> {member()!.relationship || "N/A"}
        </p>
        <p class="mb-2">
          <strong>Status:</strong> {member()!.status || "Unknown"}
        </p>

        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Updates</h3>
          <Show when={loadingUpdates()}>
            <div class="flex justify-center py-4">
              <span class="loading loading-spinner loading-md text-primary"></span>
            </div>
          </Show>
          <Show when={!loadingUpdates() && updates().length > 0}>
            <div class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              <For each={updates()}>
                {(update) => (
                  <div class="py-2">
                    <p class="text-sm text-gray-700">{update.update_text}</p>
                    {update.update_link && (
                      <a
                        href={update.update_link}
                        class="text-blue-500 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                )}
              </For>
            </div>
          </Show>
          <Show when={!loadingUpdates() && updates().length === 0}>
            <p class="text-gray-500 text-sm">No updates available.</p>
          </Show>
        </div>
      </Show>
    </div>
  );
}
