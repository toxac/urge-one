
import type { JournalReflectionEntryData } from "../../../../../../types/urgeTypes";

interface Props {
  data: JournalReflectionEntryData | null | undefined;
}

export default function Reflection (props: Props) {
  const data = props.data || {};

  return (
    <div class="space-y-2">
      <p><strong>Program Satisfaction:</strong> {data.program_satisfaction ?? "N/A"}</p>
      <p><strong>Applied Learnings:</strong> {(data.applied_learnings && data.applied_learnings.length > 0) ? data.applied_learnings.join(", ") : "N/A"}</p>
      <p><strong>Confidence Change:</strong> {data.confidence_change ?? "N/A"}</p>
      <p><strong>Questions:</strong> {(data.questions && data.questions.length > 0) ? data.questions.join(", ") : "N/A"}</p>
    </div>
  );
};

