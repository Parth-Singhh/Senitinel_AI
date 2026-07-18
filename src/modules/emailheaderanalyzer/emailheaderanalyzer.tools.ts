import { ToolDecorator as Tool, z, ExecutionContext, Widget } from '@nitrostack/core';

/**
 * Email Header Analyzer Tools
 *
 * Parse and analyze raw email headers for authentication and routing
 */

export class EmailHeaderAnalyzerTools {
  @Widget({ route: 'threat-dashboard' })
  @Tool({
    name: 'analyze_email_headers',
    description: 'Parse and analyze raw email headers for SPF/DKIM/DMARC validation, routing, and authentication',
    inputSchema: z.object({
      headers: z.string().describe('Raw email headers'),
    }),
  })
  async analyzeEmailHeaders(input: { headers: string }, context: ExecutionContext) {
    const headers = input.headers;

    context.logger.info('Analyzing email headers');

    const parsed = this.parseHeaders(headers);
    let riskScore = 0;
    const indicators: string[] = [];
    const findings: string[] = [];

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

  private parseHeaders(headers: string) {
    const lines = headers.split('\n');
    const parsed: Record<string, any> = {
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
      } else {
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

  private analyzeSPF(parsed: Record<string, any>) {
    let score = 0;
    const indicators: string[] = [];
    let status = 'unknown';

    const authResults = parsed['authentication-results'] || '';

    if (authResults.includes('spf=pass')) {
      status = 'pass';
      indicators.push('✓ SPF check passed');
    } else if (authResults.includes('spf=fail')) {
      score += 20;
      status = 'fail';
      indicators.push('🚨 SPF check failed');
    } else if (authResults.includes('spf=softfail')) {
      score += 10;
      status = 'softfail';
      indicators.push('⚠️ SPF softfail');
    } else {
      score += 15;
      status = 'none';
      indicators.push('⚠️ No SPF record found');
    }

    return { score, indicators, status };
  }

  private analyzeDKIM(parsed: Record<string, any>) {
    let score = 0;
    const indicators: string[] = [];
    let status = 'unknown';

    const authResults = parsed['authentication-results'] || '';

    if (authResults.includes('dkim=pass')) {
      status = 'pass';
      indicators.push('✓ DKIM signature valid');
    } else if (authResults.includes('dkim=fail')) {
      score += 20;
      status = 'fail';
      indicators.push('🚨 DKIM signature invalid');
    } else if (authResults.includes('dkim=neutral')) {
      score += 10;
      status = 'neutral';
      indicators.push('⚠️ DKIM neutral');
    } else {
      score += 15;
      status = 'none';
      indicators.push('⚠️ No DKIM signature found');
    }

    return { score, indicators, status };
  }

  private analyzeDMARC(parsed: Record<string, any>) {
    let score = 0;
    const indicators: string[] = [];
    let status = 'unknown';

    const authResults = parsed['authentication-results'] || '';

    if (authResults.includes('dmarc=pass')) {
      status = 'pass';
      indicators.push('✓ DMARC policy aligned');
    } else if (authResults.includes('dmarc=fail')) {
      score += 15;
      status = 'fail';
      indicators.push('⚠️ DMARC policy not aligned');
    } else {
      score += 10;
      status = 'none';
      indicators.push('⚠️ No DMARC policy found');
    }

    return { score, indicators, status };
  }

  private analyzeRouting(parsed: Record<string, any>) {
    let score = 0;
    const indicators: string[] = [];
    const findings: string[] = [];

    const receivedChain = parsed.receivedChain || [];

    if (receivedChain.length === 0) {
      score += 10;
      indicators.push('⚠️ No Received headers found');
    } else {
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

  private detectAnomalies(parsed: Record<string, any>) {
    let score = 0;
    const indicators: string[] = [];

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
