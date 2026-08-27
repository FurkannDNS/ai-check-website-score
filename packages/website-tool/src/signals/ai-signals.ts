import {
  AiSignals,
  PageContent,
  StructuredDataResult,
  MetadataResult,
  HeadingItem,
  ImageItem,
} from '@ai-auditor/shared';
import { ExtractedHtmlData } from '../extractors/html.js';

/**
 * Calculates objective, quantitative signals indicating how ready and
 * consumable a website is for AI crawlers, scrapers, and LLM agents.
 */
export function computeAiSignals(params: {
  html: string;
  htmlData: ExtractedHtmlData;
  content: PageContent;
  structuredData: StructuredDataResult;
  metadata: MetadataResult;
}): AiSignals {
  const { html, htmlData, content, structuredData, metadata } = params;

  // 1. Semantic HTML Score calculation
  const sem = htmlData.semanticElements;
  let semScore = 0;
  if (sem.main) semScore += 30;
  if (sem.header) semScore += 15;
  if (sem.nav) semScore += 15;
  if (sem.footer) semScore += 15;
  if (sem.article || sem.section) semScore += 15;
  if (sem.figure || sem.aside || sem.time) semScore += 10;
  semScore = Math.min(100, semScore);

  const semanticElementCount =
    (sem.header ? 1 : 0) +
    (sem.nav ? 1 : 0) +
    (sem.main ? 1 : 0) +
    (sem.article ? 1 : 0) +
    (sem.section ? 1 : 0) +
    (sem.aside ? 1 : 0) +
    (sem.footer ? 1 : 0) +
    (sem.figure ? 1 : 0) +
    (sem.time ? 1 : 0);

  // 2. Heading Structure Sanity check
  const issues: string[] = [];
  const h1s = htmlData.headings.filter((h: HeadingItem) => h.level === 1);
  const h1Count = h1s.length;

  if (h1Count === 0) {
    issues.push('Missing H1 heading on page');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
  }

  // Check hierarchy ordering jumps (e.g. H1 -> H3 skipping H2)
  let prevLevel = 0;
  for (const h of htmlData.headings) {
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      issues.push(`Skipped heading hierarchy from H${prevLevel} to H${h.level}`);
    }
    prevLevel = h.level;
  }

  const validHierarchy = issues.length === 0;

  // 3. Alt text coverage
  let altTextCoverage = 100;
  if (htmlData.images.length > 0) {
    const imagesWithAlt = htmlData.images.filter((img: ImageItem) => img.hasAlt).length;
    altTextCoverage = Math.round((imagesWithAlt / htmlData.images.length) * 100);
  }

  // 4. Text to code ratio
  const htmlLength = html.length;
  const textLength = content.text.length;
  const textToCodeRatio =
    htmlLength > 0 ? Math.round((textLength / htmlLength) * 10000) / 100 : 0;

  // 5. Machine readable signals
  const structuredDataPresent = structuredData.items.length > 0;
  const metaTagsPresent =
    Object.keys(metadata.openGraph).length > 0 ||
    Object.keys(metadata.twitter).length > 0 ||
    Object.keys(metadata.standard).length > 0;

  const contentAccessible = content.wordCount >= 20;

  return {
    semanticHtml: {
      score: semScore,
      hasMain: sem.main,
      hasNav: sem.nav,
      hasHeader: sem.header,
      hasFooter: sem.footer,
      elementCount: semanticElementCount,
    },
    contentAccessible,
    textToCodeRatio,
    altTextCoverage,
    headingStructureSanity: {
      validHierarchy,
      h1Count,
      issues,
    },
    machineReadable: {
      structuredDataPresent,
      typeCount: structuredData.detectedTypes.length,
      metaTagsPresent,
    },
  };
}
