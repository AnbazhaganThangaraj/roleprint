// Plain-type copy of roleprint-backend/src/schemas/analysis.schema.ts.
// The backend file is the source of truth; keep this in step with it.

export const AREAS = [
  'skills',
  'experience',
  'responsibilities',
  'education',
  'industry',
  'atsKeywords',
] as const;

export type Area = (typeof AREAS)[number];
export type Priority = 'must' | 'nice';
export type Verdict = 'met' | 'partial' | 'missing';

export type RequirementResult = {
  id: string;
  area: Area;
  requirement: string;
  priority: Priority;
  verdict: Verdict;
  evidence: string | null;
  reason: string;
};

export type AreaScore = {
  area: Area;
  applicable: boolean;
  score: number;
  weight: number;
  summary: string;
};

export type Advice = {
  area: Area;
  suggestion: string;
};

export type JobSummary = {
  title: string;
  company: string | null;
  roleFamily: string | null;
  location: string | null;
  seniority: string | null;
};

export type MatchAnalysis = {
  version: 1;
  overallScore: number;
  job: JobSummary;
  areas: AreaScore[];
  requirements: RequirementResult[];
  strengths: string[];
  gaps: string[];
  advice: Advice[];
  generatedAt: string;
};

export type ParsedCv = {
  fileName: string;
  fileType: 'pdf' | 'docx';
  text: string;
  charCount: number;
  pageCount: number | null;
  warning: string | null;
};
