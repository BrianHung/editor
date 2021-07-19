import Node from '../Node';
import { nodeInputRule } from '../../commands';
export default class HorizontalRule extends Node {
    get name() {
        return "horizontalrule";
    }
    get schema() {
        return {
            attrs: { type: { default: null } },
            group: "block",
            parseDOM: [{ tag: "hr", getAttrs: (dom) => ({ type: dom.dataset.type }) }],
            toDOM(node) { return ["hr", { "data-type": node.attrs.type }]; },
        };
    }
    commands({ nodeType }) {
        return (attrs) => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(nodeType.create(attrs)));
    }
    inputRules({ nodeType }) {
        return [
            nodeInputRule(/^(?:---|\*\*\*|___)$/, nodeType, (match) => {
                const [type] = match;
                return { type };
            }),
        ];
    }
}
