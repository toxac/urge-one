import { createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "src/stores/auth";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { manageSquad } from '../../../stores/userAssets/squad';
import { saveFormAndMarkCompleted } from '../../../stores/progress';
import { opportunitiesStore } from "src/stores/userAssets/opportunities";
import {discoveryMethodOptions} from "../../../constants/exercises/opportunities"
import type { Database } from "../../../../database.types";



type UserOpportunity = Database['public']['Tables']['user_opportunities']['Row'];
type UserOpportunityUpdate = Database['public']['Tables']['user_opportunities']['Update'];
type UserOpportunityInsert = Database['public']['Tables']['user_opportunities']['Insert'];

const schema = z.object({
    category: z.string(),
    created_at: z.string(),
    description: z.string(),
    discovery_method: z.string(),
    goal_alignment: z.string(),
    observation_type: z.string(),
    title: z.string(),
});


interface ComponentProps {
    contentMetaId: string;
    approach?: "personal-problems" | "skill-based" | "zone-of-influence" | "broader-search"  ;  // discovery
}

export default function OpportunityForm (props: ComponentProps){
    // Store
    const $session = useStore(authStore);
    const $opportunities = useStore(opportunitiesStore);
    const [userId, setUserId] = createSignal<string | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);
    const [markedCompleted, setMarkedCompleted] = createSignal(false);
    const [error, setError] = createSignal("");

    const currentDiscoveryMethod = discoveryMethodOptions.find(option => option.value === props.approach);

    const {form, data, errors} = createForm({
        initialValues:{

        },
        onSubmit: async() =>{

        },
        extend: validator({schema})


    })

    return(
        <section class="w-full bg-white border-1 border-primary rounded-lg p-8">

        </section>
    )
}