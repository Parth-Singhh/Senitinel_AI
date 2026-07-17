import { Module } from '@nitrostack/core';
import { IncidentOpsModule } from './modules/incidentops/incidentops.module';
import { ThreatAnalysisModule } from './modules/threatanalysis/threatanalysis.module';

@Module({
  name: 'app',
  imports: [
    IncidentOpsModule,
    ThreatAnalysisModule,
  ],
})
export class AppModule {}