var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResourceDecorator as Resource } from '@nitrostack/core';
/**
 * ThreatAnalysis Resources
 *
 * Provides example threat-analysis metadata and dashboard-friendly resource data.
 */
export class ThreatAnalysisResources {
    async overviewResource(context) {
        return {
            type: 'text',
            text: JSON.stringify({
                tools: [
                    {
                        name: 'analyze_email',
                        description: 'Analyze email for phishing indicators, auth failures, URL risk, attachments, and brand impersonation.',
                    },
                    {
                        name: 'scan_url',
                        description: 'Analyze a URL for suspicious patterns, impersonation, and delivery risk.',
                    },
                    {
                        name: 'lookup_cve',
                        description: 'Look up CVE data and mitigation guidance.',
                    },
                ],
                supportedSignals: [
                    'SPF/DKIM/DMARC',
                    'Reply-To mismatch',
                    'Display name spoofing',
                    'Brand impersonation',
                    'Suspicious URLs',
                    'Dangerous attachments',
                    'Grammar anomalies',
                ],
                outputFields: [
                    'riskScore',
                    'confidence',
                    'recommendedAction',
                    'evidence',
                    'signalBreakdown',
                ],
            }, null, 2),
        };
    }
}
__decorate([
    Resource({
        uri: 'threatanalysis://overview',
        name: 'Threat Analysis Overview',
        description: 'Overview of available phishing, URL, and vulnerability analysis capabilities.',
        mimeType: 'application/json',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisResources.prototype, "overviewResource", null);
//# sourceMappingURL=threatanalysis.resources.js.map