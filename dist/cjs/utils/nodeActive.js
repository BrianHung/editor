"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapTypeActive = exports.blockTypeActive = void 0;
function blockTypeActive(state, nodeType, attrs = null) {
    let { $from, to, node } = state.selection;
    if (node)
        return node.hasMarkup(nodeType, attrs);
    return to <= $from.end() && $from.parent.hasMarkup(nodeType, attrs);
}
exports.blockTypeActive = blockTypeActive;
function wrapTypeActive(state, nodeType, attrs = null) {
    let { $from, to, node } = state.selection;
    if (node)
        return node.hasMarkup(nodeType, attrs);
    if (to <= $from.end()) {
        for (let i = 0; i < $from.depth; i++) {
            if ($from.node($from.depth - i).hasMarkup(nodeType, attrs))
                return true;
        }
    }
    return false;
}
exports.wrapTypeActive = wrapTypeActive;
