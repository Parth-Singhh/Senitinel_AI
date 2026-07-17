var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { ThreatAnalysisTools } from './threatanalysis.tools.js';
import { ThreatAnalysisResources } from './threatanalysis.resources.js';
import { ThreatAnalysisPrompts } from './threatanalysis.prompts.js';
let ThreatAnalysisModule = class ThreatAnalysisModule {
};
ThreatAnalysisModule = __decorate([
    Module({
        name: 'threatanalysis',
        description: 'TODO: Add description',
        controllers: [ThreatAnalysisTools, ThreatAnalysisResources, ThreatAnalysisPrompts],
    })
], ThreatAnalysisModule);
export { ThreatAnalysisModule };
//# sourceMappingURL=threatanalysis.module.js.map