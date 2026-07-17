import { ExecutionContext } from '@nitrostack/core';
export declare class ThreatAnalysisTools {
    /**
     * Analyze email content for phishing and security threats
     */
    analyzeEmail(input: {
        content: string;
    }, context: ExecutionContext): Promise<{
        riskScore: number;
        riskLevel: string;
        indicators: {
            type: string;
            description: string;
            severity: string;
        }[];
        mitigation: string[];
        summary: string;
        imageUrl: string;
    }>;
    /**
     * Scan a URL for security threats
     */
    scanUrl(input: {
        url: string;
    }, context: ExecutionContext): Promise<{
        url: string;
        status: "safe" | "suspicious" | "malicious";
        threatExplanation: string;
        indicators: string[];
        riskScore: number;
        imageUrl: string;
    }>;
    /**
     * Look up CVE vulnerability information
     */
    lookupCve(input: {
        cveId: string;
    }, context: ExecutionContext): Promise<any>;
}
//# sourceMappingURL=threatanalysis.tools.d.ts.map