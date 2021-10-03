import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
export default function CursorNodeSelection(options) {
    let from, to;
    let clear;
    return new Plugin({
        props: {
            handleDOMEvents: {
                mousedown(view, event) {
                    if (!event.metaKey) {
                        return false;
                    }
                    console.log("MOUSEDOWN", event, event.metaKey);
                    from = view.posAtCoords({ left: event.x, top: event.y });
                    return false;
                },
                mousemove(view, event) {
                    if (!event.metaKey) {
                        return false;
                    }
                    to = view.posAtCoords({ left: event.x, top: event.y });
                    return true;
                },
                mouseup(view, event) {
                    if (!event.metaKey) {
                        return false;
                    }
                    to = view.posAtCoords({ left: event.x, top: event.y });
                    clear = true;
                    return true;
                },
            },
            decorations(state) {
                const decorations = [];
                if (from && to) {
                    const start = from.pos > to.pos ? to.pos : from.pos;
                    const end = from.pos > to.pos ? from.pos : to.pos;
                    state.doc.nodesBetween(start, end, (node, pos) => {
                        if (node.isTextblock || (node.isAtom && !node.isText)) {
                            decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-selectednode' }));
                        }
                        return node.isBlock;
                    });
                    if (clear) {
                        from = to = null;
                        clear = false;
                    }
                }
                return DecorationSet.create(state.doc, decorations);
            },
        },
    });
}
;
