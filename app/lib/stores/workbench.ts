import type { ReadableAtom } from 'nanostores';
import { EditorStore } from './editor';
import { FilesStore, type FileMap } from './files';
import { PreviewsStore } from './previews';
import { TerminalStore } from './terminal';
import { ArtifactStore, type ArtifactState, type ArtifactUpdateState } from './artifacts/ArtifactStore';
import { DocumentStore } from './documents/DocumentStore';
import { WorkbenchUIStore, type WorkbenchViewType } from './ui/WorkbenchUIStore';
import type { EditorDocument } from '~/components/editor/codemirror/types';
import type { ActionCallbackData, ArtifactCallbackData } from '~/lib/runtime/message-parser';
import { webcontainer } from '~/lib/webcontainer';
import type { ITerminal } from '~/types/terminal';
import type { ScrollPosition } from '~/components/editor/codemirror/types';

export { type WorkbenchViewType } from './ui/WorkbenchUIStore';
export { type ArtifactState, type ArtifactUpdateState } from './artifacts/ArtifactStore';

export class WorkbenchStore {
  #previewsStore = new PreviewsStore(webcontainer);
  #filesStore = new FilesStore(webcontainer);
  #editorStore = new EditorStore(this.#filesStore);
  #terminalStore = new TerminalStore(webcontainer);
  #artifactStore = new ArtifactStore();
  #documentStore = new DocumentStore(this.#filesStore, this.#editorStore);
  #uiStore = new WorkbenchUIStore();

  constructor() {}

  // UI-related getters and setters
  get showWorkbench() {
    return this.#uiStore.showWorkbench;
  }

  get currentView() {
    return this.#uiStore.currentView;
  }

  setShowWorkbench(show: boolean) {
    this.#uiStore.setShowWorkbench(show);
  }

  // Preview-related getters
  get previews() {
    return this.#previewsStore.previews;
  }

  // File and Document-related getters and setters
  get files() {
    return this.#filesStore.files;
  }

  get currentDocument(): ReadableAtom<EditorDocument | undefined> {
    return this.#editorStore.currentDocument;
  }

  get selectedFile(): ReadableAtom<string | undefined> {
    return this.#editorStore.selectedFile;
  }

  get filesCount(): number {
    return this.#filesStore.filesCount;
  }

  get unsavedFiles() {
    return this.#documentStore.unsavedFiles;
  }

  setDocuments(files: FileMap) {
    this.#documentStore.setDocuments(files);
  }

  setCurrentDocumentContent(newContent: string) {
    this.#documentStore.setCurrentDocumentContent(newContent);
  }

  setCurrentDocumentScrollPosition(position: ScrollPosition) {
    this.#documentStore.setCurrentDocumentScrollPosition(position);
  }

  setSelectedFile(filePath: string | undefined) {
    this.#documentStore.setSelectedFile(filePath);
  }

  async saveFile(filePath: string) {
    await this.#documentStore.saveFile(filePath);
  }

  async saveCurrentDocument() {
    await this.#documentStore.saveCurrentDocument();
  }

  resetCurrentDocument() {
    this.#documentStore.resetCurrentDocument();
  }

  async saveAllFiles() {
    await this.#documentStore.saveAllFiles();
  }

  getFileModifcations() {
    return this.#documentStore.getFileModifcations();
  }

  resetAllFileModifications() {
    this.#documentStore.resetAllFileModifications();
  }

  // Terminal-related getters and methods
  get showTerminal() {
    return this.#terminalStore.showTerminal;
  }

  toggleTerminal(value?: boolean) {
    this.#terminalStore.toggleTerminal(value);
  }

  attachTerminal(terminal: ITerminal) {
    this.#terminalStore.attachTerminal(terminal);
  }

  onTerminalResize(cols: number, rows: number) {
    this.#terminalStore.onTerminalResize(cols, rows);
  }

  // Artifact-related getters and methods
  get firstArtifact() {
    return this.#artifactStore.firstArtifact;
  }

  get artifacts() {
    return this.#artifactStore.artifacts;
  }

  addArtifact(data: ArtifactCallbackData) {
    this.#artifactStore.addArtifact(data);
  }

  updateArtifact(data: ArtifactCallbackData, state: Partial<ArtifactUpdateState>) {
    this.#artifactStore.updateArtifact(data, state);
  }

  async addAction(data: ActionCallbackData) {
    await this.#artifactStore.addAction(data);
  }

  async runAction(data: ActionCallbackData) {
    await this.#artifactStore.runAction(data);
  }
}

export const workbenchStore = new WorkbenchStore();
