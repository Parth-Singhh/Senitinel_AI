import { Module } from '@nitrostack/core';
import { FileRiskAnalyzerTools } from './fileriskanalyzer.tools.js';
import { FileRiskAnalyzerResources } from './fileriskanalyzer.resources.js';
import { FileRiskAnalyzerPrompts } from './fileriskanalyzer.prompts.js';

@Module({
  name: 'fileriskanalyzer',
  description: 'TODO: Add description',
  controllers: [FileRiskAnalyzerTools, FileRiskAnalyzerResources, FileRiskAnalyzerPrompts],
})
export class FileRiskAnalyzerModule {}
