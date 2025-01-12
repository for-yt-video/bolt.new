import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { getAPIKey } from '~/lib/.server/llm/api-key';
import { getAnthropicModel } from '~/lib/.server/llm/model';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
  state: 'result';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'> & {
  promptId?: string;
  systemPrompt?: string;
};

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  const headers = {
    'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    ...options?.headers,
  };

  const model = options?.headers?.['x-model-name'] as string;

  return _streamText({
    model: getAnthropicModel(getAPIKey(env), model),
    system: options?.systemPrompt || getSystemPrompt(options?.promptId, undefined, model),
    maxTokens: MAX_TOKENS,
    headers,
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
