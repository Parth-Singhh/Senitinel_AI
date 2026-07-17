import { ExecutionContext } from '@nitrostack/core';
/**
 * ThreatAnalysis Prompts
 *
 * Prompt helpers for phishing, URL, and vulnerability analysis guidance.
 */
export declare class ThreatAnalysisPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<({
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    } | {
        role: "assistant";
        content: {
            type: "text";
            text: string;
        };
    })[]>;
}
//# sourceMappingURL=threatanalysis.prompts.d.ts.map