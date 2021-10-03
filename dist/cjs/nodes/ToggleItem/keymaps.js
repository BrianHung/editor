"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleToggled = void 0;
function toggleToggled(state, dispatch) {
    let { $from, $to } = state.selection, range = $from.blockRange($to);
    let firstLineOftoggleItem = range.depth >= 2 && range.$from.node(range.depth).type == state.schema.nodes.toggleitem && range.startIndex == 0;
    if (!state.selection.empty || !firstLineOftoggleItem)
        return false;
    if (dispatch) {
        let pos = state.selection.$from.pos - state.selection.$from.parentOffset - 1;
        let toggleItem = state.tr.doc.resolve(pos).parent;
        dispatch(state.tr.setNodeMarkup(pos - 1, undefined, { checked: !toggleItem.attrs.checked }));
    }
    return true;
}
exports.toggleToggled = toggleToggled;
