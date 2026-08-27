import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHtmlData } from '../src/extractors/html.js';
import { extractPageContent } from '../src/extractors/content.js';
import { extractStructuredData } from '../src/extractors/structured.js';
import { extractMetadata } from '../src/extractors/metadata.js';
import { computeAiSignals } from '../src/signals/ai-signals.js';
import { WebsiteAuditResultSchema } from '@ai-auditor/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Integration Tests with HTML Fixtures', () => {
  it('should process e-commerce fixture and detect Product schema', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'ecommerce.html');
    const html = await fs.readFile(filePath, 'utf-8');
    const url = 'https://soundtech.example.com/products/ultranoise-pro';

    const htmlData = extractHtmlData(html, url);
    const content = extractPageContent(html);
    const structuredData = extractStructuredData(html);
    const metadata = extractMetadata(html);
    const aiSignals = computeAiSignals({ html, htmlData, content, structuredData, metadata });

    expect(htmlData.title).toBe('UltraNoise Pro Wireless Headphones - SoundTech');
    expect(structuredData.detectedTypes).toContain('Product');
    expect(structuredData.detectedTypes).toContain('Offer');
    expect(structuredData.detectedTypes).toContain('Brand');
    expect(aiSignals.semanticHtml.hasMain).toBe(true);
    expect(aiSignals.semanticHtml.hasHeader).toBe(true);
    expect(aiSignals.semanticHtml.hasFooter).toBe(true);
    expect(aiSignals.altTextCoverage).toBe(100);

    const fullResult = {
      success: true,
      url,
      finalUrl: url,
      status: 200,
      timestamp: new Date().toISOString(),
      page: {
        title: htmlData.title,
        metaDescription: htmlData.metaDescription,
        language: htmlData.language,
        canonical: htmlData.canonical,
        viewport: htmlData.viewport,
        robots: htmlData.robots,
        headings: htmlData.headings,
        content,
        links: htmlData.links,
        images: htmlData.images,
        forms: htmlData.forms,
        scripts: htmlData.scripts,
        stylesheets: htmlData.stylesheets,
        semanticElements: htmlData.semanticElements,
      },
      metadata,
      structuredData,
      technical: {
        https: true,
        status: 200,
        responseTimeMs: 120,
        contentLengthBytes: html.length,
        contentType: 'text/html; charset=utf-8',
        robotsTxt: { exists: false, disallowRules: [], sitemaps: [] },
        sitemap: { exists: false, isXml: false },
      },
      aiSignals,
      errors: [],
    };

    // Strict validation against Zod schema
    const parseRes = WebsiteAuditResultSchema.safeParse(fullResult);
    expect(parseRes.success).toBe(true);
  });

  it('should process Turkish blog article fixture and detect Article schema', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'blog.html');
    const html = await fs.readFile(filePath, 'utf-8');
    const url = 'https://blog.example.com/yapay-zeka-ve-web';

    const htmlData = extractHtmlData(html, url);
    const content = extractPageContent(html);
    const structuredData = extractStructuredData(html);
    const metadata = extractMetadata(html);
    const aiSignals = computeAiSignals({ html, htmlData, content, structuredData, metadata });

    expect(htmlData.language).toBe('tr');
    expect(structuredData.detectedTypes).toContain('Article');
    expect(structuredData.detectedTypes).toContain('Organization');
    expect(structuredData.detectedTypes).toContain('Person');
    expect(content.wordCount).toBeGreaterThan(30);
    expect(aiSignals.machineReadable.structuredDataPresent).toBe(true);
  });

  it('should process minimal fixture and catch missing elements cleanly', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'minimal.html');
    const html = await fs.readFile(filePath, 'utf-8');
    const url = 'https://minimal.example.com';

    const htmlData = extractHtmlData(html, url);
    const content = extractPageContent(html);
    const structuredData = extractStructuredData(html);
    const metadata = extractMetadata(html);
    const aiSignals = computeAiSignals({ html, htmlData, content, structuredData, metadata });

    expect(htmlData.title).toBe('Minimal Page');
    expect(htmlData.metaDescription).toBeNull();
    expect(htmlData.language).toBeNull();
    expect(structuredData.detectedTypes).toHaveLength(0);
    expect(aiSignals.semanticHtml.score).toBe(0);
    expect(aiSignals.headingStructureSanity.h1Count).toBe(0);
    expect(aiSignals.headingStructureSanity.validHierarchy).toBe(false);
  });
});
