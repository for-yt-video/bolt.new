import { memo } from 'react';
import { EditorPanel } from './EditorPanel';
import { WorkbenchPreview } from './WorkbenchPreview';
import type { EditorDocument } from '~/components/editor/codemirror/types';
import type { OnChangeCallback as OnEditorChange, OnScrollCallback as OnEditorScroll } from '~/components/editor/codemirror/types';
import type { FileMap } from '~/lib/stores/files';
import type { PreviewInfo } from '~/lib/stores/previews';
import type { WorkbenchViewType } from '~/lib/stores/workbench';

interface WorkbenchContentProps {
  selectedView: WorkbenchViewType;
  currentDocument?: EditorDocument;
  selectedFile?: string;
  files: FileMap;
  unsavedFiles: Set<string>;
  preview?: PreviewInfo;
  isStreaming?: boolean;
  onFileSelect: (filePath: string | undefined) => void;
  onEditorChange: OnEditorChange;
  onEditorScroll: OnEditorScroll;
  onFileSave: () => void;
  onFileReset: () => void;
}

export const WorkbenchContent = memo(({
  selectedView,
  currentDocument,
  selectedFile,
  files,
  unsavedFiles,
  preview,
  isStreaming,
  onFileSelect,
  onEditorChange,
  onEditorScroll,
  onFileSave,
  onFileReset,
}: WorkbenchContentProps) => {
  return (
    <div className="relative flex-1 overflow-hidden">
      {selectedView === 'code' ? (
        <EditorPanel
          editorDocument={currentDocument}
          isStreaming={isStreaming}
          selectedFile={selectedFile}
          files={files}
          unsavedFiles={unsavedFiles}
          onFileSelect={onFileSelect}
          onEditorScroll={onEditorScroll}
          onEditorChange={onEditorChange}
          onFileSave={onFileSave}
          onFileReset={onFileReset}
        />
      ) : (
        <WorkbenchPreview
          preview={preview}
          isStreaming={isStreaming}
        />
      )}
    </div>
  );
}); 