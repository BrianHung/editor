import type { Mark, MarkType } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
/**
 * TODO: Check mark attrs.
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
 */
export function markActive(state: EditorState, type: Mark | MarkType): boolean {
	let { from, $from, to, empty } = state.selection;
	if (empty) return Boolean(type.isInSet(state.storedMarks || $from.marks()));
	else return state.doc.rangeHasMark(from, to, type);
}
