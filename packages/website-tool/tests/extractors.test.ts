import { describe, it, expect } from 'vitest';
import { extractHtmlData } from '../src/extractors/html.js';

const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Website Auditor - Home</title>
  <meta name="description" content="Next generation AI-powered website audit and readiness scoring.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://example.com/home">
  <link rel="stylesheet" href="/assets/main.css">
  <style>body { color: #333; }</style>
  <script src="/assets/app.js" defer></script>
  <script>console.log('inline');</script>
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/features">Features</a>
      <a href="https://twitter.com/example" rel="noopener noreferrer">Twitter</a>
    </nav>
  </header>
  <main>
    <h1>AI Readiness Platform</h1>
    <p>Supercharge your website for LLM crawlers and agents.</p>
    <h2>Key Capabilities</h2>
    <p>Extract deep structured knowledge.</p>
    <h3>Technical Architecture</h3>
    <img src="/images/diagram.png" alt="Architecture Diagram" width="800" height="600" loading="lazy">
    <img src="/images/decorative.png">
    
    <form action="/subscribe" method="POST">
      <input type="email" name="email" placeholder="Your email">
      <button type="submit">Subscribe</button>
    </form>
  </main>
  <footer>
    <p>© 2026 AI Auditor Inc.</p>
  </footer>
</body>
</html>
`;

describe('HTML Extractor', () => {
  it('should extract title, meta description, language, canonical, and viewport', () => {
    const data = extractHtmlData(SAMPLE_HTML, 'https://example.com');

    expect(data.title).toBe('AI Website Auditor - Home');
    expect(data.metaDescription).toBe('Next generation AI-powered website audit and readiness scoring.');
    expect(data.language).toBe('en');
    expect(data.canonical).toBe('https://example.com/home');
    expect(data.viewport).toBe('width=device-width, initial-scale=1.0');
    expect(data.robots).toBe('index, follow');
  });

  it('should extract headings hierarchy in correct document order', () => {
    const data = extractHtmlData(SAMPLE_HTML, 'https://example.com');

    expect(data.headings).toHaveLength(3);
    expect(data.headings[0]).toEqual({ level: 1, text: 'AI Readiness Platform' });
    expect(data.headings[1]).toEqual({ level: 2, text: 'Key Capabilities' });
    expect(data.headings[2]).toEqual({ level: 3, text: 'Technical Architecture' });
  });

  it('should extract internal and external links with rel attributes', () => {
    const data = extractHtmlData(SAMPLE_HTML, 'https://example.com');

    expect(data.links).toHaveLength(3);
    expect(data.links[0]).toEqual({
      text: 'Home',
      href: 'https://example.com/',
      isExternal: false,
      rel: undefined,
    });
    expect(data.links[2]).toEqual({
      text: 'Twitter',
      href: 'https://twitter.com/example',
      isExternal: true,
      rel: 'noopener noreferrer',
    });
  });

  it('should extract images with alt coverage and dimensions', () => {
    const data = extractHtmlData(SAMPLE_HTML, 'https://example.com');

    expect(data.images).toHaveLength(2);
    expect(data.images[0]).toEqual({
      src: 'https://example.com/images/diagram.png',
      alt: 'Architecture Diagram',
      hasAlt: true,
      loading: 'lazy',
      width: 800,
      height: 600,
    });
    expect(data.images[1].hasAlt).toBe(false);
  });

  it('should extract forms, scripts, stylesheets, and semantic HTML elements', () => {
    const data = extractHtmlData(SAMPLE_HTML, 'https://example.com');

    expect(data.forms).toHaveLength(1);
    expect(data.forms[0].action).toBe('/subscribe');
    expect(data.forms[0].method).toBe('POST');
    expect(data.forms[0].inputCount).toBe(1);
    expect(data.forms[0].buttonCount).toBe(1);

    expect(data.scripts).toHaveLength(2);
    expect(data.stylesheets).toHaveLength(2);

    expect(data.semanticElements).toEqual({
      header: true,
      nav: true,
      main: true,
      article: false,
      section: false,
      aside: false,
      footer: true,
      figure: false,
      time: false,
    });
  });
});
