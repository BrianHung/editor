import type { MarkType } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';
import { markApplies } from '../utils/markApplies';

/**
 * Modified version of `toggleMark` from `prosemirror-commands` that
 * removes the mark if any marks of that type exists for the entire
 * selection, or adds it otherwise.
 */
export function toggleMark(markType: MarkType, attrs): Command {
	return function (state, dispatch) {
		let { empty, $cursor, ranges } = state.selection as TextSelection;
		if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false;
		if (dispatch) {
			if ($cursor) {
				if (markType.isInSet(state.storedMarks || $cursor.marks())) dispatch(state.tr.removeStoredMark(markType));
				else dispatch(state.tr.addStoredMark(markType.create(attrs)));
			} else {
				// Checks that markType exists for the entire selection.
				let has = true,
					tr = state.tr;
				for (let i = 0; has && i < ranges.length; i++) {
					let { $from, $to } = ranges[i];
					has = has && state.doc.rangeHasMark($from.pos, $to.pos, markType);
				}
				for (let i = 0; i < ranges.length; i++) {
					let { $from, $to } = ranges[i];
					if (has) {
						tr.removeMark($from.pos, $to.pos, markType);
					} else {
						let from = $from.pos,
							to = $to.pos,
							start = $from.nodeAfter,
							end = $to.nodeBefore;
						let spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0;
						let spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0;
						if (from + spaceStart < to) {
							from += spaceStart;
							to -= spaceEnd;
						}
						tr.addMark(from, to, markType.create(attrs));
					}
				}
				dispatch(tr.scrollIntoView());
			}
		}
		return true;
	};
}

export default toggleMark;
