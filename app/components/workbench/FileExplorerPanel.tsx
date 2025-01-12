import { memo } from 'react';
import { Panel } from 'react-resizable-panels';
import { FileTree } from './FileTree';
import { PanelHeader } from '~/components/ui/PanelHeader';
import type { FileMap } from '~/lib/stores/files';
import { WORK_DIR } from '~/utils/constants';

interface FileExplorerPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  selectedFile?: string;
  onFileSelect?: (value?: string) => void;
}

export const FileExplorerPanel = memo<FileExplorerPanelProps>(({ files, unsavedFiles, selectedFile, onFileSelect }) => {
  return (
    <Panel defaultSize={20} minSize={10} collapsible>
      <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
        <PanelHeader>
          <div className="i-ph:tree-structure-duotone shrink-0" />
          Files
        </PanelHeader>
        <FileTree
          className="h-full"
          files={files}
          hideRoot
          unsavedFiles={unsavedFiles}
          rootFolder={WORK_DIR}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
        />
      </div>
    </Panel>
  );
}); 