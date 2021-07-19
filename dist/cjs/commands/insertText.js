"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertText(text = '') {
    return (state, dispatch) => {
        const { $from } = state.selection;
        const { pos } = $from.pos;
        dispatch(state.tr.insertText(text, pos));
        return true;
    };
}
exports.default = insertText;
