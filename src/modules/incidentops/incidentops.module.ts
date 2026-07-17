import { Module } from '@nitrostack/core';
import { IncidentOpsTools } from './incidentops.tools.js';
import { IncidentOpsResources } from './incidentops.resources.js';
import { IncidentOpsPrompts } from './incidentops.prompts.js';

@Module({
  name: 'incidentops',
  description: 'TODO: Add description',
  controllers: [IncidentOpsTools, IncidentOpsResources, IncidentOpsPrompts],
})
export class IncidentOpsModule {}
