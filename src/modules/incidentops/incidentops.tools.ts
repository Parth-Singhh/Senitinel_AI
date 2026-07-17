import { ToolDecorator as Tool, z, ExecutionContext, Injectable, Widget } from '@nitrostack/core';

/**
 * IncidentOps Tools
 *
 * Incident report generation and threat correlation
 */

const GenerateReportSchema = z.object({
  emailAnalysis: z.object({
    riskScore: z.number(),
    confidence: z.number().optional(),
    riskLevel: z.string(),
    recommendedAction: z.string().optional(),
    evidence: z.array(z.object({
      category: z.string(),
      signal: z.string(),
      severity: z.string(),
      weight: z.number().optional(),
      details: z.string().optional(),
    })).optional(),
    signalBreakdown: z.object({
      sender: z.number().optional(),
      auth: z.number().optional(),
      body: z.number().optional(),
      urls: z.number().optional(),
      attachments: z.number().optional(),
      brand: z.number().optional(),
      grammar: z.number().optional(),
    }).optional(),
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
      confidence: z.number().optional(),
      recommended_action: z.string().optional(),
      key_indicators: z.array(z.string()),
      signal_breakdown: z.record(z.number()).optional(),
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

@Injectable()
export class IncidentOpsTools {
  @Widget({ route: 'threat-dashboard' })
  @Tool({
    name: 'generate_report',
    description: 'Generate an executive security incident report combining email analysis, URL scan, and CVE data with timeline and recommended response actions',
    inputSchema: GenerateReportSchema,
  })
  async generateReport(input: {
    emailAnalysis?: any;
    urlScan?: any;
    cveData?: any;
    incidentTitle?: string;
  }, context: ExecutionContext) {
    const { emailAnalysis, urlScan, cveData, incidentTitle } = input;

    let overallSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (emailAnalysis?.riskLevel === 'critical' || emailAnalysis?.recommendedAction === 'block' || urlScan?.status === 'malicious' || cveData?.severity === 'critical') {
      overallSeverity = 'critical';
    } else if (emailAnalysis?.riskLevel === 'high' || emailAnalysis?.recommendedAction === 'quarantine' || urlScan?.status === 'suspicious' || cveData?.severity === 'high') {
      overallSeverity = 'high';
    } else if (emailAnalysis?.riskLevel === 'medium' || cveData?.severity === 'medium') {
      overallSeverity = 'medium';
    }

    const threatAnalysis: any = {};

    if (emailAnalysis) {
      threatAnalysis.email_threat = {
        status: emailAnalysis.riskLevel,
        risk_score: emailAnalysis.riskScore,
        confidence: emailAnalysis.confidence,
        recommended_action: emailAnalysis.recommendedAction,
        key_indicators: (emailAnalysis.evidence || []).map((item: any) => item.signal || item.type).filter(Boolean),
        signal_breakdown: emailAnalysis.signalBreakdown,
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

    const timeline = [];
    let timeOffset = 0;

    if (emailAnalysis) {
      timeline.push({
        time: new Date(Date.now() - timeOffset * 60000).toISOString(),
        event: `Email analysis completed: ${emailAnalysis.riskLevel} risk, ${emailAnalysis.recommendedAction || 'no action'} recommended`,
      });
      timeOffset += 5;
    }

    if (urlScan) {
      timeline.push({
        time: new Date(Date.now() - timeOffset * 60000).toISOString(),
        event: `URL scanned: ${urlScan.url} (${urlScan.status})`,
      });
      timeOffset += 5;
    }

    if (cveData) {
      timeline.push({
        time: new Date(Date.now() - timeOffset * 60000).toISOString(),
        event: `Vulnerability ${cveData.cveId} (CVSS: ${cveData.cvssScore}) identified`,
      });
      timeOffset += 5;
    }

    timeline.push({
      time: new Date().toISOString(),
      event: 'Incident report generated and escalated to security team',
    });

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

    if (emailAnalysis?.recommendedAction === 'quarantine' || emailAnalysis?.recommendedAction === 'block') {
      recommendedActions.unshift('Quarantine the suspicious email and prevent user interaction');
    }

    if (emailAnalysis?.evidence?.some((e: any) => e.category === 'Authentication')) {
      recommendedActions.unshift('Verify SPF, DKIM, and DMARC results for the sender domain');
    }

    if (emailAnalysis?.evidence?.some((e: any) => e.category === 'Attachments')) {
      recommendedActions.unshift('Do not open any attachments until verified in a sandbox');
    }

    if (emailAnalysis?.evidence?.some((e: any) => e.category === 'URLs')) {
      recommendedActions.unshift('Inspect all embedded URLs before allowing access');
    }

    if (emailAnalysis?.evidence?.some((e: any) => e.category === 'Brand Impersonation')) {
      recommendedActions.unshift('Confirm sender legitimacy with the claimed brand through a trusted channel');
    }

    const reportId = `INC-${Date.now()}`;
    const title = incidentTitle || 'Security Incident Report - Multi-Vector Threat';

    const executiveSummary = `
A multi-vector security threat has been detected involving phishing, malicious URLs, and potential vulnerability exploitation.
${emailAnalysis ? `Email analysis indicates a ${emailAnalysis.riskLevel} risk phishing attempt with ${Math.round((emailAnalysis.confidence || 0) * 100)}% confidence. ` : ''}
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
      recommended_actions: [...new Set(recommendedActions)],
      timeline,
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    };
  }
}