"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_model_1 = require("prosemirror-model");
function pasteRule(regexp, type, getAttrs) {
    const handler = fragment => {
        const nodes = [];
        fragment.forEach(child => {
            if (child.isText) {
                const { text } = child;
                let pos = 0;
                let match;
                do {
                    match = regexp.exec(text);
                    if (match) {
                        const start = match.index;
                        const end = start + match[0].length;
                        const attrs = getAttrs instanceof Function ? getAttrs(match[0]) : getAttrs;
                        if (start > 0) {
                            nodes.push(child.cut(pos, start));
                        }
                        nodes.push(child
                            .cut(start, end)
                            .mark(type.create(attrs)
                            .addToSet(child.marks)));
                        pos = end;
                    }
                } while (match);
                if (pos < text.length) {
                    nodes.push(child.cut(pos));
                }
            }
            else {
                nodes.push(child.copy(handler(child.content)));
            }
        });
        return prosemirror_model_1.Fragment.fromArray(nodes);
    };
    return new prosemirror_state_1.Plugin({
        props: {
            transformPasted: slice => new prosemirror_model_1.Slice(handler(slice.content), slice.openStart, slice.openEnd),
        },
    });
}
exports.default = pasteRule;
