import { Module, McpApp } from '@nitrostack/core';
import { ThreatAnalysisModule } from './modules/threatanalysis/threatanalysis.module.js';
import { IncidentOpsModule } from './modules/incidentops/incidentops.module.js';
import { IocAnalyzerModule } from './modules/iocanalyzer/iocanalyzer.module.js';
import { PasswordAnalyzerModule } from './modules/passwordanalyzer/passwordanalyzer.module.js';
import { EmailHeaderAnalyzerModule } from './modules/emailheaderanalyzer/emailheaderanalyzer.module.js';
import { DomainIntelligenceModule } from './modules/domainintelligence/domainintelligence.module.js';
import { FileRiskAnalyzerModule } from './modules/fileriskanalyzer/fileriskanalyzer.module.js';
import { IncidentAdvisorModule } from './modules/incidentadvisor/incidentadvisor.module.js';

@McpApp({
  module: AppModule,
})
@Module({
  name: 'app',
  imports: [
    ThreatAnalysisModule,
    IncidentOpsModule,
    IocAnalyzerModule,
    PasswordAnalyzerModule,
    EmailHeaderAnalyzerModule,
    DomainIntelligenceModule,
    FileRiskAnalyzerModule,
    IncidentAdvisorModule,
  ],
})
export class AppModule {}