import * as z from "zod";

type ExerciseFormType = "initialExploration" | "customerInsight" | "size" | "fit"

export const broadMarketResearch = {
    market_trend: [
        "Rapidly Growing (20%+ YoY)",
        "Steadily Growing (5-20% YoY)",
        "Stable/Mature (0-5% YoY)",
        "Declining (-5-0% YoY)",
        "Rapidly Declining (-5%+ YoY)",
        "Emerging/Early Stage",
        "Disruptive/Transformative",
        "Cyclical/Seasonal",
        "Regulated/Stable"
    ],
    barriers: [
        "High Capital Requirements",
        "Regulatory/Licensing Hurdles",
        "Technical Complexity",
        "Strong Brand Loyalty to Incumbents",
        "Network Effects Needed",
        "Patents/Intellectual Property",
        "Distribution Channel Access",
        "Economies of Scale Required",
        "Specialized Expertise Needed",
        "High Customer Switching Costs",
        "Limited Key Resources/Raw Materials",
        "Established Competitor Relationships"
    ],
    competitor_market_position: [
        "Weak - Poor market position",
        "Moderate - Stable but vulnerable",
        "Strong - Well-established",
        "Dominant - Market leader",
        "Emerging - Fast-growing threat"
    ]
}

export const buying_behaviour_options = {
    research_methods: [
        "Online Search/Google",
        "Social Media Research",
        "Peer Recommendations",
        "Industry Forums/Communities",
        "Product Review Sites",
        "Direct Sales Conversations",
        "Trade Shows/Events",
        "Content Marketing (Blogs, Videos)",
        "Case Studies/Testimonials",
        "Free Trials/Demos",
        "Consultant Recommendations",
        "Traditional Media (TV, Print)"
    ],
    purchase_triggers: [
        "Pain Point Becomes Urgent",
        "Budget Availability/Season",
        "New Business Initiative",
        "Competitive Pressure",
        "Vendor Outreach/Marketing",
        "Life/Business Event",
        "End of Current Contract",
        "Scaling/Growth Phase",
        "Technology Upgrade Cycle",
        "Regulatory/Compliance Requirement",
        "Recommendation from Trusted Source",
        "Price Promotion/Discount"
    ],
    decision_factors: [
        "Price/Total Cost",
        "Ease of Use/Implementation",
        "Features/Functionality",
        "Brand Reputation",
        "Customer Reviews/Ratings",
        "Customer Support Quality",
        "Integration Capabilities",
        "Security/Compliance",
        "Scalability/Future Proofing",
        "Implementation Time",
        "Vendor Stability",
        "Customization Options"
    ]
}

export const assessment_options = {
    skills: [
        "No relevant skills - Would need to outsource/learn everything",
        "Basic understanding - Significant skill gaps exist",
        "Some relevant skills - Could handle 50% of requirements",
        "Strong skills - Can handle most requirements with minimal gaps",
        "Expert level - Have all necessary skills and experience"
    ],
    capital: [
        "No capital available - Need full external funding",
        "Very limited capital - Can cover <25% of estimated costs",
        "Some capital - Can cover 25-50% of estimated costs",
        "Adequate capital - Can cover 50-100% of estimated costs",
        "Ample capital - Can cover all costs with reserves"
    ],
    resources: [
        "No resources - Missing time, tools, and team",
        "Limited resources - Significant gaps in time/tools/team",
        "Some resources - Have about half of what's needed",
        "Good resources - Have most necessary resources available",
        "Excellent resources - Have all resources with capacity to spare"
    ],
    alignment: [
        "Complete misalignment - Conflicts with core goals/values",
        "Poor alignment - More conflicts than synergies",
        "Neutral alignment - Some alignment but also compromises",
        "Good alignment - Aligns well with goals and values",
        "Perfect alignment - Directly supports life vision and goals"
    ]
}

export const market_size_confidence = [[
    "Very Low Confidence - Rough estimates only",
    "Low Confidence - Limited data sources",
    "Medium Confidence - Multiple data points",
    "High Confidence - Robust market research",
    "Very High Confidence - Validated with primary research"
]]