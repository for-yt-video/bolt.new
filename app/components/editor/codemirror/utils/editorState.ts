import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { EditorState, type Extension } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  scrollPastEnd,
} from '@codemirror/view';
import type { MutableRefObject } from 'react';
import { getTheme } from '../cm-theme';
import { indentKeyBinding } from '../indent';
import type { EditorSettings, OnSaveCallback, OnScrollCallback, ScrollPosition } from '../types';
import type { Theme } from '~/types/theme';
import { debounce } from '~/utils/debounce';

export function newEditorState(
  doc: string,
  theme: Theme,
  settings?: EditorSettings,
  onScrollRef?: MutableRefObject<OnScrollCallback | undefined>,
  debounceScroll?: number,
  onSaveRef?: MutableRefObject<OnSaveCallback | undefined>,
  additionalExtensions: Extension[] = [],
) {
  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightActiveLine(),
    history(),
    scrollPastEnd(),
    getTheme(theme),
    keymap.of([...defaultKeymap, ...searchKeymap, ...historyKeymap, indentKeyBinding]),
    EditorState.tabSize.of(settings?.tabSize ?? 2),
    ...additionalExtensions,
  ];

  if (onScrollRef && debounceScroll) {
    const debouncedScroll = debounce((position: ScrollPosition) => {
      onScrollRef.current?.(position);
    }, debounceScroll);

    extensions.push(
      EditorView.domEventHandlers({
        scroll: (event, view) => {
          if (event.target === view.scrollDOM) {
            debouncedScroll({
              top: view.scrollDOM.scrollTop,
              left: view.scrollDOM.scrollLeft,
            });
          }
        },
      })
    );
  }

  if (onSaveRef) {
    extensions.push(
      keymap.of([
        {
          key: 'Mod-s',
          run: () => {
            onSaveRef.current?.();
            return true;
          },
        },
      ]),
    );
  }

  return EditorState.create({
    doc,
    extensions,
  });
} 