import { ExecutionContext } from '@nitrostack/core';
/**
 * IncidentOps Prompts
 *
 * TODO: Add description
 */
export declare class IncidentOpsPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=incidentops.prompts.d.ts.map