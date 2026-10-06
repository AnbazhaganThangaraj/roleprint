// Phase 1 scorer: simple keyword matching against a known skills list.
// The score is the share of skills mentioned in the JD that also appear in the CV.
// This will be replaced by an AI-based scorer in a later phase (see README).

const SKILLS = [
  'javascript', 'typescript', 'react', 'next.js', 'node.js', 'express', 'angular', 'vue',
  'html', 'css', 'tailwind', 'redux', 'graphql', 'rest', 'python', 'django', 'flask',
  'fastapi', 'java', 'spring', 'kotlin', 'go', 'rust', 'c#', '.net', 'php', 'laravel',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'prisma', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'terraform', 'ci/cd', 'git', 'linux', 'microservices',
  'machine learning', 'data analysis', 'excel', 'power bi', 'tableau', 'figma',
  'agile', 'scrum', 'jira', 'testing', 'jest', 'cypress', 'communication', 'leadership',
];

export type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
};

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILLS.filter((skill) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(skill)}($|[^a-z0-9])`);
    return pattern.test(lower);
  });
}

export function scoreMatch(cvText: string, jdText: string): MatchResult {
  const jdSkills = findSkills(jdText);
  const cvSkills = new Set(findSkills(cvText));

  const matchedSkills = jdSkills.filter((skill) => cvSkills.has(skill));
  const missingSkills = jdSkills.filter((skill) => !cvSkills.has(skill));

  const score = jdSkills.length === 0 ? 0 : Math.round((matchedSkills.length / jdSkills.length) * 100);

  return { score, matchedSkills, missingSkills };
}
