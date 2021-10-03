import type { Command } from "prosemirror-commands"
import { TextSelection } from "prosemirror-state"
/**
 * Creates a TextSelection on the entire textblock if the current selection is a cursor selection (an empty TextSelection).
 * https://prosemirror.net/docs/ref/#state.TextSelection.$cursor
 */
export const selectTextblock: Command = (state, dispatch) => {
  let {$cursor} = state.selection as TextSelection
  if (!$cursor || !$cursor.parent.isTextblock) return false
  if (dispatch) {
    dispatch(state.tr.setSelection(TextSelection.create(state.doc, $cursor.start(), $cursor.end())))
  }
  return true
}

export default selectTextblock
