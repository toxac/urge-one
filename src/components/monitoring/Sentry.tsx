import { onMount } from "solid-js";
import { initializeMonitoring } from "../../lib/sentry/browser";

interface Props {
    browserKey: string;
}

export default function Monitoring(props:Props){

    onMount(()=>{
        initializeMonitoring(props.browserKey);
    })

    return null;
}