import { getSystemPrompt } from './prompts/index';
import { WORK_DIR } from '~/utils/constants';

export { getSystemPrompt, getAvailablePrompts } from './prompts/index';
export type { SystemPrompt } from './prompts/types';

// For backward compatibility
export const getDefaultSystemPrompt = (cwd: string = WORK_DIR) => getSystemPrompt('default', cwd);
