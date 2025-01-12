import { createAnthropic } from '@ai-sdk/anthropic';

export function getAnthropicModel(apiKey: string, model: string = 'claude-3-5-sonnet-latest') {
  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic(model);
}
