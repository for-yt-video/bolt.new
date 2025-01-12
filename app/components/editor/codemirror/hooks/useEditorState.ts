import { useEffect, useRef } from 'react';
import type { EditorState } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type { Theme } from '~/types/theme';
import type { EditorDocument, EditorSettings, OnChangeCallback, OnSaveCallback, OnScrollCallback } from '~/components/editor/codemirror/types';
import { newEditorState } from '~/components/editor/codemirror/utils/editorState';
import { setEditorDocument, setNoDocument } from '~/components/editor/codemirror/utils/editorConfig';
import { debounce } from '~/utils/debounce';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('useEditorState');

type EditorStates = Map<string, EditorState>;

interface UseEditorStateProps {
  view: EditorView | null;
  doc?: EditorDocument;
  theme: Theme;
  settings?: EditorSettings;
  editable?: boolean;
  languageCompartment: any;
  debounceChange?: number;
  debounceScroll?: number;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  onSave?: OnSaveCallback;
}

export function useEditorState({
  view,
  doc,
  theme,
  settings,
  editable = true,
  languageCompartment,
  debounceChange = 150,
  debounceScroll = 100,
  onChange,
  onScroll,
  onSave,
}: UseEditorStateProps) {
  const editorStatesRef = useRef<EditorStates>(new Map());
  const themeRef = useRef<Theme>(theme);
  const docRef = useRef<EditorDocument | null>(null);
  const onScrollRef = useRef(onScroll);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);

  // Update refs
  useEffect(() => {
    onScrollRef.current = onScroll;
    onChangeRef.current = onChange;
    onSaveRef.current = onSave;
    docRef.current = doc ?? null;
    themeRef.current = theme;
  });

  // Handle document changes
  useEffect(() => {
    if (!view) return;

    const editorStates = editorStatesRef.current;

    if (!doc) {
      const state = newEditorState('', theme, settings, onScrollRef, debounceScroll, onSaveRef, [
        languageCompartment.of([]),
      ]);
      if (state) {
        view.setState(state);
        setNoDocument(view);
      }
      return;
    }

    if (doc.isBinary) return;

    if (doc.filePath === '') {
      logger.warn('File path should not be empty');
    }

    let state = editorStates.get(doc.filePath);

    if (!state) {
      state = newEditorState(doc.value, theme, settings, onScrollRef, debounceScroll, onSaveRef, [
        languageCompartment.of([]),
      ]);
      if (state) {
        editorStates.set(doc.filePath, state);
      }
    }

    if (state) {
      view.setState(state);
      setEditorDocument(view, theme, editable, languageCompartment, doc);
    }
  }, [view, doc, theme, settings, editable, languageCompartment, debounceScroll]);

  return {
    editorStatesRef,
    themeRef,
    docRef,
    onScrollRef,
    onChangeRef,
    onSaveRef,
  };
} 