"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const prosemirror_state_2 = require("prosemirror-state");
function Placeholder(options) {
    let cachedEmptyTopNode;
    return new prosemirror_state_1.Plugin({
        props: {
            decorations: ({ doc, selection }) => {
                const decorations = [];
                if (selection instanceof prosemirror_state_2.TextSelection && selection.$cursor) {
                    let pos = doc.resolve(selection.$cursor.pos);
                    pos.depth && decorations.push(prosemirror_view_1.Decoration.node(pos.before(), pos.after(), { class: 'ProseMirror-cursornode' }));
                }
                doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (node.isTextblock || (node.isAtom && !node.isText)) {
                        decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-activenode' }));
                    }
                    return node.isBlock;
                });
                doc.descendants((node, pos) => {
                    if (node.isTextblock || (node.isAtom && !node.isText)) {
                        const isEmpty = node.isTextblock && node.content.size === 0;
                        isEmpty && decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-emptynode' }));
                    }
                    return node.isBlock;
                });
                return prosemirror_view_1.DecorationSet.create(doc, decorations);
            },
            attributes(state) {
                cachedEmptyTopNode = cachedEmptyTopNode || state.doc.type.createAndFill();
                let diff = cachedEmptyTopNode.content.findDiffStart(state.doc.content);
                if (diff == null) {
                    return { class: "ProseMirror-emptydoc" };
                }
            }
        },
    });
}
exports.default = Placeholder;
;
