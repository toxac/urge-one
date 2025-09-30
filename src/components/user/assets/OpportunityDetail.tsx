import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { authStore } from "../../../stores/auth";
import { opportunitiesStore, getOpportunityById } from "../../../stores/userAssets/opportunities";
import {
    commentsStore,
    initializeCommentsForOpportunity,
    getCommentsByOpportunityId,
    createComment,
    deleteComment
} from "../../../stores/userAssets/opportunityComments";
import { Icon } from "@iconify-icon/solid";
import Modal from "../../appFeedback/Modal";
import CommentForm from "./OpportunityCommentForm";
import { notify } from '../../../stores/notifications';

interface OpportunityDetailProps {
    opportunityId: string;
    userId: string;
}

export default function OpportunityDetail(props: OpportunityDetailProps) {

    const opportunity = getOpportunityById(props.opportunityId);
    const comments = getCommentsByOpportunityId(props.opportunityId);

    return (
        <section>
        <h2>{opportunity?.title}</h2>
        </section>
    )
    
}