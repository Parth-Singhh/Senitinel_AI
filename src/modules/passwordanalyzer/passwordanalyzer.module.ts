import { Module } from '@nitrostack/core';
import { PasswordAnalyzerTools } from './passwordanalyzer.tools.js';
import { PasswordAnalyzerResources } from './passwordanalyzer.resources.js';
import { PasswordAnalyzerPrompts } from './passwordanalyzer.prompts.js';

@Module({
  name: 'passwordanalyzer',
  description: 'TODO: Add description',
  controllers: [PasswordAnalyzerTools, PasswordAnalyzerResources, PasswordAnalyzerPrompts],
})
export class PasswordAnalyzerModule {}
