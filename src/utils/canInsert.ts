import type { EditorState } from "prosemirror-state"
import type { NodeType } from "prosemirror-model"
/**
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
 */
export function canInsert(state: EditorState, nodeType: NodeType) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
  }
  return false
}