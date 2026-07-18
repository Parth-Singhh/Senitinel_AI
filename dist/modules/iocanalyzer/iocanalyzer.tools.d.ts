import { ExecutionContext } from '@nitrostack/core';
/**
 * IOC Analyzer Tools
 *
 * Analyze Indicators of Compromise (IPs, domains, hashes)
 */
export declare class IocAnalyzerTools {
    analyzeIoc(input: {
        ioc: string;
        iocType?: string;
    }, context: ExecutionContext): Promise<{
        ioc: string;
        iocType: string;
        riskScore: number;
        riskLevel: string;
        indicators: string[];
        mitigation: string[];
        reputation: string;
        imageUrl: string;
        geolocation?: undefined;
        asn?: undefined;
    } | {
        ioc: string;
        iocType: string;
        riskScore: number;
        riskLevel: string;
        reputation: string;
        indicators: string[];
        mitigation: string[];
        geolocation: string;
        asn: string;
        imageUrl: string;
    } | {
        ioc: string;
        iocType: string;
        riskScore: number;
        riskLevel: string;
        reputation: string;
        indicators: string[];
        mitigation: string[];
        registrar: string;
        registrationDate: string;
        expirationDate: string;
        imageUrl: string;
    } | {
        ioc: string;
        iocType: string;
        hashType: string;
        riskScore: number;
        riskLevel: string;
        reputation: string;
        indicators: string[];
        mitigation: string[];
        fileType: string;
        fileSize: string;
        imageUrl: string;
    } | {
        ioc: string;
        riskScore: number;
        riskLevel: string;
        indicators: string[];
        mitigation: string[];
    }>;
    private analyzeIp;
    private analyzeDomain;
    private analyzeHash;
}
//# sourceMappingURL=iocanalyzer.tools.d.ts.map