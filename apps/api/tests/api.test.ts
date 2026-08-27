import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';

describe('Hono API Endpoints', () => {
  it('GET /health should return 200 and status ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe('ok');
    expect(json.service).toBe('AI Website Audit API');
  });

  it('GET /brief should return 200 and default 16-criteria comprehensive brief', async () => {
    const res = await app.request('/brief');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.version).toBe('2.0');
    expect(json.criteria).toHaveLength(16);
  });

  it('POST /analyze with invalid JSON body should return 400', async () => {
    const res = await app.request('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'not-a-valid-url' }),
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Validation failed.');
  });

  it('POST /analyze with SSRF target (localhost/private IP) should return 403', async () => {
    const res = await app.request('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://127.0.0.1:8080/admin' }),
    });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Forbidden IP address range');
  });
});
