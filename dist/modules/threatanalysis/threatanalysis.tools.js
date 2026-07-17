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
 * ThreatAnalysis Tools
 *
 * Email, URL, and CVE analysis tools for security threat detection
 */
// Zod schemas for tool inputs and outputs
const EmailAnalysisSchema = z.object({
    content: z.string().describe('Email content to analyze for phishing'),
});
const URLScanSchema = z.object({
    url: z.string().url().describe('URL to scan for threats'),
});
const CVELookupSchema = z.object({
    cveId: z.string().describe('CVE ID to look up (e.g., CVE-2024-1234)'),
});
// Output schemas
const EmailAnalysisOutput = z.object({
    riskScore: z.number().min(0).max(100),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
    indicators: z.array(z.object({
        type: z.string(),
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high']),
    })),
    mitigation: z.array(z.string()),
    summary: z.string(),
    imageUrl: z.string().optional(),
});
const URLScanOutput = z.object({
    url: z.string(),
    status: z.enum(['safe', 'suspicious', 'malicious']),
    threatExplanation: z.string(),
    indicators: z.array(z.string()),
    riskScore: z.number().min(0).max(100),
    imageUrl: z.string().optional(),
});
const CVEOutput = z.object({
    cveId: z.string(),
    summary: z.string(),
    cvssScore: z.number().min(0).max(10),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    affectedSoftware: z.array(z.string()),
    mitigation: z.array(z.string()),
    publishedDate: z.string(),
    imageUrl: z.string().optional(),
});
let ThreatAnalysisTools = class ThreatAnalysisTools {
    /**
     * Analyze email content for phishing and security threats
     */
    async analyzeEmail(input, context) {
        const { content } = input;
        // Simulate email analysis with heuristics
        const indicators = [];
        let riskScore = 0;
        // Check for urgency tactics
        if (/urgent|immediate|act now|verify|confirm|click here|update|suspended|locked|expired/i.test(content)) {
            indicators.push({
                type: 'Urgency Tactics',
                description: 'Email uses urgent language to pressure action',
                severity: 'high',
            });
            riskScore += 25;
        }
        // Check for suspicious links
        if (/paypa1|amaz0n|micr0soft|go0gle|verify-account|confirm-identity/i.test(content)) {
            indicators.push({
                type: 'Domain Spoofing',
                description: 'Email contains domain names that mimic legitimate services',
                severity: 'high',
            });
            riskScore += 30;
        }
        // Check for requests for sensitive info
        if (/password|credit card|ssn|social security|bank account|pin|cvv/i.test(content)) {
            indicators.push({
                type: 'Credential Harvesting',
                description: 'Email requests sensitive personal or financial information',
                severity: 'high',
            });
            riskScore += 25;
        }
        // Check for suspicious attachments
        if (/\.exe|\.zip|\.scr|\.bat|\.cmd|\.vbs|\.js/i.test(content)) {
            indicators.push({
                type: 'Malicious Attachment',
                description: 'Email contains potentially dangerous file types',
                severity: 'critical',
            });
            riskScore += 35;
        }
        // Check for poor grammar/spelling (common in phishing)
        if (/\b(recieve|occured|seperate|definately|untill|wich|thier)\b/i.test(content)) {
            indicators.push({
                type: 'Poor Grammar',
                description: 'Email contains spelling/grammar errors common in phishing',
                severity: 'medium',
            });
            riskScore += 10;
        }
        // Ensure risk score doesn't exceed 100
        riskScore = Math.min(riskScore, 100);
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        const mitigation = [
            'Do not click links or download attachments from untrusted senders',
            'Verify sender email address by hovering over the display name',
            'Contact the organization directly using a known phone number or website',
            'Report the email as phishing to your email provider',
            'Enable multi-factor authentication on all accounts',
        ];
        return {
            riskScore,
            riskLevel,
            indicators: indicators.length > 0 ? indicators : [
                {
                    type: 'No Threats Detected',
                    description: 'Email appears to be legitimate',
                    severity: 'low',
                },
            ],
            mitigation,
            summary: `Email analysis complete. Risk level: ${riskLevel}. ${indicators.length} suspicious indicators detected.`,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    /**
     * Scan a URL for security threats
     */
    async scanUrl(input, context) {
        const { url } = input;
        let status = 'safe';
        let riskScore = 0;
        const indicators = [];
        // Check for domain impersonation
        if (/paypa1|amaz0n|micr0soft|go0gle|apple-id|verify-account|confirm-identity/i.test(url)) {
            status = 'malicious';
            riskScore = 95;
            indicators.push('Domain impersonation detected');
            indicators.push('Known phishing infrastructure');
        }
        // Check for suspicious TLDs
        if (/\.tk|\.ml|\.ga|\.cf|\.xyz|\.top|\.download|\.review/i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore = Math.max(riskScore, 60);
            indicators.push('Suspicious top-level domain');
        }
        // Check for IP address instead of domain
        if (/^https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore = Math.max(riskScore, 70);
            indicators.push('URL uses IP address instead of domain name');
        }
        // Check for missing HTTPS
        if (/^http:\/\//.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore = Math.max(riskScore, 50);
            indicators.push('No HTTPS encryption');
        }
        // Check for suspicious parameters
        if (/[?&](login|password|verify|confirm|update|redirect|return)=/i.test(url)) {
            if (status === 'safe')
                status = 'suspicious';
            riskScore = Math.max(riskScore, 65);
            indicators.push('Suspicious URL parameters detected');
        }
        const threatExplanation = status === 'malicious' ? 'This URL is known to be used in phishing and malware campaigns. Do not visit.' :
            status === 'suspicious' ? 'This URL has characteristics of a phishing or malware site. Exercise caution.' :
                'This URL appears to be safe based on current threat intelligence.';
        return {
            url,
            status,
            threatExplanation,
            indicators: indicators.length > 0 ? indicators : ['No threats detected'],
            riskScore,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    /**
     * Look up CVE vulnerability information
     */
    async lookupCve(input, context) {
        const { cveId } = input;
        // Mock CVE database - in production this would query NVD or similar
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
        // Return mock data or generic response
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
        inputSchema: EmailAnalysisSchema,
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
        inputSchema: URLScanSchema,
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
        inputSchema: CVELookupSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThreatAnalysisTools.prototype, "lookupCve", null);
ThreatAnalysisTools = __decorate([
    Injectable()
], ThreatAnalysisTools);
export { ThreatAnalysisTools };
//# sourceMappingURL=threatanalysis.tools.js.map