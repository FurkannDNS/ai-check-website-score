import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { app } from './app.js';

config();

const port = parseInt(process.env.PORT || '3030', 10);
const host = process.env.HOST || '0.0.0.0';

console.log(`🚀 AI Website Audit API Server & Web Dashboard running on http://${host}:${port}`);
console.log(`🌐 Open in your browser: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: host,
});
