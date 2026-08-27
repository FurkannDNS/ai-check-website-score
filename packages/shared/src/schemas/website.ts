import { z } from 'zod';
import { StaticVsRenderedComparisonSchema } from './report.js';

export const HeadingItemSchema = z.object({
  level: z.number().int().min(1).max(6),
  text: z.string(),
});

export type HeadingItem = z.infer<typeof HeadingItemSchema>;

export const LinkItemSchema = z.object({
  text: z.string(),
  href: z.string(),
  isExternal: z.boolean(),
  rel: z.string().optional(),
});

export type LinkItem = z.infer<typeof LinkItemSchema>;

export const ImageItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  hasAlt: z.boolean(),
  loading: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ImageItem = z.infer<typeof ImageItemSchema>;

export const FormItemSchema = z.object({
  action: z.string().optional(),
  method: z.string().optional(),
  inputCount: z.number().int().nonnegative(),
  buttonCount: z.number().int().nonnegative(),
});

export type FormItem = z.infer<typeof FormItemSchema>;

export const ScriptItemSchema = z.object({
  src: z.string().optional(),
  isAsync: z.boolean(),
  isDefer: z.boolean(),
  isInline: z.boolean(),
  type: z.string().optional(),
});

export type ScriptItem = z.infer<typeof ScriptItemSchema>;

export const StylesheetItemSchema = z.object({
  href: z.string().optional(),
  isInline: z.boolean(),
});

export type StylesheetItem = z.infer<typeof StylesheetItemSchema>;

export const PageContentSchema = z.object({
  text: z.string(),
  wordCount: z.number().int().nonnegative(),
  paragraphCount: z.number().int().nonnegative(),
  readingTimeMinutes: z.number().nonnegative(),
});

export type PageContent = z.infer<typeof PageContentSchema>;

export const SemanticElementsSchema = z.object({
  header: z.boolean(),
  nav: z.boolean(),
  main: z.boolean(),
  article: z.boolean(),
  section: z.boolean(),
  aside: z.boolean(),
  footer: z.boolean(),
  figure: z.boolean(),
  time: z.boolean(),
});

export type SemanticElements = z.infer<typeof SemanticElementsSchema>;

export const PageDataSchema = z.object({
  title: z.string().nullable(),
  metaDescription: z.string().nullable(),
  language: z.string().nullable(),
  canonical: z.string().nullable(),
  viewport: z.string().nullable(),
  robots: z.string().nullable(),
  headings: z.array(HeadingItemSchema),
  content: PageContentSchema,
  links: z.array(LinkItemSchema),
  images: z.array(ImageItemSchema),
  forms: z.array(FormItemSchema),
  scripts: z.array(ScriptItemSchema),
  stylesheets: z.array(StylesheetItemSchema),
  semanticElements: SemanticElementsSchema,
});

export type PageData = z.infer<typeof PageDataSchema>;

export const MetadataResultSchema = z.object({
  openGraph: z.record(z.string()),
  twitter: z.record(z.string()),
  standard: z.record(z.string()),
});

export type MetadataResult = z.infer<typeof MetadataResultSchema>;

export const StructuredDataResultSchema = z.object({
  items: z.array(z.record(z.any())),
  detectedTypes: z.array(z.string()),
  rawCount: z.number().int().nonnegative(),
  syntaxErrors: z.array(z.string()),
});

export type StructuredDataResult = z.infer<typeof StructuredDataResultSchema>;

export const RobotsTxtSignalSchema = z.object({
  exists: z.boolean(),
  disallowRules: z.array(z.string()),
  sitemaps: z.array(z.string()),
  rawPreview: z.string().optional(),
});

export type RobotsTxtSignal = z.infer<typeof RobotsTxtSignalSchema>;

export const SitemapSignalSchema = z.object({
  exists: z.boolean(),
  url: z.string().optional(),
  isXml: z.boolean(),
});

export type SitemapSignal = z.infer<typeof SitemapSignalSchema>;

export const TechnicalSignalsSchema = z.object({
  https: z.boolean(),
  status: z.number().int(),
  responseTimeMs: z.number().nonnegative(),
  contentLengthBytes: z.number().int().nonnegative(),
  contentType: z.string().nullable(),
  robotsTxt: RobotsTxtSignalSchema,
  sitemap: SitemapSignalSchema,
});

export type TechnicalSignals = z.infer<typeof TechnicalSignalsSchema>;

export const HeadingStructureSanitySchema = z.object({
  validHierarchy: z.boolean(),
  h1Count: z.number().int().nonnegative(),
  issues: z.array(z.string()),
});

export type HeadingStructureSanity = z.infer<typeof HeadingStructureSanitySchema>;

export const AiSignalsSchema = z.object({
  semanticHtml: z.object({
    score: z.number().min(0).max(100),
    hasMain: z.boolean(),
    hasNav: z.boolean(),
    hasHeader: z.boolean(),
    hasFooter: z.boolean(),
    elementCount: z.number().int().nonnegative(),
  }),
  contentAccessible: z.boolean(),
  textToCodeRatio: z.number().nonnegative(),
  altTextCoverage: z.number().min(0).max(100),
  headingStructureSanity: HeadingStructureSanitySchema,
  machineReadable: z.object({
    structuredDataPresent: z.boolean(),
    typeCount: z.number().int().nonnegative(),
    metaTagsPresent: z.boolean(),
  }),
});

export type AiSignals = z.infer<typeof AiSignalsSchema>;

export const AuditErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  phase: z.string(),
  fatal: z.boolean(),
});

export type AuditError = z.infer<typeof AuditErrorSchema>;

export const WebsiteAuditResultSchema = z.object({
  success: z.boolean(),
  url: z.string().url(),
  finalUrl: z.string().url(),
  status: z.number().int(),
  timestamp: z.string(),
  page: PageDataSchema,
  renderedPage: PageDataSchema.optional(),
  staticVsRendered: StaticVsRenderedComparisonSchema.optional(),
  metadata: MetadataResultSchema,
  structuredData: StructuredDataResultSchema,
  technical: TechnicalSignalsSchema,
  aiSignals: AiSignalsSchema,
  errors: z.array(AuditErrorSchema),
});

export type WebsiteAuditResult = z.infer<typeof WebsiteAuditResultSchema>;

export const AnalyzerOptionsSchema = z.object({
  timeoutMs: z.number().int().positive().optional().default(15000),
  maxRedirects: z.number().int().nonnegative().optional().default(5),
  maxResponseBytes: z.number().int().positive().optional().default(5242880), // 5MB
  userAgent: z.string().optional().default('AIWebsiteAuditor/2.0 (+https://github.com/ai-website-auditor)'),
  checkRobotsTxt: z.boolean().optional().default(true),
  checkSitemap: z.boolean().optional().default(true),
  allowLocal: z.boolean().optional().default(false),
  enableRenderedCrawl: z.boolean().optional().default(true),
});

export type AnalyzerOptions = z.infer<typeof AnalyzerOptionsSchema>;
