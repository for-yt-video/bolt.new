import type { PathWatcherEvent, WebContainer } from '@webcontainer/api';
import { map, type MapStore } from 'nanostores';
import { bufferWatchEvents } from '~/utils/buffer';
import { WORK_DIR } from '~/utils/constants';
import type { FileMap, Dirent } from './types';
import { FileContentManager } from './FileContentManager';

export class FileSystemWatcher {
  private files: MapStore<FileMap>;
  private size: number = 0;
  private contentManager: FileContentManager;

  constructor(private webcontainer: Promise<WebContainer>, files: MapStore<FileMap>) {
    this.files = files;
    this.contentManager = new FileContentManager();
    this.init();
  }

  get filesCount() {
    return this.size;
  }

  private async init() {
    const webcontainer = await this.webcontainer;

    webcontainer.internal.watchPaths(
      { include: [`${WORK_DIR}/**`], exclude: ['**/node_modules', '.git'], includeContent: true },
      bufferWatchEvents(100, this.processEventBuffer.bind(this)),
    );
  }

  private processEventBuffer(events: Array<[events: PathWatcherEvent[]]>) {
    const watchEvents = events.flat(2);

    for (const { type, path, buffer } of watchEvents) {
      // remove any trailing slashes
      const sanitizedPath = path.replace(/\/+$/g, '');

      switch (type) {
        case 'add_dir': {
          // we intentionally add a trailing slash so we can distinguish files from folders in the file tree
          this.files.setKey(sanitizedPath, { type: 'folder' });
          break;
        }
        case 'remove_dir': {
          this.files.setKey(sanitizedPath, undefined);

          for (const [direntPath] of Object.entries(this.files)) {
            if (direntPath.startsWith(sanitizedPath)) {
              this.files.setKey(direntPath, undefined);
            }
          }
          break;
        }
        case 'add_file':
        case 'change': {
          if (type === 'add_file') {
            this.size++;
          }

          const { content, isBinary } = this.contentManager.processFileContent(buffer);
          this.files.setKey(sanitizedPath, { type: 'file', content, isBinary });
          break;
        }
        case 'remove_file': {
          this.size--;
          this.files.setKey(sanitizedPath, undefined);
          break;
        }
        case 'update_directory': {
          // we don't care about these events
          break;
        }
      }
    }
  }
} 