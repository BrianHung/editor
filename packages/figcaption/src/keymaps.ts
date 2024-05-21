function isSelectionEntirelyInsideFigcaption(state) {
	const { $from, $to } = state.selection;
	return $from.sameParent($to) && $from.parent.type === state.schema.nodes.figcaption;
}

import { chainCommands, createParagraphNear, liftEmptyBlock, newlineInCode } from 'prosemirror-commands';
// default enter handler except splitBlock replaced with splitFigcaption
let enter = chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitFigcaption);

export function onEnterFigcaption(state, dispatch, view) {
	if (!isSelectionEntirelyInsideFigcaption(state)) return false;
	if (enter(state, dispatch, view)) return true;
	return false;
}

import type { EditorState } from 'prosemirror-state';
import { NodeSelection, TextSelection } from 'prosemirror-state';

function defaultBlockAt(match) {
	for (var i = 0; i < match.edgeCount; i++) {
		var ref = match.edge(i);
		var type = ref.type;
		if (type.isTextblock && !type.hasRequiredAttrs()) {
			return type;
		}
	}
	return null;
}

function splitFigcaption(state: EditorState, dispatch) {
	const { $from, $to } = state.selection;
	if (state.selection instanceof NodeSelection) {
		return true;
	} // no-op
	if (dispatch) {
		var deflt = $from.depth < 2 ? null : defaultBlockAt($from.node(-2).contentMatchAt($from.indexAfter(-1)));
		var slice = $from.parent.slice($to.parentOffset); // slice from right of selection to end of block
		if (!deflt.validContent(slice.content)) {
			return false;
		}
		var nodeBelow = deflt.create(null, slice.content);
		var tr = state.tr;
		tr.delete($from.pos, $to.pos + ($to.parent.content.size - $to.parentOffset)); // delete start of selection to end of figcaption
		tr.insert($from.pos, nodeBelow); // insert new node at start of selection
		var atBoundary = $from.parentOffset == 0 || $to.parentOffset == $to.parent.content.size;
		tr.setSelection(TextSelection.create(tr.doc, $from.pos + 3)); // selection at start of nodeBelow; depth 2 + deflt depth
		dispatch(tr.scrollIntoView());
	}
	return true;
}

function findCutBefore($pos) {
	if (!$pos.parent.type.spec.isolating)
		for (let i = $pos.depth - 1; i >= 0; i--) {
			if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1));
			if ($pos.node(i).type.spec.isolating) break;
		}
	return null;
}

function isCursorRightBeforeFigure(state, view) {
	let { $cursor } = state.selection;
	if (!$cursor || (view ? !view.endOfTextblock('backward', state) : $cursor.parentOffset > 0)) {
		return false;
	}
	let $cut = findCutBefore($cursor);
	return $cut && $cut.nodeBefore.type === state.schema.nodes.figure;
}

import { deleteSelection, joinBackward, selectNodeBackward } from 'prosemirror-commands';
let backspace = chainCommands(deleteSelection, joinBackward, joinBackwardFigcaption, selectNodeBackward);

export function onBackspaceFigcaption(state, dispatch, view) {
	if (!isCursorRightBeforeFigure(state, view)) return false;
	if (backspace(state, dispatch, view)) return true;
	return false;
}

function joinMaybeClear(state, $pos, dispatch) {
	let before = $pos.nodeBefore,
		after = $pos.nodeAfter,
		index = $pos.index();
	if (!before || !after || !before.lastChild.type.compatibleContent(after.type)) {
		return false;
	} // check node after is compatible with figcaption
	if (!$pos.parent.canReplace(index, index + 1) || !after.isTextblock) {
		return false;
	} // check if can replace node after and node after is textblock
	if (dispatch) {
		var tr = state.tr;
		tr.clearIncompatible($pos.pos, before.lastChild.type, before.contentMatchAt(before.childCount));
		var slice = after.slice(0);
		tr.deleteRange($pos.pos, $pos.pos + 1);
		const endPos = $pos.pos - 2;
		tr.insert(endPos, slice.content);
		tr.setSelection(TextSelection.create(tr.doc, endPos));
		dispatch(tr.scrollIntoView());
	}
	return true;
}

function joinBackwardFigcaption(state: EditorState, dispatch, view) {
	// @ts-ignore
	let { $cursor } = state.selection;
	if (!$cursor || (view ? !view.endOfTextblock('backward', state) : $cursor.parentOffset > 0)) {
		return false;
	}
	let $cut = findCutBefore($cursor);
	let before = $cut.nodeBefore,
		after = $cut.nodeAfter;
	if (before.type.spec.isolating || after.type.spec.isolating) return false;
	if (joinMaybeClear(state, $cut, dispatch)) return true;
	return false;
}
