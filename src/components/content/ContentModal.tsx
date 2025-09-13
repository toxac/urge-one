// components/ModalWrapper.jsx
import { createSignal, type JSX } from "solid-js";
import Modal from "@components/appFeedback/Modal";
interface ComponentProps {
    children: JSX.Element;
    buttonText?: string;
}

export default function ModalWrapper(props: ComponentProps) {
    const [isOpen, setIsOpen] = createSignal(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button
                class="btn btn-primary btn-outline mb-6"
                onClick={openModal}
                type="button"
            >
                {props.buttonText || "Open Modal"}
            </button>

            <Modal
                isOpen={isOpen()}
                onClose={closeModal}
                size={"lg"}
                closeOnBackdropClick={true}
            >
                <div class="prose max-w-none p-6">
                    {props.children}
                </div>
                <div class="modal-action">
                    <button class="btn" onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </>
    );
}