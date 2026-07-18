var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
let EmailAnalysisService = class EmailAnalysisService {
    async analyze(input) {
        let riskScore = 0;
        const indicators = [];
        const mitigation = [];
        // 1. Sender Authentication Check
        const authScore = this.checkAuthentication(input.auth);
        riskScore += authScore.score;
        indicators.push(...authScore.indicators);
        // 2. Display Name Spoofing
        const displayNameCheck = this.checkDisplayNameSpoofing(input.from);
        riskScore += displayNameCheck.score;
        indicators.push(...displayNameCheck.indicators);
        // 3. Reply-To Mismatch
        if (input.replyTo && input.from.email) {
            const replyToDomain = input.replyTo.split('@')[1];
            const fromDomain = input.from.domain || input.from.email.split('@')[1];
            if (replyToDomain !== fromDomain) {
                riskScore += 15;
                indicators.push({
                    type: 'Reply-To Mismatch',
                    description: `Reply-To domain (${replyToDomain}) differs from sender domain (${fromDomain})`,
                    severity: 'high',
                });
            }
        }
        // 4. Brand Impersonation Detection
        const brandCheck = this.checkBrandImpersonation(input.from, input.subject, input.bodyText);
        riskScore += brandCheck.score;
        indicators.push(...brandCheck.indicators);
        // 5. URL Analysis
        const urlCheck = this.analyzeUrls(input.urls || []);
        riskScore += urlCheck.score;
        indicators.push(...urlCheck.indicators);
        // 6. Attachment Analysis
        const attachmentCheck = this.analyzeAttachments(input.attachments || []);
        riskScore += attachmentCheck.score;
        indicators.push(...attachmentCheck.indicators);
        // 7. Social Engineering Signals
        const socialEngCheck = this.detectSocialEngineering(input.subject, input.bodyText);
        riskScore += socialEngCheck.score;
        indicators.push(...socialEngCheck.indicators);
        // 8. Urgency Tactics
        const urgencyCheck = this.detectUrgency(input.subject, input.bodyText);
        riskScore += urgencyCheck.score;
        indicators.push(...urgencyCheck.indicators);
        // 9. Credential Harvesting Patterns
        const credentialCheck = this.detectCredentialHarvesting(input.bodyText, input.bodyHtml);
        riskScore += credentialCheck.score;
        indicators.push(...credentialCheck.indicators);
        // Clamp score to 0-100
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        // Determine risk level
        let riskLevel = 'low';
        if (riskScore >= 80)
            riskLevel = 'critical';
        else if (riskScore >= 60)
            riskLevel = 'high';
        else if (riskScore >= 40)
            riskLevel = 'medium';
        // Generate mitigation recommendations
        if (riskScore >= 80) {
            mitigation.push('⛔ Do NOT click any links or download attachments');
            mitigation.push('🚨 Report this email as phishing immediately');
            mitigation.push('🔒 Change your password if you clicked any links');
        }
        else if (riskScore >= 60) {
            mitigation.push('⚠️ Exercise extreme caution with this email');
            mitigation.push('🔍 Verify sender identity through alternative channels');
            mitigation.push('🚫 Do not download attachments unless verified');
        }
        else if (riskScore >= 40) {
            mitigation.push('✓ Review email carefully before taking action');
            mitigation.push('🔗 Hover over links to verify URLs before clicking');
            mitigation.push('📧 Contact sender directly if suspicious');
        }
        else {
            mitigation.push('✓ Email appears legitimate');
            mitigation.push('🔒 Standard security practices apply');
        }
        const confidence = Math.max(50, 100 - Math.abs(riskScore - 50) / 2);
        return {
            riskScore,
            riskLevel,
            confidence: Math.round(confidence),
            indicators,
            mitigation,
            from: input.from,
            subject: input.subject,
            spf: input.auth?.spf || 'unknown',
            dkim: input.auth?.dkim || 'unknown',
            dmarc: input.auth?.dmarc || 'unknown',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    checkAuthentication(auth) {
        let score = 0;
        const indicators = [];
        if (!auth) {
            score += 20;
            indicators.push({
                type: 'Missing Authentication',
                description: 'Email lacks SPF, DKIM, or DMARC records',
                severity: 'high',
            });
            return { score, indicators };
        }
        if (auth.spf !== 'pass') {
            score += 15;
            indicators.push({
                type: 'SPF Failure',
                description: `SPF check failed (${auth.spf || 'none'})`,
                severity: 'high',
            });
        }
        if (auth.dkim !== 'pass') {
            score += 15;
            indicators.push({
                type: 'DKIM Failure',
                description: `DKIM signature invalid (${auth.dkim || 'none'})`,
                severity: 'high',
            });
        }
        if (auth.dmarc !== 'pass') {
            score += 10;
            indicators.push({
                type: 'DMARC Failure',
                description: `DMARC policy not aligned (${auth.dmarc || 'none'})`,
                severity: 'medium',
            });
        }
        return { score, indicators };
    }
    checkDisplayNameSpoofing(from) {
        let score = 0;
        const indicators = [];
        if (from.name) {
            const displayName = from.name.toLowerCase();
            const email = from.email.toLowerCase();
            const domain = from.domain?.toLowerCase() || email.split('@')[1];
            // Check for common brand names in display name but different domain
            const commonBrands = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'bank', 'irs', 'fedex', 'ups'];
            const hasBrandName = commonBrands.some((brand) => displayName.includes(brand));
            if (hasBrandName && !domain.includes(commonBrands.find((b) => displayName.includes(b)) || '')) {
                score += 25;
                indicators.push({
                    type: 'Display Name Spoofing',
                    description: `Display name claims to be from a major brand but domain is ${domain}`,
                    severity: 'critical',
                });
            }
            // Check for homograph attacks (similar looking characters)
            if (/[0O][0O]|[1l!|]|[5S]|[8B]/.test(displayName)) {
                score += 10;
                indicators.push({
                    type: 'Homograph Attack',
                    description: 'Display name contains characters that look similar to legitimate brands',
                    severity: 'medium',
                });
            }
        }
        return { score, indicators };
    }
    checkBrandImpersonation(from, subject, bodyText) {
        let score = 0;
        const indicators = [];
        const brands = {
            paypal: ['paypal', 'pp', 'ebay'],
            amazon: ['amazon', 'aws'],
            apple: ['apple', 'icloud', 'itunes'],
            microsoft: ['microsoft', 'outlook', 'office365'],
            google: ['google', 'gmail', 'drive'],
            bank: ['bank', 'banking', 'account', 'verify'],
        };
        const text = `${from.email} ${subject} ${bodyText}`.toLowerCase();
        for (const [brand, keywords] of Object.entries(brands)) {
            const hasKeyword = keywords.some((kw) => text.includes(kw));
            if (hasKeyword && !from.email.includes(brand)) {
                score += 20;
                indicators.push({
                    type: 'Brand Impersonation',
                    description: `Email references ${brand} but sender domain is ${from.domain || from.email.split('@')[1]}`,
                    severity: 'critical',
                });
                break;
            }
        }
        return { score, indicators };
    }
    analyzeUrls(urls) {
        let score = 0;
        const indicators = [];
        for (const url of urls) {
            // Check for suspicious patterns
            if (/paypa1|amaz0n|micr0soft|go0gle|apple-id|verify-account|confirm-identity|xn--/i.test(url)) {
                score += 20;
                indicators.push({
                    type: 'Malicious URL',
                    description: `URL contains known phishing patterns: ${url}`,
                    severity: 'critical',
                });
            }
            if (/^http:\/\//i.test(url)) {
                score += 10;
                indicators.push({
                    type: 'Unencrypted URL',
                    description: 'URL uses HTTP instead of HTTPS',
                    severity: 'high',
                });
            }
            if (/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly)\b/i.test(url)) {
                score += 8;
                indicators.push({
                    type: 'URL Shortener',
                    description: 'URL uses shortening service, destination unclear',
                    severity: 'medium',
                });
            }
        }
        return { score, indicators };
    }
    analyzeAttachments(attachments) {
        let score = 0;
        const indicators = [];
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar', '.zip', '.rar'];
        const macroExtensions = ['.doc', '.xls', '.ppt'];
        for (const attachment of attachments) {
            const filename = attachment.filename.toLowerCase();
            if (dangerousExtensions.some((ext) => filename.endsWith(ext))) {
                score += 25;
                indicators.push({
                    type: 'Dangerous Attachment',
                    description: `Attachment ${attachment.filename} is executable`,
                    severity: 'critical',
                });
            }
            if (macroExtensions.some((ext) => filename.endsWith(ext))) {
                score += 15;
                indicators.push({
                    type: 'Macro-Enabled Document',
                    description: `Attachment ${attachment.filename} may contain macros`,
                    severity: 'high',
                });
            }
            if (attachment.size && attachment.size > 10 * 1024 * 1024) {
                score += 5;
                indicators.push({
                    type: 'Large Attachment',
                    description: `Attachment ${attachment.filename} is unusually large (${(attachment.size / 1024 / 1024).toFixed(1)}MB)`,
                    severity: 'low',
                });
            }
        }
        return { score, indicators };
    }
    detectSocialEngineering(subject, bodyText) {
        let score = 0;
        const indicators = [];
        const text = `${subject} ${bodyText}`.toLowerCase();
        const socialEngPatterns = [
            { pattern: /verify.*account|confirm.*identity|update.*information/i, score: 15, desc: 'Account verification request' },
            { pattern: /click.*here|act.*now|immediate.*action/i, score: 10, desc: 'Pressure to take immediate action' },
            { pattern: /suspended|locked|disabled|compromised/i, score: 15, desc: 'Account compromise threat' },
            { pattern: /unusual.*activity|suspicious.*login|unauthorized.*access/i, score: 12, desc: 'Security threat claim' },
            { pattern: /claim.*reward|congratulations|won|prize/i, score: 15, desc: 'Prize/reward scam pattern' },
        ];
        for (const { pattern, score: patternScore, desc } of socialEngPatterns) {
            if (pattern.test(text)) {
                score += patternScore;
                indicators.push({
                    type: 'Social Engineering',
                    description: desc,
                    severity: 'high',
                });
            }
        }
        return { score, indicators };
    }
    detectUrgency(subject, bodyText) {
        let score = 0;
        const indicators = [];
        const text = `${subject} ${bodyText}`.toLowerCase();
        const urgencyPatterns = [
            /urgent|immediate|asap|right now|within 24 hours|expires|deadline/i,
            /act now|don't delay|limited time|hurry|quickly/i,
            /confirm now|verify now|update now|click now/i,
        ];
        const urgencyCount = urgencyPatterns.filter((p) => p.test(text)).length;
        if (urgencyCount > 0) {
            score += urgencyCount * 8;
            indicators.push({
                type: 'Urgency Tactics',
                description: `Email uses ${urgencyCount} urgency-inducing phrases`,
                severity: 'medium',
            });
        }
        return { score, indicators };
    }
    detectCredentialHarvesting(bodyText, bodyHtml) {
        let score = 0;
        const indicators = [];
        const text = `${bodyText} ${bodyHtml}`.toLowerCase();
        const credentialPatterns = [
            { pattern: /password|passphrase|pin|secret/i, score: 15, desc: 'Password request' },
            { pattern: /username|login|account number|user id/i, score: 15, desc: 'Username/account request' },
            { pattern: /credit card|card number|cvv|expiration/i, score: 20, desc: 'Credit card request' },
            { pattern: /social security|ssn|tax id/i, score: 20, desc: 'SSN/tax ID request' },
            { pattern: /banking|account details|routing number/i, score: 20, desc: 'Banking information request' },
        ];
        for (const { pattern, score: patternScore, desc } of credentialPatterns) {
            if (pattern.test(text)) {
                score += patternScore;
                indicators.push({
                    type: 'Credential Harvesting',
                    description: desc,
                    severity: 'critical',
                });
            }
        }
        return { score, indicators };
    }
};
EmailAnalysisService = __decorate([
    Injectable()
], EmailAnalysisService);
export { EmailAnalysisService };
//# sourceMappingURL=email-analysis.service.js.map