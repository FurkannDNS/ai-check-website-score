import { AuditBrief, AuditBriefSchema, DEFAULT_AUDIT_BRIEF } from '@ai-auditor/shared';
import fs from 'node:fs/promises';

export class BriefManager {
  /**
   * Returns the default 8-criteria Audit Brief.
   */
  static getDefaultBrief(): AuditBrief {
    return DEFAULT_AUDIT_BRIEF;
  }

  /**
   * Validates and returns an AuditBrief from an object.
   */
  static parseBrief(data: unknown): AuditBrief {
    return AuditBriefSchema.parse(data);
  }

  /**
   * Loads and parses an AuditBrief from a JSON file.
   */
  static async loadFromFile(filePath: string): Promise<AuditBrief> {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return AuditBriefSchema.parse(parsed);
  }
}
