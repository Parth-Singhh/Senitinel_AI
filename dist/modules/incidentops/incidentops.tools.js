var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z, Injectable, Widget } from '@nitrostack/core';
/**
 * IncidentOps Tools
 *
 * Incident report generation and threat correlation
 */
const GenerateReportSchema = z.object({
    emailAnalysis: z.object({
        riskScore: z.number(),
        riskLevel: z.string(),
        indicators: z.array(z.object({
            type: z.string(),
            description: z.string(),
            severity: z.string(),
        })),
        summary: z.string(),
    }).optional().describe('Email analysis results'),
    urlScan: z.object({
        url: z.string(),
        status: z.string(),
        threatExplanation: z.string(),
        riskScore: z.number(),
    }).optional().describe('URL scan results'),
    cveData: z.object({
        cveId: z.string(),
        summary: z.string(),
        cvssScore: z.number(),
        severity: z.string(),
    }).optional().describe('CVE lookup results'),
    incidentTitle: z.string().optional().describe('Title for the incident report'),
});
const ReportOutput = z.object({
    reportId: z.string(),
    title: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    timestamp: z.string(),
    executive_summary: z.string(),
    threat_analysis: z.object({
        email_threat: z.object({
            status: z.string(),
            risk_score: z.number(),
            key_indicators: z.array(z.string()),
        }).optional(),
        url_threat: z.object({
            status: z.string(),
            risk_score: z.number(),
            explanation: z.string(),
        }).optional(),
        vulnerability_threat: z.object({
            cve_id: z.string(),
            cvss_score: z.number(),
            severity: z.string(),
        }).optional(),
    }),
    recommended_actions: z.array(z.string()),
    timeline: z.array(z.object({
        time: z.string(),
        event: z.string(),
    })),
    imageUrl: z.string().optional(),
});
let IncidentOpsTools = class IncidentOpsTools {
    /**
     * Generate an executive security incident report combining multiple threat analyses
     */
    async generateReport(input, context) {
        const { emailAnalysis, urlScan, cveData, incidentTitle } = input;
        // Determine overall severity
        let overallSeverity = 'low';
        if (emailAnalysis?.riskLevel === 'critical' || urlScan?.status === 'malicious' || cveData?.severity === 'critical') {
            overallSeverity = 'critical';
        }
        else if (emailAnalysis?.riskLevel === 'high' || urlScan?.status === 'suspicious' || cveData?.severity === 'high') {
            overallSeverity = 'high';
        }
        else if (emailAnalysis?.riskLevel === 'medium' || cveData?.severity === 'medium') {
            overallSeverity = 'medium';
        }
        // Build threat analysis section
        const threatAnalysis = {};
        if (emailAnalysis) {
            threatAnalysis.email_threat = {
                status: emailAnalysis.riskLevel,
                risk_score: emailAnalysis.riskScore,
                key_indicators: emailAnalysis.indicators.map((ind) => ind.type),
            };
        }
        if (urlScan) {
            threatAnalysis.url_threat = {
                status: urlScan.status,
                risk_score: urlScan.riskScore,
                explanation: urlScan.threatExplanation,
            };
        }
        if (cveData) {
            threatAnalysis.vulnerability_threat = {
                cve_id: cveData.cveId,
                cvss_score: cveData.cvssScore,
                severity: cveData.severity,
            };
        }
        // Build timeline
        const timeline = [];
        let timeOffset = 0;
        if (emailAnalysis) {
            timeline.push({
                time: new Date(Date.now() - timeOffset * 60000).toISOString(),
                event: `Phishing email detected with ${emailAnalysis.riskLevel} risk level`,
            });
            timeOffset += 5;
        }
        if (urlScan) {
            timeline.push({
                time: new Date(Date.now() - timeOffset * 60000).toISOString(),
                event: `Malicious URL identified: ${urlScan.url} (${urlScan.status})`,
            });
            timeOffset += 5;
        }
        if (cveData) {
            timeline.push({
                time: new Date(Date.now() - timeOffset * 60000).toISOString(),
                event: `Vulnerability ${cveData.cveId} (CVSS: ${cveData.cvssScore}) identified in affected systems`,
            });
            timeOffset += 5;
        }
        timeline.push({
            time: new Date().toISOString(),
            event: 'Incident report generated and escalated to security team',
        });
        // Build recommended actions
        const recommendedActions = [
            'Immediately isolate affected systems from the network',
            'Block the malicious URL at the firewall and email gateway',
            'Scan all systems for indicators of compromise',
            'Review email logs for similar phishing attempts',
            'Notify all users to be vigilant for similar threats',
            'Apply security patches for identified vulnerabilities',
            'Conduct forensic analysis on compromised systems',
            'Update threat intelligence feeds',
        ];
        const reportId = `INC-${Date.now()}`;
        const title = incidentTitle || 'Security Incident Report - Multi-Vector Threat';
        const executiveSummary = `
A multi-vector security threat has been detected involving phishing, malicious URLs, and potential vulnerability exploitation.
${emailAnalysis ? `Email analysis indicates a ${emailAnalysis.riskLevel} risk phishing attempt. ` : ''}
${urlScan ? `URL scanning identified a ${urlScan.status} domain. ` : ''}
${cveData ? `CVE ${cveData.cveId} (CVSS ${cveData.cvssScore}) poses additional risk. ` : ''}
Immediate action is required to contain and remediate this threat.
    `.trim();
        return {
            reportId,
            title,
            severity: overallSeverity,
            timestamp: new Date().toISOString(),
            executive_summary: executiveSummary,
            threat_analysis: threatAnalysis,
            recommended_actions: recommendedActions,
            timeline,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
};
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'generate_report',
        description: 'Generate an executive security incident report combining email analysis, URL scan, and CVE data with timeline and recommended response actions',
        inputSchema: GenerateReportSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentOpsTools.prototype, "generateReport", null);
IncidentOpsTools = __decorate([
    Injectable()
], IncidentOpsTools);
export { IncidentOpsTools };
//# sourceMappingURL=incidentops.tools.js.map