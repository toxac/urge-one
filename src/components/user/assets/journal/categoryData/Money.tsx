import type { Component } from "solid-js";
import type { JournalMoneyEntryData } from "../../../../../../types/urgeTypes";

interface Props {
  data: JournalMoneyEntryData | null | undefined;
}

export default function Money (props: Props)  {
  const data = props.data || {};

  return (
    <div class="space-y-2">
      <p><strong>Financial Activity:</strong> {data.financial_activity ?? "N/A"}</p>
      <p><strong>Amount Involved:</strong> {data.amount_involved ? `${data.amount_involved} ${data.currency ?? ""}` : "N/A"}</p>

      {data.financial_metrics ? (
        <div class="pl-4 space-y-1">
          <p><strong>Runway Extension:</strong> {data.financial_metrics.runway_extension ?? "N/A"}</p>
          <p><strong>Revenue Change:</strong> {data.financial_metrics.revenue_change ?? "N/A"}</p>
          <p><strong>Cost Reduction:</strong> {data.financial_metrics.cost_reduction ?? "N/A"}</p>
          <p><strong>Valuation Impact:</strong> {data.financial_metrics.valuation_impact ?? "N/A"}</p>
        </div>
      ) : <p>No financial metrics data available.</p>}

      <p><strong>Decision Factors:</strong> {(data.decision_factors && data.decision_factors.length > 0) ? data.decision_factors.join(", ") : "N/A"}</p>
      <p><strong>Risk Assessment:</strong> {data.risk_assessment ?? "N/A"}</p>
    </div>
  );
};


