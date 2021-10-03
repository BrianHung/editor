"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canInsert = void 0;
function canInsert(state, nodeType) {
    let $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType))
            return true;
    }
    return false;
}
exports.canInsert = canInsert;
