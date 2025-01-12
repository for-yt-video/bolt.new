import * as nodePath from 'node:path';
import type { WebContainer } from '@webcontainer/api';
import { map, type MapStore } from 'nanostores';
import { createScopedLogger } from '~/utils/logger';
import { unreachable } from '~/utils/unreachable';
import { FileSystemWatcher } from './FileSystemWatcher';
import { FileModificationTracker } from './FileModificationTracker';
import type { FileMap, File } from './types';

const logger = createScopedLogger('FilesStore');

export class FilesStore {
  private webcontainer: Promise<WebContainer>;
  private watcher: FileSystemWatcher;
  private modificationTracker: FileModificationTracker;

  files: MapStore<FileMap> = import.meta.hot?.data.files ?? map({});

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.webcontainer = webcontainerPromise;
    this.watcher = new FileSystemWatcher(webcontainerPromise, this.files);
    this.modificationTracker = new FileModificationTracker();

    if (import.meta.hot) {
      import.meta.hot.data.files = this.files;
    }
  }

  get filesCount() {
    return this.watcher.filesCount;
  }

  getFile(filePath: string): File | undefined {
    const dirent = this.files.get()[filePath];
    return dirent?.type === 'file' ? dirent : undefined;
  }

  getFileModifications() {
    return this.modificationTracker.getModifications(this.files.get());
  }

  resetFileModifications() {
    this.modificationTracker.reset();
  }

  async saveFile(filePath: string, content: string) {
    const webcontainer = await this.webcontainer;

    try {
      const relativePath = nodePath.relative(webcontainer.workdir, filePath);

      if (!relativePath) {
        throw new Error(`EINVAL: invalid file path, write '${relativePath}'`);
      }

      const oldContent = this.getFile(filePath)?.content;

      if (!oldContent) {
        unreachable('Expected content to be defined');
      }

      await webcontainer.fs.writeFile(relativePath, content);
      this.modificationTracker.trackModification(filePath, oldContent);

      // we immediately update the file and don't rely on the `change` event coming from the watcher
      this.files.setKey(filePath, { type: 'file', content, isBinary: false });

      logger.info('File updated');
    } catch (error) {
      logger.error('Failed to update file content\n\n', error);
      throw error;
    }
  }
} 