
import type { JournalMarketEntryData } from "../../../../../../types/urgeTypes";

interface Props {
  data: JournalMarketEntryData | null | undefined;
}

export default function Market (props:Props) {
  const data = props.data || {};

  return (
    <div class="space-y-2">
      <p><strong>Activity Type:</strong> {data.activity_type ?? "N/A"}</p>
      <p><strong>Target Audience:</strong> {data.target_audience ?? "N/A"}</p>
      <p><strong>Channels Used:</strong> {(data.channels_used && data.channels_used.length > 0) ? data.channels_used.join(", ") : "N/A"}</p>

      {data.results ? (
        <div class="pl-4 space-y-1">
          <p><strong>Leads Generated:</strong> {data.results.leads_generated ?? "N/A"}</p>
          <p><strong>Conversions:</strong> {data.results.conversions ?? "N/A"}</p>
          <p><strong>Feedback Received:</strong> {(data.results.feedback_received && data.results.feedback_received.length > 0) ? data.results.feedback_received.join(", ") : "N/A"}</p>
          <p><strong>Insights Gained:</strong> {(data.results.insights_gained && data.results.insights_gained.length > 0) ? data.results.insights_gained.join(", ") : "N/A"}</p>
          <p><strong>Cost per Acquisition:</strong> {data.results.cost_per_acquisition ?? "N/A"}</p>
        </div>
      ) : <p>No results data available.</p>}
    </div>
  );
};

