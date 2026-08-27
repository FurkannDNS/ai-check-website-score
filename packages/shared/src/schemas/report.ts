import { z } from 'zod';

export const ProblemSeverityEnum = z.enum([
  'Critical',
  'High',
  'Medium',
  'Low',
  'Informational',
]);
export type ProblemSeverity = z.infer<typeof ProblemSeverityEnum>;

export const DetectedProblemSchema = z.object({
  issue: z.string(),
  severity: ProblemSeverityEnum,
  impact: z.string().optional(),
});
export type DetectedProblem = z.infer<typeof DetectedProblemSchema>;

export const ChartTypeEnum = z.enum([
  'progress',
  'comparison',
  'radar',
  'gauge',
  'binary',
  'distribution',
]);
export type ChartType = z.infer<typeof ChartTypeEnum>;

export const ChartDataSchema = z.object({
  type: ChartTypeEnum,
  title: z.string(),
  score: z.number().min(0).max(100),
  benchmark: z.number().optional(),
  staticVal: z.number().optional(),
  renderedVal: z.number().optional(),
  labels: z.array(z.string()).optional(),
  values: z.array(z.number()).optional(),
  interpretation: z.string(),
});
export type ChartData = z.infer<typeof ChartDataSchema>;

export const MetricEvaluationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  score: z.number().min(0).max(100),
  status: z.enum(['Pass', 'Warning', 'Fail', 'Critical']),
  evidence: z.array(z.string()).default([]),
  reasoning: z.string(),
  detectedProblems: z.array(DetectedProblemSchema).default([]),
  impact: z.string().default(''),
  recommendations: z.array(z.string()).default([]),
  chart: ChartDataSchema.optional(),
});
export type MetricEvaluation = z.infer<typeof MetricEvaluationSchema>;

export const CategoryScoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100),
  weight: z.number(),
  metricCount: z.number().default(1),
});
export type CategoryScore = z.infer<typeof CategoryScoreSchema>;

export const GeneratedUserQuestionSchema = z.object({
  question: z.string(),
  answerFound: z.boolean(),
  evidence: z.string().optional(),
  score: z.number().min(0).max(100),
});
export type GeneratedUserQuestion = z.infer<typeof GeneratedUserQuestionSchema>;

export const CertificationLevelEnum = z.enum([
  'AI Ready',
  'AI Compatible',
  'AI Partially Compatible',
  'AI Limited',
  'AI Critical',
]);
export type CertificationLevel = z.infer<typeof CertificationLevelEnum>;

export const StaticVsRenderedComparisonSchema = z.object({
  staticWordCount: z.number(),
  renderedWordCount: z.number(),
  wordCountGap: z.number(),
  staticHeadingCount: z.number(),
  renderedHeadingCount: z.number(),
  headingCountGap: z.number(),
  staticLinkCount: z.number(),
  renderedLinkCount: z.number(),
  linkCountGap: z.number(),
  staticImageCount: z.number(),
  renderedImageCount: z.number(),
  imageCountGap: z.number(),
  staticSemanticScore: z.number(),
  renderedSemanticScore: z.number(),
  staticStructuredDataCount: z.number(),
  renderedStructuredDataCount: z.number(),
  jsDependencyScore: z.number().min(0).max(100),
  csrDependency: z.boolean(),
  ssrAvailability: z.boolean(),
  hydrationDependency: z.boolean(),
  dynamicContentDetected: z.boolean(),
  aiCrawlabilityGap: z.number(),
  summary: z.string(),
});
export type StaticVsRenderedComparison = z.infer<typeof StaticVsRenderedComparisonSchema>;

export const AuditReportSchema = z.object({
  executiveSummary: z.string().min(1),
  baseScore: z.number().min(0).max(100),
  criticalPenalty: z.number().min(0).max(100).default(0),
  overallScore: z.number().min(0).max(100),
  certificationLevel: CertificationLevelEnum,
  letterGrade: z.enum(['A+', 'A', 'B', 'C', 'D', 'F']),
  hallucinationSafetyScore: z.number().min(0).max(100),
  hallucinationRisk: z.number().min(0).max(100),
  agentReadinessScore: z.number().min(0).max(100),
  categoryScores: z.array(CategoryScoreSchema),
  metrics: z.array(MetricEvaluationSchema),
  comparison: StaticVsRenderedComparisonSchema.optional(),
  criticalProblems: z.array(DetectedProblemSchema).default([]),
  generatedUserQuestions: z.array(GeneratedUserQuestionSchema).default([]),
  topRecommendations: z.array(z.string()).min(1),
  aiModel: z.string(),
  evaluatedAt: z.string(),
  // Backward compatibility fields
  summary: z.string().optional(),
  criteria: z.array(MetricEvaluationSchema).optional(),
});

export type AuditReport = z.infer<typeof AuditReportSchema>;
