import { atom, type WritableAtom } from 'nanostores';

export type WorkbenchViewType = 'code' | 'preview';

export class WorkbenchUIStore {
  showWorkbench: WritableAtom<boolean> = import.meta.hot?.data.showWorkbench ?? atom(false);
  currentView: WritableAtom<WorkbenchViewType> = import.meta.hot?.data.currentView ?? atom('code');

  constructor() {
    if (import.meta.hot) {
      import.meta.hot.data.showWorkbench = this.showWorkbench;
      import.meta.hot.data.currentView = this.currentView;
    }
  }

  setShowWorkbench(show: boolean) {
    this.showWorkbench.set(show);
  }

  setCurrentView(view: WorkbenchViewType) {
    this.currentView.set(view);
  }
} 