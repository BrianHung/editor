"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markActive = void 0;
function markActive(state, type) {
    let { from, $from, to, empty } = state.selection;
    if (empty)
        return type.isInSet(state.storedMarks || $from.marks());
    else
        return state.doc.rangeHasMark(from, to, type);
}
exports.markActive = markActive;
