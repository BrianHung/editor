import type { EditorState } from "prosemirror-state";

export function toggleChecked(state: EditorState, dispatch) {
  let {$from, $to} = state.selection, range = $from.blockRange($to);
  let firstLineOfTodoItem = range.depth >= 2 && range.$from.node(range.depth).type == state.schema.nodes.todoitem && range.startIndex == 0;
  if (!state.selection.empty || !firstLineOfTodoItem) return false
  if (dispatch) {
    // pos gets beginning of the first child of todo item
    let pos = state.selection.$from.pos - state.selection.$from.parentOffset - 1;
    let todoItem = state.tr.doc.resolve(pos).parent;
    // negative offset to go from first child to todo item itself
    dispatch(state.tr.setNodeMarkup(pos - 1, undefined, {checked: !todoItem.attrs.checked}));
  }
  return true
}