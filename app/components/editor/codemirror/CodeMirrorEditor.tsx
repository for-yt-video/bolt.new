import { Compartment, EditorSelection } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { memo, useEffect, useRef, useState } from 'react';
import { BinaryContent } from './BinaryContent';
import { useEditorState } from './hooks/useEditorState';
import type { EditorDocument, EditorSettings, EditorUpdate, OnChangeCallback, OnSaveCallback, OnScrollCallback } from './types';
import { debounce } from '~/utils/debounce';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import type { Theme } from '~/types/theme';
import { classNames } from '~/utils/classNames';

const logger = createScopedLogger('CodeMirrorEditor');

interface Props {
  theme: Theme;
  id?: unknown;
  doc?: EditorDocument;
  editable?: boolean;
  debounceChange?: number;
  debounceScroll?: number;
  autoFocusOnDocumentChange?: boolean;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  onSave?: OnSaveCallback;
  className?: string;
  settings?: EditorSettings;
}

export const CodeMirrorEditor = memo(
  ({
    id,
    doc,
    debounceScroll = 100,
    debounceChange = 150,
    autoFocusOnDocumentChange = false,
    editable = true,
    onScroll,
    onChange,
    onSave,
    theme,
    settings,
    className = '',
  }: Props) => {
    renderLogger.trace('CodeMirrorEditor');

    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [languageCompartment] = useState(new Compartment());

    const {
      editorStatesRef,
      themeRef,
      docRef,
      onScrollRef,
      onChangeRef,
      onSaveRef,
    } = useEditorState({
      view: viewRef.current,
      doc,
      theme,
      settings,
      editable,
      languageCompartment,
      debounceChange,
      debounceScroll,
      onChange,
      onScroll,
      onSave,
    });

    useEffect(() => {
      const onUpdate = debounce((update: EditorUpdate) => {
        onChangeRef.current?.(update);
      }, debounceChange);

      const view = new EditorView({
        parent: containerRef.current!,
        dispatchTransactions(transactions) {
          const previousSelection = view.state.selection;
          view.update(transactions);
          const newSelection = view.state.selection;

          const selectionChanged =
            newSelection !== previousSelection &&
            (newSelection === undefined || previousSelection === undefined || !newSelection.eq(previousSelection));

          if (docRef.current && (transactions.some((transaction) => transaction.docChanged) || selectionChanged)) {
            onUpdate({
              selection: view.state.selection,
              content: view.state.doc.toString(),
            });

            editorStatesRef.current!.set(docRef.current.filePath, view.state);
          }
        },
      });

      viewRef.current = view;

      return () => {
        viewRef.current?.destroy();
        viewRef.current = null;
      };
    }, []);

    if (doc?.isBinary) {
      return <BinaryContent />;
    }

    return (
      <div
        ref={containerRef}
        className={classNames('h-full w-full overflow-hidden', className)}
        style={{
          fontSize: settings?.fontSize,
        }}
      />
    );
  },
);

CodeMirrorEditor.displayName = 'CodeMirrorEditor';
