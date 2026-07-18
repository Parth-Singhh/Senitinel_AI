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
 * Password Analyzer Tools
 *
 * Analyze password strength, entropy, and breach history
 */
export class PasswordAnalyzerTools {
    async analyzePassword(input, context) {
        const password = input.password;
        const checkBreach = input.checkBreach !== false;
        context.logger.info('Analyzing password strength');
        let riskScore = 0;
        const indicators = [];
        const recommendations = [];
        // 1. Length Analysis
        const length = password.length;
        if (length < 8) {
            riskScore += 30;
            indicators.push('🚨 Password too short (< 8 characters)');
            recommendations.push('Use at least 12-16 characters');
        }
        else if (length < 12) {
            riskScore += 15;
            indicators.push('⚠️ Password could be longer (< 12 characters)');
            recommendations.push('Consider using 16+ characters for better security');
        }
        else {
            indicators.push('✓ Good password length');
        }
        // 2. Character Diversity
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigits = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const charTypes = [hasLower, hasUpper, hasDigits, hasSpecial].filter(Boolean).length;
        if (charTypes < 2) {
            riskScore += 25;
            indicators.push('🚨 Low character diversity');
            recommendations.push('Mix uppercase, lowercase, numbers, and symbols');
        }
        else if (charTypes < 3) {
            riskScore += 15;
            indicators.push('⚠️ Moderate character diversity');
            recommendations.push('Add special characters for stronger security');
        }
        else {
            indicators.push('✓ Good character diversity');
        }
        // 3. Common Patterns
        const commonPatterns = [
            { pattern: /^[a-z]+\d+$/, name: 'Simple letter+number pattern' },
            { pattern: /^(password|admin|letmein|welcome|123456|qwerty)/i, name: 'Common password' },
            { pattern: /(.)\1{2,}/, name: 'Repeated characters' },
            { pattern: /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, name: 'Sequential characters' },
            { pattern: /^(123|234|345|456|567|678|789|890|012)/i, name: 'Sequential numbers' },
        ];
        for (const { pattern, name } of commonPatterns) {
            if (pattern.test(password)) {
                riskScore += 20;
                indicators.push(`🚨 ${name} detected`);
                recommendations.push(`Avoid ${name.toLowerCase()}`);
                break;
            }
        }
        // 4. Entropy Calculation
        const entropy = this.calculateEntropy(password);
        if (entropy < 30) {
            riskScore += 20;
            indicators.push(`⚠️ Low entropy (${entropy.toFixed(1)} bits)`);
            recommendations.push('Increase randomness and complexity');
        }
        else if (entropy < 50) {
            indicators.push(`✓ Moderate entropy (${entropy.toFixed(1)} bits)`);
        }
        else {
            indicators.push(`✓ Strong entropy (${entropy.toFixed(1)} bits)`);
        }
        // 5. Breach Check (simulated)
        let breachStatus = 'not_found';
        if (checkBreach) {
            const commonBreaches = ['password123', 'admin123', 'letmein', 'welcome123', 'qwerty123'];
            if (commonBreaches.includes(password.toLowerCase())) {
                riskScore += 40;
                breachStatus = 'found_in_breach';
                indicators.push('🚨 Password found in known data breaches');
                recommendations.push('Change this password immediately');
            }
            else {
                indicators.push('✓ Not found in known breaches');
            }
        }
        // Clamp score
        riskScore = Math.min(Math.max(riskScore, 0), 100);
        const strength = riskScore >= 80 ? 'very_weak' : riskScore >= 60 ? 'weak' : riskScore >= 40 ? 'fair' : riskScore >= 20 ? 'good' : 'strong';
        const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        return {
            password: '***' + password.slice(-2), // Mask password in output
            riskScore,
            riskLevel,
            strength,
            length,
            entropy: entropy.toFixed(1),
            charTypes,
            hasLower,
            hasUpper,
            hasDigits,
            hasSpecial,
            breachStatus,
            indicators,
            recommendations,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    calculateEntropy(password) {
        let charsetSize = 0;
        if (/[a-z]/.test(password))
            charsetSize += 26;
        if (/[A-Z]/.test(password))
            charsetSize += 26;
        if (/\d/.test(password))
            charsetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
            charsetSize += 32;
        return password.length * Math.log2(charsetSize);
    }
}
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'analyze_password',
        description: 'Analyze password strength, entropy, and check for common patterns and breach history',
        inputSchema: z.object({
            password: z.string().describe('Password to analyze'),
            checkBreach: z.boolean().optional().describe('Check if password appears in known breaches'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PasswordAnalyzerTools.prototype, "analyzePassword", null);
//# sourceMappingURL=passwordanalyzer.tools.js.map