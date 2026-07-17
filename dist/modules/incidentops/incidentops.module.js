var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { IncidentOpsTools } from './incidentops.tools.js';
import { IncidentOpsResources } from './incidentops.resources.js';
import { IncidentOpsPrompts } from './incidentops.prompts.js';
let IncidentOpsModule = class IncidentOpsModule {
};
IncidentOpsModule = __decorate([
    Module({
        name: 'incidentops',
        description: 'TODO: Add description',
        controllers: [IncidentOpsTools, IncidentOpsResources, IncidentOpsPrompts],
    })
], IncidentOpsModule);
export { IncidentOpsModule };
//# sourceMappingURL=incidentops.module.js.map