var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z, Widget } from '@nitrostack/core';
/**
 * Email Header Analyzer Tools
 *
 * Parse and analyze raw email headers for authentication and routing
 */
export class EmailHeaderAnalyzerTools {
    async analyzeEmailHeaders(input, context) {
        const headers = input.headers;
        context.logger.info('Analyzing email headers');
        const parsed = this.parseHeaders(headers);
        let riskScore = 0;
        const indicators = [];
        const findings = [];
        // 1. SPF Analysis
        const spfResult = this.analyzeSPF(parsed);
        riskScore += spfResult.score;
        indicators.push(...spfResult.indicators);
        // 2. DKIM Analysis
        const dkimResult = this.analyzeDKIM(parsed);
        riskScore += dkimResult.score;
        indicators.push(...dkimResult.indicators);
        // 3. DMARC Analysis
        const dmarcResult = this.analyzeDMARC(parsed);
        riskScore += dmarcResult.score;
        indicators.push(...dmarcResult.indicators);
        // 4. Routing Analysis
        const routingResult = this.analyzeRouting(parsed);
        riskScore += routingResult.score;
        indicators.push(...routingResult.indicators);
        findings.push(...routingResult.findings);
        // 5. Header Anomalies
        const anomalyResult = this.detectAnomalies(parsed);
        riskScore += anomalyResult.score;
        indicators.push(...anomalyResult.indicators);
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        return {
            riskScore,
            riskLevel,
            indicators,
            findings,
            parsed: {
                from: parsed.from,
                to: parsed.to,
                subject: parsed.subject,
                date: parsed.date,
                messageId: parsed.messageId,
                receivedChain: parsed.receivedChain,
            },
            authentication: {
                spf: spfResult.status,
                dkim: dkimResult.status,
                dmarc: dmarcResult.status,
            },
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    parseHeaders(headers) {
        const lines = headers.split('\n');
        const parsed = {
            from: '',
            to: '',
            subject: '',
            date: '',
            messageId: '',
            receivedChain: [],
            spf: '',
            dkim: '',
            dmarc: '',
            returnPath: '',
            replyTo: '',
        };
        let currentHeader = '';
        let currentValue = '';
        for (const line of lines) {
            if (/^\s/.test(line)) {
                // Continuation of previous header
                currentValue += ' ' + line.trim();
            }
            else {
                // New header
                if (currentHeader) {
                    parsed[currentHeader.toLowerCase()] = currentValue;
                }
                const [header, ...valueParts] = line.split(':');
                currentHeader = header.trim();
                currentValue = valueParts.join(':').trim();
            }
        }
        // Add last header
        if (currentHeader) {
            parsed[currentHeader.toLowerCase()] = currentValue;
        }
        // Parse Received headers
        const receivedMatches = headers.match(/^Received:.*?$/gm) || [];
        parsed.receivedChain = receivedMatches.map((r) => r.replace(/^Received:\s*/, ''));
        return parsed;
    }
    analyzeSPF(parsed) {
        let score = 0;
        const indicators = [];
        let status = 'unknown';
        const authResults = parsed['authentication-results'] || '';
        if (authResults.includes('spf=pass')) {
            status = 'pass';
            indicators.push('✓ SPF check passed');
        }
        else if (authResults.includes('spf=fail')) {
            score += 20;
            status = 'fail';
            indicators.push('🚨 SPF check failed');
        }
        else if (authResults.includes('spf=softfail')) {
            score += 10;
            status = 'softfail';
            indicators.push('⚠️ SPF softfail');
        }
        else {
            score += 15;
            status = 'none';
            indicators.push('⚠️ No SPF record found');
        }
        return { score, indicators, status };
    }
    analyzeDKIM(parsed) {
        let score = 0;
        const indicators = [];
        let status = 'unknown';
        const authResults = parsed['authentication-results'] || '';
        if (authResults.includes('dkim=pass')) {
            status = 'pass';
            indicators.push('✓ DKIM signature valid');
        }
        else if (authResults.includes('dkim=fail')) {
            score += 20;
            status = 'fail';
            indicators.push('🚨 DKIM signature invalid');
        }
        else if (authResults.includes('dkim=neutral')) {
            score += 10;
            status = 'neutral';
            indicators.push('⚠️ DKIM neutral');
        }
        else {
            score += 15;
            status = 'none';
            indicators.push('⚠️ No DKIM signature found');
        }
        return { score, indicators, status };
    }
    analyzeDMARC(parsed) {
        let score = 0;
        const indicators = [];
        let status = 'unknown';
        const authResults = parsed['authentication-results'] || '';
        if (authResults.includes('dmarc=pass')) {
            status = 'pass';
            indicators.push('✓ DMARC policy aligned');
        }
        else if (authResults.includes('dmarc=fail')) {
            score += 15;
            status = 'fail';
            indicators.push('⚠️ DMARC policy not aligned');
        }
        else {
            score += 10;
            status = 'none';
            indicators.push('⚠️ No DMARC policy found');
        }
        return { score, indicators, status };
    }
    analyzeRouting(parsed) {
        let score = 0;
        const indicators = [];
        const findings = [];
        const receivedChain = parsed.receivedChain || [];
        if (receivedChain.length === 0) {
            score += 10;
            indicators.push('⚠️ No Received headers found');
        }
        else {
            findings.push(`📧 Email passed through ${receivedChain.length} mail servers`);
            // Check for suspicious routing
            if (receivedChain.length > 5) {
                score += 5;
                indicators.push('⚠️ Unusual number of hops');
            }
            // Check for external relays
            for (const hop of receivedChain) {
                if (/from.*\[.*\]/.test(hop)) {
                    findings.push(`🔗 Hop: ${hop.substring(0, 60)}...`);
                }
            }
        }
        return { score, indicators, findings };
    }
    detectAnomalies(parsed) {
        let score = 0;
        const indicators = [];
        // Check for missing headers
        if (!parsed.from) {
            score += 15;
            indicators.push('🚨 Missing From header');
        }
        if (!parsed.date) {
            score += 10;
            indicators.push('⚠️ Missing Date header');
        }
        if (!parsed.messageId) {
            score += 10;
            indicators.push('⚠️ Missing Message-ID header');
        }
        // Check for mismatched domains
        const from = parsed.from || '';
        const returnPath = parsed['return-path'] || '';
        if (from && returnPath && !from.includes(returnPath.split('@')[1])) {
            score += 15;
            indicators.push('⚠️ Return-Path domain differs from From domain');
        }
        // Check for suspicious headers
        if (parsed['x-originating-ip']) {
            indicators.push(`ℹ️ Originating IP: ${parsed['x-originating-ip']}`);
        }
        return { score, indicators };
    }
}
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'analyze_email_headers',
        description: 'Parse and analyze raw email headers for SPF/DKIM/DMARC validation, routing, and authentication',
        inputSchema: z.object({
            headers: z.string().describe('Raw email headers'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailHeaderAnalyzerTools.prototype, "analyzeEmailHeaders", null);
//# sourceMappingURL=emailheaderanalyzer.tools.js.map