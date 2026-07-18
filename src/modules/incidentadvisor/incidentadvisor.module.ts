import { Module } from '@nitrostack/core';
import { IncidentAdvisorTools } from './incidentadvisor.tools.js';
import { IncidentAdvisorResources } from './incidentadvisor.resources.js';
import { IncidentAdvisorPrompts } from './incidentadvisor.prompts.js';

@Module({
  name: 'incidentadvisor',
  description: 'TODO: Add description',
  controllers: [IncidentAdvisorTools, IncidentAdvisorResources, IncidentAdvisorPrompts],
})
export class IncidentAdvisorModule {}
