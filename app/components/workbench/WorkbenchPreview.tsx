import { memo } from 'react';
import { Preview } from './Preview';
import type { PreviewInfo } from '~/lib/stores/previews';

interface WorkbenchPreviewProps {
  preview?: PreviewInfo;
  isStreaming?: boolean;
  onClose?: () => void;
}

export const WorkbenchPreview = memo(({ preview }: WorkbenchPreviewProps) => {
  if (!preview) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Preview />
      </div>
    </div>
  );
}); 