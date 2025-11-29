import { createSignal, createEffect } from "solid-js";
import { useStore } from "@nanostores/solid";
import { journalsStore, createJournal, updateJournal, journalsStoreLoading } from "../../stores/userAssets/journals";

import { type Database } from "../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];


interface Props {
    userId: string;
}

export default function JournalList (props: Props){
    const $journalEntries = useStore(journalsStore);
    const $journalStoreLoading = useStore(journalsStoreLoading);

    createEffect(()=>{
        // Load journal entries from the nanostore
    });

    return null;

}