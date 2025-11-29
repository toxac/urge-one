/**
 * @file src/components/journal/options.ts
 * @description options for fields in journal
 */

/*
user_journal table Schema
user_journals: {
        Row: {
          additional_data: Json | null
          audio_note: string | null
          category: string
          content: string
          content_id: string | null
          created_at: string
          id: string
          is_public: boolean | null
          mood: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          urgency: string | null
          user_id: string
        }
    }

    */
type FieldOptions = {
    label: string;
    value: string;
    description: string;
};

const categoryOptions: FieldOptions[] = [
    {
        label: "Personal Growth",
        value: "personal-growth",
        description: "Reflections on self-improvement and development"
    },
    {
        label: "Business Ideas",
        value: "business-ideas",
        description: "Entrepreneurial ideas and business insights"
    },
    {
        label: "Challenges",
        value: "challenges",
        description: "Obstacles faced and how you overcame them"
    },
    {
        label: "Wins & Achievements",
        value: "wins-achievements",
        description: "Successes and milestone accomplishments"
    },
    {
        label: "Customer Feedback",
        value: "customer-feedback",
        description: "Feedback and insights from customers"
    },
    {
        label: "Learning",
        value: "learning",
        description: "New things learned and skills acquired"
    },
    {
        label: "Strategy",
        value: "strategy",
        description: "Strategic planning and business strategy"
    },
    {
        label: "Daily Reflection",
        value: "daily-reflection",
        description: "Daily thoughts and reflections"
    },
    {
        label: "Goals",
        value: "goals",
        description: "Goal setting and progress tracking"
    },
    {
        label: "Other",
        value: "other",
        description: "Miscellaneous entries"
    }
];

const urgencyOptions: FieldOptions[] = [
    {
        label: "Critical",
        value: "critical",
        description: "Requires immediate action"
    },
    {
        label: "High",
        value: "high",
        description: "Important and should be addressed soon"
    },
    {
        label: "Medium",
        value: "medium",
        description: "Important but can wait"
    },
    {
        label: "Low",
        value: "low",
        description: "Nice to have, not urgent"
    },
    {
        label: "None",
        value: "none",
        description: "General note, no urgency"
    }
];

const moodOptions: FieldOptions[] = [
    {
        label: "Excited",
        value: "excited",
        description: "Energized and enthusiastic"
    },
    {
        label: "Motivated",
        value: "motivated",
        description: "Driven and focused"
    },
    {
        label: "Optimistic",
        value: "optimistic",
        description: "Positive and hopeful"
    },
    {
        label: "Calm",
        value: "calm",
        description: "Peaceful and composed"
    },
    {
        label: "Neutral",
        value: "neutral",
        description: "No strong emotions"
    },
    {
        label: "Tired",
        value: "tired",
        description: "Fatigued or exhausted"
    },
    {
        label: "Stressed",
        value: "stressed",
        description: "Under pressure or overwhelmed"
    },
    {
        label: "Frustrated",
        value: "frustrated",
        description: "Annoyed or dissatisfied"
    },
    {
        label: "Discouraged",
        value: "discouraged",
        description: "Disheartened or doubtful"
    },
    {
        label: "Anxious",
        value: "anxious",
        description: "Worried or uneasy"
    }
];

export { categoryOptions, urgencyOptions, moodOptions, type FieldOptions };