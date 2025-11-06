/**
 * @description fetches contents for given milestone from contentMetaStore and checks status for each in progressStore
 * @return jsx
 * @children accomplishments as modal 
 * @author: amit chanchal
 */

import { createSignal, createEffect } from "solid-js";
import { useStore } from "@nanostores/solid";
import { contentMetaStore, isContentMetaLoading } from "../../../stores/contentMeta";
import { progressStore, isProgressLoading, getContentProgressByMilestone } from "../../../stores/progress";
import { accomplishmentStore,  } from "../../../stores/userAssets/accomplishments";
import Modal from "../../appFeedback/Modal";
import type { Database } from "../../../../database.types";

type ContentMeta = Database['public']['Tables']['content_meta']['Row'];
type Progress = Database['public']['Tables']['user_progress']['Row'];

interface Props {
    milestoneContentId: string;
    userId: string;
}

export default function MilestoneSummary (props: Props){
    // Get nanostore references
    const $content  = useStore(contentMetaStore);
    const $isContentLoading = useStore(isContentMetaLoading);
    const $progress = useStore(progressStore);
    const $isProgressLoading = useStore(isProgressLoading);

    const [isMilestoneComplete, setIsMilestoneComplete] = createSignal(false);
    const [milestoneContent, setMilestoneContent] = createSignal<ContentMeta[] | null>(null);
    // initialize content based on progress status
    const [completedContent, setCompletedContent] = createSignal <ContentMeta[] | null> (null);
    const [incompleteContent, setIncompleteContent] = createSignal <ContentMeta[] | null>(null);

    // progress effect
    createEffect(()=>{
        if($isContentLoading()){
            const relatedContent: ContentMeta[] | null = $content().filter(a => a.milestone_id == props.milestoneContentId)

            if(relatedContent){
                const {completed, incomplete} = getContentProgressByMilestone(props.milestoneContentId, relatedContent);
                setCompletedContent(completed);
                setIncompleteContent(incomplete);
                // check if user has completed all content for the milestone
                if(incomplete.length == 0){
                    setIsMilestoneComplete(true);
                    // set the milestone to be completed
                }
            }
        }
    });

    //accomplishment effect
    createEffect(()=>{

    })

}