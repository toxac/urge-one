import { createSignal, createEffect, Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { journalsStore, journalsStoreLoading } from "../../../../stores/userAssets/journals";
import type { JournalBuildEntryData, JournalReflectionEntryData, JournalMarketEntryData, JournalMoneyEntryData } from "../../../../../types/urgeTypes";
import type { Database } from "../../../../../database.types";

import Build from "./categoryData/Build";
import Money from "./categoryData/Money";
import Reflection from "./categoryData/Reflection";
import Market from "./categoryData/Market";

type Journal = Database['public']['Tables']['user_journals']['Row'];

interface JournalDetailsProps {
    userId: string;
    journalId: string;
}

export default function JournalDetails(props: JournalDetailsProps) {
    const $journals = useStore(journalsStore);
    const $loading = useStore(journalsStoreLoading);
    const [journal, setJournal] = createSignal<Journal | undefined>(undefined);
    const [loading, setLoading] = createSignal(true);

    // Find journal in store once loaded
    createEffect(() => {
        if (!$loading()) {
            const found = $journals().find(j => j.id === props.journalId && j.user_id === props.userId);
            setJournal(found);
            setLoading(false);
        }
    });

    // Render the right entry data component based on category
    function renderCategoryData(journal?: Journal) {
        if (!journal) return null;

        const data = journal.entry_data;

        switch (journal.category) {
            case "reflection":
                return <Reflection data={data as JournalReflectionEntryData} />;
            case "build":
                return <Build data={data as JournalBuildEntryData} />;
            case "market":
                return <Market data={data as JournalMarketEntryData} />;
            case "money":
                return <Money data={data as JournalMoneyEntryData} />;
            default:
                return <p>No detailed data available for this category.</p>;
        }
    }

    return (
        <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <Show when={!loading()} fallback={
                <div class="flex justify-center py-12">
                    <span class="loading loading-spinner loading-lg text-primary" />
                </div>
            }>
                <Show when={journal()} fallback={<p class="text-center text-gray-600">Journal not found.</p>}>
                    {(j) => {
                        const journalData = j(); // get the actual journal object
                        return (
                            <>
                                <h2 class="text-2xl font-bold mb-2">{journalData.title || "Untitled Journal"}</h2>
                                <p class="text-gray-700 mb-4 whitespace-pre-wrap">{journalData.content || "No description provided."}</p>

                                <p class="mb-2"><strong>Category:</strong> {journalData.category || "N/A"}</p>
                                <p class="mb-2"><strong>Type:</strong> {journalData.type || "N/A"}</p>
                                <p class="mb-2"><strong>Urgency:</strong> {journalData.urgency || "N/A"}</p>
                                <p class="mb-4"><strong>Tags:</strong> {(journalData.tags && journalData.tags.length > 0) ? journalData.tags.join(", ") : "None"}</p>

                                <div>
                                    <h3 class="font-semibold mb-2">Details</h3>
                                    {renderCategoryData(journalData)}
                                </div>
                            </>
                        );
                    }}
                </Show>

            </Show>
        </div>
    );
}
