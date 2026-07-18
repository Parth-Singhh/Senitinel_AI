import { ExecutionContext } from '@nitrostack/core';
/**
 * Domain Intelligence Tools
 *
 * Analyze domain WHOIS, DNS, SSL certificates, and reputation
 */
export declare class DomainIntelligenceTools {
    analyzeDomain(input: {
        domain: string;
    }, context: ExecutionContext): Promise<{
        domain: string;
        riskScore: number;
        riskLevel: string;
        indicators: string[];
        findings: string[];
        whois: Record<string, any>;
        dns: Record<string, any>;
        ssl: Record<string, any>;
        imageUrl: string;
    }>;
    private analyzeWhois;
    private analyzeDns;
    private analyzeSsl;
    private analyzeDomainAge;
    private analyzeReputation;
}
//# sourceMappingURL=domainintelligence.tools.d.ts.map