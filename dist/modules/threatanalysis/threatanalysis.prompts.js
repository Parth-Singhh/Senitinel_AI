var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PromptDecorator as Prompt } from '@nitrostack/core';
/**
 * ThreatAnalysis Prompts
 *
 * Prompt helpers for phishing, URL, and vulnerability analysis guidance.
 */
export class ThreatAnalysisPrompts {
    async helpPrompt(args, context) {
        return [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: 'How do I use the threat analysis tools effectively?',
                },
            },
            {
                role: 'assistant',
                content: {
                    type: 'text',
                    text: `Use the threat analysis tools to inspect emails, URLs, and vulnerabilities.

Email analysis returns:
- riskScore
- confidence
- recommendedAction
- evidence
- signalBreakdown

Interpretation:
- allow: no strong threat indicators
- warn: suspicious, but not severe
- quarantine: likely phishing or malicious content
- block: highly likely malicious

Best practices:
- verify sender authentication results
- check reply-to and sender domain mismatches
- inspect suspicious URLs and attachments
- confirm brand impersonation against known legitimate domains
- use the evidence list to understand why the score was raised`,
                },
            },
        ];
    }
}
__decorate([
    Prompt({
        name: 'threatanalysis-help',
        description: 'Help users understand the threat analysis tools and how to interpret results.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisPrompts.prototype, "helpPrompt", null);
//# sourceMappingURL=threatanalysis.prompts.js.map