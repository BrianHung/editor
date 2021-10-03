import type { EditorState } from "prosemirror-state"
import type { Mark, MarkType } from "prosemirror-model"
/**
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
 */
export function markActive(state: EditorState, type: Mark | MarkType): boolean {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks()) as boolean
  else return state.doc.rangeHasMark(from, to, type)
}