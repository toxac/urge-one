import { createSignal } from "solid-js";
import { journalsStore, createJournal, updateJournal } from "../../stores/userAssets/journals";

import { type Database } from "../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];


interface Props {
    userId: string;
    journal: Journal;
}

export default function JournalDetail (props: Props){

}