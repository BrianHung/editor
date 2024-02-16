import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

import { NodeSelection } from 'prosemirror-state';

/**
 * WIP
 * Source: https://github.com/ccorcos/prosemirror-examples/blob/master/src/components/BlockSelection.tsx
 */

type BlockSelection = NodeSelection & { block: true };

export function selectPrevNodeSelection(state: EditorState, dispatch, view: EditorView) {
	if (!(state.selection instanceof NodeSelection) && (state.selection as BlockSelection).block) {
		return false;
	}
	let prevSelection: BlockSelection | undefined;
	if ((prevSelection = findPrevSiblingNodeSelection(state))) {
		let lastSelection: BlockSelection | undefined;
	}
	return true;
}

export function selectNextNodeSelection(state: EditorState, dispatch, view: EditorView) {
	if (!(state.selection instanceof NodeSelection) && (state.selection as BlockSelection).block) {
		return false;
	}
	return true;
}

export function findFirstChildNodeSelection(state) {
	const { $from, node } = state.selection as BlockSelection;
	if (node.isAtom || node.isLeaf || node.childCount == 0) return; // no children
	const child = node.firstChild;
}

export function findLastChildNodeSelection(state) {
	const { $from, node } = state.selection as BlockSelection;
	if (node.isAtom || node.isLeaf || node.childCount == 0) return; // no children
	const child = node.lastChild;
}

export function findPrevSiblingNodeSelection(state: EditorState) {
	const { $to } = state.selection;
	let prevIndex = $to.indexAfter() - 2;
	if (prevIndex >= $to.parent.childCount) return; // first sibling, none exist before
	const pos = $to.posAtIndex(prevIndex);
	const selection = NodeSelection.create(state.doc, pos) as BlockSelection;
	selection.block = true;
	return selection;
}

export function findNextSiblingNodeSelection(state: EditorState) {
	const { $to } = state.selection;
	let nextIndex = $to.indexAfter();
	if (nextIndex >= $to.parent.childCount) return; // last sibling, none exist after
	const pos = $to.posAtIndex(nextIndex);
	const selection = NodeSelection.create(state.doc, pos) as BlockSelection;
	selection.block = true;
	return selection;
}

/**
 * Modification of selectParentNode where NodeSelection has block=true of.
 * Source: https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 */
export function selectParentNode(state: EditorState, dispatch, view: EditorView) {
	let { $from, to } = state.selection,
		pos;
	let same = $from.sharedDepth(to);
	if (same == 0) return false;
	pos = $from.before(same);
	if (dispatch) {
		const selection = NodeSelection.create(state.doc, pos) as BlockSelection;
		selection.block = true;
		dispatch(state.tr.setSelection(selection));
	}
	return true;
}
