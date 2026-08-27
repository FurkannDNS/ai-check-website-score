import { describe, it, expect } from 'vitest';
import { extractStructuredData } from '../src/extractors/structured.js';

const HTML_WITH_JSONLD = `
<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Acme Global",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://example.com/#website",
        "url": "https://example.com",
        "name": "Acme"
      },
      {
        "@type": "Article",
        "headline": "Modern SEO Practices",
        "author": {
          "@type": "Person",
          "name": "Jane Doe"
        }
      }
    ]
  }
  </script>
  <!-- Broken JSON block -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "unclosed": "syntax error
  }
  </script>
</head>
<body></body>
</html>
`;

describe('Structured Data Extractor (JSON-LD)', () => {
  it('should parse JSON-LD scripts and recursively discover Schema.org types', () => {
    const result = extractStructuredData(HTML_WITH_JSONLD);

    expect(result.rawCount).toBe(3);
    expect(result.items.length).toBe(2); // 2 valid parsed blocks

    // Detected types should include Organization, WebSite, Article, Person
    expect(result.detectedTypes).toContain('Organization');
    expect(result.detectedTypes).toContain('WebSite');
    expect(result.detectedTypes).toContain('Article');
    expect(result.detectedTypes).toContain('Person');
  });

  it('should capture syntax errors without crashing', () => {
    const result = extractStructuredData(HTML_WITH_JSONLD);

    expect(result.syntaxErrors.length).toBe(1);
    expect(result.syntaxErrors[0]).toContain('Failed to parse JSON-LD block #3');
  });
});
