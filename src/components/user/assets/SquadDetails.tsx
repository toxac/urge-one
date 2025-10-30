// SquadDetails.tsx
import { createSignal, Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import { useStore } from "@nanostores/solid";
import { squadStore, squadStoreError } from "../../../stores/userAssets/squad";
import { squadUpdatesStore, initializeSquadUpdates } from "../../../stores/userAssets/squadUpdates";

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
  const member = () => $store().find(m => m.id === props.memberId);

  // Initialize updates when component mounts
  createEffect(() => {
    if (props.memberId) {
      // Load updates for current user
      initializeSquadUpdates(member()?.user_id || "").then(() => {
        // Filter updates for specific member if needed
        const allUpdates = squadUpdatesStore.get();
        setUpdates(allUpdates);
        setLoadingUpdates(false);
      });
    }
  });

  return (
    <Modal isOpen={true} onClose={props.onClose} size="xl" >
      {member() ? (
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{member()!.name || member()!.email}</h2>
          <p class="mb-2"><strong>Relationship:</strong> {member()!.relationship || "N/A"}</p>
          <p class="mb-2"><strong>Status:</strong> {member()!.status || "Unknown"}</p>
          {/* Additional details if available */}
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Updates</h3>
            <Show when={loadingUpdates()}>
              <div class="flex justify-center py-4">
                <span class="loading loading-spinner loading-md text-primary"></span>
              </div>
            </Show>
            <Show when={!loadingUpdates() && updates().length > 0}">
              <div class="divide-y divide-gray-200">
                <For each={updates()}>
                  {(update) => (
                    <div class="py-2">
                      <p class="text-sm text-gray-700">{update.update_text}</p>
                      {update.update_link && (
                        <a href={update.update_link} class="text-blue-500 text-xs" target="_blank" rel="noopener noreferrer">
                          View Details
                        </a>
                      )}
                    </div>
                  )}
                </For>
              </div>
            </Show>
            <Show when={!loadingUpdates() && updates().length === 0}">
              <p class="text-gray-500 text-sm">No updates available.</p>
            </Show>
          </div>
        </div>
      ) : (
        <div class="p-4">
          <p>Member details not found.</p>
        </div>
      )}
    </Modal>
  );
}
