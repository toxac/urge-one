# Context
I want to develop Ai assessment for opportunities in my app. 
# key terms
- Opportunities: refer to problems users observe which have potential to become a business.
- urgeAssist: urges AI assistance which provides focussed input on selected context


# Urge Platform
## Overview
### Mission: Democratize Success
The goal is for every user to launch a profitable business, regardless of scale (not just aiming for unicorns or VC funding). Success is defined by the founder's personal goals (lifestyle, financial freedom).

### Primary Problem Solved: Entrepreneurial Paralysis
The main blocker is the fear of starting, overthinking, and lack of practical clarity. Urge guides users past these internal barriers.

### Core Differentiator: Action Over Theory
The platform is built on Execution. Guidance must always lead to a measurable, real-world action (Think, Create, Communicate, Execute).

## Unique Terminology and Concepts
### Opportunity
- **Meaning & Purpose**: (NOT "Idea"): A problem that is validated and someone is willing to pay to solve. It's grounded in market reality.
- **Usage Rule**: Use "Opportunity" exclusively when referring to business ventures in the evaluation phase.

### MSP
- **Meaning & Purpose**: (Minimal Sell-able Product, NOT "MVP"): The absolute minimum required to deliver core value and secure a payment. Focuses on revenue and commitment, not just viability.
- **Usage Rule**: Emphasize that MSP is built to sell and validate demand immediately.

### Real Sales
- **Meaning & Purpose**: (NOT "Pitch Decks"): The primary measure of success.
- **Usage Rule**: Guidance must prioritize customer acquisition and revenue generation over investor presentation or speculative valuation.

### Cheer Squad
- **Meaning & Purpose**: The user's personal network (friends, family, peers) responsible for accountability and support.
- **Usage Rule**: Treat as a structured support mechanism the founder can actively leverage.

### Value
- **Meaning & Purpose**: The core benefit (Functional, Emotional, Social, Monetary) that justifies the price.
- **Usage Rule**: Always connect product/service features to the value delivered.

---- 


## Program Structure and Content Objectives

### Milestones
- **Goal**: Set the vision, motivate, and introduce the theme.
- **Content Tone of Voice** : Motivational, high-level, aspirational. Focus on the transition achieved (e.g., "You moved from planning to building").

### Concepts
- **Goal**: Introduce foundational principles and demystify complex topics.
- **Content Tone of Voice** : Educational, insightful, and anti-jargon. Focus on the "why it matters" and "how to think about it" (The "Aha!" moment).

### Exercises
- **Goal**: Provide clear instructions for practical, form-based work.
- **Content Tone of Voice** : Instructional, direct, and actionable. Output should be structured (e.g., simple step-by-step lists, data definitions, or calculations).

### Challenges
- **Goal**: Push the user out of their comfort zone (e.g., cold calls, facing rejection).
- **Content Tone of Voice** : Empathetic, encouraging, and firm. Output must focus on resilience building and reframing the uncomfortable action as valuable data collection.

## Tech Stack 
The Urge web application is built on a modern, decoupled architecture designed for high performance, rapid iteration, and secure handling of user data and program logic. We prioritize using scalable, managed services to reduce initial DevOps overhead, allowing the team to focus entirely on feature development.

---

## I. Frontend & Development Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Astro (Hybrid/SSR)** | Provides fast, static content delivery (SSG) for public pages and flexible Server-Side Rendering (SSR) for protected, dynamic program pages. |
| **UI Library** | **SolidJS** | Used for building highly reactive and efficient client-side components (forms, dashboards, interactive elements). Chosen for its performance benefits. |
| **Styling** | **Tailwind CSS (v4) & Flowbite** | Utility-first styling for speed and consistency, augmented by Flowbite's pre-built, accessible components (menus, buttons, inputs). |
|
| **Form Handling** | **Felte/Solidjs** | out of the box form handling and validation |
| **Validation** | **Zod** | Simple validation library also used by astrojs by default |

---

