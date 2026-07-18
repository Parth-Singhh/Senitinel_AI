import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

/**
 * FileRiskAnalyzer Prompts
 * 
 * TODO: Add description
 */
export class FileRiskAnalyzerPrompts {
  @Prompt({
    name: 'fileriskanalyzer-help',
    description: 'TODO: Add description',
  })
  async helpPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: 'TODO: Add prompt content',
        },
      },
    ];
  }
}
