import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

export async function exportContentData() {
  // Get all collections (excluding resources as requested)
  const allMilestones = await getCollection('milestones');
  const allConcepts = await getCollection('concepts');
  const allChallenges = await getCollection('challenges');
  const allExercises = await getCollection('exercises');
  const allSummaries = await getCollection('summaries');

  // Format all content data
  const contentData = {
    generatedAt: new Date().toISOString(),
    collections: {
      milestones: allMilestones.map(item => ({
        id: item.data.id,
        type: 'milestones' as const,
        title: item.data.title,
        slug: item.slug,
        contentMetaId: item.data.contentMetaId,
        programId: item.data.programId,
        programName: item.data.programName,
        subtitle: item.data.subtitle,
        pubDate: item.data.pubDate?.toISOString(),
        updatedDate: item.data.updatedDate?.toISOString(),
        description: item.data.description,
        sequence: item.data.sequence,
        previous: item.data.previous,
        next: item.data.next,
        coverImage: item.data.coverImage,
        language: item.data.language,
        version: item.data.version,
        archived: item.data.archived,
        // Include all data
        fullData: item.data
      })),
      
      concepts: allConcepts.map(item => ({
        id: item.data.id,
        type: 'concepts' as const,
        title: item.data.title,
        slug: item.slug,
        contentMetaId: item.data.contentMetaId,
        programId: item.data.programId,
        programName: item.data.programName,
        subtitle: item.data.subtitle,
        pubDate: item.data.pubDate?.toISOString(),
        updatedDate: item.data.updatedDate?.toISOString(),
        description: item.data.description,
        sequence: item.data.sequence,
        milestone: item.data.milestone,
        previous: item.data.previous,
        next: item.data.next,
        language: item.data.language,
        version: item.data.version,
        archived: item.data.archived,
        fullData: item.data
      })),
      
      challenges: allChallenges.map(item => ({
        id: item.data.id,
        type: 'challenges' as const,
        title: item.data.title,
        slug: item.slug,
        contentMetaId: item.data.contentMetaId,
        programId: item.data.programId,
        programName: item.data.programName,
        subtitle: item.data.subtitle,
        pubDate: item.data.pubDate?.toISOString(),
        updatedDate: item.data.updatedDate?.toISOString(),
        description: item.data.description,
        sequence: item.data.sequence,
        milestone: item.data.milestone,
        isOpen: item.data.isOpen,
        previous: item.data.previous,
        next: item.data.next,
        language: item.data.language,
        version: item.data.version,
        archived: item.data.archived,
        fullData: item.data
      })),
      
      exercises: allExercises.map(item => ({
        id: item.data.id,
        type: 'exercises' as const,
        title: item.data.title,
        slug: item.slug,
        contentMetaId: item.data.contentMetaId,
        programId: item.data.programId,
        programName: item.data.programName,
        subtitle: item.data.subtitle,
        pubDate: item.data.pubDate?.toISOString(),
        updatedDate: item.data.updatedDate?.toISOString(),
        description: item.data.description,
        sequence: item.data.sequence,
        milestone: item.data.milestone,
        hasForm: item.data.hasForm,
        previous: item.data.previous,
        next: item.data.next,
        language: item.data.language,
        version: item.data.version,
        archived: item.data.archived,
        fullData: item.data
      })),
      
      summaries: allSummaries.map(item => ({
        id: item.data.id,
        type: 'summaries' as const,
        title: item.data.title,
        slug: item.slug,
        contentMetaId: item.data.contentMetaId,
        programId: item.data.programId,
        programName: item.data.programName,
        milestone: item.data.milestone,
        previous: item.data.previous,
        next: item.data.next,
        language: item.data.language,
        fullData: item.data
      }))
    },
    statistics: {
      totalItems: allMilestones.length + allConcepts.length + allChallenges.length + allExercises.length + allSummaries.length,
      milestones: allMilestones.length,
      concepts: allConcepts.length,
      challenges: allChallenges.length,
      exercises: allExercises.length,
      summaries: allSummaries.length
    }
  };

  // Save to JSON file
  const outputPath = path.join(process.cwd(), 'public', 'content-data.json');
  await fs.writeFile(outputPath, JSON.stringify(contentData, null, 2));
  
  console.log('Content data exported successfully!');
  console.log(`Total items: ${contentData.statistics.totalItems}`);
  console.log(`Milestones: ${contentData.statistics.milestones}`);
  console.log(`Concepts: ${contentData.statistics.concepts}`);
  console.log(`Challenges: ${contentData.statistics.challenges}`);
  console.log(`Exercises: ${contentData.statistics.exercises}`);
  console.log(`Summaries: ${contentData.statistics.summaries}`);
  console.log(`Saved to: ${outputPath}`);

  return contentData;
}