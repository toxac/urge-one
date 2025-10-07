import { createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { opportunitiesStore, opportunitiesStoreLoading } from "../../stores/userAssets/opportunities";

interface Props {
    userId: string;
    profile: any
}


