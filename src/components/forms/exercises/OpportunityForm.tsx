import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "src/stores/auth";
import { createForm } from '@felte/solid';
import * as z from "zod";
import { supabaseBrowserClient } from '../../../lib/supabase/client';
import { validator } from '@felte/validator-zod';
import { notify } from '../../../stores/notifications';
import { saveFormAndMarkCompleted } from '../../../stores/progress';
import { manageOpportunities } from "src/stores/userAssets/opportunities";
import {type DiscoveryMethodOption, discoveryMethodOptions} from "../../../constants/exercises/opportunities"
import type { Database } from "../../../../database.types";
import type { UserOpportunitiesStatus, UserOpportunitiesDiscoveryMethod } from "../../../../types/dbconsts";


type UserOpportunity = Database['public']['Tables']['user_opportunities']['Row'];
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
    approach?: UserOpportunitiesDiscoveryMethod;
}

export default function OpportunityForm (props: ComponentProps){
    // Store
    const $session = useStore(authStore);
    const [userId, setUserId] = createSignal<string | null>(null);
    const [discoveryMethod, setDiscoveryMethod] = createSignal<DiscoveryMethodOption|null>(null)
    const [loading, setLoading] = createSignal(false);
    const [success, setSuccess] = createSignal(false);

    const getDiscoveryMethod = (discoveryMethodValue: UserOpportunitiesDiscoveryMethod) => {
        const approach = discoveryMethodOptions.find(option => option.value === discoveryMethodValue);
        if (approach) {
            setDiscoveryMethod(approach);
        } else {
            setDiscoveryMethod(null); // or handle the undefined case appropriately
        }
    }
    
    onMount(()=>{
        if(props.approach){
            getDiscoveryMethod(props.approach)
        }
    })

    // get current user data
    createEffect(()=>{
        if(!$session() || !$session().loading) return;
        const user = $session().user;
        if(user){
            setUserId(user.id)
        }
    })

    const {form, data, errors} = createForm({
        initialValues:{
            category: "",
            created_at: "",
            description: "",
            discovery_method: props.approach || "",
            goal_alignment: "",
            observation_type: "",
            title: "",
        },
        onSubmit: async(values) =>{
            setLoading(true);
            const supabase = supabaseBrowserClient;
            try {
                if(userId()){
                    const currentDate = new Date();
                    const status: UserOpportunitiesStatus = "added";
                    const newOpportunityPayload :UserOpportunityInsert ={
                        category: values.category,
                        description: values.description,
                        discovery_method: values.discovery_method,
                        goal_alignment: values.goal_alignment,
                        observation_type: values.observation_type,
                        title: values.title,
                        created_at: currentDate.toISOString(),
                        status: status,
                        user_id: userId()
                    }
                    const {data, error} = await supabase.from('user_opprtunities').insert(newOpportunityPayload).select().single();

                    if(data){
                        // add inserted opportunity to store
                        manageOpportunities("create", data);
                        saveFormAndMarkCompleted(props.contentMetaId);
                        notify.success("New opportunity added","Success!");
                        setSuccess(true);
                    }

                    if(error){
                        throw error;
                    }

                } else {
                    notify.error("No user found!, Please retry after logging in", "Fail");
                }
                
            } catch (error) {
                notify.error("Something went wrong at our end, Please try saving the opportunity again", "Failed")
                
            } finally {

            }
        },
        extend: validator({schema})


    })

    return(
        <section class="w-full bg-white border-1 border-primary rounded-lg px-8">
        <h2>Add a new opportunity</h2>
        <p></p>

        </section>
    )
}