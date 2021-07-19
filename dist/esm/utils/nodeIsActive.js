import { NodeSelection } from 'prosemirror-state';
export const findParentNode = predicate => ({ $from }) => findParentNodeClosestToPos($from, predicate);
export const findParentNodeClosestToPos = ($pos, predicate) => {
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
export const findSelectedNodeOfType = nodeType => selection => {
    if (selection instanceof NodeSelection) {
        const { node, $from } = selection;
        if (equalNodeType(nodeType, node)) {
            return { node, pos: $from.pos, depth: $from.depth };
        }
    }
};
export const equalNodeType = (nodeType, node) => {
    return ((Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) ||
        node.type === nodeType);
};
export default function nodeIsActive(state, type, attrs = {}) {
    const predicate = node => node.type === type;
    const node = findSelectedNodeOfType(type)(state.selection)
        || findParentNode(predicate)(state.selection);
    if (!Object.keys(attrs).length || !node) {
        return !!node;
    }
    return node.node.hasMarkup(type, Object.assign(Object.assign({}, node.node.attrs), attrs));
}
