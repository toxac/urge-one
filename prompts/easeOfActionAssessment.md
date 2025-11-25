# Assessing content for Ease of Action
I want to use Fogg's behaviour model and asses each content for ease of action, I want evaluation on three main criteria
1. Motivation : Scored for -> Pleasure/Pain, Hope/Fear, Social
2. Ability: scored for -> Time,	Money, Physical Effort, Brain Cycles, Social Deviance [inverse], Routine
3. Prompt: scxored for -> CTA clarity, Timing/Context, Cue strength, Support

I want these scored in standardized way and also i want recommendations for improvement for each of those criterias. I want the output in json format using schema below.

```ts
type Schema = {
    seq: number; //ignore the value in frontmatter and add this based on sequence as i give you content
    activityType: string;
    slug: string; // id in frontmatter
    hasForm: boolean; // if present in frontmatter
    // Score for ease of action using fogg behaviour model
    motivation_painPleasure: number;
    motivation_hopeFear: number;
    motivation_social: number;
    ability_time: number;
    ability_money: number;
    ability_physicalEffort: number;
    ability_brainCycle: number;
    ability_socialDeviance: number;
    ability_routine: number;
    promptCTAClarity: number;
    promptTiming: number;
    promptCueStrength: number;
    promptSupport: number;
    totalScore: number;
    // recommendation for improvement
    recommendationMotivation: string;
    recommendationAbility: string;
    recommendationPrompt: string;
}

```
## Instruction
1. What do you think of this approach
2. I will give you content one at a time in mdx format from urge content. you have to evaluate it based on approach i have described above. 
3. After assessment you have to give me result in json format based on the described schema.

Ask me if you have any clarification before i start sharing content one by one in sequence.

