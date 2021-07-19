import { highlightTree } from "@codemirror/highlight";
import { highlightStyle } from "./highlightStyle";
export function syntaxHighlight(text, support, callback, options = { match: highlightStyle.match }) {
    let pos = 0;
    let tree = support.language.parseString(text);
    highlightTree(tree, options.match, (from, to, classes) => {
        from > pos && callback({ text: text.slice(pos, from), style: null, from: pos, to: from });
        callback({ text: text.slice(pos, from), style: classes, from, to });
        pos = to;
    });
    pos != tree.length && callback({ text: text.slice(pos, tree.length), style: null, from: pos, to: tree.length });
}