## II. Backend & Data Infrastructure

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Core Backend / DB** | **Supabase (PostgreSQL)** | Provides a powerful, scalable PostgreSQL database solution. This is the single source of truth for all user profiles, program data, and assets. |
| **Authentication** | **Supabase Auth** | Handles secure user registration, login, and session management, integrating seamlessly with our database and RLS policies. |
| **Storage** | **Supabase Storage** | Used for storing user-generated content, such as profile pictures and journal attachments, integrated directly with the database. |
| **Real-time / Events** | **Supabase Realtime** | Powers features requiring immediate updates, such as the **Weekly Standups** and real-time community chat/notifications. |
| **API Proxy / Serverless Logic** | **AWS Lambda / Edge Functions** | Used for secure backend logic (e.g., payment webhooks, complex data processing, proxying AI calls). |

---

## III. Strategic Integrations

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Client State Management** | **Nanostores** | Lightweight, framework-agnostic global state management solution used to maintain client-side consistency for user data, authentication status, and current application context. |
| **AI / Assistance** | **Google Gemini API** | Powers **UrgeAssist**, providing intelligent content generation, brainstorming frameworks, and rapid information retrieval to accelerate the user's strategic thinking. |

## Urge Assist Opportunities 

Two key ways AI will be integrated:
- Filling market research data for an opportunity (no additional context required)
- Assess opportunity for the user (additional context user skills, user resources, user risk profile)
### Schema 

```ts
user_opportunities: {
        Row: {
          alignment_assessment_score: number | null //to be recommended using Ai analysis
          assessment_rationale: string | null //to be recommended using Ai analysis
          barriers_to_entry: string[] | null //to be recommended using Ai for data filling
          capital_assessment_score: number | null //to be recommended using Ai analysis
          category: string | null // filled by user
          competitors: string[] | null //to be recommended using Ai for data filling
          created_at: string 
          description: string | null // filled by user
          discovery_method: string // filled by user
          id: string
          market_size: Json | null //to be recommended using Ai for data filling
          market_size_rationale: string | null //to be recommended using Ai analysis
          market_trend: string | null //to be recommended using Ai for data filling
          observation_type: string | null // filled by user
          resource_assessment_score: number | null //to be recommended using Ai analysis
          risk_comfort_score: number | null //to be recommended using Ai analysis
          skill_assessment_score: number | null //to be recommended using Ai analysis
          status: string | null
          target_buying_behaviour: Json | null //to be recommended using Ai for data filling
          target_demographics: Json | null //to be recommended using Ai for data filling
          target_motivations: string[] | null //to be recommended using Ai for data filling
          target_psychographics: Json | null //to be recommended using Ai for data filling
          target_unmet_needs: string[] | null //to be recommended using Ai for data filling
          title: string | null // filled by user
          top_pain_point: string | null // filled by user
          updated_at: string | null
          user_id: string | null
        }}

```

