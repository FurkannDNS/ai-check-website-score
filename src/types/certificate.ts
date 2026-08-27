export type CertificateTier = "VERIFIED" | "GOLD_AI" | "ENTERPRISE";

export type AuditStatus = "PASSED" | "EXCELLENT" | "IN_PROGRESS" | "FAILED";

export interface AuditMetric {
  id: string;
  label: string;
  score: number; // 0 - 100
  status: AuditStatus;
  description: string;
  iconName: string;
}

export interface CertificateRecord {
  id: string; // e.g. "ARB-2025-8842"
  businessName: string;
  domain: string;
  issueDate: string;
  expiryDate: string;
  overallScore: number; // e.g. 98
  tier: CertificateTier;
  stars: number; // 1-5
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  verifiedBy: string; // "METAFONICS Yapay Zeka Teknolojileri"
  metrics: AuditMetric[];
  badgeUrl: string;
  qrCodeUrl?: string;
  featuresEnabled: string[];
}

export interface VerificationSearchQuery {
  query: string; // domain or certificate ID
}
