import { Compartment, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { Theme } from '~/types/theme';
import type { EditorDocument } from '../types';
import { getLanguage } from '../languages';

const readOnlyCompartment = new Compartment();
const readOnlyTooltipStateEffect = StateEffect.define<boolean>();

export function setNoDocument(view: EditorView) {
  view.dispatch({
    effects: [
      readOnlyCompartment.reconfigure([EditorView.editable.of(false)]),
      readOnlyTooltipStateEffect.of(true),
    ],
  });
}

export async function setEditorDocument(
  view: EditorView,
  theme: Theme,
  editable: boolean,
  languageCompartment: Compartment,
  doc: EditorDocument,
) {
  const language = await getLanguage(doc.filePath);
  
  view.dispatch({
    effects: [
      readOnlyCompartment.reconfigure([EditorView.editable.of(editable)]),
      readOnlyTooltipStateEffect.of(!editable),
      languageCompartment.reconfigure(language ? [language] : []),
    ],
  });

  if (doc.scroll) {
    view.scrollDOM.scrollTop = doc.scroll.top;
    view.scrollDOM.scrollLeft = doc.scroll.left;
  }
} 