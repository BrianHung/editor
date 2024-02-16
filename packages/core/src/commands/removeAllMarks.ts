import type { Command } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';
/**
 * Removes all marks that exist in the current selection. If the selection is empty,
 * this applies to the storedMarks instead of a range of the document.
 * https://prosemirror.net/docs/ref/#commands.toggleMark
 * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 */
export const removeAllMarks: Command = (state, dispatch) => {
	let { empty, $cursor, ranges } = state.selection as TextSelection;
	if (empty && !$cursor) return false; // Checks that selection is TextSelection
	if (dispatch) {
		if ($cursor) {
			dispatch(state.tr.setStoredMarks([]));
		} else {
			let tr = state.tr;
			for (let i = 0; i < ranges.length; i++) {
				let { $from, $to } = ranges[i];
				tr.removeMark($from.pos, $to.pos);
			}
			dispatch(tr.scrollIntoView());
		}
	}
	return true;
};

export default removeAllMarks;
