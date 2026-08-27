import { guardUrl } from '../ssrf/guard.js';

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  maxResponseBytes?: number;
  userAgent?: string;
  headers?: Record<string, string>;
  allowLocal?: boolean;
}

export interface SafeFetchResponse {
  status: number;
  statusText: string;
  headers: Headers;
  text: string;
  finalUrl: string;
  responseTimeMs: number;
  contentLengthBytes: number;
  contentType: string | null;
}

export class SafeFetchError extends Error {
  constructor(message: string, public readonly code: string, public readonly status?: number) {
    super(message);
    this.name = 'SafeFetchError';
  }
}

/**
 * Fetches a URL with SSRF protection, strict redirect validation,
 * response size capping, and timeout protection.
 */
export async function safeFetch(
  initialUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResponse> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const maxRedirects = options.maxRedirects ?? 5;
  const maxResponseBytes = options.maxResponseBytes ?? 5 * 1024 * 1024; // 5MB
  const userAgent =
    options.userAgent ?? 'AIWebsiteAuditor/1.0 (+https://github.com/ai-website-auditor)';
  const allowLocal = options.allowLocal ?? process.env.ALLOW_LOCAL === 'true';

  let currentUrl = initialUrl;
  let redirectCount = 0;
  const startTime = Date.now();

  while (redirectCount <= maxRedirects) {
    // 1. SSRF check before every request (including redirects)
    const securityCheck = await guardUrl(currentUrl, { allowLocal });
    if (!securityCheck.isSafe) {
      throw new SafeFetchError(
        `SSRF Security Block on ${currentUrl}: ${securityCheck.reason}`,
        'SSRF_BLOCKED'
      );
    }

    // 2. Setup timeout controller
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
          ...options.headers,
        },
        redirect: 'manual', // Manual redirect control for SSRF safety
        signal: controller.signal,
      });

      // 3. Handle redirects manually
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new SafeFetchError(
            `Redirect status ${response.status} returned without Location header`,
            'INVALID_REDIRECT'
          );
        }

        redirectCount++;
        if (redirectCount > maxRedirects) {
          throw new SafeFetchError(
            `Exceeded maximum redirect limit of ${maxRedirects}`,
            'TOO_MANY_REDIRECTS'
          );
        }

        // Resolve target URL relative to current
        currentUrl = new URL(location, currentUrl).href;
        continue;
      }

      // 4. Stream response body with size limit guard
      const contentType = response.headers.get('content-type');
      const contentLengthHeader = response.headers.get('content-length');

      if (contentLengthHeader) {
        const declaredLength = parseInt(contentLengthHeader, 10);
        if (declaredLength > maxResponseBytes) {
          throw new SafeFetchError(
            `Content-Length (${declaredLength} bytes) exceeds limit of ${maxResponseBytes} bytes`,
            'PAYLOAD_TOO_LARGE'
          );
        }
      }

      if (!response.body) {
        const responseTimeMs = Date.now() - startTime;
        return {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          text: '',
          finalUrl: currentUrl,
          responseTimeMs,
          contentLengthBytes: 0,
          contentType,
        };
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          totalBytes += value.length;
          if (totalBytes > maxResponseBytes) {
            reader.cancel();
            throw new SafeFetchError(
              `Response exceeded maximum size limit of ${maxResponseBytes} bytes`,
              'PAYLOAD_TOO_LARGE'
            );
          }
          chunks.push(value);
        }
      }

      // Combine chunks into string using TextDecoder
      const combinedBuffer = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      const text = new TextDecoder('utf-8').decode(combinedBuffer);
      const responseTimeMs = Date.now() - startTime;

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        text,
        finalUrl: currentUrl,
        responseTimeMs,
        contentLengthBytes: totalBytes,
        contentType,
      };
    } catch (err: any) {
      if (err instanceof SafeFetchError) {
        throw err;
      }
      if (err.name === 'AbortError') {
        throw new SafeFetchError(
          `Request timeout after ${timeoutMs}ms`,
          'REQUEST_TIMEOUT'
        );
      }
      throw new SafeFetchError(
        `Network fetch failure on ${currentUrl}: ${err.message}`,
        'FETCH_FAILED'
      );
    } finally {
      clearTimeout(timer);
    }
  }

  throw new SafeFetchError(
    `Exceeded maximum redirect limit of ${maxRedirects}`,
    'TOO_MANY_REDIRECTS'
  );
}
