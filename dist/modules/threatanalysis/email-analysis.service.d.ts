import type { EmailAnalysisInput } from './email-types.js';
export declare class EmailAnalysisService {
    analyze(input: EmailAnalysisInput): Promise<{
        riskScore: number;
        riskLevel: string;
        confidence: number;
        indicators: {
            type: string;
            description: string;
            severity: string;
        }[];
        mitigation: string[];
        from: import("./email-types.js").EmailAddressInfo;
        subject: string | undefined;
        spf: string;
        dkim: string;
        dmarc: string;
        imageUrl: string;
    }>;
    private checkAuthentication;
    private checkDisplayNameSpoofing;
    private checkBrandImpersonation;
    private analyzeUrls;
    private analyzeAttachments;
    private detectSocialEngineering;
    private detectUrgency;
    private detectCredentialHarvesting;
}
//# sourceMappingURL=email-analysis.service.d.ts.map