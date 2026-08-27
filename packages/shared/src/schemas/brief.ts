import { z } from 'zod';

export const BriefCriterionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  weight: z.number().min(1).max(100),
  rules: z.array(z.string().min(1)),
});

export type BriefCriterion = z.infer<typeof BriefCriterionSchema>;

export const AuditBriefSchema = z.object({
  version: z.string().default('1.0'),
  name: z.string(),
  description: z.string(),
  criteria: z.array(BriefCriterionSchema).min(1),
}).refine((data) => {
  const totalWeight = data.criteria.reduce((sum, c) => sum + c.weight, 0);
  return Math.abs(totalWeight - 100) < 0.01;
}, {
  message: 'The sum of all criterion weights in the AuditBrief must equal exactly 100',
});

export type AuditBrief = z.infer<typeof AuditBriefSchema>;
