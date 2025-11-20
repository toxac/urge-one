import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

type ContentType = 'milestones' | 'concepts' | 'challenges' | 'exercises' | 'summaries';

interface ContentNode {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  contentMetaId: string;
  sequence?: number;
  next?: {
    type: string;
    id: string;
  };
  previous?: {
    type: string;
    id: string;
  };
  data: any;
}

interface Sequence {
  id: string;
  name: string;
  nodes: ContentNode[];
  startNode: ContentNode;
  endNode: ContentNode;
  length: number;
}

export async function generateSequences() {
  // Get all collections (excluding resources)
  const allMilestones = await getCollection('milestones');
  const allConcepts = await getCollection('concepts');
  const allChallenges = await getCollection('challenges');
  const allExercises = await getCollection('exercises');
  const allSummaries = await getCollection('summaries');

  // Combine all content into a single array with type information
  const allContent: ContentNode[] = [
    ...allMilestones.map(item => ({ ...item, type: 'milestones' as ContentType })),
    ...allConcepts.map(item => ({ ...item, type: 'concepts' as ContentType })),
    ...allChallenges.map(item => ({ ...item, type: 'challenges' as ContentType })),
    ...allExercises.map(item => ({ ...item, type: 'exercises' as ContentType })),
    ...allSummaries.map(item => ({ ...item, type: 'summaries' as ContentType })),
  ].map(item => ({
    id: item.data.id,
    type: item.type,
    title: item.data.title,
    slug: item.slug,
    contentMetaId: item.data.contentMetaId,
    sequence: item.data.sequence,
    next: item.data.next,
    previous: item.data.previous,
    data: item.data
  }));

  // Create a map for quick lookup
  const contentMap = new Map<string, ContentNode>();
  allContent.forEach(item => {
    const key = `${item.type}:${item.id}`;
    contentMap.set(key, item);
  });

  // Find the starting milestone
  const startMilestoneId = "milestone-1-begin-your-thrilling-new-adventure";
  const startNode = allContent.find(item => 
    item.type === 'milestones' && item.id === startMilestoneId
  );

  if (!startNode) {
    throw new Error(`Starting milestone not found: ${startMilestoneId}`);
  }

  console.log(`Starting sequence from: ${startNode.title} (${startNode.type}:${startNode.id})`);

  const sequences: Sequence[] = [];
  const visited = new Set<string>();

  // Build sequence from the starting milestone
  const buildSequenceFromStart = (startNode: ContentNode): Sequence => {
    const sequenceNodes: ContentNode[] = [startNode];
    visited.add(`${startNode.type}:${startNode.id}`);
    
    let currentNode = startNode;

    // Follow next pointers to build the sequence
    while (currentNode.next) {
      const nextKey = `${currentNode.next.type}:${currentNode.next.id}`;
      
      // Check for cycles
      if (visited.has(nextKey)) {
        console.warn(`Cycle detected at ${nextKey} from ${currentNode.type}:${currentNode.id}`);
        break;
      }

      const nextNode = contentMap.get(nextKey);
      
      if (!nextNode) {
        console.warn(`Next node not found: ${nextKey}`);
        break;
      }

      // Verify the chain is consistent (next's previous should point to current)
      if (nextNode.previous && 
          (nextNode.previous.type !== currentNode.type || nextNode.previous.id !== currentNode.id)) {
        console.warn(`Inconsistent chain: ${nextKey} previous points to ${nextNode.previous.type}:${nextNode.previous.id} but current is ${currentNode.type}:${currentNode.id}`);
      }

      sequenceNodes.push(nextNode);
      visited.add(nextKey);
      currentNode = nextNode;
    }

    return {
      id: `main-sequence`,
      name: `Main Learning Sequence - ${startNode.title}`,
      nodes: sequenceNodes,
      startNode: startNode,
      endNode: sequenceNodes[sequenceNodes.length - 1],
      length: sequenceNodes.length
    };
  };

  // Build the main sequence
  const mainSequence = buildSequenceFromStart(startNode);
  sequences.push(mainSequence);

  // Find any orphaned sequences (content that wasn't included in the main sequence but has relationships)
  const orphanedStarts = allContent.filter(item => 
    !visited.has(`${item.type}:${item.id}`) && 
    !item.previous // No previous means it could be a start of another sequence
  );

  // Build sequences from orphaned starting points
  orphanedStarts.forEach((startNode, index) => {
    if (!visited.has(`${startNode.type}:${startNode.id}`)) {
      const orphanSequence = buildSequenceFromStart(startNode);
      sequences.push({
        ...orphanSequence,
        id: `orphaned-sequence-${index + 1}`,
        name: `Orphaned Sequence ${index + 1} - ${startNode.title}`
      });
    }
  });

  // Sort sequences by the sequence number of their first node if available
  sequences.sort((a, b) => {
    const aSeq = a.startNode.sequence || 0;
    const bSeq = b.startNode.sequence || 0;
    return aSeq - bSeq;
  });

  const result = {
    generatedAt: new Date().toISOString(),
    totalSequences: sequences.length,
    totalNodes: sequences.reduce((sum, seq) => sum + seq.nodes.length, 0),
    sequences: sequences.map(seq => ({
      ...seq,
      nodes: seq.nodes.map(node => ({
        id: node.id,
        type: node.type,
        title: node.title,
        slug: node.slug,
        contentMetaId: node.contentMetaId,
        sequence: node.sequence,
        next: node.next,
        previous: node.previous,
        programId: node.data.programId,
        programName: node.data.programName,
        language: node.data.language
      }))
    }))
  };

  // Save to JSON file
  const outputPath = path.join(process.cwd(), 'public', 'content-sequences.json');
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
  
  console.log(`Generated ${sequences.length} sequences with ${result.totalNodes} total nodes`);
  console.log(`Main sequence has ${mainSequence.length} nodes`);
  console.log(`Saved to: ${outputPath}`);

  return result;
}