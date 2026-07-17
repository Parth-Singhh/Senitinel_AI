import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

/**
 * ThreatAnalysis Prompts
 *
 * Prompt helpers for phishing, URL, and vulnerability analysis guidance.
 */
export class ThreatAnalysisPrompts {
  @Prompt({
    name: 'threatanalysis-help',
    description: 'Help users understand the threat analysis tools and how to interpret results.',
  })
  async helpPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: 'How do I use the threat analysis tools effectively?',
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Use the threat analysis tools to inspect emails, URLs, and vulnerabilities.

Email analysis returns:
- riskScore
- confidence
- recommendedAction
- evidence
- signalBreakdown

Interpretation:
- allow: no strong threat indicators
- warn: suspicious, but not severe
- quarantine: likely phishing or malicious content
- block: highly likely malicious

Best practices:
- verify sender authentication results
- check reply-to and sender domain mismatches
- inspect suspicious URLs and attachments
- confirm brand impersonation against known legitimate domains
- use the evidence list to understand why the score was raised`,
        },
      },
    ];
  }
}