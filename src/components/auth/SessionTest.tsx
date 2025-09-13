import { useStore } from "@nanostores/solid";
import { authStore } from "../../stores/auth";
import { Show, createEffect, createSignal } from "solid-js";

export default function Session() {
    const $session = useStore(authStore);
    const [email, setEmail] = createSignal("")

    createEffect(() => {
        if ($session()) {
            setEmail($session().user?.email!)
        }
    })

    return (
        <div>
            {email()}
        </div>
    )

}