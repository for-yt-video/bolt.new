import { Markdown } from './Markdown';
import { modificationsRegex } from '~/utils/diff';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  // Match markdown image syntax: ![alt](data:image/...)
  const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/g;
  const images = Array.from(content.matchAll(imageRegex)).map(match => match[2]); // match[2] is the URL
  const textContent = content.replace(imageRegex, '').trim();

  return (
    <div className="overflow-hidden pt-[4px]">
      <Markdown limitedMarkdown>{sanitizeUserMessage(textContent)}</Markdown>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((imageData, index) => (
            <img
              key={index}
              src={imageData}
              alt={`User uploaded image ${index + 1}`}
              className="max-w-[300px] max-h-[300px] rounded object-contain"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function sanitizeUserMessage(content: string) {
  return content.replace(modificationsRegex, '').trim();
}
