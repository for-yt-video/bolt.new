import { computeFileModifications } from '~/utils/diff';
import type { FileMap, FileModifications } from './types';

export class FileModificationTracker {
  private modifiedFiles: Map<string, string> = new Map();

  trackModification(filePath: string, originalContent: string) {
    if (!this.modifiedFiles.has(filePath)) {
      this.modifiedFiles.set(filePath, originalContent);
    }
  }

  getModifications(files: FileMap): FileModifications | undefined {
    return computeFileModifications(files, this.modifiedFiles);
  }

  reset() {
    this.modifiedFiles.clear();
  }
} 