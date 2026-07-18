import { Module } from '@nitrostack/core';
import { ThreatAnalysisTools } from './threatanalysis.tools.js';
import { ThreatAnalysisResources } from './threatanalysis.resources.js';
import { ThreatAnalysisPrompts } from './threatanalysis.prompts.js';
import { EmailAnalysisService } from './email-analysis.service.js';

@Module({
  name: 'threatanalysis',
  description: 'Threat analysis module for phishing, URL, and vulnerability detection',
  controllers: [ThreatAnalysisTools, ThreatAnalysisResources, ThreatAnalysisPrompts],
  providers: [EmailAnalysisService],
})
export class ThreatAnalysisModule {}