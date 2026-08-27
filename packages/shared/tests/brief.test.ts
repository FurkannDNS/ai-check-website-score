import { describe, it, expect } from 'vitest';
import { DEFAULT_AUDIT_BRIEF, AuditBriefSchema } from '../src/index.js';

describe('AuditBrief Schema & Default Brief', () => {
  it('should validate DEFAULT_AUDIT_BRIEF successfully', () => {
    const parseResult = AuditBriefSchema.safeParse(DEFAULT_AUDIT_BRIEF);
    expect(parseResult.success).toBe(true);
  });

  it('should have 16 comprehensive criteria summing to 100 weight', () => {
    expect(DEFAULT_AUDIT_BRIEF.criteria).toHaveLength(16);

    const totalWeight = DEFAULT_AUDIT_BRIEF.criteria.reduce((sum, c) => sum + c.weight, 0);
    expect(totalWeight).toBe(100);

    const actualIds = DEFAULT_AUDIT_BRIEF.criteria.map((c) => c.id);
    expect(actualIds).toContain('semantic-intelligence');
    expect(actualIds).toContain('content-comprehension');
    expect(actualIds).toContain('ai-answerability');
    expect(actualIds).toContain('entity-intelligence');
    expect(actualIds).toContain('structured-knowledge');
    expect(actualIds).toContain('ai-agent-readiness');
    expect(actualIds).toContain('hallucination-risk');
  });

  it('should reject a brief whose weights do not sum to 100', () => {
    const invalidBrief = {
      version: '1.0',
      name: 'Invalid Brief',
      description: 'Bad weights',
      criteria: [
        {
          id: 'test',
          name: 'Test',
          description: 'Desc',
          weight: 50,
          rules: ['Rule 1'],
        },
      ],
    };

    const parseResult = AuditBriefSchema.safeParse(invalidBrief);
    expect(parseResult.success).toBe(false);
  });
});
