import { memo } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { Slider, type SliderOptions } from '~/components/ui/Slider';
import type { WorkbenchViewType } from '~/lib/stores/workbench';

interface WorkbenchToolbarProps {
  selectedView: WorkbenchViewType;
  onViewChange: (view: WorkbenchViewType) => void;
  onSave: () => void;
  onReset: () => void;
  onDownload: () => void;
  isStreaming?: boolean;
}

export const WorkbenchToolbar = memo(({
  selectedView,
  onViewChange,
  onSave,
  onReset,
  onDownload,
  isStreaming,
}: WorkbenchToolbarProps) => {
  const sliderOptions: SliderOptions<WorkbenchViewType> = {
    left: { value: 'code', text: '', icon: 'i-ph:code-duotone text-lg' },
    right: { value: 'preview', text: '', icon: 'i-ph:device-mobile-duotone text-lg' },
  };

  return (
    <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor">
      <Slider
        selected={selectedView}
        options={sliderOptions}
        setSelected={(value) => onViewChange(value as WorkbenchViewType)}
      />
      <div className="flex items-center gap-1 ml-auto">
        <IconButton
          icon="i-ph:floppy-disk-duotone"
          title="Save"
          onClick={onSave}
          disabled={isStreaming}
        />
        <IconButton
          icon="i-ph:arrow-counter-clockwise"
          title="Reset"
          onClick={onReset}
          disabled={isStreaming}
        />
        <IconButton
          icon="i-ph:download"
          title="Download"
          onClick={onDownload}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
}); 