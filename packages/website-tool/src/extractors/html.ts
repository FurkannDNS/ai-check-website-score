import * as cheerio from 'cheerio';
import {
  HeadingItem,
  LinkItem,
  ImageItem,
  FormItem,
  ScriptItem,
  StylesheetItem,
  SemanticElements,
} from '@ai-auditor/shared';

export interface ExtractedHtmlData {
  title: string | null;
  metaDescription: string | null;
  language: string | null;
  canonical: string | null;
  viewport: string | null;
  robots: string | null;
  headings: HeadingItem[];
  links: LinkItem[];
  images: ImageItem[];
  forms: FormItem[];
  scripts: ScriptItem[];
  stylesheets: StylesheetItem[];
  semanticElements: SemanticElements;
}

/**
 * Extracts structural and semantic DOM elements from HTML.
 */
export function extractHtmlData(html: string, baseUrl: string): ExtractedHtmlData {
  const $ = cheerio.load(html);

  // 1. Title
  const titleText = $('title').first().text().trim();
  const title = titleText.length > 0 ? titleText : null;

  // 2. Meta description
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    null;

  // 3. Language
  const language =
    $('html').attr('lang')?.trim() ||
    $('meta[http-equiv="content-language"]').attr('content')?.trim() ||
    null;

  // 4. Canonical
  const canonicalHref = $('link[rel="canonical"]').attr('href')?.trim();
  let canonical: string | null = null;
  if (canonicalHref) {
    try {
      canonical = new URL(canonicalHref, baseUrl).href;
    } catch {
      canonical = canonicalHref;
    }
  }

  // 5. Viewport & Robots meta
  const viewport = $('meta[name="viewport"]').attr('content')?.trim() || null;
  const robots = $('meta[name="robots"]').attr('content')?.trim() || null;

  // 6. Headings in document order
  const headings: HeadingItem[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const tagName = el.tagName.toLowerCase();
    const level = parseInt(tagName.replace('h', ''), 10);
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 0) {
      headings.push({ level, text });
    }
  });

  // 7. Links
  const links: LinkItem[] = [];
  let baseHostname = '';
  try {
    baseHostname = new URL(baseUrl).hostname;
  } catch {}

  $('a[href]').each((_, el) => {
    const hrefAttr = $(el).attr('href')?.trim();
    if (!hrefAttr || hrefAttr.startsWith('javascript:') || hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) {
      return;
    }

    let absoluteHref = hrefAttr;
    let isExternal = false;
    try {
      const parsed = new URL(hrefAttr, baseUrl);
      absoluteHref = parsed.href;
      isExternal = parsed.hostname !== baseHostname;
    } catch {
      isExternal = false;
    }

    const text = $(el).text().replace(/\s+/g, ' ').trim();
    const rel = $(el).attr('rel')?.trim() || undefined;

    links.push({
      text,
      href: absoluteHref,
      isExternal,
      rel,
    });
  });

  // 8. Images
  const images: ImageItem[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src')?.trim() || $(el).attr('data-src')?.trim() || '';
    if (!src) return;

    let absoluteSrc = src;
    try {
      absoluteSrc = new URL(src, baseUrl).href;
    } catch {}

    const alt = $(el).attr('alt')?.trim() ?? '';
    const loading = $(el).attr('loading')?.trim() || undefined;
    const widthStr = $(el).attr('width')?.trim();
    const heightStr = $(el).attr('height')?.trim();

    const width = widthStr && !isNaN(Number(widthStr)) ? parseInt(widthStr, 10) : undefined;
    const height = heightStr && !isNaN(Number(heightStr)) ? parseInt(heightStr, 10) : undefined;

    images.push({
      src: absoluteSrc,
      alt,
      hasAlt: $(el).attr('alt') !== undefined && alt.length > 0,
      loading,
      width,
      height,
    });
  });

  // 9. Forms
  const forms: FormItem[] = [];
  $('form').each((_, el) => {
    const action = $(el).attr('action')?.trim() || undefined;
    const method = $(el).attr('method')?.toUpperCase().trim() || undefined;
    const inputCount = $(el).find('input, textarea, select').length;
    const buttonCount = $(el).find('button, input[type="submit"]').length;

    forms.push({
      action,
      method,
      inputCount,
      buttonCount,
    });
  });

  // 10. Scripts
  const scripts: ScriptItem[] = [];
  $('script').each((_, el) => {
    const src = $(el).attr('src')?.trim();
    const type = $(el).attr('type')?.trim();
    const isAsync = $(el).attr('async') !== undefined;
    const isDefer = $(el).attr('defer') !== undefined;
    const isInline = !src;

    // Ignore json-ld scripts here (they are handled in structured data)
    if (type === 'application/ld+json') return;

    scripts.push({
      src: src ? (tryMakeAbsolute(src, baseUrl) ?? src) : undefined,
      isAsync,
      isDefer,
      isInline,
      type: type || undefined,
    });
  });

  // 11. Stylesheets
  const stylesheets: StylesheetItem[] = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    stylesheets.push({
      href: href ? (tryMakeAbsolute(href, baseUrl) ?? href) : undefined,
      isInline: false,
    });
  });
  $('style').each(() => {
    stylesheets.push({
      isInline: true,
    });
  });

  // 12. Semantic HTML elements
  const semanticElements: SemanticElements = {
    header: $('header').length > 0,
    nav: $('nav').length > 0,
    main: $('main').length > 0,
    article: $('article').length > 0,
    section: $('section').length > 0,
    aside: $('aside').length > 0,
    footer: $('footer').length > 0,
    figure: $('figure').length > 0,
    time: $('time').length > 0,
  };

  return {
    title,
    metaDescription,
    language,
    canonical,
    viewport,
    robots,
    headings,
    links,
    images,
    forms,
    scripts,
    stylesheets,
    semanticElements,
  };
}

function tryMakeAbsolute(urlStr: string, baseUrl: string): string | null {
  try {
    return new URL(urlStr, baseUrl).href;
  } catch {
    return null;
  }
}