#### Options for fields 
```ts

export interface DiscoveryMethodOption {
  value: string;
  label: string;
  helperText: string;
  observationType?: { value: string; label: string; helperText: string, example?: string } [];
}

export const discoveryMethodOptions: DiscoveryMethodOption[] = [
  {
    value: "personal-problems",
    label: "Personal Problems",
    helperText: "Look for business ideas by solving problems you experience daily. Pay attention to frustrations that keep coming up - these are often signs of larger market needs. For example, if you struggle to find healthy, convenient meals despite trying various options, this could reveal an opportunity for a specialized meal delivery service that addresses specific dietary needs or time constraints.",
    observationType: [
      {
        value: "daily-frustrations",
        label: "Daily Frustrations",
        helperText: "Turn everyday annoyances into business opportunities by asking 'How could this be easier?' For example, if you frequently misplace your keys and find existing solutions inadequate, you might develop a more reliable key-finding device with longer battery life or better integration with smart home systems.",
      },
      {
        value: "unmet-needs",
        label: "Unmet Needs",
        helperText: "Identify gaps in current solutions by noticing what you wish existed. For example, if you're learning a language but find existing apps too generic, you could create an interactive platform that focuses on conversational skills for specific professions or travel scenarios, making learning more practical and engaging.",
      },
      {
        value: "passion-projects",
        label: "Passion Projects",
        helperText: "Transform what you love doing into a viable business by identifying commercial applications. For example, if baking is your hobby and you notice friends consistently praising your unique cake designs, you could start a specialty cake business focusing on custom dietary requirements or themed decorations for local events.",
      },
    ],
  },
  {
    value: "skill-based",
    label: "Skills",
    helperText: "Identify opportunities where your specific expertise can solve problems for others. For example, as a skilled graphic designer, you might notice that many small businesses in your area have outdated branding - this presents an opportunity to offer affordable branding packages specifically tailored for local entrepreneurs looking to establish a professional online presence.",
    observationType: [
      {
        value: "professional-skills",
        label: "Professional Skills",
        helperText: "Apply your career experience to help others facing similar challenges. For example, if you're an accountant who notices freelancers struggling with tax planning, you could create a service that offers quarterly tax estimates and deductible tracking specifically designed for independent contractors in creative industries.",
      },
      {
        value: "creative-skills",
        label: "Creative Skills",
        helperText: "Monetize your artistic talents by addressing specific market needs. For example, as a musician, you might observe that many adults want to learn instruments but feel intimidated by traditional lessons - you could develop a beginner-friendly program focusing on playing popular songs quickly while building fundamental skills.",
      },
      {
        value: "technical-skills",
        label: "Technical Skills",
        helperText: "Use your technical expertise to solve practical business problems. For example, as a web developer, you might notice local restaurants struggling with outdated online ordering systems - you could create affordable, mobile-friendly websites with integrated reservation and takeout features specifically for small food businesses.",
      },
      {
        value: "interpersonal-skills",
        label: "Interpersonal Skills",
        helperText: "Help others improve their communication and relationship-building abilities. For example, if you're naturally skilled at public speaking and notice professionals struggling with presentations, you could offer coaching services focusing on virtual meeting effectiveness or technical presentation skills for STEM professionals.",
      },
    ],
  },
  {
    value: "zone-of-influence",
    label: "Zone of Influence",
    helperText: "Pay close attention to the challenges mentioned by people in your social and professional circles. For example, if multiple friends complain about the lack of reliable childcare options in your neighborhood, this could indicate an opportunity to start a licensed home daycare service with flexible hours that accommodates shift workers or parents with irregular schedules.",
    observationType: [
      {
        value: "family-and-friends",
        label: "Family and Friends",
        helperText: "Listen for recurring problems within your closest relationships. For example, if a family member with mobility challenges struggles to find suitable exercise options, you could develop adaptive fitness programs or create specialized equipment that makes home workouts more accessible for people with similar needs.",
      },
      {
        value: "colleagues-and-acquaintances",
        label: "Colleagues and Acquaintances",
        helperText: "Notice common workplace frustrations and unmet professional needs. For example, if coworkers consistently complain about the lack of healthy lunch options near your office, you could start a weekly meal prep delivery service focusing on office-friendly meals that accommodate various dietary restrictions common in your workplace.",
      },
      {
        value: "community-members",
        label: "Community Members",
        helperText: "Identify shared challenges within your local or online communities. For example, if members of your neighborhood association express concern about food waste, you could create a community composting service or develop an app that connects local restaurants with food rescue organizations to redistribute surplus meals.",
      },
    ],
  },
  {
    value: "broader-search",
    label: "Broad Search",
    helperText: "Research emerging patterns and underserved markets to identify scalable opportunities. For example, if you notice growing consumer interest in sustainable living through social media and market reports, you could develop a line of eco-friendly household products that address specific pain points like reducing plastic waste or simplifying green living for urban dwellers.",
    observationType: [
      {
        value: "hypes-and-trends",
        label: "Hypes and Trends",
        helperText: "Capitalize on emerging trends by identifying sustainable applications. For example, as virtual reality becomes more accessible, you could develop VR training simulations for industries like healthcare or construction, focusing on safety procedures that are expensive or dangerous to practice in real-world settings.",
      },
      {
        value: "niche-communities",
        label: "Niche Communities",
        helperText: "Discover specialized needs within focused interest groups. For example, by participating in online forums for pet owners with special needs animals, you might identify a gap in products for elderly pets - leading to a business creating mobility aids, specialized bedding, or nutritional supplements for aging companion animals.",
      },
      {
        value: "google-trends-and-search-keywords",
        label: "Google Trends and Search Keywords",
        helperText: "Use search data to identify growing consumer interests and unanswered questions. For example, if you notice rising searches for 'sustainable wedding decorations' alongside complaints about limited options, you could create a rental service for reusable wedding decor focusing on eco-friendly materials and local delivery.",
      },
      {
        value: "marketplaces",
        label: "Marketplaces",
        helperText: "Analyze marketplace gaps by studying customer reviews and product limitations. For example, while researching Etsy bestsellers, you might notice consistent complaints about jewelry tarnishing quickly - presenting an opportunity to create a line of hypoallergenic, tarnish-resistant pieces using innovative materials and offering lifetime maintenance guarantees.",
      },
      {
        value: "social-media-trends",
        label: "Social Media Trends",
        helperText: "Identify business opportunities by monitoring social conversations and emerging needs. For example, if you notice increasing discussions about mental health support for remote workers, you could develop digital wellness tools specifically designed for distributed teams, offering structured break systems and connection-building features.",
      },
    ],
  },
];

interface SelectOption {
  value: string;
  label: string;
  helperText?: string;
}

export const categoryOptions: SelectOption[] = [
  {
    value: "functional",
    label: "Functional",
    helperText: "Focus on problems that affect how things work, their usability, or efficiency. Look for opportunities to streamline processes, improve performance, or solve practical challenges - like creating a project management tool that simplifies team collaboration for remote workers who struggle with coordinating across time zones.",
  },
  {
    value: "emotional",
    label: "Emotional",
    helperText: "Address challenges that impact people's feelings, cause frustration, or relate to psychological needs. Consider solutions that reduce stress, increase joy, or improve mental well-being - such as developing a mindfulness app that helps busy professionals manage anxiety through short, integrated daily practices during work breaks.",
  },
  {
    value: "social",
    label: "Social",
    helperText: "Solve problems related to social connections, belonging, community, or relationships. Look for ways to help people connect more meaningfully - like creating a platform that helps newcomers in cities build friendships through shared interest groups and local event recommendations based on compatibility.",
  },
  {
    value: "financial",
    label: "Financial",
    helperText: "Help people with money management, costs, expenses, or financial well-being. Identify opportunities to make financial tasks easier or more accessible - such as developing a budgeting app specifically for freelancers that automatically categorizes business expenses and calculates quarterly tax estimates.",
  },
  {
    value: "physical",
    label: "Physical",
    helperText: "Address needs related to physical health, comfort, safety, or the physical world. Look for ways to improve daily living conditions - like creating ergonomic home office equipment that prevents back pain for remote workers who don't have proper workspace setups.",
  },
  {
    value: "environmental",
    label: "Environmental",
    helperText: "Focus on sustainability, resource management, or ecological concerns. Identify opportunities to help people live more sustainably - such as developing a service that helps households reduce waste through personalized recycling guidance and connections to local composting facilities.",
  },
];

export const alignmentWithGoalsOptions: SelectOption[] = [
  {
    value: "strong-alignment",
    label: "Strong Alignment",
    helperText: "This opportunity perfectly matches your personal values, skills, and long-term vision. It leverages your strengths while addressing a market need you're passionate about - like a environmental scientist starting a sustainability consulting business that combines their expertise with their commitment to climate action.",
  },
  {
    value: "good-alignment",
    label: "Good Alignment",
    helperText: "This opportunity fits well with your goals and utilizes some of your key skills, though it might require developing new capabilities. For example, a teacher starting educational workshops that draw on their communication skills while expanding into curriculum development for corporate training programs.",
  },
  {
    value: "neutral",
    label: "Neutral",
    helperText: "This opportunity has some connection to your interests but isn't a perfect match for your core strengths or passions. It might represent a practical business option that serves a clear market need, like an IT professional opening a general tech repair shop despite their primary interest being in software development.",
  },
  {
    value: "poor-alignment",
    label: "Poor Alignment",
    helperText: "This opportunity doesn't align well with your main objectives and may require skills outside your comfort zone. While potentially profitable, it might not provide the personal satisfaction you seek - such as a creative artist pursuing a purely administrative business that offers stability but little creative expression.",
  },
  {
    value: "no-alignment",
    label: "No Alignment",
    helperText: "This opportunity conflicts with your values, goals, or preferred working style. Pursuing it would likely lead to frustration despite any financial potential - like an environmentally conscious person considering a business that involves significant resource waste or goes against their sustainability principles.",
  },
];

// Getter function for discovery method - returns empty string for null/undefined
export function getDiscoveryMethod(value: string | null | undefined): string {
  if (!value) return '';
  const option = discoveryMethodOptions.find(option => option.value === value);
  return option ? option.label : '';
}

// Getter function for category - returns empty string for null/undefined
export function getCategory(value: string | null | undefined): string {
  if (!value) return '';
  const option = categoryOptions.find(option => option.value === value);
  return option ? option.label : '';
}

// Getter function for alignment - returns empty string for null/undefined
export function getAlignment(value: string | null | undefined): string {
  if (!value) return '';
  const option = alignmentWithGoalsOptions.find(option => option.value === value);
  return option ? option.label : '';
}

// Optional: Get specific property getters
export function getDiscoveryMethodHelperText(value: string | null | undefined): string {
  if (!value) return '';
  const option = discoveryMethodOptions.find(option => option.value === value);
  return option ? option.helperText : '';
}

export function getCategoryHelperText(value: string | null | undefined): string {
  if (!value) return '';
  const option = categoryOptions.find(option => option.value === value);
  return option?.helperText || '';
}

export function getAlignmentHelperText(value: string | null | undefined): string {
  if (!value) return '';
  const option = alignmentWithGoalsOptions.find(option => option.value === value);
  return option?.helperText || '';
}

// Getter for observation types within a discovery method
export function getObservationType(
  discoveryMethodValue: string | null | undefined, 
  observationTypeValue: string | null | undefined
): string {
  if (!discoveryMethodValue || !observationTypeValue) return '';
  
  const discoveryMethod = discoveryMethodOptions.find(option => option.value === discoveryMethodValue);
  const observationType = discoveryMethod?.observationType?.find(obs => obs.value === observationTypeValue);
  return observationType ? observationType.label : '';
}

// Get observation type helper text
export function getObservationTypeHelperText(
  discoveryMethodValue: string | null | undefined, 
  observationTypeValue: string | null | undefined
): string {
  if (!discoveryMethodValue || !observationTypeValue) return '';
  
  const discoveryMethod = discoveryMethodOptions.find(option => option.value === discoveryMethodValue);
  const observationType = discoveryMethod?.observationType?.find(obs => obs.value === observationTypeValue);
  return observationType?.helperText || '';
}

// Optional: Flexible getter that allows specifying which property to return
export function getDiscoveryMethodProperty(
  value: string | null | undefined, 
  property: 'label' | 'helperText' = 'label'
): string {
  if (!value) return '';
  const option = discoveryMethodOptions.find(option => option.value === value);
  return option ? option[property] : '';
}

export function getCategoryProperty(
  value: string | null | undefined, 
  property: 'label' | 'helperText' = 'label'
): string {
  if (!value) return '';
  const option = categoryOptions.find(option => option.value === value);
  return option?.[property] || '';
}

export function getAlignmentProperty(
  value: string | null | undefined, 
  property: 'label' | 'helperText' = 'label'
): string {
  if (!value) return '';
  const option = alignmentWithGoalsOptions.find(option => option.value === value);
  return option?.[property] || '';
}
```

#### Options for Evaluation
```ts
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
```
## Task

I want to develop a AI assist endpoint using vercel Ai sdk using deepseek api for 1. opportunities data completions and 2. opportunity assessment so for these help me
1. Come up with a implementation plan 
2. Show me how to integrate deepseek for structured data output




