import { ExecutionContext } from '@nitrostack/core';
/**
 * EmailHeaderAnalyzer Prompts
 *
 * TODO: Add description
 */
export declare class EmailHeaderAnalyzerPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=emailheaderanalyzer.prompts.d.ts.map