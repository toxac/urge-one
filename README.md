# Astro Starter Kit: Basics

https://xqxzcpocbwqhuoqymhbr.supabase.co/auth/v1/verify?token=pkce_ede32d9dda41ecb2d28c5d1b0faa29918983fd268f2d9a8388c1033f&type=recovery&redirect_to=http://localhost:4321/auth/reset-password

# schema for opportunity_research

## Overall
id	BIGINT	PRIMARY KEY	Unique research entry identifier (for high growth).
user_id	UUID	NOT NULL, FK (profiles)	User who owns this research record.
opportunity_name	TEXT	NOT NULL	The title of the specific opportunity being researched.
created_at	TIMESTAMPTZ	DEFAULT NOW()	When the research record was created.
updated_at	TIMESTAMPTZ	DEFAULT NOW()	Timestamp for any updates.
is_selected	BOOLEAN	DEFAULT FALSE	Flag for the final committed opportunity.
total_score	NUMERIC	NULLABLE	Calculated score from the Priority Matrix.
status	TEXT	DEFAULT 'draft'	Research status (draft, complete, validated).
-- MARKET & CUSTOMER DATA --			
market_size_tam	NUMERIC	NULLABLE	Total Available Market (numerical estimate).
market_size_sam	NUMERIC	NULLABLE	Serviceable Available Market (numerical estimate).
market_size_som	NUMERIC	NULLABLE	Share of Market (numerical estimate/percentage).
market_trend	TEXT	NULLABLE	Market trajectory (growing, stable, shrinking).
top_pain_point	TEXT	NULLABLE	The single biggest customer pain identified.
current_workaround	TEXT	NULLABLE	How customers solve the problem now.
main_competitors	JSONB	NULLABLE	Analysis of 2-3 key competitors (name, weakness, pricing).
unique_angle	TEXT	NULLABLE	How the MSP solves a competitor's weakness.
-- PERSONAL FIT & GOALS --			
skills_alignment_score	INTEGER	NULLABLE	Self-assessment score (1-5) on skill leverage.
risk_comfort_score	INTEGER	NULLABLE	Self-assessment score (1-5) on risk tolerance.
goal_alignment_score	INTEGER	NULLABLE	Self-assessment score (1-5) on alignment with personal "why."
resource_availability	TEXT	NULLABLE	Assessment of resources (e.g., 'time available', 'funding needed').
initial_msp_cost	NUMERIC	NULLABLE	Estimated cost (money/time) for Minimal Sell-able Product.
-- FINAL DECISION & ACTION --			
commitment_justification	TEXT	NULLABLE	Qualitative reason for final selection (gut check).
next_immediate_action	TEXT	NULLABLE	The very next small step committed to after selection.

## M3.1 / M3.2: Exploring Market & Customer Needs
This combines the initial customer deep dive into one exercise, focusing on identifying the problem and qualifying the customer.

Exercise Form	Fields to Populate (Data Focus)	Task Type
Research Opportunities (Initial Input)	opportunity_name (Crucial for linking)	Think
top_pain_point	Analyze
current_workaround	Explore
unique_angle (Brief idea of differentiation)	Create

## M3.3: Sizing Up Your Opportunity
This exercise focuses on external validation and quantification (The "Head").

Exercise Form	Fields to Populate (Data Focus)	Task Type
Market Quantification & Comp.	market_size_tam, market_size_sam, market_size_som	Execute (Calculation)
market_trend	Analyze
main_competitors (JSONB for up to 3 entries)	Analyze

## M3.4: Assessing Personal Fit
This exercise focuses on internal validation (The "Heart").

Exercise Form	Fields to Populate (Data Focus)	Task Type
Personal Fit Assessment	skills_alignment_score	Think
risk_comfort_score	Think
goal_alignment_score	Think
resource_availability (Text summary of time/money)	Analyze
initial_msp_cost (Estimated cost/time)	Execute

## M3.5: Prioritizing & Selecting
This exercise is the final decision point.

Exercise Form	Fields to Populate (Data Focus)	Task Type
Priority Matrix & Selection	is_selected (Boolean flag for the winner)	Execute (Decision)
commitment_justification	Communicate
next_immediate_action	Execute

# Adding all fields to existing user_opportunity table
```ts
type user_opportunities= {
        // Current Fields
        category: string | null; 
        created_at: string;
        description: string | null;
        discovery_method: string;
        goal_alignment: string | null;
        id: string;
        observation_type: string | null;
        rank: number | null; // remove this
        status: string | null;
        title: string | null;
        updated_at: string | null;
        user_id: string | null;
        //Proposed Fields
        is_selected: boolen; // default -> fasle
        total_score : number; // score assigned after assessment
        assessment_scores: jsonb ; 
        // Market and Customer Data
        market_size: json; // {sop,sam,som with remarks}


        
    }

```

