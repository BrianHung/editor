import type { Command } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';
// import { selectionFromDOM } from "prosemirror-view/src/selection"
/**
 * DocView.enforceCursorAssoc
 * https://github.com/codemirror/view/blob/main/src/docview.ts
 *
 * moveToLineBoundary
 * https://github.com/codemirror/view/blob/main/src/cursor.ts
 */
function moveToTextblockLineBoundary(side: -1 | 1): Command {
	return function (state, dispatch, view) {
		let sel = state.selection,
			$pos = side < 0 ? sel.$from : sel.$to;
		let depth = $pos.depth;
		while ($pos.node(depth).isInline) {
			if (!depth) return false;
			depth--;
		}
		if (!$pos.node(depth).isTextblock) return false;
		if (dispatch) {
			// Browser workaround lack of caret associativity
			// https://github.com/w3c/selection-api/issues/32
			let sel = (view.root as any).getSelection();
			if (sel.modify) {
				sel.modify('move', side < 0 ? 'backward' : 'forward', 'lineboundary');
				// let newSel = selectionFromDOM(view, "pointer")
				// if (newSel && !state.selection.eq(newSel)) {
				// let tr = state.tr.setSelection(newSel)
				// dispatch(tr)
				// }
			} else {
				let coords = view.coordsAtPos($pos.pos);
				let blockRect = view.domAtPos($pos.pos).node.parentElement.getBoundingClientRect();
				let pos = view.posAtCoords({
					left: side < 0 ? blockRect.left + 1 : blockRect.right - 1,
					top: (coords.bottom + coords.top) / 2,
				});
				dispatch(state.tr.setSelection(TextSelection.create(state.doc, pos.pos)));
			}
		}
		return true;
	};
}

function extendToTextblockLineBoundary(side: -1 | 1): Command {
	return function (state, dispatch, view) {
		let sel = state.selection,
			$pos = side < 0 ? sel.$from : sel.$to;
		let depth = $pos.depth;
		while ($pos.node(depth).isInline) {
			if (!depth) return false;
			depth--;
		}
		if (!$pos.node(depth).isTextblock) return false;
		if (dispatch) {
			// Browser workaround lack of caret associativity
			// https://github.com/w3c/selection-api/issues/32
			let sel = (view.root as any).getSelection();
			if (sel.modify) {
				sel.modify('extend', side < 0 ? 'backward' : 'forward', 'lineboundary');
			} else {
				let coords = view.coordsAtPos($pos.pos);
				let blockRect = view.domAtPos($pos.pos).node.parentElement.getBoundingClientRect();
				let pos = view.posAtCoords({
					left: side < 0 ? blockRect.left + 1 : blockRect.right - 1,
					top: (coords.bottom + coords.top) / 2,
				});
				dispatch(state.tr.setSelection(TextSelection.create(state.doc, $pos.pos, pos.pos)));
			}
		}
		return true;
	};
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Moves the cursor to the start of current text block.
export const cursorTextblockBoundaryForward = moveToTextblockLineBoundary(1);

// :: (EditorState, ?(tr: Transaction)) → bool
// Moves the cursor to the end of current text block.
export const cursorTextblockBoundaryBackward = moveToTextblockLineBoundary(-1);

// :: (EditorState, ?(tr: Transaction)) → bool
// Moves the cursor to the start of current text block.
export const selectLineBoundaryForward = extendToTextblockLineBoundary(1);

// :: (EditorState, ?(tr: Transaction)) → bool
// Moves the cursor to the end of current text block.
export const selectLineBoundaryBackward = extendToTextblockLineBoundary(-1);
