import { ExecutionContext } from '@nitrostack/core';
/**
 * PasswordAnalyzer Prompts
 *
 * TODO: Add description
 */
export declare class PasswordAnalyzerPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=passwordanalyzer.prompts.d.ts.map