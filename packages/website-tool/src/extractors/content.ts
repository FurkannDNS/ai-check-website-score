import * as cheerio from 'cheerio';
import { PageContent } from '@ai-auditor/shared';

/**
 * Extracts clean main text content by removing boilerplate elements
 * (headers, footers, navs, aside, cookie consent modals, scripts, styles).
 */
export function extractPageContent(html: string): PageContent {
  const $ = cheerio.load(html);

  // Remove elements that are never main content
  $(
    'script, style, noscript, svg, iframe, canvas, ' +
    'header, nav, footer, aside, ' +
    'form, button, ' +
    '.cookie, .cookie-banner, #cookie-banner, .cookie-consent, #cookie-notice, ' +
    '[aria-modal="true"], [role="dialog"], [role="banner"], [role="navigation"], [role="contentinfo"], ' +
    '.ad, .ads, .advertisement, [id*="google_ads"]'
  ).remove();

  // If a <main> or <article> tag is present, prioritize text within it
  let contentContainer = $('main');
  if (contentContainer.length === 0 || contentContainer.text().trim().length < 50) {
    contentContainer = $('article');
  }
  if (contentContainer.length === 0 || contentContainer.text().trim().length < 50) {
    contentContainer = $('body');
  }

  // Count paragraphs before stripping tags
  let paragraphCount = 0;
  contentContainer.find('p').each((_, el) => {
    if ($(el).text().trim().length > 10) {
      paragraphCount++;
    }
  });

  // Extract text and normalize whitespace
  const rawText = contentContainer.text();
  const cleanedText = rawText
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();

  // Calculate word count
  const words = cleanedText.length > 0
    ? cleanedText.split(/\s+/).filter((w) => w.length > 0)
    : [];
  const wordCount = words.length;

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.round((wordCount / 200) * 10) / 10;

  return {
    text: cleanedText,
    wordCount,
    paragraphCount,
    readingTimeMinutes,
  };
}
