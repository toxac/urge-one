// SquadList.tsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import { useStore } from "@nanostores/solid";
import { squadInitialized, squadUpdatesInitialized } from '../../../stores/userAssets/squadInitialization';
import {
  squadStore,
  squadStoreLoading,
  squadStoreError,
  initializeSquad,
  deleteSquadMember,
} from "../../../stores/userAssets/squad";
import { initializeSquadUpdates } from '../../../stores/userAssets/squadUpdates';
import { notify } from "../../../stores/notifications";
import SquadDetails from "./SquadDetails";
import SquadForm from "./SquadForm";
import Modal from "../../appFeedback/Modal";

interface SquadListProps {
  userId: string;
}

export default function SquadList(props: SquadListProps) {
  const $squad = useStore(squadStore);
  const $loading = useStore(squadStoreLoading);
  const $error = useStore(squadStoreError);
  const squadInit = useStore(squadInitialized);
    const squadUpdatesInit = useStore(squadUpdatesInitialized);

    const [combinedLoading, setCombinedLoading] = createSignal(true);
    const [combinedError, setCombinedError] = createSignal<string | null>(null);

  const [loading, setLoading] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  // Mode can be 'list' (default), 'form' (add), 'details' (view member)
  const [mode, setMode] = createSignal<"list" | "form" | "details">("list");
  const [selectedMemberId, setSelectedMemberId] = createSignal<string | null>(null);

  createEffect(() => {
    setLoading($loading());
  });

  createEffect(async () => {
  if (props.userId) {
    setCombinedLoading(true);
    setCombinedError(null);

    try {
      await initializeSquad(props.userId);
      await initializeSquadUpdates(props.userId);
    } catch (error) {
      setCombinedError('Failed to load squad data');
    } finally {
      setCombinedLoading(false);
    }
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

  const openDetailsModal = (id: string) => {
    setSelectedMemberId(id);
    setMode("details");
    setShowModal(true);
  };

  const openAddMemberModal = () => {
    setSelectedMemberId(null);
    setMode("form");
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedMemberId(null);
    setShowModal(false);
    setMode("list");
  };

  return (
    <div class="w-full mx-auto px-4 py-8">
      {/* Add Squad Member Button */}
      <div class="flex justify-end mb-4">
        <button class="btn btn-primary" onClick={openAddMemberModal}>
          <Icon icon="mdi:account-plus" class="mr-2" />
          Add Squad Member
        </button>
      </div>

      {/* Loading Spinner */}
      <Show when={combinedLoading()}>
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Show>

      {/* Error Alert */}
      <Show when={combinedError()}>
        <div class="alert alert-error">Error loading squad members: {$error()?.message}</div>
      </Show>

      {/* No squad members message */}
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

      {/* Squad Members List */}
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
                      <span
                        class={`badge badge-sm ${
                          member.status === "request accepted" ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {member.status || "Unknown Status"}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <button
                      class="btn btn-ghost btn-circle"
                      onClick={() => openDetailsModal(member.id)}
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

      {/* Modal for Details or Add Form */}
      <Show when={showModal()}>
        <Modal isOpen={showModal()} onClose={closeModal} size="xl">
          <Show when={mode() === "form"}>
            <SquadForm
              userId={props.userId}
              onSuccess={() => {
                closeModal();
                initializeSquad(props.userId); // reload squad after adding new member
              }}
            />
          </Show>

          <Show when={mode() === "details" && selectedMemberId()}>
            <SquadDetails memberId={selectedMemberId()!} onClose={closeModal} />
          </Show>
        </Modal>
      </Show>
    </div>
  );
}
