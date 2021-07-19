"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
function CursorNodeSelection(options) {
    let from, to;
    let clear;
    return new prosemirror_state_1.Plugin({
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
                            decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { class: 'ProseMirror-selectednode' }));
                        }
                        return node.isBlock;
                    });
                    if (clear) {
                        from = to = null;
                        clear = false;
                    }
                }
                return prosemirror_view_1.DecorationSet.create(state.doc, decorations);
            },
        },
    });
}
exports.default = CursorNodeSelection;
;
