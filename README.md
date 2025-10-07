# Astro Starter Kit: Basics

https://xqxzcpocbwqhuoqymhbr.supabase.co/auth/v1/verify?token=pkce_ede32d9dda41ecb2d28c5d1b0faa29918983fd268f2d9a8388c1033f&type=recovery&redirect_to=http://localhost:4321/auth/reset-password


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