"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markInputRule = void 0;
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
function getMarksBetween(start, end, state) {
    let marks = [];
    state.doc.nodesBetween(start, end, (node, pos) => {
        marks = [...marks, ...node.marks.map(mark => ({ start: pos, end: pos + node.nodeSize, mark }))];
    });
    return marks;
}
function markInputRule(regexp, markType, getAttrs) {
    return new prosemirror_inputrules_1.InputRule(regexp, (state, match, start, end) => {
        const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        const tr = state.tr;
        const m = match.length - 1;
        let markEnd = end;
        let markStart = start;
        if (match[m]) {
            const matchStart = start + match[0].indexOf(match[m - 1]);
            const matchEnd = matchStart + match[m - 1].length - 1;
            const textStart = matchStart + match[m - 1].lastIndexOf(match[m]);
            const textEnd = textStart + match[m].length;
            const excludedMarks = getMarksBetween(start, end, state)
                .filter(item => item.mark.type.excludes(markType))
                .filter(item => item.end > matchStart);
            if (excludedMarks.length)
                return null;
            (textEnd < matchEnd) && tr.delete(textEnd, matchEnd);
            (textStart > matchStart) && tr.delete(matchStart, textStart);
            markStart = matchStart;
            markEnd = markStart + match[m].length;
        }
        tr.addMark(markStart, markEnd, markType.create(attrs));
        tr.removeStoredMark(markType);
        return tr;
    });
}
exports.markInputRule = markInputRule;
