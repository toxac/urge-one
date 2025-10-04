import { createSignal, Show } from "solid-js";
import Modal from "../../../components/appFeedback/Modal";
import { Icon } from "@iconify-icon/solid";
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

    const handleModalClose = () => {
        setShowModal(false);
        setAction("none");
    }

    return (

        <>
            <div class="w-full flex justify-end gap-2">
                <div class="tooltip tooltip-top" data-tip="Add a note">
                    <button class="btn btn-square bg-white" onClick={() => showAction("note")}>
                        <Icon icon="mdi:note-outline" width={24} height={24} />
                    </button>
                </div>
                <div class="tooltip tooltip-top" data-tip="Post a question">
                    <button class="btn btn-square bg-white" onClick={() => showAction("question")}>
                        <Icon icon="mdi:question-mark-circle-outline" width="24" height="24" />
                    </button>
                </div>
                <div class="tooltip tooltip-top" data-tip="Bookmark page">
                    <SaveBookmark
                        contentType={props.contentType}
                        referenceTable={props.referenceTable}
                        referenceUrl={props.referenceUrl}
                        relatedContentId={props.relatedContentId}
                        userId={props.userId}
                    />
                </div>
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
                    onClose={handleModalClose}
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
                    onClose={handleModalClose}
                />
            </Modal>
        </>
    )

}