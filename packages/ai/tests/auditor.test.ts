import { describe, it, expect } from 'vitest';
import { buildSystemInstruction, buildAuditUserPrompt } from '../src/prompts.js';
import { DEFAULT_AUDIT_BRIEF, AuditReportSchema, WebsiteAuditResult } from '@ai-auditor/shared';

const MOCK_WEBSITE_RESULT: WebsiteAuditResult = {
  success: true,
  url: 'https://example.com',
  finalUrl: 'https://example.com',
  status: 200,
  timestamp: new Date().toISOString(),
  page: {
    title: 'Example Domain',
    metaDescription: 'This domain is for use in illustrative examples.',
    language: 'en',
    canonical: 'https://example.com',
    viewport: 'width=device-width, initial-scale=1',
    robots: null,
    headings: [{ level: 1, text: 'Example Domain' }],
    content: {
      text: 'This domain is for use in illustrative examples in documents.',
      wordCount: 10,
      paragraphCount: 1,
      readingTimeMinutes: 0.1,
    },
    links: [{ text: 'More information...', href: 'https://www.iana.org/domains/example', isExternal: true }],
    images: [],
    forms: [],
    scripts: [],
    stylesheets: [],
    semanticElements: {
      header: false,
      nav: false,
      main: false,
      article: false,
      section: false,
      aside: false,
      footer: false,
      figure: false,
      time: false,
    },
  },
  staticVsRendered: {
    staticWordCount: 10,
    renderedWordCount: 10,
    wordCountGap: 0,
    staticHeadingCount: 1,
    renderedHeadingCount: 1,
    headingCountGap: 0,
    staticLinkCount: 1,
    renderedLinkCount: 1,
    linkCountGap: 0,
    staticImageCount: 0,
    renderedImageCount: 0,
    imageCountGap: 0,
    staticSemanticScore: 0,
    renderedSemanticScore: 0,
    staticStructuredDataCount: 0,
    renderedStructuredDataCount: 0,
    jsDependencyScore: 100,
    csrDependency: false,
    ssrAvailability: true,
    hydrationDependency: false,
    dynamicContentDetected: false,
    aiCrawlabilityGap: 0,
    summary: 'Statik ve rendered DOM eşleşmektedir.',
  },
  metadata: { openGraph: {}, twitter: {}, standard: {} },
  structuredData: { items: [], detectedTypes: [], rawCount: 0, syntaxErrors: [] },
  technical: {
    https: true,
    status: 200,
    responseTimeMs: 150,
    contentLengthBytes: 1256,
    contentType: 'text/html; charset=UTF-8',
    robotsTxt: { exists: false, disallowRules: [], sitemaps: [] },
    sitemap: { exists: false, isXml: false },
  },
  aiSignals: {
    semanticHtml: { score: 0, hasMain: false, hasNav: false, hasHeader: false, hasFooter: false, elementCount: 0 },
    contentAccessible: false,
    textToCodeRatio: 0.05,
    altTextCoverage: 100,
    headingStructureSanity: { validHierarchy: true, h1Count: 1, issues: [] },
    machineReadable: { structuredDataPresent: false, typeCount: 0, metaTagsPresent: false },
  },
  errors: [],
};

describe('AI Auditor Prompts and Schema Validation', () => {
  it('should build proper system instructions and user prompt', () => {
    const sysPrompt = buildSystemInstruction();
    expect(sysPrompt).toContain('AI Readiness');
    expect(sysPrompt).toContain('STRICT BOTTOM-UP EVALUATION');

    const userPrompt = buildAuditUserPrompt(MOCK_WEBSITE_RESULT, DEFAULT_AUDIT_BRIEF);
    expect(userPrompt).toContain('AUDIT BRIEF');
    expect(userPrompt).toContain('TWO-PHASE CRAWL');
    expect(userPrompt).toContain('https://example.com');
  });

  it('should validate a structured AI audit report according to AuditReportSchema', () => {
    const sampleAiReport = {
      executiveSummary: 'Web sitesi statik olarak taranabilmekte fakat semantik etiketler ve şema verileri eksiktir.',
      baseScore: 68,
      criticalPenalty: 0,
      overallScore: 68,
      certificationLevel: 'AI Partially Compatible',
      letterGrade: 'C',
      hallucinationSafetyScore: 80,
      hallucinationRisk: 20,
      agentReadinessScore: 50,
      categoryScores: [
        {
          id: 'semantic-intelligence',
          name: 'Semantik ve Yapısal Zeka',
          score: 65,
          weight: 15,
          metricCount: 2,
        },
      ],
      metrics: [
        {
          id: 'semantic-html-usage',
          name: 'Semantik HTML Kullanımı',
          category: 'Semantik ve Yapısal Zeka',
          score: 60,
          status: 'Warning',
          evidence: ['<main> etiketi bulunamadı', 'Yalnızca div konteynerleri mevcut'],
          reasoning: 'Semantik HTML Kullanımı skoru 60/100: Web sitenizde modern HTML5 etiketleri eksiktir.',
          detectedProblems: [
            {
              issue: '<main> semantik konteyneri eksik',
              severity: 'Medium',
              impact: 'LLM crawler ana içeriği ayrıştırmakta zorlanabilir',
            },
          ],
          impact: 'İçerik filtreleme zorluğu',
          recommendations: ['Ana içeriği <main> etiketi ile çevreleyin.'],
          chart: {
            type: 'progress',
            title: 'Semantik HTML Skoru',
            score: 60,
            interpretation: 'Geliştirilmesi gereken orta düzey semantik yapı.',
          },
        },
      ],
      criticalProblems: [],
      generatedUserQuestions: [
        {
          question: 'Bu web sitesi ne sunuyor?',
          answerFound: true,
          evidence: 'Example domain for illustrative documents',
          score: 90,
        },
      ],
      topRecommendations: [
        'Schema.org JSON-LD yapılandırılmış verisini ekleyin.',
        'Ana içeriği <main> semantik etiketi içine alın.',
      ],
      aiModel: 'gemini-3.7-flash',
      evaluatedAt: new Date().toISOString(),
    };

    const parseRes = AuditReportSchema.safeParse(sampleAiReport);
    expect(parseRes.success).toBe(true);
  });
});
