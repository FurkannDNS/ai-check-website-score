import { z } from 'zod';
import { WebsiteAuditResultSchema, AnalyzerOptionsSchema } from './website.js';
import { AuditBriefSchema } from './brief.js';
import { AuditReportSchema } from './report.js';

export const AnalyzeRequestSchema = z.object({
  url: z.string().url('A valid HTTP or HTTPS URL is required'),
  brief: AuditBriefSchema.optional(),
  ai: z.boolean().optional().default(false),
  options: AnalyzerOptionsSchema.optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const AnalyzeResponseSchema = z.object({
  success: z.boolean(),
  website: WebsiteAuditResultSchema,
  audit: AuditReportSchema.optional(),
  error: z.string().optional(),
});

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
