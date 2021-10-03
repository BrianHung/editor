import { NodeSelection } from "prosemirror-state";
export function selectPrevNodeSelection(state, dispatch, view) {
    if (!(state.selection instanceof NodeSelection) && state.selection.block) {
        return false;
    }
    let prevSelection;
    if ((prevSelection = findPrevSiblingNodeSelection(state))) {
        let lastSelection;
    }
    return true;
}
export function selectNextNodeSelection(state, dispatch, view) {
    if (!(state.selection instanceof NodeSelection) && state.selection.block) {
        return false;
    }
    return true;
}
export function findFirstChildNodeSelection(state) {
    const { $from, node } = state.selection;
    if (node.isAtom || node.isLeaf || node.childCount == 0)
        return;
    const child = node.firstChild;
}
export function findLastChildNodeSelection(state) {
    const { $from, node } = state.selection;
    if (node.isAtom || node.isLeaf || node.childCount == 0)
        return;
    const child = node.lastChild;
}
export function findPrevSiblingNodeSelection(state) {
    const { $to } = state.selection;
    let prevIndex = $to.indexAfter() - 2;
    if (prevIndex >= $to.parent.childCount)
        return;
    const pos = $to.posAtIndex(prevIndex);
    const selection = NodeSelection.create(state.doc, pos);
    selection.block = true;
    return selection;
}
export function findNextSiblingNodeSelection(state) {
    const { $to } = state.selection;
    let nextIndex = $to.indexAfter();
    if (nextIndex >= $to.parent.childCount)
        return;
    const pos = $to.posAtIndex(nextIndex);
    const selection = NodeSelection.create(state.doc, pos);
    selection.block = true;
    return selection;
}
export function selectParentNode(state, dispatch, view) {
    let { $from, to } = state.selection, pos;
    let same = $from.sharedDepth(to);
    if (same == 0)
        return false;
    pos = $from.before(same);
    if (dispatch) {
        const selection = NodeSelection.create(state.doc, pos);
        selection.block = true;
        dispatch(state.tr.setSelection(selection));
    }
    return true;
}
