function isSelectionEntirelyInsideFigcaption(state) {
    const { $from, $to } = state.selection;
    return $from.sameParent($to) && $from.parent.type === state.schema.nodes.figcaption;
}
import { chainCommands, newlineInCode, createParagraphNear, liftEmptyBlock } from "prosemirror-commands";
let enter = chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitFigcaption);
export function onEnterFigcaption(state, dispatch, view) {
    if (!isSelectionEntirelyInsideFigcaption(state))
        return false;
    if (enter(state, dispatch, view))
        return true;
    return false;
}
import { NodeSelection, TextSelection } from "prosemirror-state";
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
function splitFigcaption(state, dispatch) {
    const { $from, $to } = state.selection;
    if (state.selection instanceof NodeSelection) {
        return true;
    }
    if (dispatch) {
        var deflt = $from.depth < 2 ? null : defaultBlockAt($from.node(-2).contentMatchAt($from.indexAfter(-1)));
        var slice = $from.parent.slice($to.parentOffset);
        if (!deflt.validContent(slice.content)) {
            return false;
        }
        var nodeBelow = deflt.create(null, slice.content);
        var tr = state.tr;
        tr.delete($from.pos, $to.pos + ($to.parent.content.size - $to.parentOffset));
        tr.insert($from.pos, nodeBelow);
        var atBoundary = ($from.parentOffset == 0) || ($to.parentOffset == $to.parent.content.size);
        tr.setSelection(TextSelection.create(tr.doc, $from.pos + 3));
        dispatch(tr.scrollIntoView());
    }
    return true;
}
function findCutBefore($pos) {
    if (!$pos.parent.type.spec.isolating)
        for (let i = $pos.depth - 1; i >= 0; i--) {
            if ($pos.index(i) > 0)
                return $pos.doc.resolve($pos.before(i + 1));
            if ($pos.node(i).type.spec.isolating)
                break;
        }
    return null;
}
function isCursorRightBeforeFigure(state, view) {
    let { $cursor } = state.selection;
    if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) {
        return false;
    }
    let $cut = findCutBefore($cursor);
    return $cut && $cut.nodeBefore.type === state.schema.nodes.figure;
}
import { deleteSelection, joinBackward, selectNodeBackward } from "prosemirror-commands";
let backspace = chainCommands(deleteSelection, joinBackward, joinBackwardFigcaption, selectNodeBackward);
export function onBackspaceFigcaption(state, dispatch, view) {
    if (!isCursorRightBeforeFigure(state, view))
        return false;
    if (backspace(state, dispatch, view))
        return true;
    return false;
}
function joinMaybeClear(state, $pos, dispatch) {
    let before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index();
    if (!before || !after || !before.lastChild.type.compatibleContent(after.type)) {
        return false;
    }
    if (!$pos.parent.canReplace(index, index + 1) || !after.isTextblock) {
        return false;
    }
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
function joinBackwardFigcaption(state, dispatch, view) {
    let { $cursor } = state.selection;
    if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) {
        return false;
    }
    let $cut = findCutBefore($cursor);
    let before = $cut.nodeBefore, after = $cut.nodeAfter;
    if (before.type.spec.isolating || after.type.spec.isolating)
        return false;
    if (joinMaybeClear(state, $cut, dispatch))
        return true;
    return false;
}
