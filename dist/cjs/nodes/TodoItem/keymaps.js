"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleChecked = void 0;
function toggleChecked(state, dispatch) {
    let { $from, $to } = state.selection, range = $from.blockRange($to);
    let firstLineOfTodoItem = range.depth >= 2 && range.$from.node(range.depth).type == state.schema.nodes.todoitem && range.startIndex == 0;
    if (!state.selection.empty || !firstLineOfTodoItem)
        return false;
    if (dispatch) {
        let pos = state.selection.$from.pos - state.selection.$from.parentOffset - 1;
        let todoItem = state.tr.doc.resolve(pos).parent;
        dispatch(state.tr.setNodeMarkup(pos - 1, undefined, { checked: !todoItem.attrs.checked }));
    }
    return true;
}
exports.toggleChecked = toggleChecked;
