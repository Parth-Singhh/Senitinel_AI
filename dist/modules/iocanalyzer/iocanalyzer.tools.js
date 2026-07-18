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
 * IOC Analyzer Tools
 *
 * Analyze Indicators of Compromise (IPs, domains, hashes)
 */
export class IocAnalyzerTools {
    async analyzeIoc(input, context) {
        const ioc = input.ioc.trim();
        let detectedType = input.iocType;
        // Auto-detect IOC type
        if (!detectedType) {
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ioc)) {
                detectedType = 'ip';
            }
            else if (/^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/.test(ioc)) {
                detectedType = 'hash';
            }
            else if (/^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}$/i.test(ioc)) {
                detectedType = 'domain';
            }
        }
        context.logger.info('Analyzing IOC', { ioc, type: detectedType });
        if (detectedType === 'ip') {
            return this.analyzeIp(ioc);
        }
        else if (detectedType === 'domain') {
            return this.analyzeDomain(ioc);
        }
        else if (detectedType === 'hash') {
            return this.analyzeHash(ioc);
        }
        return {
            ioc,
            riskScore: 0,
            riskLevel: 'unknown',
            indicators: ['Unable to determine IOC type'],
            mitigation: ['Verify IOC format and try again'],
        };
    }
    analyzeIp(ip) {
        let riskScore = 0;
        const indicators = [];
        const mitigation = [];
        // Check for private IPs
        if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(ip)) {
            return {
                ioc: ip,
                iocType: 'ip',
                riskScore: 0,
                riskLevel: 'safe',
                indicators: ['✓ Private IP address (RFC 1918)'],
                mitigation: ['No action required for private IP'],
                reputation: 'trusted',
                imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
            };
        }
        // Simulate reputation lookup
        const reputationDb = {
            '192.0.2.1': { score: 85, reputation: 'malicious', indicators: ['Known botnet C2 server', 'Multiple abuse reports'] },
            '198.51.100.1': { score: 60, reputation: 'suspicious', indicators: ['Proxy/VPN detected', 'Hosting provider with abuse history'] },
            '203.0.113.1': { score: 20, reputation: 'suspicious', indicators: ['Unusual geographic location', 'High port scan activity'] },
        };
        const reputation = reputationDb[ip];
        if (reputation) {
            riskScore = reputation.score;
            indicators.push(...reputation.indicators);
        }
        else {
            riskScore = 15;
            indicators.push('✓ No known reputation issues');
        }
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        if (riskScore >= 80) {
            mitigation.push('🚨 Block this IP immediately');
            mitigation.push('🚨 Review all connections from this IP');
            mitigation.push('🟠 Check for data exfiltration');
        }
        else if (riskScore >= 60) {
            mitigation.push('⚠️ Monitor connections from this IP');
            mitigation.push('🟠 Implement rate limiting');
            mitigation.push('🟡 Review firewall rules');
        }
        else {
            mitigation.push('✓ Standard monitoring recommended');
        }
        return {
            ioc: ip,
            iocType: 'ip',
            riskScore,
            riskLevel,
            reputation: reputation?.reputation || 'unknown',
            indicators,
            mitigation,
            geolocation: 'US',
            asn: 'AS12345',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    analyzeDomain(domain) {
        let riskScore = 0;
        const indicators = [];
        const mitigation = [];
        // Check for suspicious patterns
        if (/paypa1|amaz0n|micr0soft|go0gle|apple-id|xn--/.test(domain)) {
            riskScore += 40;
            indicators.push('🚨 Domain impersonation pattern detected');
        }
        if (/^[a-z0-9]{1,3}\./.test(domain)) {
            riskScore += 15;
            indicators.push('⚠️ Very short domain name (potential typosquatting)');
        }
        if (/\.(xyz|top|tk|ml|ga|cf|click|download|review|work|loan|vip|shop)$/.test(domain)) {
            riskScore += 20;
            indicators.push('⚠️ Suspicious TLD');
        }
        // Simulate reputation lookup
        const reputationDb = {
            'malicious-domain.com': { score: 95, reputation: 'malicious', indicators: ['Known phishing domain', 'Malware distribution'] },
            'suspicious-site.xyz': { score: 70, reputation: 'suspicious', indicators: ['Phishing reports', 'Credential harvesting'] },
        };
        const reputation = reputationDb[domain];
        if (reputation) {
            riskScore = Math.max(riskScore, reputation.score);
            indicators.push(...reputation.indicators);
        }
        else if (riskScore === 0) {
            indicators.push('✓ No known reputation issues');
        }
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        if (riskScore >= 80) {
            mitigation.push('🚨 Block domain in firewall/DNS');
            mitigation.push('🚨 Alert users about phishing');
            mitigation.push('🟠 Check for data exfiltration');
        }
        else if (riskScore >= 60) {
            mitigation.push('⚠️ Monitor DNS queries to this domain');
            mitigation.push('🟠 Implement DNS filtering');
            mitigation.push('🟡 Review user access logs');
        }
        else {
            mitigation.push('✓ Standard monitoring recommended');
        }
        return {
            ioc: domain,
            iocType: 'domain',
            riskScore,
            riskLevel,
            reputation: reputation?.reputation || 'unknown',
            indicators,
            mitigation,
            registrar: 'GoDaddy',
            registrationDate: '2023-01-15',
            expirationDate: '2025-01-15',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    analyzeHash(hash) {
        let riskScore = 0;
        const indicators = [];
        const mitigation = [];
        const hashType = hash.length === 32 ? 'MD5' : hash.length === 40 ? 'SHA1' : hash.length === 64 ? 'SHA256' : 'unknown';
        // Simulate hash reputation lookup
        const reputationDb = {
            'd41d8cd98f00b204e9800998ecf8427e': { score: 85, reputation: 'malicious', indicators: ['Trojan.Win32.Generic', 'Detected by 45 AV engines'] },
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': { score: 70, reputation: 'suspicious', indicators: ['Potentially unwanted program', 'Detected by 12 AV engines'] },
        };
        const reputation = reputationDb[hash];
        if (reputation) {
            riskScore = reputation.score;
            indicators.push(...reputation.indicators);
        }
        else {
            riskScore = 5;
            indicators.push('✓ No known malware signatures');
        }
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        if (riskScore >= 80) {
            mitigation.push('🚨 Quarantine file immediately');
            mitigation.push('🚨 Scan all systems for this hash');
            mitigation.push('🟠 Review file execution logs');
        }
        else if (riskScore >= 60) {
            mitigation.push('⚠️ Isolate affected systems');
            mitigation.push('🟠 Perform deeper analysis');
            mitigation.push('🟡 Monitor for lateral movement');
        }
        else {
            mitigation.push('✓ Standard monitoring recommended');
        }
        return {
            ioc: hash,
            iocType: 'hash',
            hashType,
            riskScore,
            riskLevel,
            reputation: reputation?.reputation || 'unknown',
            indicators,
            mitigation,
            fileType: 'PE32 executable',
            fileSize: '2.5 MB',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
}
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'analyze_ioc',
        description: 'Analyze Indicators of Compromise (IPs, domains, file hashes) for reputation and threat intelligence',
        inputSchema: z.object({
            ioc: z.string().describe('IP address, domain, or file hash to analyze'),
            iocType: z.enum(['ip', 'domain', 'hash']).optional().describe('Type of IOC (auto-detected if not specified)'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IocAnalyzerTools.prototype, "analyzeIoc", null);
//# sourceMappingURL=iocanalyzer.tools.js.map