import { describe, it, expect } from 'vitest';
import { extractPageContent } from '../src/extractors/content.js';

const HTML_WITH_BOILERPLATE = `
<!DOCTYPE html>
<html>
<body>
  <header>
    <nav>
      <ul><li><a href="/">Nav Item 1</a></li><li><a href="/">Nav Item 2</a></li></ul>
    </nav>
  </header>
  <div class="cookie-banner">
    <p>We use cookies to improve your browsing experience. Accept all.</p>
    <button>Accept</button>
  </div>
  <aside>
    <h3>Related links</h3>
    <p>Sidebar content that should be excluded from main text.</p>
  </aside>
  <main>
    <h1>Comprehensive Guide to Artificial Intelligence</h1>
    <p>Artificial intelligence is transforming modern software engineering and technical search discovery.</p>
    <p>Large language models require clean, structured, and accessible content representations to effectively understand and index web pages.</p>
  </main>
  <footer>
    <p>© 2026 Example Corp. All rights reserved.</p>
  </footer>
</body>
</html>
`;

describe('Content Extractor', () => {
  it('should strip boilerplate headers, navs, footers, asides, and cookie banners', () => {
    const result = extractPageContent(HTML_WITH_BOILERPLATE);

    expect(result.text).toContain('Artificial intelligence is transforming');
    expect(result.text).toContain('Large language models require');

    // Should NOT contain boilerplate
    expect(result.text).not.toContain('Nav Item 1');
    expect(result.text).not.toContain('We use cookies');
    expect(result.text).not.toContain('Sidebar content');
    expect(result.text).not.toContain('All rights reserved');
  });

  it('should accurately compute word count and paragraph count', () => {
    const result = extractPageContent(HTML_WITH_BOILERPLATE);

    expect(result.paragraphCount).toBe(2);
    expect(result.wordCount).toBeGreaterThan(20);
    expect(result.readingTimeMinutes).toBeGreaterThanOrEqual(0.1);
  });
});
