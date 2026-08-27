import { chromium, Browser } from 'playwright';

export interface RenderedCrawlResult {
  success: boolean;
  html: string;
  finalUrl: string;
  status: number;
  renderTimeMs: number;
  jsErrors: string[];
  consoleLogs: string[];
  error?: string;
}

export class BrowserCrawler {
  private static browserInstance: Browser | null = null;

  private static async getBrowser(): Promise<Browser> {
    if (!this.browserInstance) {
      this.browserInstance = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      });
    }
    return this.browserInstance;
  }

  public static async crawl(
    url: string,
    options: { timeoutMs?: number; userAgent?: string } = {}
  ): Promise<RenderedCrawlResult> {
    const timeoutMs = options.timeoutMs || 15000;
    const userAgent = options.userAgent || 'AIWebsiteAuditor/2.0 (+https://github.com/ai-website-auditor)';
    const startTime = Date.now();
    const jsErrors: string[] = [];
    const consoleLogs: string[] = [];

    let browser: Browser | null = null;
    let context = null;
    let page = null;

    try {
      browser = await this.getBrowser();
      context = await browser.newContext({
        userAgent,
        viewport: { width: 1280, height: 800 },
        ignoreHTTPSErrors: true,
      });

      page = await context.newPage();

      page.on('pageerror', (err) => {
        jsErrors.push(err.message || String(err));
      });

      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
        }
      });

      const response = await page.goto(url, {
        timeout: timeoutMs,
        waitUntil: 'domcontentloaded',
      });

      // Wait a brief moment for dynamic hydration / client-side rendering
      try {
        await page.waitForLoadState('networkidle', { timeout: 3000 });
      } catch {
        // networkidle timeout is okay, page has already loaded domcontentloaded
      }

      // Small tick for microtask DOM mutations
      await page.waitForTimeout(500);

      const html = await page.content();
      const finalUrl = page.url() || url;
      const status = response ? response.status() : 200;
      const renderTimeMs = Date.now() - startTime;

      return {
        success: true,
        html,
        finalUrl,
        status,
        renderTimeMs,
        jsErrors,
        consoleLogs,
      };
    } catch (err: any) {
      return {
        success: false,
        html: '',
        finalUrl: url,
        status: 0,
        renderTimeMs: Date.now() - startTime,
        jsErrors,
        consoleLogs,
        error: err.message || 'Browser rendering failed',
      };
    } finally {
      if (page) await page.close().catch(() => {});
      if (context) await context.close().catch(() => {});
    }
  }

  public static async closeBrowser(): Promise<void> {
    if (this.browserInstance) {
      await this.browserInstance.close().catch(() => {});
      this.browserInstance = null;
    }
  }
}
