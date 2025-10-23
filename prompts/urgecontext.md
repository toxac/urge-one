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

