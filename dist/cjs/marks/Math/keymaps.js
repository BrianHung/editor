"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMath = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const deleteMath = (state, dispatch, view) => {
    const { tr, selection: { $from: from, $to: to, $cursor } } = state;
    if (!from.sameParent(to))
        return false;
    const rborder = from.parent.type !== state.schema.nodes.math
        && from.doc.resolve(from.pos - 1).parent.type === state.schema.nodes.math;
    if (rborder) {
        const mathNode = from.doc.resolve(from.pos - 1).parent;
        const startPos = from.pos;
        tr.replaceRangeWith(startPos - mathNode.nodeSize, startPos, state.schema.text("$" + mathNode.textContent));
        const selection = prosemirror_state_1.Selection.near(tr.doc.resolve(startPos), -1);
        tr.setSelection(selection).scrollIntoView();
        dispatch(tr);
        return true;
    }
    const lborder = from.parent.type === state.schema.nodes.math
        && from.doc.resolve(from.pos - 1).parent.type !== state.schema.nodes.math;
    if (lborder) {
        const mathNode = from.parent;
        const startPos = from.pos - 1;
        tr.replaceRangeWith(startPos, startPos + mathNode.nodeSize, state.schema.text(mathNode.textContent + "$"));
        const selection = prosemirror_state_1.Selection.near(tr.doc.resolve(startPos), 1);
        tr.setSelection(selection).scrollIntoView();
        dispatch(tr);
        return true;
    }
    const textLength = $cursor ? $cursor.node().textContent.length : 0;
    if (textLength == 1) {
        tr.delete($cursor.pos - 1, $cursor.pos);
        dispatch(tr);
        return true;
    }
    return false;
};
exports.deleteMath = deleteMath;
function isSelectionEntirelyInsideMath(state) {
    return state.selection.$from.sameParent(state.selection.$to) &&
        state.selection.$from.parent.type === state.schema.nodes.math;
}
