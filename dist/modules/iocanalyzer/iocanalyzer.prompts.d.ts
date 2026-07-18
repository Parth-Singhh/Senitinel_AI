import { ExecutionContext } from '@nitrostack/core';
/**
 * IocAnalyzer Prompts
 *
 * TODO: Add description
 */
export declare class IocAnalyzerPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=iocanalyzer.prompts.d.ts.map