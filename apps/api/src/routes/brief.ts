import { Hono } from 'hono';
import { BriefManager } from '@ai-auditor/audit';

export const briefRouter = new Hono();

briefRouter.get('/', (c) => {
  const brief = BriefManager.getDefaultBrief();
  return c.json(brief);
});
