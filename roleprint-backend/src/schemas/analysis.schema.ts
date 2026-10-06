// The contract for an explainable CV vs JD analysis.
// The LLM fills in requirements, strengths, gaps and advice; the scorer computes every number.
// The client keeps a plain-type copy of this file in roleprint-client/src/types/analysis.ts.
import { z } from 'zod';

export const AREAS = [
  'skills',
  'experience',
  'responsibilities',
  'education',
  'industry',
  'atsKeywords',
] as const;

export const AreaSchema = z.enum(AREAS);
export type Area = z.infer<typeof AreaSchema>;

// Share of the overall score each area carries. An area the JD says nothing about is dropped
// and the remaining weights are rescaled so they still add up to 1.
export const AREA_WEIGHTS: Record<Area, number> = {
  skills: 0.35,
  experience: 0.2,
  responsibilities: 0.15,
  education: 0.1,
  industry: 0.1,
  atsKeywords: 0.1,
};

export const PrioritySchema = z.enum(['must', 'nice']);
export type Priority = z.infer<typeof PrioritySchema>;

export const VerdictSchema = z.enum(['met', 'partial', 'missing']);
export type Verdict = z.infer<typeof VerdictSchema>;

// One requirement from the JD and how the CV measures up against it.
export const RequirementResultSchema = z.object({
  id: z.string().min(1),
  area: AreaSchema,
  requirement: z.string().min(1),
  priority: PrioritySchema,
  verdict: VerdictSchema,
  // A verbatim quote from the CV that supports the verdict; null when the requirement is missing.
  evidence: z.string().nullable(),
  reason: z.string().min(1),
});
export type RequirementResult = z.infer<typeof RequirementResultSchema>;

export const AreaScoreSchema = z.object({
  area: AreaSchema,
  // false when the JD has no requirements in this area; score and weight are then 0
  applicable: z.boolean(),
  score: z.number().int().min(0).max(100),
  weight: z.number().min(0).max(1),
  summary: z.string(),
});
export type AreaScore = z.infer<typeof AreaScoreSchema>;

export const AdviceSchema = z.object({
  area: AreaSchema,
  suggestion: z.string().min(1),
});
export type Advice = z.infer<typeof AdviceSchema>;

export const JobSummarySchema = z.object({
  title: z.string(),
  company: z.string().nullable(),
  roleFamily: z.string().nullable(),
  location: z.string().nullable(),
  seniority: z.string().nullable(),
});
export type JobSummary = z.infer<typeof JobSummarySchema>;

export const MatchAnalysisSchema = z.object({
  version: z.literal(1),
  overallScore: z.number().int().min(0).max(100),
  job: JobSummarySchema,
  areas: z.array(AreaScoreSchema).length(AREAS.length),
  requirements: z.array(RequirementResultSchema),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  advice: z.array(AdviceSchema),
  generatedAt: z.iso.datetime(),
});
export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>;

// Response of POST /api/cv/parse
export const ParsedCvSchema = z.object({
  fileName: z.string(),
  fileType: z.enum(['pdf', 'docx']),
  text: z.string(),
  charCount: z.number().int(),
  pageCount: z.number().int().nullable(),
  warning: z.string().nullable(),
});
export type ParsedCv = z.infer<typeof ParsedCvSchema>;
