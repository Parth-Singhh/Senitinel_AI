var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, McpApp } from '@nitrostack/core';
import { ThreatAnalysisModule } from './modules/threatanalysis/threatanalysis.module.js';
import { IncidentOpsModule } from './modules/incidentops/incidentops.module.js';
import { IocAnalyzerModule } from './modules/iocanalyzer/iocanalyzer.module.js';
import { PasswordAnalyzerModule } from './modules/passwordanalyzer/passwordanalyzer.module.js';
import { EmailHeaderAnalyzerModule } from './modules/emailheaderanalyzer/emailheaderanalyzer.module.js';
import { DomainIntelligenceModule } from './modules/domainintelligence/domainintelligence.module.js';
import { FileRiskAnalyzerModule } from './modules/fileriskanalyzer/fileriskanalyzer.module.js';
import { IncidentAdvisorModule } from './modules/incidentadvisor/incidentadvisor.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
    }),
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map