"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalNodeType = exports.findSelectedNodeOfType = exports.findParentNodeClosestToPos = exports.findParentNode = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const findParentNode = predicate => ({ $from }) => exports.findParentNodeClosestToPos($from, predicate);
exports.findParentNode = findParentNode;
const findParentNodeClosestToPos = ($pos, predicate) => {
    for (let i = $pos.depth; i > 0; i--) {
        const node = $pos.node(i);
        if (predicate(node)) {
            return {
                pos: i > 0 ? $pos.before(i) : 0,
                start: $pos.start(i),
                depth: i,
                node
            };
        }
    }
};
exports.findParentNodeClosestToPos = findParentNodeClosestToPos;
const findSelectedNodeOfType = nodeType => selection => {
    if (selection instanceof prosemirror_state_1.NodeSelection) {
        const { node, $from } = selection;
        if (exports.equalNodeType(nodeType, node)) {
            return { node, pos: $from.pos, depth: $from.depth };
        }
    }
};
exports.findSelectedNodeOfType = findSelectedNodeOfType;
const equalNodeType = (nodeType, node) => {
    return ((Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) ||
        node.type === nodeType);
};
exports.equalNodeType = equalNodeType;
function nodeIsActive(state, type, attrs = {}) {
    const predicate = node => node.type === type;
    const node = exports.findSelectedNodeOfType(type)(state.selection)
        || exports.findParentNode(predicate)(state.selection);
    if (!Object.keys(attrs).length || !node) {
        return !!node;
    }
    return node.node.hasMarkup(type, Object.assign(Object.assign({}, node.node.attrs), attrs));
}
exports.default = nodeIsActive;
