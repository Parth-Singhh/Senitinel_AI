import { ExecutionContext } from '@nitrostack/core';
/**
 * DomainIntelligence Prompts
 *
 * TODO: Add description
 */
export declare class DomainIntelligencePrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=domainintelligence.prompts.d.ts.map