import { MODIFICATIONS_TAG_NAME } from '~/utils/constants';
import { allowedHTMLElements } from '~/utils/markdown';
import type { SystemPrompt } from './types';

interface PromptData {
  name: string;
  description: string;
  content: string;
}

export function loadPromptFromJSON(data: PromptData): SystemPrompt {
  return {
    name: data.name,
    description: data.description,
    getPrompt: (cwd?: string) => {
      // Replace template variables
      return data.content
        .replace('{allowedHTMLElements}', allowedHTMLElements.map((tagName) => `<${tagName}>`).join(', '))
        .replace('{MODIFICATIONS_TAG_NAME}', MODIFICATIONS_TAG_NAME)
        .replace('{cwd}', cwd || '');
    },
  };
} 