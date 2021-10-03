"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllMarks = void 0;
const removeAllMarks = (state, dispatch) => {
    let { empty, $cursor, ranges } = state.selection;
    if ((empty && !$cursor))
        return false;
    if (dispatch) {
        if ($cursor) {
            dispatch(state.tr.setStoredMarks([]));
        }
        else {
            let tr = state.tr;
            for (let i = 0; i < ranges.length; i++) {
                let { $from, $to } = ranges[i];
                tr.removeMark($from.pos, $to.pos);
            }
            dispatch(tr.scrollIntoView());
        }
    }
    return true;
};
exports.removeAllMarks = removeAllMarks;
exports.default = exports.removeAllMarks;
