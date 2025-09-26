import type { UserOpportunitiesDiscoveryMethod } from "../../../types/dbconsts";
export interface DiscoveryMethodOption {
    value: UserOpportunitiesDiscoveryMethod;
    label: string;
    helperText: string;
    example?: string;
    observationType?: { value: string; label: string; helperText: string, example?: string } [];
  }
  
 export const discoveryMethodOptions: DiscoveryMethodOption [] = [
    {
      value: "personal-problems",
      label: "Your problems and frustrations",
      helperText: "Opportunities discovered by identifying and analyzing problems you personally face.",
      example: "Example: You struggle to find healthy and convenient meals, leading to an idea for a meal delivery service.",
      observationType: [
        {
          value: "daily-frustrations",
          label: "Daily Frustrations",
          helperText: "Problems and inconveniences you encounter in your daily life.",
          example: "Example: You constantly misplace your keys, leading to an idea for a key-finding device.",
        },
        {
          value: "unmet-needs",
          label: "Unmet Needs",
          helperText: "Needs or desires that are not currently being addressed by existing solutions.",
          example: "Example: You wish there was a better way to learn a new language, leading to an idea for an interactive language learning app.",
        },
        {
          value: "passion-projects",
          label: "Passion Projects",
          helperText: "Opportunities related to your hobbies, interests, or passions.",
          example: "Example: You love to bake and realize there's a demand for custom-decorated cakes, leading to an idea for a cake decorating business.",
        },
      ],
    },
    {
      value: "skill-based",
      label: "Turning skills into opportunities",
      helperText: "Opportunities identified by leveraging your existing skills and talents to solve problems for others.",
      example: "Example: You're a skilled graphic designer and realize that many small businesses need help with their branding, leading to an idea for a design agency.",
      observationType: [
        {
          value: "professional-skills",
          label: "Professional Skills",
          helperText: "Skills you've acquired through your work experience or education.",
          example: "Example: You're a skilled accountant and realize that many freelancers struggle with their taxes, leading to an idea for a tax preparation service.",
        },
        {
          value: "creative-skills",
          label: "Creative Skills",
          helperText: "Skills related to creativity, design, or artistic expression.",
          example: "Example: You're a talented musician and realize that many people want to learn to play an instrument, leading to an idea for music lessons.",
        },
        {
          value: "technical-skills",
          label: "Technical Skills",
          helperText: "Skills related to technology, programming, or digital tools.",
          example: "Example: You're a skilled web developer and realize that many businesses need help building websites, leading to an idea for a web development agency.",
        },
        {
          value: "interpersonal-skills",
          label: "Interpersonal Skills",
          helperText: "Skills related to communication, collaboration, and relationship building.",
          example: "Example: You're a skilled communicator and realize that many people struggle with public speaking, leading to an idea for public speaking coaching.",
        },
      ],
    },
    {
      value: "zone-of-influence",
      label: "Observing people around you",
      helperText: "Opportunities found by observing and understanding the problems faced by people you know (friends, family, colleagues, etc.).",
      example: "Example: Your friend complains about the lack of childcare options in your area, leading to an idea for a daycare center.",
      observationType: [
        {
          value: "family-and-friends",
          label: "Family and Friends",
          helperText: "Problems and needs of your family members and close friends.",
          example: "Example: Your family member struggles with a chronic illness, leading to an idea for a support group or specialized product.",
        },
        {
          value: "colleagues-and-acquaintances",
          label: "Colleagues and Acquaintances",
          helperText: "Problems faced by people you work with or interact with regularly.",
          example: "Example: Your colleagues complain about the lack of healthy food options near the office, leading to an idea for a healthy food delivery service.",
        },
        {
          value: "community-members",
          label: "Community Members",
          helperText: "Problems and needs within your local community or online communities you participate in.",
          example: "Example: Members of your online community express frustration with finding reliable information about a specific topic, leading to an idea for a curated resource website.",
        },
      ],
    },
    {
      value: "broader-search",
      label: "Cast a wider net",
      helperText: "Opportunities discovered by exploring broader trends, markets, and online communities to identify problems and needs.",
      example: "Example: You notice a growing trend of people interested in sustainable living, leading to an idea for an eco-friendly product or service.",
      observationType: [
        {
          value: "hypes-and-trends",
          label: "Hypes and Trends",
          helperText: "Opportunities identified by analyzing current trends and hypes.",
          example: "Example: You notice a growing hype around virtual reality, leading to an idea for a VR experience or application.",
        },
        {
          value: "niche-communities",
          label: "Niche Communities",
          helperText: "Opportunities discovered within niche communities and online forums.",
          example: "Example: You discover a passionate online community of pet lovers who are frustrated with the lack of high-quality pet products, leading to an idea for a pet supply business.",
        },
        {
          value: "google-trends-and-search-keywords",
          label: "Google Trends and Search Keywords",
          helperText: "Opportunities found by researching Google Trends and search keywords.",
          example: "Example: You research Google Trends and discover a rising interest in a particular type of cuisine, leading to an idea for a restaurant or food product.",
        },
        {
          value: "marketplaces",
          label: "Marketplaces",
          helperText: "Opportunities identified by analyzing online marketplaces like Amazon and Etsy.",
          example: "Example: You analyze popular products on Etsy and notice a gap in the market for handmade jewelry with a specific style, leading to an idea for an Etsy shop.",
        },
        {
          value: "social-media-trends",
          label: "Social Media Trends",
          helperText: "Opportunities discovered through social media trends and conversations.",
          example: "Example: You notice a trending hashtag on Twitter related to a social issue, leading to an idea for a product or service that addresses that issue.",
        },
      ],
    },
  ];


interface SelectOption {
  value: string;
  label: string;
  helperText?: string; // Helper text is optional for some options
}
  
export const categoryOptions: SelectOption [] = [
    {
      value: "functional",
      label: "Functional",
      helperText: "Problems related to how things work, their usability, or their efficiency.",
    },
    {
      value: "emotional",
      label: "Emotional",
      helperText: "Problems that affect people's feelings, cause frustration, or relate to psychological needs.",
    },
    {
      value: "social",
      label: "Social",
      helperText: "Problems related to social connections, belonging, community, or relationships.",
    },
    {
      value: "financial",
      label: "Financial",
      helperText: "Problems related to money, costs, expenses, or financial well-being.",
    },
    {
      value: "physical",
      label: "Physical",
      helperText: "Problems related to physical health, comfort, safety, or the physical world.",
    },
    {
      value: "environmental",
      label: "Environmental",
      helperText: "Problems related to the environment, sustainability, resource management, or ecological concerns.",
    },
];


export const alignmentWithGoalsOptions: SelectOption [] = [
  {
    value: "strong-alignment",
    label: "Strong Alignment",
    helperText: "The opportunity strongly aligns with your goals and aspirations.",
  },
  {
    value: "good-alignment",
    label: "Good Alignment",
    helperText: "The opportunity aligns well with your goals.",
  },
  {
    value: "neutral",
    label: "Neutral",
    helperText: "The opportunity is somewhat aligned with your goals.",
  },
  {
    value: "poor-alignment",
    label: "Poor Alignment",
    helperText: "The opportunity does not align well with your goals.",
  },
  {
    value: "no-alignment",
    label: "No Alignment",
    helperText: "The opportunity does not align with your goals at all.",
  },
];