"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectParentNode = exports.findNextSiblingNodeSelection = exports.findPrevSiblingNodeSelection = exports.findLastChildNodeSelection = exports.findFirstChildNodeSelection = exports.selectNextNodeSelection = exports.selectPrevNodeSelection = void 0;
const prosemirror_state_1 = require("prosemirror-state");
function selectPrevNodeSelection(state, dispatch, view) {
    if (!(state.selection instanceof prosemirror_state_1.NodeSelection) && state.selection.block) {
        return false;
    }
    let prevSelection;
    if ((prevSelection = findPrevSiblingNodeSelection(state))) {
        let lastSelection;
    }
    return true;
}
exports.selectPrevNodeSelection = selectPrevNodeSelection;
function selectNextNodeSelection(state, dispatch, view) {
    if (!(state.selection instanceof prosemirror_state_1.NodeSelection) && state.selection.block) {
        return false;
    }
    return true;
}
exports.selectNextNodeSelection = selectNextNodeSelection;
function findFirstChildNodeSelection(state) {
    const { $from, node } = state.selection;
    if (node.isAtom || node.isLeaf || node.childCount == 0)
        return;
    const child = node.firstChild;
}
exports.findFirstChildNodeSelection = findFirstChildNodeSelection;
function findLastChildNodeSelection(state) {
    const { $from, node } = state.selection;
    if (node.isAtom || node.isLeaf || node.childCount == 0)
        return;
    const child = node.lastChild;
}
exports.findLastChildNodeSelection = findLastChildNodeSelection;
function findPrevSiblingNodeSelection(state) {
    const { $to } = state.selection;
    let prevIndex = $to.indexAfter() - 2;
    if (prevIndex >= $to.parent.childCount)
        return;
    const pos = $to.posAtIndex(prevIndex);
    const selection = prosemirror_state_1.NodeSelection.create(state.doc, pos);
    selection.block = true;
    return selection;
}
exports.findPrevSiblingNodeSelection = findPrevSiblingNodeSelection;
function findNextSiblingNodeSelection(state) {
    const { $to } = state.selection;
    let nextIndex = $to.indexAfter();
    if (nextIndex >= $to.parent.childCount)
        return;
    const pos = $to.posAtIndex(nextIndex);
    const selection = prosemirror_state_1.NodeSelection.create(state.doc, pos);
    selection.block = true;
    return selection;
}
exports.findNextSiblingNodeSelection = findNextSiblingNodeSelection;
function selectParentNode(state, dispatch, view) {
    let { $from, to } = state.selection, pos;
    let same = $from.sharedDepth(to);
    if (same == 0)
        return false;
    pos = $from.before(same);
    if (dispatch) {
        const selection = prosemirror_state_1.NodeSelection.create(state.doc, pos);
        selection.block = true;
        dispatch(state.tr.setSelection(selection));
    }
    return true;
}
exports.selectParentNode = selectParentNode;
