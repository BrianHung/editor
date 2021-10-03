"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeInputRule = void 0;
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
function nodeInputRule(regexp, type, getAttrs) {
    return new prosemirror_inputrules_1.InputRule(regexp, (state, match, start, end) => {
        const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        const tr = state.tr;
        if (match[0]) {
            tr.replaceWith(start - 1, end, type.create(attrs));
        }
        return tr;
    });
}
exports.nodeInputRule = nodeInputRule;
