var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { IocAnalyzerTools } from './iocanalyzer.tools.js';
import { IocAnalyzerResources } from './iocanalyzer.resources.js';
import { IocAnalyzerPrompts } from './iocanalyzer.prompts.js';
let IocAnalyzerModule = class IocAnalyzerModule {
};
IocAnalyzerModule = __decorate([
    Module({
        name: 'iocanalyzer',
        description: 'TODO: Add description',
        controllers: [IocAnalyzerTools, IocAnalyzerResources, IocAnalyzerPrompts],
    })
], IocAnalyzerModule);
export { IocAnalyzerModule };
//# sourceMappingURL=iocanalyzer.module.js.map