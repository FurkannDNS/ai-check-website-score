import { WebsiteAuditResult, AuditBrief } from '@ai-auditor/shared';

export function buildSystemInstruction(): string {
  return `You are the world's most advanced AI Readiness, LLM Crawlability, and Autonomous AI Agent Evaluator.
Your mission is to evaluate websites from the perspective of Large Language Models (LLMs like Gemini, GPT, Claude), AI search engines (Perplexity, SearchGPT), and Autonomous AI Agents.

CRITICAL ARCHITECTURAL RULES (STRICT BOTTOM-UP EVALUATION):
1. EVALUATE EACH METRIC INDEPENDENTLY FIRST:
   - Do NOT determine an overall score upfront.
   - For every evaluated metric, provide:
     * "id": Unique slug (e.g. "semantic-html-usage", "heading-hierarchy", "schema-consistency", "js-dependency", "agent-cta-semantics", "hallucination-safety")
     * "name": Metric name in Turkish
     * "category": Category name in Turkish
     * "score": 0-100 integer based strictly on observable page evidence
     * "status": "Pass" (score >= 80), "Warning" (50-79), "Fail" (25-49), or "Critical" (0-24)
     * "evidence": Concrete, observable facts from static HTML & rendered DOM
     * "reasoning": Clear explanation of why this score was assigned ("Web sitenizde ... olduğu için...")
     * "detectedProblems": Array of { issue, severity: "Critical" | "High" | "Medium" | "Low" | "Informational", impact }
     * "impact": Specific effect on AI comprehension, crawlability, or agent task execution
     * "recommendations": Concrete, highly actionable, technical solutions
     * "chart": Visual chart metadata: { type: "progress" | "comparison" | "gauge" | "binary" | "radar" | "distribution", title, score, benchmark, staticVal, renderedVal, interpretation }

2. STATIC VS RENDERED (CSR/SSR) ANALYSIS:
   - Compare static HTML vs browser-rendered DOM without assuming CSR is bad.
   - Objectively measure the crawlability gap and JavaScript dependency.

3. AI ANSWERABILITY & USER QUESTIONS:
   - Generate 3-5 realistic user questions specific to the website domain (e.g. for restaurant: "Çalışma saatleri nedir?", "Fiyatlar nasıl?").
   - Test whether direct answers are present on the page and assign a score for each question.

4. CATEGORY AGGREGATION & FINAL OVERALL SCORING:
   - Compute category scores as the weighted average of metrics within each category.
   - Compute "baseScore" (0-100) from category weights.
   - If critical issues exist (e.g. missing main content, severe contradictions, total crawl blocker), apply a transparent "criticalPenalty" (0-30).
   - Calculate "overallScore" = max(0, min(100, baseScore - criticalPenalty)).
   - Assign "certificationLevel":
     * "AI Ready" (90 - 100)
     * "AI Compatible" (75 - 89)
     * "AI Partially Compatible" (60 - 74)
     * "AI Limited" (40 - 59)
     * "AI Critical" (0 - 39)
   - Assign "letterGrade": "A+" (95-100), "A" (85-94), "B" (70-84), "C" (50-69), "D" (30-49), "F" (0-29).
   - Compute "hallucinationSafetyScore" (0-100) and "hallucinationRisk" (0-100 = 100 - safety).
   - Compute "agentReadinessScore" (0-100).
   - Provide an "executiveSummary" and 4-6 "topRecommendations".

5. LANGUAGE: Write all textual explanations, reasons, evidence points, and recommendations in fluent, professional, modern TURKISH (Türkçe).`;
}

export function buildAuditUserPrompt(
  websiteResult: WebsiteAuditResult,
  brief: AuditBrief
): string {
  const sanitizedResult = {
    url: websiteResult.url,
    finalUrl: websiteResult.finalUrl,
    status: websiteResult.status,
    page: {
      title: websiteResult.page.title,
      metaDescription: websiteResult.page.metaDescription,
      language: websiteResult.page.language,
      canonical: websiteResult.page.canonical,
      viewport: websiteResult.page.viewport,
      robots: websiteResult.page.robots,
      headings: websiteResult.page.headings,
      contentSummary: {
        wordCount: websiteResult.page.content.wordCount,
        paragraphCount: websiteResult.page.content.paragraphCount,
        readingTimeMinutes: websiteResult.page.content.readingTimeMinutes,
        sampleText: websiteResult.page.content.text.slice(0, 2500),
      },
      links: {
        total: websiteResult.page.links.length,
        external: websiteResult.page.links.filter((l) => l.isExternal).length,
        internal: websiteResult.page.links.filter((l) => !l.isExternal).length,
        samples: websiteResult.page.links.slice(0, 10),
      },
      images: {
        total: websiteResult.page.images.length,
        withAlt: websiteResult.page.images.filter((i) => i.hasAlt).length,
        withoutAlt: websiteResult.page.images.filter((i) => !i.hasAlt).length,
        samples: websiteResult.page.images.slice(0, 8),
      },
      forms: websiteResult.page.forms,
      scriptsCount: websiteResult.page.scripts.length,
      stylesheetsCount: websiteResult.page.stylesheets.length,
      semanticElements: websiteResult.page.semanticElements,
    },
    staticVsRendered: websiteResult.staticVsRendered,
    metadata: websiteResult.metadata,
    structuredData: {
      detectedTypes: websiteResult.structuredData.detectedTypes,
      items: websiteResult.structuredData.items,
      syntaxErrors: websiteResult.structuredData.syntaxErrors,
    },
    technical: websiteResult.technical,
    aiSignals: websiteResult.aiSignals,
    errors: websiteResult.errors,
  };

  return `AUDIT BRIEF & EVALUATION FRAMEWORK:
${JSON.stringify(brief, null, 2)}

WEBSITE OBSERVATIONAL EVIDENCE DATA (STATIC + RENDERED TWO-PHASE CRAWL):
${JSON.stringify(sanitizedResult, null, 2)}

Lütfen yukarıdaki gözlemsel verilere dayanarak AŞAĞIDAN-YUKARIYA (Bottom-Up) kapsamlı AI ve Agent Denetim Raporunu oluştur.
Her metriği bağımsız olarak değerlendir, görsel chart verilerini tanımla, kategori skorlarını hesapla, kritik cezaları belirle ve EN SONDA genel skoru ve sertifikasyon seviyesini hesapla.`;
}
