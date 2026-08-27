import {
  WebsiteAuditResult,
  AuditBrief,
  AuditReport,
  AnalyzerOptions,
} from '@ai-auditor/shared';
import { analyzeWebsite } from '@ai-auditor/website-tool';
import { evaluateWebsiteWithGemini } from '@ai-auditor/ai';
import { BriefManager } from './brief-manager.js';

export interface AuditRunOptions {
  url: string;
  brief?: AuditBrief;
  enableAi?: boolean;
  apiKey?: string;
  model?: string;
  analyzerOptions?: Partial<AnalyzerOptions>;
}

export interface AuditRunResult {
  website: WebsiteAuditResult;
  audit?: AuditReport;
}

export class AuditEngine {
  /**
   * Orchestrates the complete website audit process:
   * 1. Extracts structured observational evidence from URL
   * 2. (Optional) Evaluates evidence with Gemini AI according to the Audit Brief
   */
  static async run(options: AuditRunOptions): Promise<AuditRunResult> {
    const { url, enableAi = false, apiKey, model, analyzerOptions } = options;
    const brief = options.brief || BriefManager.getDefaultBrief();

    // 1. Run Website Observational Analysis (Tool)
    const websiteResult = await analyzeWebsite({
      url,
      options: analyzerOptions,
    });

    // 2. If AI evaluation is requested and data extraction succeeded, run Gemini
    let auditReport: AuditReport | undefined;
    if (enableAi && websiteResult.success) {
      auditReport = await evaluateWebsiteWithGemini(websiteResult, brief, {
        apiKey,
        model,
      });
    }

    return {
      website: websiteResult,
      audit: auditReport,
    };
  }
}
