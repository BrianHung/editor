"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeAttrs = void 0;
function getNodeAttrs(state, type) {
    const { from, to } = state.selection;
    let nodes = [];
    state.doc.nodesBetween(from, to, node => { nodes = [...nodes, node]; });
    const node = nodes.reverse().find(nodeItem => nodeItem.type.name === type.name);
    if (node)
        return node.attrs;
    return {};
}
exports.getNodeAttrs = getNodeAttrs;
