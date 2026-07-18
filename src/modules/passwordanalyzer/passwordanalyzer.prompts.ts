import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

/**
 * PasswordAnalyzer Prompts
 * 
 * TODO: Add description
 */
export class PasswordAnalyzerPrompts {
  @Prompt({
    name: 'passwordanalyzer-help',
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
