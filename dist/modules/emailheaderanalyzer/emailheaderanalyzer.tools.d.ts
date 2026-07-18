import { ExecutionContext } from '@nitrostack/core';
/**
 * Email Header Analyzer Tools
 *
 * Parse and analyze raw email headers for authentication and routing
 */
export declare class EmailHeaderAnalyzerTools {
    analyzeEmailHeaders(input: {
        headers: string;
    }, context: ExecutionContext): Promise<{
        riskScore: number;
        riskLevel: string;
        indicators: string[];
        findings: string[];
        parsed: {
            from: any;
            to: any;
            subject: any;
            date: any;
            messageId: any;
            receivedChain: any;
        };
        authentication: {
            spf: string;
            dkim: string;
            dmarc: string;
        };
        imageUrl: string;
    }>;
    private parseHeaders;
    private analyzeSPF;
    private analyzeDKIM;
    private analyzeDMARC;
    private analyzeRouting;
    private detectAnomalies;
}
//# sourceMappingURL=emailheaderanalyzer.tools.d.ts.map