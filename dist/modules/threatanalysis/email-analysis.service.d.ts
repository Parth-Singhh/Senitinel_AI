import { AuthStatus, EmailAnalysisInput, EmailAnalysisResult, EvidenceItem, SignalBreakdown, Severity } from './email-types';
export declare class EmailAnalysisService {
    scoreSenderAuth(auth?: {
        spf?: AuthStatus;
        dkim?: AuthStatus;
        dmarc?: AuthStatus;
    }): {
        score: number;
        evidence: EvidenceItem[];
    };
    scoreSenderIdentity(input: {
        fromName?: string;
        fromEmail: string;
        replyTo?: string;
        subject?: string;
        bodyText: string;
    }): {
        score: number;
        evidence: EvidenceItem[];
    };
    scoreBodyLanguage(bodyText: string): {
        score: number;
        evidence: EvidenceItem[];
    };
    scoreUrls(urls: string[], bodyText: string): {
        score: number;
        evidence: EvidenceItem[];
    };
    scoreAttachments(attachments?: Array<{
        filename: string;
        mimeType?: string;
        size?: number;
    }>): {
        score: number;
        evidence: EvidenceItem[];
    };
    scoreBrandImpersonation(input: {
        subject?: string;
        bodyText: string;
        fromEmail: string;
        fromName?: string;
    }): {
        score: number;
        evidence: EvidenceItem[];
    };
    calibrateFinalScore(parts: SignalBreakdown): number;
    buildMitigation(evidence: EvidenceItem[]): string[];
    buildIndicators(evidence: EvidenceItem[]): {
        type: string;
        description: string;
        severity: Severity;
    }[];
    analyze(input: EmailAnalysisInput): EmailAnalysisResult;
}
//# sourceMappingURL=email-analysis.service.d.ts.map