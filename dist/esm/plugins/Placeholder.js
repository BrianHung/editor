import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TextSelection } from "prosemirror-state";
export default function Placeholder(options) {
    let cachedEmptyTopNode;
    return new Plugin({
        props: {
            decorations: ({ doc, selection }) => {
                const decorations = [];
                if (selection instanceof TextSelection && selection.$cursor) {
                    let pos = doc.resolve(selection.$cursor.pos);
                    pos.depth && decorations.push(Decoration.node(pos.before(), pos.after(), { class: 'ProseMirror-cursornode' }));
                }
                doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (node.isTextblock || (node.isAtom && !node.isText)) {
                        decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-activenode' }));
                    }
                    return node.isBlock;
                });
                doc.descendants((node, pos) => {
                    if (node.isTextblock || (node.isAtom && !node.isText)) {
                        const isEmpty = node.isTextblock && node.content.size === 0;
                        isEmpty && decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-emptynode' }));
                    }
                    return node.isBlock;
                });
                return DecorationSet.create(doc, decorations);
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
;
