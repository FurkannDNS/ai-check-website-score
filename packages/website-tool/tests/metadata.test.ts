import { describe, it, expect } from 'vitest';
import { extractMetadata } from '../src/extractors/metadata.js';

const HTML_WITH_METADATA = `
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="AI Readiness Auditor">
  <meta property="og:description" content="Audit your website for AI compatibility.">
  <meta property="og:image" content="https://example.com/og.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com">
  <meta property="og:site_name" content="AI Auditor">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="AI Readiness Auditor">
  <meta name="twitter:description" content="Audit your website for AI compatibility.">
  <meta name="twitter:image" content="https://example.com/twitter.png">

  <meta name="author" content="Antigravity Team">
  <meta name="keywords" content="AI, SEO, Audit, LLM, Web">
  <meta name="theme-color" content="#4F46E5">
</head>
<body></body>
</html>
`;

describe('Metadata & Social Graph Extractor', () => {
  it('should extract OpenGraph tags', () => {
    const result = extractMetadata(HTML_WITH_METADATA);

    expect(result.openGraph['og:title']).toBe('AI Readiness Auditor');
    expect(result.openGraph['og:description']).toBe('Audit your website for AI compatibility.');
    expect(result.openGraph['og:image']).toBe('https://example.com/og.png');
    expect(result.openGraph['og:type']).toBe('website');
    expect(result.openGraph['og:site_name']).toBe('AI Auditor');
  });

  it('should extract Twitter Cards', () => {
    const result = extractMetadata(HTML_WITH_METADATA);

    expect(result.twitter['twitter:card']).toBe('summary_large_image');
    expect(result.twitter['twitter:title']).toBe('AI Readiness Auditor');
    expect(result.twitter['twitter:image']).toBe('https://example.com/twitter.png');
  });

  it('should extract standard meta tags', () => {
    const result = extractMetadata(HTML_WITH_METADATA);

    expect(result.standard['author']).toBe('Antigravity Team');
    expect(result.standard['keywords']).toBe('AI, SEO, Audit, LLM, Web');
    expect(result.standard['theme-color']).toBe('#4F46E5');
  });
});
