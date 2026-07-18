import { ExecutionContext } from '@nitrostack/core';
/**
 * Incident Advisor Tools
 *
 * Guided security incident triage and playbook suggestions
 */
export declare class IncidentAdvisorTools {
    getIncidentGuidance(input: {
        incidentType: string;
        severity?: string;
        affectedSystems?: string[];
    }, context: ExecutionContext): Promise<{
        incidentType: string;
        severity: string;
        affectedSystems: string[];
        playbook: any;
        immediateActions: any;
        investigationSteps: any;
        containmentSteps: any;
        recoverySteps: any;
        communicationTemplate: any;
        resources: any;
        imageUrl: string;
    }>;
    private getPlaybook;
}
//# sourceMappingURL=incidentadvisor.tools.d.ts.map