## Tables for dashboard
accomplishments: {
    category: string | null
    created_at: string
    criteria: Json | null
    description: string | null
    id: number
    image_url: string | null
    is_active: boolean | null
    level: string | null
    name: string | null
    points: number | null
    type: string | null
    updated_at: string | null
}
user_accomplishments(has store): {
    accomplishment_id: number | null
    context_data: Json | null
    created_at: string
    earned_at: string | null
    id: number
    user_id: string | null
}
events: {
    capacity: number | null
    created_at: string | null
    created_by: string
    currency: string | null
    description: string | null
    end_time: string
    event_format: string
    event_type: string
    exhibits: Json[] | null
    featured_image_url: string | null
    id: string
    is_member_only: boolean
    is_paid: boolean
    location: Json | null
    online_link: string | null
    price: number | null
    sessions: Json[] | null
    start_time: string
    title: string
    updated_at: string | null
}
user_events:(has store) {
    attendance_status: string | null
    created_at: string
    email: string | null
    event_id: string | null
    id: string
    name: string | null
    organization: string | null
    organization_role: string | null
    participant_avatar_url: string | null
    participant_bio: string | null
    participant_type: string | null
    status: string | null
    transaction_id: string | null
    user_id: string | null
}

user_challenge_progress:(has store) {
    challenge_id: string
    completed_at: string | null
    created_at: string
    email: string | null
    feedback_rating: number | null
    feedback_text: string | null
    id: number
    last_step_completed: number | null
    notification_sent: Json | null
    reflections: Json[] | null
    updated_at: string | null
    user_id: string | null
}

user_cheer_squad: (has store){
    created_at: string | null
    email: string
    id: string
    name: string | null
    relationship: string | null
    status: string | null
    updated_at: string | null
    user_id: string
}
user_cheer_squad_updates: {
    cheer_squad_id: string
    created_at: string | null
    id: string
    status: string | null
    type: string
    update_link: string | null
    update_text: string | null
    user_id: string
}

user_journals:(has store) {
    category: string | null
    content: string | null
    created_at: string
    entry_data: Json | null
    id: string
    is_public: boolean | null
    related_entity_id: string | null
    related_entity_slug: string | null
    related_entity_type: string | null
    title: string | null
    type: string | null
    updated_at: string | null
    user_id: string | null
}

user_opportunities:(has store) {
    category: string | null
    created_at: string
    description: string | null
    discovery_method: string
    goal_alignment: string | null
    id: string
    observation_type: string | null
    rank: number | null
    status: string | null
    title: string | null
    updated_at: string | null
    user_id: string | null
}

user_progress: (has store){
    completed_at: string | null
    content_meta_id: string | null
    content_slug: string | null
    content_title: string | null
    content_type: string | null
    created_at: string
    feedback_rating: number | null
    feedback_text: string | null
    form_completed: boolean | null
    has_form: boolean | null
    id: number
    status: string | null
    updated_at: string | null
    user_id: string
}

user_questions:(has store) {
    content: string
    content_type: string
    created_at: string
    id: number
    is_public: boolean
    reference_table: string
    reference_url: string
    related_content_id: string
    status: string
    title: string
    user_id: string
}

user_question_responses(has store): {
    asker_id: string
    content: string
    created_at: string
    feedback_rating: number | null
    id: number
    question_id: number | null
    updated_at: string
    user_id: string
}
user_skills(has store): {
    assessment_market_demand: string | null
    assessment_monetization_ideas: Json[] | null
    assessment_notes: string | null
    assessment_passion_level: number | null
    assessment_required_investment: string | null
    assessment_status: string | null
    assessment_viability: Json[] | null
    category: string
    created_at: string | null
    description: string | null
    experience: string | null
    frequency_of_use: string | null
    id: string
    is_public: boolean | null
    name: string | null
    professional_training: string | null
    proficiency_level: string | null
    project_examples: Json | null
    subcategory: string
    updated_at: string | null
    user_id: string
}


user_opportunities 
```ts
user_opportunities: {
        Row: {
          alignment_assessment_score: number | null
          assessment_rationale: string | null // not to included in phone app
          barriers_to_entry: string[] | null // not to included in phone app
          capital_assessment_score: number | null // not to included in phone app
          category: string | null
          competitors: string[] | null // not to included in phone app
          created_at: string
          description: string | null
          discovery_method: string
          id: string
          market_size: Json | null // not to included in phone app
          market_size_rationale: string | null // not to included in phone app
          market_trend: string | null // not to included in phone app
          observation_type: string | null
          resource_assessment_score: number | null // not to included in phone app
          risk_comfort_score: number | null // not to included in phone app
          skill_assessment_score: number | null // not to included in phone app
          status: string | null
          target_buying_behaviour: Json | null // not to included in phone app
          target_demographics: Json | null // not to included in phone app
          target_motivations: string[] | null // not to included in phone app
          target_psychographics: Json | null // not to included in phone app
          target_unmet_needs: string[] | null // not to included in phone app
          title: string | null        
          top_pain_point: string | null // not to included in phone app
          updated_at: string | null
          user_id: string | null
        }},

        user_opportunity_comments: {
        Row: {
          comment_type: string | null // "observation"| "insight" | "question" |"update";
          content: string | null
          created_at: string
          id: string
          opportunity_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }}


```