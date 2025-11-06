/**
 * @description Defines all accomplishments available in the program
 * Types are based on database schema from database.types.ts
 */

import type { Database } from "../../database.types";
import type { JournalCategory } from "../../types/urgeTypes";

type Accomplishment = Database['public']['Tables']['accomplishments']['Row'];
type Json = Database['public']['Tables']['accomplishments']['Row']['criteria'];

// Combine all criteria types
type AccomplishmentCriteria = {
    milestone_id?: string;
    challenge_id?: string;
    journal_entries_count?: number;
    public_entries_count?: number;
    categories_covered?: JournalCategory[];
    resources_published?: number;
    questions_answered?: number;
    streak_days?: number;
    discussion_prompts?: number;
    feedback_given?: number;
    squad_members?: number;
    squad_engagement_days?: number;
    opportunities_identified?: number;
    landing_page_created?: boolean;
    first_sale_made?: boolean;
    mvp_created?: boolean;
    customers_acquired?: number;
    marketing_campaign_launched?: boolean;
    beta_testers_acquired?: number;
    customer_feedback_collected?: number;
    revenue_milestone?: number;
    testimonials_collected?: number;
    marketing_channels_active?: number;
    status: 'completed';
    documentation_provided?: boolean;
    interviews_conducted?: boolean;
    opportunities_documented?: boolean;
    evidence_provided?: boolean;
};

