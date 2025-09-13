
import { createSignal } from "solid-js";
import Modal from "./Modal";

export default function ModalTest() {
    const [isOpen, setIsOpen] = createSignal(false)


    const handleClick = () => {
        setIsOpen(true);
    }

    return (
        <>
            <button onClick={handleClick}>Test</button>
            <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)}>
                <div class="w-full">Test</div>
            </Modal>
        </>
    )

}