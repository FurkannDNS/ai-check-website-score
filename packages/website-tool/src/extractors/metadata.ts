import * as cheerio from 'cheerio';
import { MetadataResult } from '@ai-auditor/shared';

/**
 * Extracts OpenGraph, Twitter Cards, and standard metadata tags from HTML.
 */
export function extractMetadata(html: string): MetadataResult {
  const $ = cheerio.load(html);
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  const standard: Record<string, string> = {};

  $('meta').each((_, el) => {
    const property = $(el).attr('property')?.trim() || $(el).attr('name')?.trim();
    const content = $(el).attr('content')?.trim();

    if (!property || content === undefined) return;

    const lowerProp = property.toLowerCase();

    if (lowerProp.startsWith('og:')) {
      openGraph[property] = content;
    } else if (lowerProp.startsWith('twitter:')) {
      twitter[property] = content;
    } else {
      const standardKeys = [
        'description',
        'author',
        'keywords',
        'generator',
        'theme-color',
        'application-name',
        'robots',
        'publisher',
      ];
      if (standardKeys.includes(lowerProp)) {
        standard[lowerProp] = content;
      }
    }
  });

  return {
    openGraph,
    twitter,
    standard,
  };
}
