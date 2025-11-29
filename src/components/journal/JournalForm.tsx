import { createSignal } from "solid-js";
import { journalsStore, createJournal, updateJournal } from "../../stores/userAssets/journals";

import { type Database } from "../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];
type JournalInsert = Database['public']['Tables']['user_journals']['Insert'];
type JournalUpdate = Database['public']['Tables']['user_journals']['Update'];

interface Props {
    userId: string;
    currentJournal: Journal | null;
    currrentContentId: string | null;
    onSuccess?: (journal: Journal) => void;

}

export default function JournalForm (props: Props){

}