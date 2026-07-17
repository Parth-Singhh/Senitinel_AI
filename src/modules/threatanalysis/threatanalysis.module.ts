import { Module } from '@nitrostack/core';
import { ThreatAnalysisTools } from './threatanalysis.tools.js';
import { ThreatAnalysisResources } from './threatanalysis.resources.js';
import { ThreatAnalysisPrompts } from './threatanalysis.prompts.js';

@Module({
  name: 'threatanalysis',
  description: 'TODO: Add description',
  controllers: [ThreatAnalysisTools, ThreatAnalysisResources, ThreatAnalysisPrompts],
})
export class ThreatAnalysisModule {}
