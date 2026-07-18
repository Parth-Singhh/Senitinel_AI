import { Module, McpApp } from '@nitrostack/core';
import { ThreatAnalysisModule } from './modules/threatanalysis/threatanalysis.module.js';
import { IncidentOpsModule } from './modules/incidentops/incidentops.module.js';
import { IocAnalyzerModule } from './modules/iocanalyzer/iocanalyzer.module.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'Sentinel AI',
    version: '1.0.0',
  },
})
@Module({
  name: 'app',
  imports: [ThreatAnalysisModule, IncidentOpsModule, IocAnalyzerModule],
})
export class AppModule {} 