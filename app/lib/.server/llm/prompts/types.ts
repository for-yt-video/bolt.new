export interface SystemPrompt {
  name: string;
  description: string;
  getPrompt: (cwd?: string, model?: string) => string;
} 