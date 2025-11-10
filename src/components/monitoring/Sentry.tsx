import { onMount } from "solid-js";
import { initializeMonitoring } from "../../lib/sentry/browser";



export default function Monitoring(){

    onMount(()=>{
        initializeMonitoring();
    })

    return null;
}