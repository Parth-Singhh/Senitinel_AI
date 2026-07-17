import { Module } from '@nitrostack/core';
import { ThreatAnalysisTools } from './threatanalysis.tools';
import { ThreatAnalysisResources } from './threatanalysis.resources';
import { ThreatAnalysisPrompts } from './threatanalysis.prompts';
import { EmailAnalysisService } from './email-analysis.service';

@Module({
  name: 'threatanalysis',
  description: 'Threat analysis module for phishing, URL, and vulnerability detection',
  controllers: [ThreatAnalysisTools, ThreatAnalysisResources, ThreatAnalysisPrompts],
  providers: [EmailAnalysisService],
})
export class ThreatAnalysisModule {}