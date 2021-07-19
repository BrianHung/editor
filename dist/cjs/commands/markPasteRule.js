"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_model_1 = require("prosemirror-model");
function markPasteRule(regexp, type, getAttrs) {
    const handler = (fragment, parent) => {
        const nodes = [];
        fragment.forEach(child => {
            if (child.isText) {
                const { text, marks } = child;
                let pos = 0;
                let match;
                const isLink = !!marks.filter(x => x.type.name === 'link')[0];
                while (!isLink && (match = regexp.exec(text)) !== null) {
                    if (parent.type.allowsMarkType(type) && match[1]) {
                        const start = match.index;
                        const end = start + match[0].length;
                        const textStart = start + match[0].indexOf(match[1]);
                        const textEnd = textStart + match[1].length;
                        const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
                        if (start > 0) {
                            nodes.push(child.cut(pos, start));
                        }
                        nodes.push(child
                            .cut(textStart, textEnd)
                            .mark(type.create(attrs)
                            .addToSet(child.marks)));
                        pos = end;
                    }
                }
                if (pos < text.length) {
                    nodes.push(child.cut(pos));
                }
            }
            else {
                nodes.push(child.copy(handler(child.content, child)));
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
exports.default = markPasteRule;
