import { Mark, MarkType } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';

export function activeMarks(state: EditorState) {
	let { $from, $to, empty } = state.selection;
	if (empty) return state.storedMarks || $from.marks();
	else return $from.marksAcross($to) || [];
}

/**
 * Returns active marks of mark type at selection.
 * @param state
 * @param type
 * @returns
 */
export function activeMark(state: EditorState, type: Mark | MarkType) {
	return activeMarks(state).filter(mark => mark === type || mark.type === type);
}

/**
 * Returns attributes of mark type at selection if only one mark type is active.
 */
export function markAttrs(state: EditorState, type: Mark | MarkType) {
	const mark = activeMark(state, type);
	if (mark.length !== 1) return Object.create(null);
	return mark[0].attrs;
}

export default activeMarks;
