import { createSignal } from "solid-js";

import { type Database } from "../../../database.types";

type Journal = Database['public']['Tables']['user_journals']['Row'];
type JournalInsert = Database['public']['Tables']['user_journals']['Insert'];
type JournalUpdate = Database['public']['Tables']['user_journals']['Update'];

interface Props {
    userId: string;
    journal: Journal | null;
}

export default function JournalForm (props: Props){
    
}