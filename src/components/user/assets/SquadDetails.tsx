// SquadDetails.tsx
import { createMemo, Show, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { Icon } from "@iconify-icon/solid";
import { squadStore, squadStoreError } from "../../../stores/userAssets/squad";
import { squadUpdatesStore } from "../../../stores/userAssets/squadUpdates";

interface SquadDetailsProps {
  memberId: string;
  onClose: () => void;
}

export default function SquadDetails(props: SquadDetailsProps) {
  const $squad = useStore(squadStore);
  const $error = useStore(squadStoreError);
  const $updates = useStore(squadUpdatesStore);

  // Find selected member
  const member = createMemo(() => $squad().find((m) => m.id === props.memberId));

  // Filter updates for this member
  const memberUpdates = createMemo(() =>
    $updates().filter((update) => update.cheer_squad_id === props.memberId)
  );

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
          <Show when={memberUpdates().length > 0} fallback={<p class="text-gray-500 text-sm">No updates available.</p>}>
            <div class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              <For each={memberUpdates()}>
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
        </div>
      </Show>
    </div>
  );
}
