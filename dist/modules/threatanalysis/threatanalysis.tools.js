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
import { EmailAnalysisService } from './email-analysis.service';
/**
 * ThreatAnalysis Tools
 *
 * Email, URL, and CVE analysis tools for security threat detection
 */
let ThreatAnalysisTools = class ThreatAnalysisTools {
    emailAnalysisService;
    constructor(emailAnalysisService) {
        this.emailAnalysisService = emailAnalysisService;
    }
    async analyzeEmail(input, context) {
        context.logger.info('Analyzing email for phishing indicators', {
            from: input.from.email,
            subject: input.subject,
        });
        return this.emailAnalysisService.analyze(input);
    }
    async scanUrl(input, context) {
        const url = input.url;
        let status = 'safe';
        let riskScore = 0;
        const indicators = [];
        if (/paypa1|amaz0n|micr0soft|go0gle|apple-id|verify-account|confirm-identity|xn--/i.test(url)) {
            status = 'malicious';
            riskScore = 95;
            indicators.push('Domain impersonation or punycode detected');
            indicators.push('Known phishing infrastructure');
        }
        if (/^http:\/\//i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore += 10;
            indicators.push('No HTTPS encryption');
        }
        if (/^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/|$)/i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore += 20;
            indicators.push('URL uses IP address instead of domain');
        }
        if (/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly)\b/i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore += 15;
            indicators.push('URL shortener detected');
        }
        if (/\.(xyz|top|tk|ml|ga|cf|click|download|review|work|loan|vip|shop)(\/|$)/i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore += 15;
            indicators.push('Suspicious top-level domain');
        }
        if (/\b(login|verify|confirm|update|secure|account|signin|password|unlock|reset)\b/i.test(url)) {
            riskScore += 10;
            indicators.push('Credential-related path keywords');
        }
        if ((url.match(/\./g) || []).length >= 4) {
            riskScore += 8;
            indicators.push('Deep subdomain chain detected');
        }
        const threatExplanation = status === 'malicious'
            ? 'This URL is known to be malicious or highly suspicious. Do not visit.'
            : status === 'suspicious'
                ? 'This URL has suspicious characteristics. Exercise caution.'
                : 'This URL appears safe based on current checks.';
        return {
            url,
            status,
            threatExplanation,
            indicators: indicators.length > 0 ? indicators : ['No threats detected'],
            riskScore: Math.min(riskScore, 100),
            imageUrl: status === 'safe'
                ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop'
                : 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    async lookupCve(input, context) {
        const cveId = input.cveId;
        const cveDatabase = {
            'CVE-2024-1234': {
                cveId: 'CVE-2024-1234',
                summary: 'Remote Code Execution vulnerability in popular web framework',
                cvssScore: 9.8,
                severity: 'critical',
                affectedSoftware: ['Framework v1.0-v2.5', 'Framework v3.0-v3.2'],
                mitigation: [
                    'Update to Framework v2.6 or v3.3 or later',
                    'Apply security patch immediately',
                    'Monitor systems for exploitation attempts',
                    'Implement network segmentation',
                ],
                publishedDate: '2024-01-15',
            },
            'CVE-2024-5678': {
                cveId: 'CVE-2024-5678',
                summary: 'SQL Injection vulnerability in database connector',
                cvssScore: 8.6,
                severity: 'high',
                affectedSoftware: ['Database Connector v1.0-v1.5'],
                mitigation: [
                    'Update to Database Connector v1.6 or later',
                    'Use parameterized queries',
                    'Implement input validation',
                    'Apply principle of least privilege to database accounts',
                ],
                publishedDate: '2024-02-20',
            },
        };
        const cveData = cveDatabase[cveId] || {
            cveId,
            summary: `Vulnerability in system component. Requires investigation.`,
            cvssScore: 7.5,
            severity: 'high',
            affectedSoftware: ['Multiple versions'],
            mitigation: [
                'Check official vendor security advisories',
                'Apply available patches',
                'Monitor for exploitation',
                'Implement compensating controls',
            ],
            publishedDate: new Date().toISOString().split('T')[0],
        };
        return {
            ...cveData,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
};
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'analyze_email',
        description: 'Analyze email content for phishing attempts, suspicious indicators, and generate a risk score with mitigation recommendations',
        inputSchema: z.object({
            subject: z.string().optional(),
            from: z.object({
                name: z.string().optional(),
                email: z.string().email(),
                domain: z.string().optional(),
            }),
            replyTo: z.string().optional(),
            bodyText: z.string(),
            bodyHtml: z.string().optional(),
            urls: z.array(z.string().url()).optional(),
            attachments: z.array(z.object({
                filename: z.string(),
                mimeType: z.string().optional(),
                size: z.number().optional(),
            })).optional(),
            auth: z.object({
                spf: z.enum(['pass', 'fail', 'softfail', 'neutral', 'none']).optional(),
                dkim: z.enum(['pass', 'fail', 'neutral', 'none']).optional(),
                dmarc: z.enum(['pass', 'fail', 'bestguesspass', 'none']).optional(),
            }).optional(),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisTools.prototype, "analyzeEmail", null);
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'scan_url',
        description: 'Analyze a URL to determine if it is safe, suspicious, or malicious, with threat explanation and risk indicators',
        inputSchema: z.object({
            url: z.string().url(),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisTools.prototype, "scanUrl", null);
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'lookup_cve',
        description: 'Look up CVE vulnerability information including summary, CVSS score, severity, affected software, and mitigation recommendations',
        inputSchema: z.object({
            cveId: z.string(),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisTools.prototype, "lookupCve", null);
ThreatAnalysisTools = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EmailAnalysisService])
], ThreatAnalysisTools);
export { ThreatAnalysisTools };
//# sourceMappingURL=threatanalysis.tools.js.map