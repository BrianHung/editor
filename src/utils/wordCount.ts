import type {EditorState} from "prosemirror-state";

export function countWords(state: EditorState) {
  return state.doc.textContent.split(/\W+/g).filter(Boolean).length;
}

export function countChars(state: EditorState) {
  return state.doc.textContent.length;
}