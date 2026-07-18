import { ExecutionContext } from '@nitrostack/core';
/**
 * Password Analyzer Tools
 *
 * Analyze password strength, entropy, and breach history
 */
export declare class PasswordAnalyzerTools {
    analyzePassword(input: {
        password: string;
        checkBreach?: boolean;
    }, context: ExecutionContext): Promise<{
        password: string;
        riskScore: number;
        riskLevel: string;
        strength: string;
        length: number;
        entropy: string;
        charTypes: number;
        hasLower: boolean;
        hasUpper: boolean;
        hasDigits: boolean;
        hasSpecial: boolean;
        breachStatus: string;
        indicators: string[];
        recommendations: string[];
        imageUrl: string;
    }>;
    private calculateEntropy;
}
//# sourceMappingURL=passwordanalyzer.tools.d.ts.map