/**
 * @description handles basic grammatical operations on string
 * @author amitchanchal @toxac
 * @file /lib/content/grammer
 */

/**
 * Converts a plural noun to its singular form.
 * Handles most common cases but may not work for irregular plurals.
 * @param pluralWord - The plural word to convert
 * @returns The singular form of the word
 */
export function toSingular(pluralWord: string | null) : string | null {
  if (!pluralWord) return null;

  const lowerWord = pluralWord.toLowerCase();
  
  // Irregular plurals
  const irregulars: Record<string, string> = {
    children: 'child',
    people: 'person',
    men: 'man',
    women: 'woman',
    teeth: 'tooth',
    feet: 'foot',
    mice: 'mouse',
    geese: 'goose',
    oxen: 'ox',
    lice: 'louse',
    criteria: 'criterion',
    phenomena: 'phenomenon',
    data: 'datum',
    indices: 'index',
    appendices: 'appendix',
    alumni: 'alumnus',
    syllabi: 'syllabus',
    foci: 'focus',
    fungi: 'fungus',
    nuclei: 'nucleus',
    radii: 'radius',
    stimuli: 'stimulus',
    vertebrae: 'vertebra',
    analyses: 'analysis',
    bases: 'basis',
    crises: 'crisis',
    diagnoses: 'diagnosis',
    ellipses: 'ellipsis',
    hypotheses: 'hypothesis',
    oases: 'oasis',
    parentheses: 'parenthesis',
    synopses: 'synopsis',
    theses: 'thesis',
    exercises: 'exercise',
    milestones: 'milestone',
    concepts: 'concept',
    resources: 'resource',
    challenges: 'challenge'
  };

  // Check irregular plurals first
  if (irregulars[lowerWord]) {
    // Preserve original capitalization
    if (pluralWord[0] === pluralWord[0].toUpperCase()) {
      return irregulars[lowerWord][0].toUpperCase() + irregulars[lowerWord].slice(1);
    }
    return irregulars[lowerWord];
  }

  // Rules for regular plurals
  const rules: [RegExp, string][] = [
    [/ses$/i, 's'],      // e.g., processes -> process
    [/xes$/i, 'x'],      // e.g., boxes -> box
    [/zes$/i, 'z'],      // e.g., quizzes -> quiz
    [/ches$/i, 'ch'],    // e.g., churches -> church
    [/shes$/i, 'sh'],    // e.g., dishes -> dish
    [/ies$/i, 'y'],      // e.g., puppies -> puppy
    [/oes$/i, 'o'],      // e.g., potatoes -> potato
    [/ves$/i, 'f'],      // e.g., leaves -> leaf
    [/s$/i, ''],         // default case: remove 's'
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(pluralWord)) {
      return pluralWord.replace(pattern, replacement);
    }
  }

  // Return original if no rules matched
  return pluralWord;
}


/**
 * Converts a singular noun to its plural form.
 * Handles most common cases including irregular plurals.
 * @param singularWord - The singular word to convert
 * @returns The plural form of the word
 */
export function toPlural(singularWord: string | null): string| null {
  if (!singularWord) return singularWord;

  const lowerWord = singularWord.toLowerCase();
  
  // Irregular plurals
  const irregulars: Record<string, string> = {
    child: 'children',
    person: 'people',
    man: 'men',
    woman: 'women',
    tooth: 'teeth',
    foot: 'feet',
    mouse: 'mice',
    goose: 'geese',
    ox: 'oxen',
    louse: 'lice',
    criterion: 'criteria',
    phenomenon: 'phenomena',
    datum: 'data',
    index: 'indices',
    appendix: 'appendices',
    alumnus: 'alumni',
    syllabus: 'syllabi',
    focus: 'foci',
    fungus: 'fungi',
    nucleus: 'nuclei',
    radius: 'radii',
    stimulus: 'stimuli',
    vertebra: 'vertebrae',
    analysis: 'analyses',
    basis: 'bases',
    crisis: 'crises',
    diagnosis: 'diagnoses',
    ellipsis: 'ellipses',
    hypothesis: 'hypotheses',
    oasis: 'oases',
    parenthesis: 'parentheses',
    synopsis: 'synopses',
    thesis: 'theses',
    cactus: 'cacti',
    bacterium: 'bacteria',
    curriculum: 'curricula',
    medium: 'media',
    memorandum: 'memoranda',
    stratum: 'strata',
  };

  // Check irregular singulars first
  if (irregulars[lowerWord]) {
    // Preserve original capitalization
    if (singularWord[0] === singularWord[0].toUpperCase()) {
      return irregulars[lowerWord][0].toUpperCase() + irregulars[lowerWord].slice(1);
    }
    return irregulars[lowerWord];
  }

  // Rules for regular plurals
  const rules: [RegExp, string][] = [
    [/([^aeiou])y$/i, '$1ies'],    // city -> cities
    [/(ss|sh|ch|x|z)$/i, '$1es'],  // box -> boxes, dish -> dishes
    [/([^aeiou]o)$/i, '$1es'],     // potato -> potatoes
    [/(f|fe)$/i, 'ves'],           // leaf -> leaves, wife -> wives
    [/sis$/i, 'ses'],              // analysis -> analyses
    [/([^s])$/i, '$1s'],           // default: add 's'
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(singularWord)) {
      return singularWord.replace(pattern, replacement);
    }
  }

  // Return original if no rules matched
  return singularWord;
}

