// SquadList.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { squadStore, squadStoreLoading, squadStoreError, initializeSquad, deleteSquadMember } from "../../../stores/userAssets/squad";
import { notify } from "../../../stores/notifications";
import SquadDetails from "./SquadDetails";

interface SquadListProps {
  userId: string;
}

export default function SquadList(props: SquadListProps) {
  const $squad = useStore(squadStore);
  const $loading = useStore(squadStoreLoading);
  const $error = useStore(squadStoreError);

  const [loading, setLoading] = createSignal(false);
  const [showDetailsModal, setShowDetailsModal] = createSignal(false);
  const [selectedMemberId, setSelectedMemberId] = createSignal<string | null>(null);

  createEffect(() => {
    setLoading($loading());
  });

  createEffect(() => {
    if (props.userId) {
      initializeSquad(props.userId);
    }
  });

  const handleDelete = async (id: string, name: string | null) => {
    try {
      const { success, error } = await deleteSquadMember(id);
      if (error) throw error;
      if (success) {
        notify.success(`Squad member ${name || ""} deleted`, "Success");
      }
    } catch (error) {
      console.error(error);
      notify.error("Failed to delete squad member", "Error");
    }
  };

  const handleShowDetails = (id: string) => {
    setSelectedMemberId(id);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMemberId(null);
    setShowDetailsModal(false);
  };

  return (
    <div class="w-full mx-auto px-4 py-8">
      <Show when={loading()}>
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Show>

      <Show when={$error()}>
        <div class="alert alert-error">
          Error loading squad members: {$error()?.message}
        </div>
      </Show>

      <Show when={$squad().length === 0 && !loading()}>
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:account-group-outline" width={64} height={64} />
          </div>
          <h3 class="text-xl font-semibold mb-2">Your cheer squad is empty.</h3>
          <p class="text-gray-600 mb-6">
            Add some members to get support and accountability.
          </p>
        </div>
      </Show>

      <Show when={$squad().length > 0 && !loading()}>
        <div class="grid grid-cols-1 gap-4">
          <For each={$squad()}>
            {(member) => (
              <div class="shadow-lg px-8 py-4 mt-8 rounded-lg">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-lg font-semibold">{member.name || member.email}</p>
                    <p class="text-sm text-gray-600">{member.relationship || "Relationship not specified"}</p>
                    <div>
                      <span class={`badge badge-sm ${member.status === "request accepted" ? "badge-success" : "badge-warning"}`}>
                        {member.status || "Unknown Status"}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <button
                      class="btn btn-ghost btn-circle"
                      onClick={() => handleShowDetails(member.id)}
                      aria-label="View details"
                      title="View details"
                    >
                      <Icon icon="mdi:eye-outline" class="text-lg" />
                    </button>
                    <button
                      class="btn btn-ghost btn-circle"
                      onClick={() => handleDelete(member.id, member.name)}
                      aria-label="Remove member"
                      title="Remove member"
                    >
                      <Icon icon="mdi:delete-outline" class="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={showDetailsModal() && selectedMemberId()}>
        <SquadDetails
          memberId={selectedMemberId()!}
          onClose={handleCloseModal}
        />
      </Show>
    </div>
  );
}
