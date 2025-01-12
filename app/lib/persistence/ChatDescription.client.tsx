import { useStore } from '@nanostores/react';
import { description } from './useChatHistory';

export function ChatDescription() {
  const chatDescription = useStore(description);
  return <span data-chat-description>{chatDescription}</span>;
}
