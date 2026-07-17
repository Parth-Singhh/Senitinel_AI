import { Module } from '@nitrostack/core';
import { SystemHealthCheck } from './health/system.health';
import { IncidentOpsModule } from './modules/incidentops/incidentops.module';
import { ThreatAnalysisModule } from './modules/threatanalysis/threatanalysis.module';

@Module({
  name: 'app',
  imports: [
    IncidentOpsModule,
    ThreatAnalysisModule,
  ],
  providers: [SystemHealthCheck],
})
export class AppModule {}