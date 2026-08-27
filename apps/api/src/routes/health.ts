import { Hono } from 'hono';

export const healthRouter = new Hono();

const startTime = Date.now();

healthRouter.get('/', (c) => {
  return c.json({
    status: 'ok',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    service: 'AI Website Audit API',
    version: '1.0.0',
  });
});
