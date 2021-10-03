"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syntaxHighlight = void 0;
const highlight_1 = require("@codemirror/highlight");
const highlightStyle_js_1 = require("./highlightStyle.js");
function syntaxHighlight(text, support, callback, options = { match: highlightStyle_js_1.highlightStyle.match }) {
    let pos = 0;
    let tree = support.language.parser.parse(text);
    (0, highlight_1.highlightTree)(tree, options.match, (from, to, classes) => {
        from > pos && callback({ text: text.slice(pos, from), style: null, from: pos, to: from });
        callback({ text: text.slice(from, to), style: classes, from, to });
        pos = to;
    });
    pos != tree.length && callback({ text: text.slice(pos, tree.length), style: null, from: pos, to: tree.length });
}
exports.syntaxHighlight = syntaxHighlight;
