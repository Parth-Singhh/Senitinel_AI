import { ExecutionContext } from '@nitrostack/core';
export declare class IncidentOpsTools {
    /**
     * Generate an executive security incident report combining multiple threat analyses
     */
    generateReport(input: {
        emailAnalysis?: any;
        urlScan?: any;
        cveData?: any;
        incidentTitle?: string;
    }, context: ExecutionContext): Promise<{
        reportId: string;
        title: string;
        severity: "low" | "medium" | "high" | "critical";
        timestamp: string;
        executive_summary: string;
        threat_analysis: any;
        recommended_actions: string[];
        timeline: {
            time: string;
            event: string;
        }[];
        imageUrl: string;
    }>;
}
//# sourceMappingURL=incidentops.tools.d.ts.map