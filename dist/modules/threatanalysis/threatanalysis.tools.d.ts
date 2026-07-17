import { ExecutionContext } from '@nitrostack/core';
import { EmailAnalysisService } from './email-analysis.service';
import type { EmailAnalysisInput } from './email-types';
/**
 * ThreatAnalysis Tools
 *
 * Email, URL, and CVE analysis tools for security threat detection
 */
export declare class ThreatAnalysisTools {
    private readonly emailAnalysisService;
    constructor(emailAnalysisService: EmailAnalysisService);
    analyzeEmail(input: EmailAnalysisInput, context: ExecutionContext): Promise<import("./email-types").EmailAnalysisResult>;
    scanUrl(input: {
        url: string;
    }, context: ExecutionContext): Promise<{
        url: string;
        status: "malicious" | "suspicious" | "safe";
        threatExplanation: string;
        indicators: string[];
        riskScore: number;
        imageUrl: string;
    }>;
    lookupCve(input: {
        cveId: string;
    }, context: ExecutionContext): Promise<any>;
}
//# sourceMappingURL=threatanalysis.tools.d.ts.map