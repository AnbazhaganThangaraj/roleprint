import { describe, expect, it } from 'vitest';
import { AREAS, AREA_WEIGHTS, MatchAnalysisSchema } from '../src/schemas/analysis.schema.js';

describe('MatchAnalysis contract', () => {
  it('area weights cover every area and add up to 1', () => {
    expect(Object.keys(AREA_WEIGHTS).sort()).toEqual([...AREAS].sort());
    const total = Object.values(AREA_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it('accepts a well-formed analysis and rejects an out-of-range score', () => {
    const analysis = {
      version: 1,
      overallScore: 72,
      job: { title: 'Frontend Engineer', company: null, roleFamily: 'Frontend', location: 'Remote', seniority: 'Senior' },
      areas: AREAS.map((area) => ({ area, applicable: true, score: 70, weight: AREA_WEIGHTS[area], summary: 'ok' })),
      requirements: [
        {
          id: 'r1',
          area: 'skills',
          requirement: 'React',
          priority: 'must',
          verdict: 'met',
          evidence: 'Skills: React, TypeScript',
          reason: 'Listed in skills and used in two roles',
        },
      ],
      strengths: ['Strong React experience'],
      gaps: ['No Kubernetes'],
      advice: [{ area: 'skills', suggestion: 'Move React projects to the top of the CV' }],
      generatedAt: new Date().toISOString(),
    };
    expect(MatchAnalysisSchema.safeParse(analysis).success).toBe(true);
    expect(MatchAnalysisSchema.safeParse({ ...analysis, overallScore: 140 }).success).toBe(false);
  });
});
