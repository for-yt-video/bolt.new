export interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
}

export interface Folder {
  type: 'folder';
}

export type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export interface FileModification {
  type: 'diff' | 'file';
  content: string;
}

export type FileModifications = Record<string, FileModification>; 