import defaultPromptData from './data/default.json';
import minimalPromptData from './data/minimal.json';
import piratePromptData from './data/pirate.json';
import babyYodaPromptData from './data/baby-yoda.json';
import { loadPromptFromJSON } from './loader';
import type { SystemPrompt } from './types';

export const prompts: Record<string, SystemPrompt> = {
  default: loadPromptFromJSON(defaultPromptData),
  minimal: loadPromptFromJSON(minimalPromptData),
  pirate: loadPromptFromJSON(piratePromptData),
  'baby-yoda': loadPromptFromJSON(babyYodaPromptData),
};

export const getSystemPrompt = (promptId: string = 'default', cwd?: string, model?: string): string => {
  const prompt = prompts[promptId];
  if (!prompt) {
    throw new Error(`System prompt "${promptId}" not found`);
  }
  return prompt.getPrompt(cwd, model);
};

export const getAvailablePrompts = (): Array<{ id: string; name: string; description: string }> => {
  return Object.entries(prompts).map(([id, prompt]) => ({
    id,
    name: prompt.name,
    description: prompt.description,
  }));
};

export type { SystemPrompt }; 