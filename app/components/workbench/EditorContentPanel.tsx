import { memo, useMemo } from 'react';
import { Panel } from 'react-resizable-panels';
import { FileBreadcrumb } from './FileBreadcrumb';
import { CodeMirrorEditor } from '~/components/editor/codemirror/CodeMirrorEditor';
import type {
  EditorDocument,
  EditorSettings,
  OnChangeCallback as OnEditorChange,
  OnSaveCallback as OnEditorSave,
  OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/types';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import type { FileMap } from '~/lib/stores/files';
import type { Theme } from '~/types/theme';
import { isMobile } from '~/utils/mobile';

interface EditorContentPanelProps {
  files?: FileMap;
  editorDocument?: EditorDocument;
  isStreaming?: boolean;
  unsavedFiles?: Set<string>;
  theme: Theme;
  editorSettings: EditorSettings;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

export const EditorContentPanel = memo<EditorContentPanelProps>(
  ({
    files,
    editorDocument,
    isStreaming,
    unsavedFiles,
    theme,
    editorSettings,
    onEditorChange,
    onEditorScroll,
    onFileSelect,
    onFileSave,
    onFileReset,
  }) => {
    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }
      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return editorDocument !== undefined && unsavedFiles?.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    return (
      <Panel className="flex flex-col" defaultSize={80} minSize={20}>
        <PanelHeader className="overflow-x-auto">
          {activeFileSegments?.length && (
            <div className="flex items-center flex-1 text-sm">
              <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
              {activeFileUnsaved && (
                <div className="flex gap-1 ml-auto -mr-1.5">
                  <PanelHeaderButton onClick={onFileSave}>
                    <div className="i-ph:floppy-disk-duotone" />
                    Save
                  </PanelHeaderButton>
                  <PanelHeaderButton onClick={onFileReset}>
                    <div className="i-ph:clock-counter-clockwise-duotone" />
                    Reset
                  </PanelHeaderButton>
                </div>
              )}
            </div>
          )}
        </PanelHeader>
        <div className="h-full flex-1 overflow-hidden">
          <CodeMirrorEditor
            theme={theme}
            editable={!isStreaming && editorDocument !== undefined}
            settings={editorSettings}
            doc={editorDocument}
            autoFocusOnDocumentChange={!isMobile()}
            onScroll={onEditorScroll}
            onChange={onEditorChange}
            onSave={onFileSave}
          />
        </div>
      </Panel>
    );
  },
); 