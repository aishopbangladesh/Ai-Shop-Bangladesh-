export type Jurisdiction =
  | 'US - Delaware'
  | 'US - California'
  | 'US - New York'
  | 'UK & Commonwealth (England & Wales)'
  | 'Bangladesh (Contract Act 1872)'
  | 'European Union (GDPR Compliant)'
  | 'International Cross-Border';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PartyInfo {
  name: string;
  role: string;
  rep: string;
  address: string;
  email?: string;
}

export interface ContractSection {
  number: string;
  title: string;
  content: string;
  plainExplanation: string;
  riskLevel: RiskLevel;
  keyObligations?: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  subtitle?: string;
  docType: string;
  jurisdiction: string;
  effectiveDate: string;
  duration?: string;
  preamble: string;
  recitals: string[];
  definitions?: { term: string; definition: string }[];
  sections: ContractSection[];
  signatures: {
    partyATitle: string;
    partyAName: string;
    partyBTitle: string;
    partyBName: string;
  };
  clientExecutiveSummary: string[];
  complianceScore: number;
  language: 'en' | 'bn';
  createdAt: string;
}

export interface VideoScene {
  sceneNumber: number;
  title: string;
  bengaliTitle: string;
  durationSec: number;
  avatarScriptEn: string;
  avatarScriptBn: string;
  highlightClauseQuote: string;
  onScreenBullets: string[];
  riskBadge: string;
  iconType: 'shield' | 'scale' | 'dollar' | 'file' | 'alert' | 'check';
  visualAdvice?: string;
}

export interface VideoStoryboard {
  videoTitle: string;
  totalEstimatedDurationSec: number;
  presenterRole: string;
  scenes: VideoScene[];
}

export interface RedFlagItem {
  clauseReference: string;
  severity: RiskLevel;
  issue: string;
  potentialImpact: string;
  suggestedFix: string;
}

export interface RiskAuditResult {
  overallRiskScore: number;
  safetyVerdict: string;
  summaryAssessment: string;
  redFlags: RedFlagItem[];
  missingSafeguards: string[];
  plainLanguageSummary: string;
  preSignChecklist: string[];
}

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  jurisdictionExperience: string;
  avatarUrl: string;
  voiceGender: 'male' | 'female';
  voiceName: string;
  badge: string;
}