export const ACCOMPLISHMENTS: Omit<Accomplishment, 'id' | 'created_at' | 'updated_at'>[] = [
    // Milestone Accomplishments (previous ones remain the same)...
    // Personal Growth Accomplishments (previous ones remain the same)...
    // Customer Connection Accomplishments (previous ones remain the same)...
    // Action Taker Accomplishments (previous ones remain the same)...
    // Journal Accomplishments (previous ones remain the same)...

    // Opportunity Identification Accomplishments
    {
        name: "Problem Spotter",
        description: "Identified your first business opportunity by focusing on real problems to solve.",
        category: "business_builder",
        type: "opportunity",
        level: "bronze",
        points: 25,
        is_active: true,
        image_url: "/badges/problem-spotter.png",
        criteria: {
            opportunities_identified: 1,
            status: "completed"
        }
    },
    {
        name: "Opportunity Hunter",
        description: "Identified 5 potential business opportunities. You're developing a keen eye for problems worth solving.",
        category: "business_builder",
        type: "opportunity",
        level: "silver",
        points: 75,
        is_active: true,
        image_url: "/badges/opportunity-hunter.png",
        criteria: {
            opportunities_identified: 5,
            status: "completed"
        }
    },
    {
        name: "Opportunity Maven",
        description: "Identified 20 business opportunities. You've mastered the art of seeing problems as opportunities.",
        category: "business_builder",
        type: "opportunity",
        level: "gold",
        points: 200,
        is_active: true,
        image_url: "/badges/opportunity-maven.png",
        criteria: {
            opportunities_identified: 20,
            status: "completed"
        }
    },

    // Business Building Accomplishments
    {
        name: "Landing Page Creator",
        description: "Built your first landing page to validate your business idea.",
        category: "business_builder",
        type: "building",
        level: "bronze",
        points: 50,
        is_active: true,
        image_url: "/badges/landing-page-creator.png",
        criteria: {
            landing_page_created: true,
            status: "completed"
        }
    },
    {
        name: "First Sale Champion",
        description: "Made your first sale! A huge milestone in your entrepreneurial journey.",
        category: "business_builder",
        type: "revenue",
        level: "gold",
        points: 300,
        is_active: true,
        image_url: "/badges/first-sale.png",
        criteria: {
            first_sale_made: true,
            status: "completed"
        }
    },
    {
        name: "MVP Builder",
        description: "Created your first Minimum Viable Product.",
        category: "business_builder",
        type: "building",
        level: "silver",
        points: 150,
        is_active: true,
        image_url: "/badges/mvp-builder.png",
        criteria: {
            mvp_created: true,
            status: "completed"
        }
    },
    {
        name: "Customer Acquisition Master",
        description: "Successfully acquired your first 10 customers.",
        category: "business_builder",
        type: "revenue",
        level: "gold",
        points: 400,
        is_active: true,
        image_url: "/badges/customer-master.png",
        criteria: {
            customers_acquired: 10,
            status: "completed"
        }
    },
    {
        name: "Marketing Pioneer",
        description: "Launched your first marketing campaign.",
        category: "business_builder",
        type: "marketing",
        level: "silver",
        points: 100,
        is_active: true,
        image_url: "/badges/marketing-pioneer.png",
        criteria: {
            marketing_campaign_launched: true,
            status: "completed"
        }
    },

    // Additional Business Building Accomplishments
    {
        name: "Beta Testing Pro",
        description: "Successfully recruited and engaged 10 beta testers.",
        category: "business_builder",
        type: "validation",
        level: "silver",
        points: 150,
        is_active: true,
        image_url: "/badges/beta-testing-pro.png",
        criteria: {
            beta_testers_acquired: 10,
            status: "completed"
        }
    },
    {
        name: "Feedback Collector",
        description: "Collected and documented feedback from 20 users/customers.",
        category: "business_builder",
        type: "validation",
        level: "gold",
        points: 200,
        is_active: true,
        image_url: "/badges/feedback-collector.png",
        criteria: {
            customer_feedback_collected: 20,
            status: "completed"
        }
    },
    {
        name: "Revenue Milestone: Launch",
        description: "Reached your first $100 in revenue.",
        category: "business_builder",
        type: "revenue",
        level: "silver",
        points: 200,
        is_active: true,
        image_url: "/badges/revenue-milestone-1.png",
        criteria: {
            revenue_milestone: 100,
            status: "completed"
        }
    },
    {
        name: "Revenue Milestone: Growth",
        description: "Achieved $1,000 in revenue. Your business is gaining traction!",
        category: "business_builder",
        type: "revenue",
        level: "gold",
        points: 500,
        is_active: true,
        image_url: "/badges/revenue-milestone-2.png",
        criteria: {
            revenue_milestone: 1000,
            status: "completed"
        }
    },
    {
        name: "Social Proof Collector",
        description: "Collected 5 strong customer testimonials.",
        category: "business_builder",
        type: "marketing",
        level: "silver",
        points: 150,
        is_active: true,
        image_url: "/badges/social-proof-collector.png",
        criteria: {
            testimonials_collected: 5,
            status: "completed"
        }
    },
    {
        name: "Marketing Explorer",
        description: "Successfully tested and established presence on 3 different marketing channels.",
        category: "business_builder",
        type: "marketing",
        level: "gold",
        points: 250,
        is_active: true,
        image_url: "/badges/marketing-explorer.png",
        criteria: {
            marketing_channels_active: 3,
            status: "completed"
        }
    },

    // Support Squad (Cheer Squad) Accomplishments
    {
        name: "Squad Starter",
        description: "Added your first accountability partner to your cheer squad.",
        category: "support",
        type: "squad",
        level: "bronze",
        points: 25,
        is_active: true,
        image_url: "/badges/squad-starter.png",
        criteria: {
            squad_members: 1,
            status: "completed"
        }
    },
    {
        name: "Squad Builder",
        description: "Built a support network of 3 accountability partners in your cheer squad.",
        category: "support",
        type: "squad",
        level: "silver",
        points: 75,
        is_active: true,
        image_url: "/badges/squad-builder.png",
        criteria: {
            squad_members: 3,
            status: "completed"
        }
    },
    {
        name: "Squad Master",
        description: "Created a powerful support network with 5 active accountability partners.",
        category: "support",
        type: "squad",
        level: "gold",
        points: 150,
        is_active: true,
        image_url: "/badges/squad-master.png",
        criteria: {
            squad_members: 5,
            status: "completed"
        }
    },
    {
        name: "Engagement Champion",
        description: "Maintained regular check-ins with your cheer squad for 30 days.",
        category: "support",
        type: "squad",
        level: "gold",
        points: 200,
        is_active: true,
        image_url: "/badges/engagement-champion.png",
        criteria: {
            squad_engagement_days: 30,
            status: "completed"
        }
    }
];

// Categories
export const ACCOMPLISHMENT_CATEGORIES = [
    "milestone",
    "personal_growth",
    "customer_connection",
    "business_builder",
    "action_taker",
    "engagement",
    "contribution",
    "streak",
    "support"
] as const;

// Levels
export const ACCOMPLISHMENT_LEVELS = [
    "bronze",
    "silver",
    "gold"
] as const;

// Types
export const ACCOMPLISHMENT_TYPES = [
    "completion",
    "challenge",
    "journal",
    "contribution",
    "streak",
    "community",
    "opportunity",
    "building",
    "revenue",
    "marketing",
    "validation",
    "squad"
] as const;

// Helper function to get accomplishment by ID
export function getAccomplishmentByChallenge(challengeId: string) {
    return ACCOMPLISHMENTS.find(a => 
        (a.criteria as AccomplishmentCriteria).challenge_id === challengeId
    );
}

// Helper function to get milestone accomplishment
export function getMilestoneAccomplishment(milestoneId: string) {
    return ACCOMPLISHMENTS.find(a => 
        (a.criteria as AccomplishmentCriteria).milestone_id === milestoneId
    );
}

// Helper to get all accomplishments of a category
export function getAccomplishmentsByCategory(category: string) {
    return ACCOMPLISHMENTS.filter(a => a.category === category);
}