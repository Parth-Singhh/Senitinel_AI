import { ExecutionContext } from '@nitrostack/core';
/**
 * IncidentAdvisor Prompts
 *
 * TODO: Add description
 */
export declare class IncidentAdvisorPrompts {
    helpPrompt(args: Record<string, unknown>, context: ExecutionContext): Promise<{
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[]>;
}
//# sourceMappingURL=incidentadvisor.prompts.d.ts.map