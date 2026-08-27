import { Hono } from 'hono';
import { AnalyzeRequestSchema } from '@ai-auditor/shared';
import { AuditEngine } from '@ai-auditor/audit';

export const analyzeRouter = new Hono();

analyzeRouter.post('/', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        success: false,
        error: 'Invalid JSON request body.',
      },
      400
    );
  }

  const parseResult = AnalyzeRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: 'Validation failed.',
        details: parseResult.error.format(),
      },
      400
    );
  }

  const { url, brief, ai, options } = parseResult.data;

  try {
    const result = await AuditEngine.run({
      url,
      brief,
      enableAi: ai,
      analyzerOptions: options,
    });

    if (!result.website.success) {
      const isSsrf = result.website.errors.some((e) => e.code === 'SSRF_BLOCKED');
      const statusCode = isSsrf ? 403 : 502;

      return c.json(
        {
          success: false,
          website: result.website,
          error: result.website.errors.map((e) => e.message).join('; '),
        },
        statusCode
      );
    }

    return c.json({
      success: true,
      website: result.website,
      audit: result.audit,
    });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: `Internal audit execution error: ${err.message}`,
      },
      500
    );
  }
});
