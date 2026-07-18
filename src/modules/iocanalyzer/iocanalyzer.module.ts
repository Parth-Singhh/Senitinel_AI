import { Module } from '@nitrostack/core';
import { IocAnalyzerTools } from './iocanalyzer.tools.js';
import { IocAnalyzerResources } from './iocanalyzer.resources.js';
import { IocAnalyzerPrompts } from './iocanalyzer.prompts.js';

@Module({
  name: 'iocanalyzer',
  description: 'TODO: Add description',
  controllers: [IocAnalyzerTools, IocAnalyzerResources, IocAnalyzerPrompts],
})
export class IocAnalyzerModule {}
