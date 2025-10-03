import { createSignal, Show } from "solid-js";
import Modal from "../../../components/appFeedback/Modal";
import AddNote from "./AddNote";
import PostQuestion from "./PostQuestion";
import SaveBookmark from "./SaveBookmark";

interface ComponentProps {
    userId: string;
    contentType: string; // type of content maps to content_type
    relatedContentId: string; // maps to related_content_id
    referenceUrl: string; // maps to reference_url
    referenceTable: string; // maps to reference_table
    onSuccess?: () => void;
}

type Action = "note" | "question" | "bookmark" | "none";

export default function ContentAction(props: ComponentProps) {
    const [action, setAction] = createSignal<Action>("none");
    const [showModal, setShowModal] = createSignal(false);

    const showAction = (action: Action) => {
        setAction(action);
        setShowModal(true);
    }

    return (

        <>
            <div class="w-full flex justify-end gap-4">
                <button class="btn btn-outline" onClick={() => showAction("note")}>Note</button>
                <button class="btn btn-outline" onClick={() => setAction("question")}>Question</button>
                <SaveBookmark
                    contentType={props.contentType}
                    referenceTable={props.referenceTable}
                    referenceUrl={props.referenceUrl}
                    relatedContentId={props.relatedContentId}
                    userId={props.userId}
                />
            </div>
            {/* Note Modal */}
            <Modal isOpen={action() == "note" && showModal()} size="lg" onClose={() => setShowModal(false)}>
                <AddNote
                    userId={props.userId}
                    contentType={props.contentType}
                    relatedContentId={props.relatedContentId}
                    referenceUrl={props.referenceUrl}
                    referenceTable={props.referenceTable}
                    onSuccess={() => setShowModal(false)}
                />
            </Modal>
            {/* Note Modal */}
            <Modal isOpen={action() == "question" && showModal()} size="lg" onClose={() => setShowModal(false)}>
                <PostQuestion
                    userId={props.userId}
                    contentType={props.contentType}
                    relatedContentId={props.relatedContentId}
                    referenceUrl={props.referenceUrl}
                    referenceTable={props.referenceTable}
                    onSuccess={() => setShowModal(false)}
                />
            </Modal>
        </>
    )

}