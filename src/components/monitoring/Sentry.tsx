import { onMount } from "solid-js";
import { initializeMonitoringOnBrowser } from "../../lib/sentry/browser";

export default function Monitoring(){

    onMount(()=>{
        initializeMonitoringOnBrowser();
    })

    return null;
}