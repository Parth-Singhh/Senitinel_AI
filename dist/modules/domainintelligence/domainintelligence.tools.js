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
 * Domain Intelligence Tools
 *
 * Analyze domain WHOIS, DNS, SSL certificates, and reputation
 */
export class DomainIntelligenceTools {
    async analyzeDomain(input, context) {
        const domain = input.domain.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        context.logger.info('Analyzing domain', { domain });
        let riskScore = 0;
        const indicators = [];
        const findings = [];
        // 1. WHOIS Analysis
        const whoisResult = this.analyzeWhois(domain);
        riskScore += whoisResult.score;
        indicators.push(...whoisResult.indicators);
        findings.push(...whoisResult.findings);
        // 2. DNS Analysis
        const dnsResult = this.analyzeDns(domain);
        riskScore += dnsResult.score;
        indicators.push(...dnsResult.indicators);
        findings.push(...dnsResult.findings);
        // 3. SSL Certificate Analysis
        const sslResult = this.analyzeSsl(domain);
        riskScore += sslResult.score;
        indicators.push(...sslResult.indicators);
        findings.push(...sslResult.findings);
        // 4. Domain Age Analysis
        const ageResult = this.analyzeDomainAge(domain);
        riskScore += ageResult.score;
        indicators.push(...ageResult.indicators);
        // 5. Reputation Analysis
        const reputationResult = this.analyzeReputation(domain);
        riskScore += reputationResult.score;
        indicators.push(...reputationResult.indicators);
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        return {
            domain,
            riskScore,
            riskLevel,
            indicators,
            findings,
            whois: whoisResult.data,
            dns: dnsResult.data,
            ssl: sslResult.data,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    analyzeWhois(domain) {
        let score = 0;
        const indicators = [];
        const findings = [];
        const data = {};
        // Simulate WHOIS lookup
        const whoisDb = {
            'google.com': {
                registrar: 'MarkMonitor Inc.',
                registrationDate: '1997-09-15',
                expirationDate: '2028-09-14',
                registrant: 'Google LLC',
                privacyProtection: false,
            },
            'malicious-domain.com': {
                registrar: 'Unknown Registrar',
                registrationDate: '2024-01-01',
                expirationDate: '2025-01-01',
                registrant: 'Privacy Protected',
                privacyProtection: true,
            },
        };
        const whoisInfo = whoisDb[domain] || {
            registrar: 'Unknown',
            registrationDate: new Date().toISOString().split('T')[0],
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            registrant: 'Unknown',
            privacyProtection: true,
        };
        Object.assign(data, whoisInfo);
        // Check for privacy protection
        if (whoisInfo.privacyProtection) {
            score += 10;
            indicators.push('⚠️ WHOIS privacy protection enabled');
        }
        else {
            indicators.push('✓ WHOIS information publicly available');
        }
        // Check registration date
        const regDate = new Date(whoisInfo.registrationDate);
        const ageMonths = (Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (ageMonths < 1) {
            score += 25;
            indicators.push('🚨 Domain registered less than 1 month ago');
        }
        else if (ageMonths < 6) {
            score += 15;
            indicators.push('⚠️ Domain registered less than 6 months ago');
        }
        else {
            indicators.push('✓ Domain has established registration history');
        }
        // Check expiration
        const expDate = new Date(whoisInfo.expirationDate);
        const daysUntilExp = (expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysUntilExp < 30) {
            score += 15;
            indicators.push('⚠️ Domain expiring soon');
        }
        else {
            findings.push(`📅 Domain expires: ${whoisInfo.expirationDate}`);
        }
        findings.push(`📋 Registrar: ${whoisInfo.registrar}`);
        findings.push(`👤 Registrant: ${whoisInfo.registrant}`);
        return { score, indicators, findings, data };
    }
    analyzeDns(domain) {
        let score = 0;
        const indicators = [];
        const findings = [];
        const data = {};
        // Simulate DNS records
        const dnsDb = {
            'google.com': {
                a: ['142.250.185.46'],
                mx: ['10 smtp.google.com'],
                txt: ['v=spf1 include:_spf.google.com ~all'],
                ns: ['ns1.google.com', 'ns2.google.com'],
            },
        };
        const dnsRecords = dnsDb[domain] || {
            a: ['192.0.2.1'],
            mx: [],
            txt: [],
            ns: ['ns1.example.com'],
        };
        Object.assign(data, dnsRecords);
        // Check for A records
        if (dnsRecords.a && dnsRecords.a.length > 0) {
            indicators.push(`✓ A records found: ${dnsRecords.a.join(', ')}`);
        }
        else {
            score += 20;
            indicators.push('🚨 No A records found');
        }
        // Check for MX records
        if (dnsRecords.mx && dnsRecords.mx.length > 0) {
            indicators.push(`✓ MX records configured`);
        }
        else {
            score += 10;
            indicators.push('⚠️ No MX records found');
        }
        // Check for SPF
        const hasSPF = dnsRecords.txt?.some((txt) => txt.includes('v=spf1'));
        if (hasSPF) {
            indicators.push('✓ SPF record configured');
        }
        else {
            score += 10;
            indicators.push('⚠️ No SPF record found');
        }
        findings.push(`🔗 Nameservers: ${dnsRecords.ns.join(', ')}`);
        return { score, indicators, findings, data };
    }
    analyzeSsl(domain) {
        let score = 0;
        const indicators = [];
        const findings = [];
        const data = {};
        // Simulate SSL certificate info
        const sslDb = {
            'google.com': {
                issuer: 'Google Internet Authority G3',
                validFrom: '2024-01-01',
                validUntil: '2025-04-01',
                algorithm: 'sha256WithRSAEncryption',
                keySize: 2048,
            },
        };
        const sslInfo = sslDb[domain] || {
            issuer: 'Unknown',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            algorithm: 'unknown',
            keySize: 0,
        };
        Object.assign(data, sslInfo);
        // Check certificate validity
        const validUntil = new Date(sslInfo.validUntil);
        const daysUntilExp = (validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysUntilExp < 0) {
            score += 30;
            indicators.push('🚨 SSL certificate expired');
        }
        else if (daysUntilExp < 30) {
            score += 15;
            indicators.push('⚠️ SSL certificate expiring soon');
        }
        else {
            indicators.push('✓ SSL certificate valid');
        }
        // Check key size
        if (sslInfo.keySize < 2048) {
            score += 15;
            indicators.push('⚠️ Weak SSL key size');
        }
        else {
            indicators.push('✓ Strong SSL key size');
        }
        findings.push(`🔐 Issuer: ${sslInfo.issuer}`);
        findings.push(`📅 Valid until: ${sslInfo.validUntil}`);
        return { score, indicators, findings, data };
    }
    analyzeDomainAge(domain) {
        let score = 0;
        const indicators = [];
        // Simulate domain age
        const ageDb = {
            'google.com': 27,
            'malicious-domain.com': 0.1,
        };
        const ageYears = ageDb[domain] ?? 1;
        if (ageYears < 0.5) {
            score += 30;
            indicators.push('🚨 Brand new domain (< 6 months)');
        }
        else if (ageYears < 2) {
            score += 15;
            indicators.push('⚠️ Relatively new domain (< 2 years)');
        }
        else if (ageYears > 10) {
            indicators.push('✓ Established domain (> 10 years)');
        }
        else {
            indicators.push(`ℹ️ Domain age: ${ageYears.toFixed(1)} years`);
        }
        return { score, indicators };
    }
    analyzeReputation(domain) {
        let score = 0;
        const indicators = [];
        // Simulate reputation lookup
        const reputationDb = {
            'google.com': { score: 0, reputation: 'trusted' },
            'malicious-domain.com': { score: 90, reputation: 'malicious' },
        };
        const reputation = reputationDb[domain] || { score: 10, reputation: 'unknown' };
        score += reputation.score;
        if (reputation.reputation === 'trusted') {
            indicators.push('✓ Domain has excellent reputation');
        }
        else if (reputation.reputation === 'malicious') {
            indicators.push('🚨 Domain flagged as malicious');
        }
        else {
            indicators.push('ℹ️ Domain reputation unknown');
        }
        return { score, indicators };
    }
}
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'analyze_domain',
        description: 'Analyze domain WHOIS information, DNS records, SSL certificate, age, and reputation',
        inputSchema: z.object({
            domain: z.string().describe('Domain name to analyze'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DomainIntelligenceTools.prototype, "analyzeDomain", null);
//# sourceMappingURL=domainintelligence.tools.js.map