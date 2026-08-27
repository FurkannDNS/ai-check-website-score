import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRouter } from './routes/health.js';
import { briefRouter } from './routes/brief.js';
import { analyzeRouter } from './routes/analyze.js';
import { globalErrorHandler } from './middleware/error-handler.js';
import { renderDashboardHtml } from './ui.js';

export function createApp(): Hono {
  const app = new Hono();

  // Middleware
  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Routes
  app.route('/health', healthRouter);
  app.route('/brief', briefRouter);
  app.route('/analyze', analyzeRouter);

  // Root: Serves Interactive Web Dashboard UI or JSON
  app.get('/', (c) => {
    const accept = c.req.header('accept') || '';
    if (accept.includes('application/json') && !accept.includes('text/html')) {
      return c.json({
        name: 'AI Website Audit API',
        version: '1.0.0',
        endpoints: {
          'GET /health': 'Service health status',
          'GET /brief': 'Default AI Audit Brief',
          'POST /analyze': 'Analyze website and generate structured audit report',
        },
      });
    }

    return c.html(renderDashboardHtml());
  });

  // Error handling
  app.onError(globalErrorHandler);

  return app;
}

export const app = createApp();
