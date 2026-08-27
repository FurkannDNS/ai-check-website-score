import * as cheerio from 'cheerio';
import { StructuredDataResult } from '@ai-auditor/shared';

/**
 * Extracts and parses JSON-LD (<script type="application/ld+json">) blocks,
 * recursively discovers Schema.org types, and captures any syntax errors.
 */
export function extractStructuredData(html: string): StructuredDataResult {
  const $ = cheerio.load(html);
  const items: Record<string, any>[] = [];
  const detectedTypesSet = new Set<string>();
  const syntaxErrors: string[] = [];
  let rawCount = 0;

  $('script[type="application/ld+json"]').each((_, el) => {
    rawCount++;
    const rawContent = $(el).text().trim();
    if (!rawContent) return;

    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'object' && item !== null) {
            items.push(item);
            collectSchemaTypes(item, detectedTypesSet);
          }
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        items.push(parsed);
        collectSchemaTypes(parsed, detectedTypesSet);
      }
    } catch (err) {
      syntaxErrors.push(`Failed to parse JSON-LD block #${rawCount}: ${(err as Error).message}`);
    }
  });

  return {
    items,
    detectedTypes: Array.from(detectedTypesSet).sort(),
    rawCount,
    syntaxErrors,
  };
}

/**
 * Recursively traverses JSON-LD object graphs to collect all '@type' definitions.
 */
function collectSchemaTypes(obj: any, typeSet: Set<string>): void {
  if (!obj || typeof obj !== 'object') return;

  if (obj['@type']) {
    const typeVal = obj['@type'];
    if (typeof typeVal === 'string') {
      typeSet.add(normalizeSchemaType(typeVal));
    } else if (Array.isArray(typeVal)) {
      for (const t of typeVal) {
        if (typeof t === 'string') {
          typeSet.add(normalizeSchemaType(t));
        }
      }
    }
  }

  // Handle @graph array
  if (Array.isArray(obj['@graph'])) {
    for (const subItem of obj['@graph']) {
      collectSchemaTypes(subItem, typeSet);
    }
  }

  // Traverse nested properties
  for (const key of Object.keys(obj)) {
    if (key !== '@graph' && typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          collectSchemaTypes(item, typeSet);
        }
      } else {
        collectSchemaTypes(obj[key], typeSet);
      }
    }
  }
}

function normalizeSchemaType(typeStr: string): string {
  // Strip schema.org URL prefixes if present (e.g., "https://schema.org/Organization" -> "Organization")
  return typeStr.replace(/^https?:\/\/schema\.org\//i, '').trim();
}
