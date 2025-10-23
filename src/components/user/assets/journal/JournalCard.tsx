import { Show } from "solid-js";
import { Icon } from "@iconify-icon/solid";
import type { Database } from "../../../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalCardProps {
  journal: Journal;
  onDelete: () => void;
  deleting?: boolean;
}

export default function JournalCard (props: JournalCardProps)  {
  
  const handleViewDetails = () => {
    // Redirect to journal detail page using window.location or router as needed
    window.location.href = `/assets/journal/${props.journal.id}`;
  };

  return (
    <div class="border rounded-md p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="mb-4 md:mb-0 flex-grow cursor-pointer" onClick={handleViewDetails} role="button" tabIndex={0} aria-label={`View details for journal titled ${props.journal.title}`}>
        <h5 class="text-lg font-semibold mb-1">{props.journal.title || "Untitled Journal"}</h5>
        <p class="text-gray-600 text-sm truncate max-w-md">{props.journal.content?.substring(0, 120) || "No content preview"}</p>
        <p class="text-gray-400 text-xs mt-2">Created on {new Date(props.journal.created_at).toLocaleDateString()}</p>
      </div>

      <div class="flex gap-3 items-center">
        <button 
          class="btn btn-sm btn-outline btn-error flex items-center gap-1"
          onClick={props.onDelete}
          disabled={props.deleting}
          aria-label="Delete journal entry"
          title="Delete journal entry"
        >
          <Show when={!props.deleting} fallback={
            <span class="loading loading-spinner loading-xs"></span>
          }>
            <Icon icon="mdi:trash-can-outline" width={18} height={18} />
            Delete
          </Show>
        </button>
      </div>
    </div>
  );
}


