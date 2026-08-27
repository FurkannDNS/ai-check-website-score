import { RobotsTxtSignal, SitemapSignal } from '@ai-auditor/shared';
import { safeFetch } from '../fetcher/safe-fetch.js';

export interface TechnicalProbeResult {
  robotsTxt: RobotsTxtSignal;
  sitemap: SitemapSignal;
}

/**
 * Safely probes robots.txt and sitemap.xml for the given base URL.
 */
export async function probeTechnicalSignals(
  baseUrl: string,
  options: { checkRobotsTxt?: boolean; checkSitemap?: boolean } = {}
): Promise<TechnicalProbeResult> {
  const checkRobots = options.checkRobotsTxt ?? true;
  const checkSitemap = options.checkSitemap ?? true;

  let robotsTxt: RobotsTxtSignal = {
    exists: false,
    disallowRules: [],
    sitemaps: [],
  };

  let sitemap: SitemapSignal = {
    exists: false,
    isXml: false,
  };

  let origin = '';
  try {
    const parsed = new URL(baseUrl);
    origin = parsed.origin;
  } catch {
    return { robotsTxt, sitemap };
  }

  // 1. Probe robots.txt
  if (checkRobots) {
    try {
      const robotsUrl = `${origin}/robots.txt`;
      const res = await safeFetch(robotsUrl, {
        timeoutMs: 5000,
        maxResponseBytes: 512 * 1024, // 512KB max for robots.txt
      });

      if (res.status === 200 && res.text.length > 0) {
        robotsTxt.exists = true;
        robotsTxt.rawPreview = res.text.slice(0, 500);

        const lines = res.text.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (/^Disallow:\s*/i.test(trimmed)) {
            const rule = trimmed.replace(/^Disallow:\s*/i, '').trim();
            if (rule) robotsTxt.disallowRules.push(rule);
          } else if (/^Sitemap:\s*/i.test(trimmed)) {
            const smUrl = trimmed.replace(/^Sitemap:\s*/i, '').trim();
            if (smUrl) robotsTxt.sitemaps.push(smUrl);
          }
        }
      }
    } catch {
      // Non-fatal if robots.txt is missing or blocked
    }
  }

  // 2. Probe sitemap.xml (either discovered from robots.txt or default origin/sitemap.xml)
  if (checkSitemap) {
    try {
      const targetSitemapUrl =
        robotsTxt.sitemaps.length > 0 ? robotsTxt.sitemaps[0] : `${origin}/sitemap.xml`;

      const res = await safeFetch(targetSitemapUrl, {
        timeoutMs: 5000,
        maxResponseBytes: 512 * 1024,
      });

      if (res.status === 200 && res.text.length > 0) {
        const isXml =
          (res.contentType && res.contentType.includes('xml')) ||
          res.text.trim().startsWith('<?xml') ||
          res.text.includes('<urlset') ||
          res.text.includes('<sitemapindex');

        sitemap = {
          exists: true,
          url: targetSitemapUrl,
          isXml: !!isXml,
        };
      }
    } catch {
      // Non-fatal if sitemap probe fails
    }
  }

  return {
    robotsTxt,
    sitemap,
  };
}
