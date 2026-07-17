export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';
export type RecommendedAction = 'allow' | 'warn' | 'quarantine' | 'block';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type AuthStatus = 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'bestguesspass';
export interface EmailAddressInfo {
    name?: string;
    email: string;
    domain?: string;
}
export interface EmailAttachmentInfo {
    filename: string;
    mimeType?: string;
    size?: number;
}
export interface EmailAuthInfo {
    spf?: AuthStatus;
    dkim?: AuthStatus;
    dmarc?: AuthStatus;
}
export interface EmailAnalysisInput {
    subject?: string;
    from: EmailAddressInfo;
    replyTo?: string;
    bodyText: string;
    bodyHtml?: string;
    urls?: string[];
    attachments?: EmailAttachmentInfo[];
    auth?: EmailAuthInfo;
}
export interface EvidenceItem {
    category: string;
    signal: string;
    severity: Severity;
    weight: number;
    details?: string;
}
export interface SignalBreakdown {
    sender: number;
    auth: number;
    body: number;
    urls: number;
    attachments: number;
    brand: number;
    grammar: number;
}
export interface EmailAnalysisResult {
    riskScore: number;
    confidence: number;
    riskLevel: RiskLevel;
    recommendedAction: RecommendedAction;
    evidence: EvidenceItem[];
    signalBreakdown: SignalBreakdown;
    indicators: Array<{
        type: string;
        description: string;
        severity: Severity;
    }>;
    mitigation: string[];
    summary: string;
    senderDomain?: string;
    replyToDomain?: string;
    fromAddress?: string;
    urls?: string[];
    attachments?: Array<{
        filename: string;
        mimeType?: string;
        risk?: string;
    }>;
    imageUrl?: string;
}
//# sourceMappingURL=email-types.d.ts.map