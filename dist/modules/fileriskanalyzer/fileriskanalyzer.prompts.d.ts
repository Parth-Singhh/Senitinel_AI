import { ExecutionContext } from '@nitrostack/core';
/**
 * FileRiskAnalyzer Prompts
 *
 * TODO: Add description
 */
export declare class FileRiskAnalyzerPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=fileriskanalyzer.prompts.d.ts.map