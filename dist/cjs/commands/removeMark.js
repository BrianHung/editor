"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function removeMark(type) {
    return (state, dispatch) => {
        const { tr, selection } = state;
        let { from, to } = selection;
        const { $from, empty } = selection;
        if (empty) {
            const range = utils_1.getMarkRange($from, type);
            if (range == false)
                return null;
            from = range.from;
            to = range.to;
        }
        tr.removeMark(from, to, type);
        return dispatch(tr);
    };
}
exports.default = removeMark;
