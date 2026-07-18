import { Module } from '@nitrostack/core';
import { EmailHeaderAnalyzerTools } from './emailheaderanalyzer.tools.js';
import { EmailHeaderAnalyzerResources } from './emailheaderanalyzer.resources.js';
import { EmailHeaderAnalyzerPrompts } from './emailheaderanalyzer.prompts.js';

@Module({
  name: 'emailheaderanalyzer',
  description: 'TODO: Add description',
  controllers: [EmailHeaderAnalyzerTools, EmailHeaderAnalyzerResources, EmailHeaderAnalyzerPrompts],
})
export class EmailHeaderAnalyzerModule {}
