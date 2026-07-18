import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

/**
 * DomainIntelligence Prompts
 * 
 * TODO: Add description
 */
export class DomainIntelligencePrompts {
  @Prompt({
    name: 'domainintelligence-help',
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
