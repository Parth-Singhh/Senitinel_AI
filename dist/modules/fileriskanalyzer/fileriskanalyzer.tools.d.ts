import { ExecutionContext } from '@nitrostack/core';
/**
 * File Risk Analyzer Tools
 *
 * Analyze file hashes, types, and predict malware behavior
 */
export declare class FileRiskAnalyzerTools {
    analyzeFileRisk(input: {
        filename: string;
        hash?: string;
        fileSize?: number;
        fileType?: string;
    }, context: ExecutionContext): Promise<{
        filename: string;
        riskScore: number;
        riskLevel: string;
        indicators: string[];
        recommendations: string[];
        fileInfo: {
            hash: string | undefined;
            fileSize: number | undefined;
            fileType: string;
        };
        imageUrl: string;
    }>;
    private analyzeFileType;
    private analyzeFileSize;
    private analyzeHashReputation;
    private predictBehavior;
    private detectFileType;
}
//# sourceMappingURL=fileriskanalyzer.tools.d.ts.map