import { createSignal, onCleanup, Show, type JSX } from "solid-js";
import { Portal } from "solid-js/web";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element;
    size?: "sm" | "md" | "lg" | "xl";
    closeOnBackdropClick?: boolean;
}

export default function Modal(props: ModalProps) {

    // Set defaults
    const size = props.size || "md";
    const closeOnBackdropClick = props.closeOnBackdropClick !== false;

    // Size classes mapping
    const sizeClasses = {
        sm: "w-1/4 max-w-md",
        md: "w-1/2 max-w-2xl",
        lg: "w-3/4 max-w-4xl",
        xl: "w-5/6 max-w-6xl",
        full: "w-full max-w-full"
    };

    // Handle ESC key press
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            props.onClose();
        }
    };

    // Add event listener for ESC key
    if (typeof window !== "undefined") {
        window.addEventListener("keydown", handleKeyDown);
        onCleanup(() => {
            window.removeEventListener("keydown", handleKeyDown);
        });
    }

    const handleBackdropClick = () => {
        if (closeOnBackdropClick) {
            props.onClose();
        }
    };

    return (
        <Show when={props.isOpen}>
            <Portal>
                <dialog class="modal modal-open">
                    <div class={`modal-box w-full lg:${sizeClasses[size]}`}>
                        {props.children}
                    </div>

                    {/* Backdrop click closes modal */}
                    <div class="modal-backdrop" onClick={handleBackdropClick}>
                        <button>close</button>
                    </div>
                </dialog>
            </Portal>
        </Show>
    );
};

