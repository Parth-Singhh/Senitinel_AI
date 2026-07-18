import { ExecutionContext } from '@nitrostack/core';
import { EmailAnalysisService } from './email-analysis.service.js';
import type { EmailAnalysisInput } from './email-types.js';
/**
 * ThreatAnalysis Tools
 *
 * Email, URL, and CVE analysis tools for security threat detection
 */
export declare class ThreatAnalysisTools {
    private readonly emailAnalysisService;
    constructor(emailAnalysisService: EmailAnalysisService);
    analyzeEmail(input: EmailAnalysisInput, context: ExecutionContext): Promise<{
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
    scanUrl(input: {
        url: string;
    }, context: ExecutionContext): Promise<{
        url: string;
        status: "safe" | "suspicious" | "malicious";
        threatExplanation: string;
        indicators: string[];
        riskScore: number;
        reputationScore: number;
        subdomainDepth: number;
        hasHttps: boolean;
        imageUrl: string;
    }>;
    lookupCve(input: {
        cveId: string;
    }, context: ExecutionContext): Promise<any>;
}
//# sourceMappingURL=threatanalysis.tools.d.ts.map