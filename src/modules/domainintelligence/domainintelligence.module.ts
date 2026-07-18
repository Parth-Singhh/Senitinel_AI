import { Module } from '@nitrostack/core';
import { DomainIntelligenceTools } from './domainintelligence.tools.js';
import { DomainIntelligenceResources } from './domainintelligence.resources.js';
import { DomainIntelligencePrompts } from './domainintelligence.prompts.js';

@Module({
  name: 'domainintelligence',
  description: 'TODO: Add description',
  controllers: [DomainIntelligenceTools, DomainIntelligenceResources, DomainIntelligencePrompts],
})
export class DomainIntelligenceModule {}
