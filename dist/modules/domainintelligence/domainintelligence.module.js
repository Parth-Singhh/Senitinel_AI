var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { DomainIntelligenceTools } from './domainintelligence.tools.js';
import { DomainIntelligenceResources } from './domainintelligence.resources.js';
import { DomainIntelligencePrompts } from './domainintelligence.prompts.js';
let DomainIntelligenceModule = class DomainIntelligenceModule {
};
DomainIntelligenceModule = __decorate([
    Module({
        name: 'domainintelligence',
        description: 'TODO: Add description',
        controllers: [DomainIntelligenceTools, DomainIntelligenceResources, DomainIntelligencePrompts],
    })
], DomainIntelligenceModule);
export { DomainIntelligenceModule };
//# sourceMappingURL=domainintelligence.module.js.map