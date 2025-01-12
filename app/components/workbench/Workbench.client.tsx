import { useStore } from '@nanostores/react';
import type { FileSystemAPI } from '@webcontainer/api';
import JSZip from 'jszip';
import { computed } from 'nanostores';
import { memo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { WorkbenchContent } from './WorkbenchContent';
import { WorkbenchLayout } from './WorkbenchLayout';
import { WorkbenchToolbar } from './WorkbenchToolbar';
import type { OnChangeCallback as OnEditorChange, OnScrollCallback as OnEditorScroll, ScrollPosition } from '~/components/editor/codemirror/types';
import type { PreviewInfo } from '~/lib/stores/previews';
import { workbenchStore } from '~/lib/stores/workbench';
import { webcontainer } from '~/lib/webcontainer';
import { renderLogger } from '~/utils/logger';

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const Workbench = memo(({ chatStarted, isStreaming }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const hasPreview = useStore(computed(workbenchStore.previews, (previews: PreviewInfo[]) => previews.length > 0));
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);
  const files = useStore(workbenchStore.files);
  const selectedView = useStore(workbenchStore.currentView);
  const previews = useStore(workbenchStore.previews);

  const setSelectedView = (view: 'code' | 'preview') => {
    workbenchStore.currentView.set(view);
  };

  useEffect(() => {
    if (hasPreview) {
      setSelectedView('preview');
    }
  }, [hasPreview]);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update: { content: string }) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position: ScrollPosition) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error('Failed to update file content');
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  const onDownload = useCallback(async () => {
    try {
      const webcontainerInstance = await webcontainer;
      const files = await webcontainerInstance.fs.readdir('/', { withFileTypes: true });
      const zip = new JSZip();

      const processDirectory = async (
        dirPath: string,
        entries: Awaited<ReturnType<FileSystemAPI['readdir']>>,
      ) => {
        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;

          if (entry.isFile()) {
            const content = await webcontainerInstance.fs.readFile(fullPath);
            zip.file(fullPath.slice(1), content); // remove leading slash
          } else if (entry.isDirectory() && entry.name !== 'node_modules') {
            const subEntries = await webcontainerInstance.fs.readdir(fullPath, {
              withFileTypes: true,
            });
            await processDirectory(fullPath, subEntries);
          }
        }
      };

      await processDirectory('', files);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Project downloaded successfully');
    } catch (error) {
      console.error('Failed to download project:', error);
      toast.error('Failed to download project');
    }
  }, []);

  if (!chatStarted) {
    return null;
  }

  return (
    <WorkbenchLayout isOpen={showWorkbench}>
      <WorkbenchToolbar
        selectedView={selectedView}
        onViewChange={setSelectedView}
        onSave={onFileSave}
        onReset={onFileReset}
        onDownload={onDownload}
        isStreaming={isStreaming}
      />
      <WorkbenchContent
        selectedView={selectedView}
        currentDocument={currentDocument}
        selectedFile={selectedFile}
        files={files}
        unsavedFiles={unsavedFiles}
        preview={previews[0]}
        isStreaming={isStreaming}
        onFileSelect={onFileSelect}
        onEditorChange={onEditorChange}
        onEditorScroll={onEditorScroll}
        onFileSave={onFileSave}
        onFileReset={onFileReset}
      />
    </WorkbenchLayout>
  );
});
