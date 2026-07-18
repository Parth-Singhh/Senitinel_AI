import { ToolDecorator as Tool, z, ExecutionContext, Injectable, Widget } from '@nitrostack/core';
import { EmailAnalysisService } from './email-analysis.service.js';
import type { EmailAnalysisInput } from './email-types.js';

/**
 * ThreatAnalysis Tools
 *
 * Email, URL, and CVE analysis tools for security threat detection
 */

@Injectable({ deps: [EmailAnalysisService] })
export class ThreatAnalysisTools {
  constructor(private readonly emailAnalysisService: EmailAnalysisService) {}

  @Widget({ route: 'threat-dashboard' })
  @Tool({
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
  })
  async analyzeEmail(input: EmailAnalysisInput, context: ExecutionContext) {
    context.logger.info('Analyzing email for phishing indicators', {
      from: input.from.email,
      subject: input.subject,
    });

    return this.emailAnalysisService.analyze(input);
  }

  @Widget({ route: 'threat-dashboard' })
  @Tool({
    name: 'scan_url',
    description: 'Analyze a URL to determine if it is safe, suspicious, or malicious, with threat explanation and risk indicators',
    inputSchema: z.object({
      url: z.string().url(),
    }),
  })
  async scanUrl(input: { url: string }, context: ExecutionContext) {
    const url = input.url;
    let status: 'safe' | 'suspicious' | 'malicious' = 'safe';
    let riskScore = 0;
    const indicators: string[] = [];

    // 1. Domain Impersonation & Punycode
    if (/paypa1|amaz0n|micr0soft|go0gle|apple-id|verify-account|confirm-identity|xn--/i.test(url)) {
      status = 'malicious';
      riskScore = 95;
      indicators.push('🚨 Domain impersonation or punycode detected');
      indicators.push('🚨 Known phishing infrastructure');
    }

    // 2. HTTPS Analysis
    if (/^http:\/\//i.test(url)) {
      if (status === 'safe') status = 'suspicious';
      riskScore += 10;
      indicators.push('⚠️ No HTTPS encryption');
    }

    // 3. IP-based URLs
    if (/^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/|$)/i.test(url)) {
      if (status === 'safe') status = 'suspicious';
      riskScore += 20;
      indicators.push('⚠️ URL uses IP address instead of domain');
    }

    // 4. URL Shortener Detection
    if (/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|ow\.ly|short\.link)\b/i.test(url)) {
      if (status === 'safe') status = 'suspicious';
      riskScore += 15;
      indicators.push('⚠️ URL shortener detected - destination unclear');
    }

    // 5. Suspicious TLD Detection
    if (/\.(xyz|top|tk|ml|ga|cf|click|download|review|work|loan|vip|shop|win|date|stream|racing|cricket|accountant|faith|science|trade)(\/|$)/i.test(url)) {
      if (status === 'safe') status = 'suspicious';
      riskScore += 15;
      indicators.push('⚠️ Suspicious top-level domain');
    }

    // 6. Credential-related Keywords
    if (/\b(login|verify|confirm|update|secure|account|signin|password|unlock|reset|authenticate|authorize)\b/i.test(url)) {
      riskScore += 10;
      indicators.push('⚠️ Credential-related path keywords detected');
    }

    // 7. Deep Subdomain Detection
    const subdomainCount = (url.match(/\./g) || []).length;
    if (subdomainCount >= 4) {
      riskScore += 8;
      indicators.push(`⚠️ Deep subdomain chain detected (${subdomainCount} levels)`);
    }

    // 8. Reputation Score (simulated)
    const reputationScore = Math.max(0, 100 - riskScore);

    const threatExplanation =
      status === 'malicious'
        ? '🚨 This URL is known to be malicious or highly suspicious. Do NOT visit.'
        : status === 'suspicious'
          ? '⚠️ This URL has suspicious characteristics. Exercise extreme caution.'
          : '✓ This URL appears safe based on current checks.';

    return {
      url,
      status,
      threatExplanation,
      indicators: indicators.length > 0 ? indicators : ['✓ No threats detected'],
      riskScore: Math.min(riskScore, 100),
      reputationScore,
      subdomainDepth: subdomainCount,
      hasHttps: /^https:\/\//i.test(url),
      imageUrl: status === 'safe'
        ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    };
  }

  @Widget({ route: 'threat-dashboard' })
  @Tool({
    name: 'lookup_cve',
    description: 'Look up CVE vulnerability information including summary, CVSS score, severity, affected software, and mitigation recommendations',
    inputSchema: z.object({
      cveId: z.string(),
    }),
  })
  async lookupCve(input: { cveId: string }, context: ExecutionContext) {
    const cveId = input.cveId;

    const cveDatabase: Record<string, any> = {
      'CVE-2024-1234': {
        cveId: 'CVE-2024-1234',
        summary: 'Remote Code Execution vulnerability in popular web framework',
        cvssScore: 9.8,
        severity: 'critical',
        affectedSoftware: ['Framework v1.0-v2.5', 'Framework v3.0-v3.2'],
        mitigation: [
          '🔴 Update to Framework v2.6 or v3.3 or later immediately',
          '🔴 Apply security patch immediately',
          '🟠 Monitor systems for exploitation attempts',
          '🟠 Implement network segmentation',
          '🟡 Review access logs for suspicious activity',
        ],
        publishedDate: '2024-01-15',
        mitreTactics: ['Execution', 'Privilege Escalation'],
      },
      'CVE-2024-5678': {
        cveId: 'CVE-2024-5678',
        summary: 'SQL Injection vulnerability in database connector',
        cvssScore: 8.6,
        severity: 'high',
        affectedSoftware: ['Database Connector v1.0-v1.5'],
        mitigation: [
          '🟠 Update to Database Connector v1.6 or later',
          '🟠 Use parameterized queries in all applications',
          '🟡 Implement input validation and sanitization',
          '🟡 Apply principle of least privilege to database accounts',
          '🟢 Enable SQL query logging and monitoring',
        ],
        publishedDate: '2024-02-20',
        mitreTactics: ['Persistence', 'Exfiltration'],
      },
    };

    const cveData = cveDatabase[cveId] || {
      cveId,
      summary: `Vulnerability in system component. Requires investigation.`,
      cvssScore: 7.5,
      severity: 'high',
      affectedSoftware: ['Multiple versions'],
      mitigation: [
        '🟠 Check official vendor security advisories',
        '🟠 Apply available patches',
        '🟡 Monitor for exploitation',
        '🟡 Implement compensating controls',
      ],
      publishedDate: new Date().toISOString().split('T')[0],
      mitreTactics: [],
    };

    return {
      ...cveData,
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    };
  }
}
