var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { PasswordAnalyzerTools } from './passwordanalyzer.tools.js';
import { PasswordAnalyzerResources } from './passwordanalyzer.resources.js';
import { PasswordAnalyzerPrompts } from './passwordanalyzer.prompts.js';
let PasswordAnalyzerModule = class PasswordAnalyzerModule {
};
PasswordAnalyzerModule = __decorate([
    Module({
        name: 'passwordanalyzer',
        description: 'TODO: Add description',
        controllers: [PasswordAnalyzerTools, PasswordAnalyzerResources, PasswordAnalyzerPrompts],
    })
], PasswordAnalyzerModule);
export { PasswordAnalyzerModule };
//# sourceMappingURL=passwordanalyzer.module.js.map