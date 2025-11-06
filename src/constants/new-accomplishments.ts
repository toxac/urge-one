/**
 * @description Additional accomplishments for opportunity identification, business building, and support squad
 * To be added to the main accomplishments.ts file
 */

// Opportunity Identification Accomplishments
const OPPORTUNITY_ACCOMPLISHMENTS = [
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
    }
];

// Business Building Accomplishments
const BUSINESS_BUILDING_ACCOMPLISHMENTS = [
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
    }
];

// Support Squad (Cheer Squad) Accomplishments
const SUPPORT_SQUAD_ACCOMPLISHMENTS = [
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