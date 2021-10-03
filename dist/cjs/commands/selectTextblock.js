"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTextblock = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const selectTextblock = (state, dispatch) => {
    let { $cursor } = state.selection;
    if (!$cursor || !$cursor.parent.isTextblock)
        return false;
    if (dispatch) {
        dispatch(state.tr.setSelection(prosemirror_state_1.TextSelection.create(state.doc, $cursor.start(), $cursor.end())));
    }
    return true;
};
exports.selectTextblock = selectTextblock;
exports.default = exports.selectTextblock;
