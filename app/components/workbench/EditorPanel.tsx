import { useStore } from '@nanostores/react';
import { memo, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileExplorerPanel } from './FileExplorerPanel';
import { EditorContentPanel } from './EditorContentPanel';
import { TerminalPanel } from './TerminalPanel';
import type {
  EditorDocument,
  EditorSettings,
  OnChangeCallback as OnEditorChange,
  OnSaveCallback as OnEditorSave,
  OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/types';
import { shortcutEventEmitter } from '~/lib/hooks';
import type { FileMap } from '~/lib/stores/files';
import { themeStore } from '~/lib/stores/theme';
import { workbenchStore } from '~/lib/stores/workbench';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const DEFAULT_TERMINAL_SIZE = 25;
const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);
    const terminalToggledByShortcut = useRef(false);

    useEffect(() => {
      const unsubscribeFromEventEmitter = shortcutEventEmitter.on('toggleTerminal', () => {
        terminalToggledByShortcut.current = true;
      });

      return () => {
        unsubscribeFromEventEmitter();
      };
    }, []);

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <PanelGroup direction="horizontal">
            <FileExplorerPanel
              files={files}
              unsavedFiles={unsavedFiles}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
            <PanelResizeHandle />
            <EditorContentPanel
              files={files}
              editorDocument={editorDocument}
              isStreaming={isStreaming}
              unsavedFiles={unsavedFiles}
              theme={theme}
              editorSettings={editorSettings}
              onEditorChange={onEditorChange}
              onEditorScroll={onEditorScroll}
              onFileSelect={onFileSelect}
              onFileSave={onFileSave}
              onFileReset={onFileReset}
            />
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <TerminalPanel
          showTerminal={showTerminal}
          theme={theme}
          defaultSize={DEFAULT_TERMINAL_SIZE}
          terminalToggledByShortcut={terminalToggledByShortcut}
        />
      </PanelGroup>
    );
  },
);
