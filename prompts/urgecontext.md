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

## Other Apps

### urge-go
mobile app that provides users with features from urge which they can use on the go. Features on the go 

- Journals - Users can record journal entries (includes data from user_journals, user_journal_responses)
- Opportunities - Way to save oportunities when users discover then anywhere, (Includes tables user_opportunities, user-opportunity_comments)
- Network - to be implemented later
- Updates and notification

## Database Schema
```ts
Tables: {
      accomplishments: { // Predefined accomplishments
        Row: {
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
      }
      challenge_steps: { // steps for challenges mainly for open free challenges links to challenges table
        Row: {
          challenge_id: string | null
          created_at: string
          id: number
          instructions: string | null
          reflection_questions: string[] | null
          sequence: number | null
          title: string | null
          updated_at: string | null
        }
      }
      challenges: { // Challenges
        Row: {
          archived: boolean | null
          badges: Json | null
          content_meta_id: string | null
          cover_image: Json | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_open: boolean | null
          language: string
          milestone_id: string | null
          program_id: string | null
          pub_date: string
          sequence: number | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_date: string | null
          version: number | null
        }
      }
      content_meta: { // A meta copy of program content from app markdown files
        Row: {
          accomplishment_id: number | null
          content: string | null
          content_type: string
          created_at: string
          description: string | null
          difficulty: string | null
          has_form: boolean | null
          id: string
          milestone_id: string | null
          program_id: string | null
          related_content: Json | null
          sequence: number | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
      }
      discounts: { // discount for offerings
        Row: {
          code: string
          created_at: string
          currency: string | null
          entity_id: string
          entity_name: string | null
          entity_type: string
          id: number
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
          value: number
          value_type: string
        }
      }
      events: { // events
        Row: {
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
      }
      journal_responses: { // responses to user_journal
        Row: {
          content: string
          created_at: string
          id: string
          journal_id: string | null
          metadata: Json | null
          response_type: string | null
          user_id: string | null
        }
      }
      leads: { // Marketing leads from all sources
        Row: {
          city: string | null
          communications: Json | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          gender: string | null
          id: number
          last_name: string | null
          notes: string | null
          opt_newsletter: boolean | null
          opt_updates: boolean | null
          other_details: Json | null
          phone: string | null
          program_id: string | null
          segment: string | null
          source: string | null
          source_details: Json | null
          status: string | null
        }
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string | null
          id: number
          status: string | null
          user_id: string | null
        }
      }
      offerings: { // programs, events, subscription/membership and others
        Row: {
          base_price_amount: number | null
          created_at: string
          currency: string | null
          description: string | null
          duration_months: number | null
          entity_type: string | null
          id: number
          is_active: boolean | null
          name: string
          related_entity_id: string | null
          updated_at: string | null
        }
      }
      programs: { // program information
        Row: {
          created_at: string
          description: string | null
          id: string
          mode: string | null
          name: string
          price: Json | null
          type: string | null
          updated_at: string | null
        }
      }
      resource_comments: { // comment for resources table
        Row: {
          created_at: string
          created_by: string
          id: number
          resources_id: number
          status: string | null
          text: string | null
          title: string | null
          updated_at: string | null
        }
      }
      resources: { // blogs, templates, guides etc
        Row: {
          categories: string[] | null
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
      }
      roles: { // predefined user access roles
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
      }
      user_accomplishments: { // list of accomplishments for users
        Row: {
          accomplishment_id: number | null
          context_data: Json | null
          created_at: string
          earned_at: string | null
          id: number
          user_id: string | null
        }

      }
      user_bookmarks: { // bookmarks created by users
        Row: {
          content_type: string | null
          created_at: string
          id: number
          reference_table: string | null
          reference_url: string
          related_content_id: string | null
          title: string | null
          user_id: string | null
        }
      }
      user_challenge_progress: { // tracks user progress through challenges, used for open challenges
        Row: {
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
      }
      user_cheer_squad: { // people invited by users to be their cheer squad/accountability partners
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          relationship: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
      }
      user_cheer_squad_updates: {
        Row: {
          cheer_squad_id: string
          created_at: string | null
          id: string
          status: string | null
          type: string
          update_link: string | null
          update_text: string | null
          user_id: string
        }
      }
      user_enrollments: { // program enrollments
        Row: {
          enrolled_at: string
          id: number
          program_id: string | null
          program_name: string | null
          transaction_id: string | null
          user_id: string | null
        }
      }
      user_events: { // event registrations
        Row: {
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
      }
      user_journals: { // user created journals
        Row: {
          category: string | null
          content: string | null
          created_at: string
          cross_post_to_blog: boolean | null
          cross_post_to_social: string[] | null
          cta_description: string | null
          cta_title: string | null
          cta_type: string | null
          entry_data: Json | null
          has_cta: boolean | null
          id: string
          is_public: boolean | null
          program_ref: Json | null
          response_deadline: string | null
          should_email_followers: boolean | null
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
          urgency: string | null
          user_id: string | null
        }
      }
      user_memberships: { // memebership to network
        Row: {
          created_at: string
          id: string
          offering_id: number | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
          valid_until: string | null
        }
      }
      user_notes: { // notes created by users from program content
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          id: number
          reference_table: string | null
          reference_url: string
          related_content_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
      }
      user_opportunities: { // opportunities identified by users
        Row: {
          alignment_assessment_score: number | null
          assessment_rationale: string | null
          barriers_to_entry: string[] | null
          capital_assessment_score: number | null
          category: string | null
          competitors: string[] | null
          created_at: string
          description: string | null
          discovery_method: string
          id: string
          market_size: Json | null
          market_size_rationale: string | null
          market_trend: string | null
          observation_type: string | null
          resource_assessment_score: number | null
          risk_comfort_score: number | null
          skill_assessment_score: number | null
          status: string | null
          target_buying_behaviour: Json | null
          target_demographics: Json | null
          target_motivations: string[] | null
          target_psychographics: Json | null
          target_unmet_needs: string[] | null
          title: string | null
          top_pain_point: string | null
          updated_at: string | null
          user_id: string | null
        }
      }
      user_opportunity_comments: { // observations recorded by users for opportunities
        Row: {
          comment_type: string | null
          content: string | null
          created_at: string
          id: string
          opportunity_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
      }
      user_profiles: {
        Row: {
          activations: Json[] | null
          address: Json | null
          age_group: string | null
          bio: string | null
          created_at: string | null
          education: Json | null
          employment: Json | null
          entrepreneurial_assessment: Json | null
          first_name: string | null
          gender: string | null
          interests: Json | null
          last_active_at: string | null
          last_name: string | null
          motivation_deal_breakers: string | null
          motivation_emotions: string[] | null
          motivation_perfect_day: string | null
          motivation_statement: string | null
          motivations: Json | null
          myths: Json | null
          preferences: Json | null
          profile_picture: string | null
          roles: Json[] | null
          settings: Json | null
          social_links: Json | null
          updated_at: string | null
          user_id: string
          username: string
          website: string | null
        }
      }
      user_progress: { // user progress tracking for program content
        Row: {
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
      }
      user_question_responses: { // responses to questions posted by users on programs content
        Row: {
          asker_id: string
          content: string
          created_at: string
          feedback_rating: number | null
          id: number
          question_id: number | null
          updated_at: string
          user_id: string
        }
      }
      user_questions: { //questions posted by users on programs content
        Row: {
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
      }
      user_roles: { // roles assigned to users
        Row: {
          created_at: string
          id: number
          role_id: number
          role_name: string | null
          updated_at: string | null
          user_id: string | null
          valid_until: string | null
        }
      }
      user_skills: { // skills listed by users
        Row: {
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
      }
      user_transactions: { 
        Row: {
          base_amount: number | null
          created_at: string
          currency: string | null
          discount_amount: number | null
          discount_id: number | null
          id: string
          offering_id: number | null
          offering_name: string | null
          offering_type: string | null
          payment_method: string | null
          payment_provider: string | null
          provider_data: Json | null
          provider_transaction_id: string | null
          status: string | null
          tax_amount: number | null
          total_amount_paid: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings_with_details"
            referencedColumns: ["offering_id"]
          },
        ]
      }
    }

```