import {
  WebsiteAuditResult,
  AnalyzerOptions,
  AnalyzerOptionsSchema,
  AuditError,
  PageData,
} from '@ai-auditor/shared';
import { safeFetch } from './fetcher/safe-fetch.js';
import { extractHtmlData } from './extractors/html.js';
import { extractPageContent } from './extractors/content.js';
import { extractStructuredData } from './extractors/structured.js';
import { extractMetadata } from './extractors/metadata.js';
import { probeTechnicalSignals } from './extractors/technical.js';
import { computeAiSignals } from './signals/ai-signals.js';
import { BrowserCrawler } from './crawler/browser-crawler.js';
import { DOMComparator } from './crawler/dom-comparator.js';

export interface AnalyzeWebsiteInput {
  url: string;
  options?: Partial<AnalyzerOptions>;
}

/**
 * Pure evidence collector / observer pipeline for website auditing.
 * Executes a Two-Phase (Static HTTP + Headless Browser Rendered) Crawl,
 * compares DOM deltas, and extracts strictly objective evidence without subjective bias.
 */
export async function analyzeWebsite(input: AnalyzeWebsiteInput): Promise<WebsiteAuditResult> {
  const options = AnalyzerOptionsSchema.parse(input.options || {});
  const errors: AuditError[] = [];
  const timestamp = new Date().toISOString();

  let targetUrl = input.url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  // 1. Static HTTP Crawl (with SSRF protection)
  let fetchRes;
  try {
    fetchRes = await safeFetch(targetUrl, {
      timeoutMs: options.timeoutMs,
      maxRedirects: options.maxRedirects,
      maxResponseBytes: options.maxResponseBytes,
      userAgent: options.userAgent,
      allowLocal: options.allowLocal,
    });
  } catch (err: any) {
    const isSsrf = err.code === 'SSRF_BLOCKED';
    errors.push({
      code: err.code || 'FETCH_ERROR',
      message: err.message,
      phase: isSsrf ? 'ssrf_guard' : 'http_fetch',
      fatal: true,
    });

    return {
      success: false,
      url: targetUrl,
      finalUrl: targetUrl,
      status: err.status || (isSsrf ? 403 : 502),
      timestamp,
      page: {
        title: null,
        metaDescription: null,
        language: null,
        canonical: null,
        viewport: null,
        robots: null,
        headings: [],
        content: { text: '', wordCount: 0, paragraphCount: 0, readingTimeMinutes: 0 },
        links: [],
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
      metadata: { openGraph: {}, twitter: {}, standard: {} },
      structuredData: { items: [], detectedTypes: [], rawCount: 0, syntaxErrors: [] },
      technical: {
        https: targetUrl.startsWith('https://'),
        status: err.status || (isSsrf ? 403 : 502),
        responseTimeMs: 0,
        contentLengthBytes: 0,
        contentType: null,
        robotsTxt: { exists: false, disallowRules: [], sitemaps: [] },
        sitemap: { exists: false, isXml: false },
      },
      aiSignals: {
        semanticHtml: { score: 0, hasMain: false, hasNav: false, hasHeader: false, hasFooter: false, elementCount: 0 },
        contentAccessible: false,
        textToCodeRatio: 0,
        altTextCoverage: 0,
        headingStructureSanity: { validHierarchy: false, h1Count: 0, issues: ['Fetch failed'] },
        machineReadable: { structuredDataPresent: false, typeCount: 0, metaTagsPresent: false },
      },
      errors,
    };
  }

  // 2. Extract Static DOM & Page data
  const staticHtml = fetchRes.text;
  const finalUrl = fetchRes.finalUrl;
  const staticHtmlData = extractHtmlData(staticHtml, finalUrl);
  const staticContent = extractPageContent(staticHtml);
  const staticStructuredData = extractStructuredData(staticHtml);
  const staticMetadata = extractMetadata(staticHtml);

  for (const err of staticStructuredData.syntaxErrors) {
    errors.push({
      code: 'JSONLD_SYNTAX_ERROR',
      message: err,
      phase: 'structured_data_extraction',
      fatal: false,
    });
  }

  const staticSignals = computeAiSignals({
    html: staticHtml,
    htmlData: staticHtmlData,
    content: staticContent,
    structuredData: staticStructuredData,
    metadata: staticMetadata,
  });

  const staticPage: PageData = {
    title: staticHtmlData.title,
    metaDescription: staticHtmlData.metaDescription,
    language: staticHtmlData.language,
    canonical: staticHtmlData.canonical,
    viewport: staticHtmlData.viewport,
    robots: staticHtmlData.robots,
    headings: staticHtmlData.headings,
    content: staticContent,
    links: staticHtmlData.links,
    images: staticHtmlData.images,
    forms: staticHtmlData.forms,
    scripts: staticHtmlData.scripts,
    stylesheets: staticHtmlData.stylesheets,
    semanticElements: staticHtmlData.semanticElements,
  };

  // 3. Rendered Browser Crawl (Playwright Chromium)
  let renderedHtml = staticHtml;
  let renderedPage = staticPage;
  let renderedStructuredData = staticStructuredData;
  let renderedSignals = staticSignals;

  if (options.enableRenderedCrawl !== false) {
    try {
      const browserRes = await BrowserCrawler.crawl(finalUrl, {
        timeoutMs: options.timeoutMs,
        userAgent: options.userAgent,
      });

      if (browserRes.success && browserRes.html) {
        renderedHtml = browserRes.html;
        const rHtmlData = extractHtmlData(renderedHtml, browserRes.finalUrl || finalUrl);
        const rContent = extractPageContent(renderedHtml);
        renderedStructuredData = extractStructuredData(renderedHtml);
        const rMetadata = extractMetadata(renderedHtml);

        renderedSignals = computeAiSignals({
          html: renderedHtml,
          htmlData: rHtmlData,
          content: rContent,
          structuredData: renderedStructuredData,
          metadata: rMetadata,
        });

        renderedPage = {
          title: rHtmlData.title || staticHtmlData.title,
          metaDescription: rHtmlData.metaDescription || staticHtmlData.metaDescription,
          language: rHtmlData.language || staticHtmlData.language,
          canonical: rHtmlData.canonical || staticHtmlData.canonical,
          viewport: rHtmlData.viewport || staticHtmlData.viewport,
          robots: rHtmlData.robots || staticHtmlData.robots,
          headings: rHtmlData.headings.length > 0 ? rHtmlData.headings : staticHtmlData.headings,
          content: rContent.wordCount >= staticContent.wordCount ? rContent : staticContent,
          links: rHtmlData.links.length > 0 ? rHtmlData.links : staticHtmlData.links,
          images: rHtmlData.images.length > 0 ? rHtmlData.images : staticHtmlData.images,
          forms: rHtmlData.forms.length > 0 ? rHtmlData.forms : staticHtmlData.forms,
          scripts: rHtmlData.scripts,
          stylesheets: rHtmlData.stylesheets,
          semanticElements: rHtmlData.semanticElements,
        };

        if (browserRes.jsErrors.length > 0) {
          for (const jsErr of browserRes.jsErrors.slice(0, 5)) {
            errors.push({
              code: 'CLIENT_JS_ERROR',
              message: jsErr,
              phase: 'rendered_browser_crawl',
              fatal: false,
            });
          }
        }
      }
    } catch (err: any) {
      // Non-fatal, fallback to static extraction
      errors.push({
        code: 'RENDER_CRAWL_FAILED',
        message: err.message || 'Headless browser crawl failed, using static HTML fallback',
        phase: 'rendered_browser_crawl',
        fatal: false,
      });
    }
  }

  // 4. Compare Static vs Rendered DOM
  const staticVsRendered = DOMComparator.compare(
    staticPage,
    renderedPage,
    staticStructuredData,
    renderedStructuredData,
    staticSignals,
    renderedSignals
  );

  // 5. Probe Technical Discoverability (Robots.txt & Sitemap)
  const technicalProbes = await probeTechnicalSignals(finalUrl, {
    checkRobotsTxt: options.checkRobotsTxt,
    checkSitemap: options.checkSitemap,
  });

  const technical = {
    https: finalUrl.startsWith('https://'),
    status: fetchRes.status,
    responseTimeMs: fetchRes.responseTimeMs,
    contentLengthBytes: fetchRes.contentLengthBytes,
    contentType: fetchRes.contentType,
    robotsTxt: technicalProbes.robotsTxt,
    sitemap: technicalProbes.sitemap,
  };

  // Primary page uses the richer representation (rendered if available)
  const primaryPage = renderedPage.content.wordCount >= staticPage.content.wordCount ? renderedPage : staticPage;
  const primaryStructuredData = renderedStructuredData.items.length >= staticStructuredData.items.length ? renderedStructuredData : staticStructuredData;
  const primarySignals = renderedSignals.semanticHtml.score >= staticSignals.semanticHtml.score ? renderedSignals : staticSignals;

  return {
    success: true,
    url: targetUrl,
    finalUrl,
    status: fetchRes.status,
    timestamp,
    page: primaryPage,
    renderedPage,
    staticVsRendered,
    metadata: staticMetadata,
    structuredData: primaryStructuredData,
    technical,
    aiSignals: primarySignals,
    errors,
  };
}
