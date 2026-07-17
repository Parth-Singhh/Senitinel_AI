import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';

/**
 * ThreatAnalysis Resources
 *
 * Provides example threat-analysis metadata and dashboard-friendly resource data.
 */
export class ThreatAnalysisResources {
  @Resource({
    uri: 'threatanalysis://overview',
    name: 'Threat Analysis Overview',
    description: 'Overview of available phishing, URL, and vulnerability analysis capabilities.',
    mimeType: 'application/json',
  })
  async overviewResource(context: ExecutionContext) {
    return {
      type: 'text' as const,
      text: JSON.stringify(
        {
          tools: [
            {
              name: 'analyze_email',
              description: 'Analyze email for phishing indicators, auth failures, URL risk, attachments, and brand impersonation.',
            },
            {
              name: 'scan_url',
              description: 'Analyze a URL for suspicious patterns, impersonation, and delivery risk.',
            },
            {
              name: 'lookup_cve',
              description: 'Look up CVE data and mitigation guidance.',
            },
          ],
          supportedSignals: [
            'SPF/DKIM/DMARC',
            'Reply-To mismatch',
            'Display name spoofing',
            'Brand impersonation',
            'Suspicious URLs',
            'Dangerous attachments',
            'Grammar anomalies',
          ],
          outputFields: [
            'riskScore',
            'confidence',
            'recommendedAction',
            'evidence',
            'signalBreakdown',
          ],
        },
        null,
        2
      ),
    };
  }
}