import { ExecutionContext } from '@nitrostack/core';
/**
 * ThreatAnalysis Prompts
 *
 * TODO: Add description
 */
export declare class ThreatAnalysisPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=threatanalysis.prompts.d.ts.map