import { Node } from "../../Node.js";
import { InputRule } from 'prosemirror-inputrules';
import { canInsert } from "../../utils/index.js";
export const HorizontalRule = (options) => Node(Object.assign({ name: "horizontalrule", attrs: { type: { default: null } }, group: "block", parseDOM: [{ tag: "hr", getAttrs: (dom) => ({ type: dom.dataset.type }) }], toDOM(node) { return ["hr", { "data-type": node.attrs.type }]; },
    commands({ nodeType }) {
        return {
            horizontalrule: attrs => (state, dispatch) => {
                if (!canInsert(state, nodeType))
                    return false;
                dispatch(state.tr.replaceSelectionWith(nodeType.create(attrs)));
                return true;
            }
        };
    },
    inputRules({ nodeType }) {
        return [
            new InputRule(/^(---|\*\*\*|___)\n$/, (state, match, start, end) => {
                const tr = state.tr;
                tr.replaceWith(start - 1, end, nodeType.create({ type: match[1] }));
                return tr;
            }),
            new InputRule(/^(—\-|—)\n$/, (state, match, start, end) => {
                const tr = state.tr;
                tr.replaceWith(start - 1, end, nodeType.create({ type: "---" }));
                return tr;
            })
        ];
    } }, options));
