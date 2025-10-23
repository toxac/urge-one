import type { Component } from "solid-js";
import type { JournalBuildEntryData } from "../../../../../../types/urgeTypes";

interface Props {
  data: JournalBuildEntryData | null | undefined;
}

export default function Build (props: Props)  {
  const data = props.data || {};

  return (
    <div class="space-y-2">
      <p><strong>Build Phase:</strong> {data.build_phase ?? "N/A"}</p>
      <p><strong>Is Launch:</strong> {data.is_launch ? "Yes" : "No"}</p>
      <p><strong>Time Invested:</strong> {data.time_invested ? `${data.time_invested} hours` : "N/A"}</p>
      <p><strong>Technical Challenges:</strong> {(data.technical_challenges && data.technical_challenges.length > 0) ? data.technical_challenges.join(", ") : "N/A"}</p>
      <p><strong>Validation Results:</strong> {data.validation_results ?? "N/A"}</p>
      <p><strong>Launch Type:</strong> {data.launch_type ?? "N/A"}</p>
      <p><strong>Metrics Tracked:</strong> {(data.metrics_tracked && data.metrics_tracked.length > 0) ? data.metrics_tracked.join(", ") : "N/A"}</p>
    </div>
  );
};


