import { defineCollection , z, reference } from "astro:content";

const milestones = defineCollection({
    schema: z.object({
        id: z.string(),
        contentMetaId: z.string(),
        programId: z.string(),
        programName: z.string().optional(),
        title: z.string(),
        subtitle: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        description: z.string().optional(),
        sequence: z.number(),

        // Progression (flexible reference)
        previous: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),

        next: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),

        // Cover image
        coverImage: z.object({
            alt: z.string(),
            src: z.string().or(z.string().url()),
            caption: z.string().optional(),
            credits: z.string().optional(),
            originalSrc:z.string().optional(),
        }).optional(),
        summary: z.string().optional(),
        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
        version: z.number().optional(),
        archived: z.boolean().optional().default(false),
    }),
});

const concepts = defineCollection({
    schema: z.object({
        id: z.string(),
        contentMetaId: z.string(), 
        programId: z.string(),
        programName: z.string().optional(),
        title: z.string(),
        subtitle: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        description: z.string().optional(),
        sequence: z.number(), // sequence for concepts
        // Program references
        milestone: reference("milestones"), // use id string instead of reference
        // Progression
        previous: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        next: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
        version: z.number().optional(),
        archived: z.boolean().optional().default(false),
    }),
});

// Summary does not have a content_meta_id and is not saved the content_meta table
const summaries = defineCollection({
    schema: z.object({
        id: z.string(),
        contentMetaId: z.string(), 
        programId: z.string(),
        programName: z.string().optional(),
        title: z.string(),
        // Program references
        milestone: reference("milestones"), // use id string instead of reference
        // Progression
        previous: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        next: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        // Cover image
        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
    }),
});


const challenges = defineCollection({
    schema: z.object({
        id: z.string(), 
        contentMetaId: z.string(), 
        challengeId: z.string().optional(), 
        programId: z.string().optional(),
        programName: z.string().optional(),
        title: z.string(),
        subtitle:z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        description: z.string().optional(),
        milestone: reference('milestones'), // id of milestone
        concept: reference('concepts'), // id of concept
        hasForm: z.boolean().default(false),
        isOpen: z.boolean().optional(),
        type: z.enum(['think', 'research', 'create', 'communicate', 'execute']),
        sequence: z.number(), // sequence for challenges
        // Progression (flexible reference)
        previous: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        next: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),
        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
        version: z.number().optional(),
        archived: z.boolean().optional().default(false),
    }),
});


const exercises = defineCollection({
    schema: z.object({
        id: z.string(),
        contentMetaId: z.string(),  
        programId: z.string(),
        programName: z.string().optional(),
        title: z.string(),
        subtitle: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        description: z.string().optional(),
        milestone: reference('milestones'), 
        hasForm: z.boolean().default(false),
        sequence: z.number(), // sequence for exercises
        // Progression (flexible reference)
        previous: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),

        next: z.object({
            type: z.string(),
            id: z.string(),
        }).optional(),

        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
        version: z.number().optional(),
        archived: z.boolean().optional().default(false),
    }),
});

// resources are blogs which have guides, templates, kits, playbooks etc
const resources = defineCollection({
    schema: z.object({
        id: z.string(),
        resourceMetaId: z.number(), // id(int8) for supabase content_meta entry
        author: z.object({
            username: z.string().optional(),
            userId: z.string().optional(),
            firstname: z.string().optional(),
            lastName: z.string().optional(),
            avatarUrl: z.string().optional(),
        }).optional(), // created_by (user_id) column in supabase, make this into a object
        title: z.string(),
        concept: reference('concepts').optional(), //for linking concepts to resources
        subtitle: z.string().optional(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()).optional(),
        theme: z.string().optional(),
        category: z.enum([
            "guides",
            "toolkits",
            "stories",
            "opinions",
            "news & updates",
            "templates",
            "checklists",
            "interviews",
            "research & reports",
          ]).optional(),
        featured: z.boolean().optional(),
        description: z.string(),
        coverImage: z.object({
            alt: z.string(),
            src: z.string().or(z.string().url()),
            caption: z.string().optional(),
            credits: z.string().optional(),
            originalSrc: z.string().optional(),
        }).optional(),
        language: z.enum(["en", "bn", "hi", "kn", "ne", "ps", "si","ta", "te" ]).default('en'),
        version: z.number().optional(),
        archived: z.boolean().optional().default(false),
    }),
});

export const collections = {concepts, milestones, challenges, exercises, resources, summaries }