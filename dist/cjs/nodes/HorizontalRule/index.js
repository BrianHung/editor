"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalRule = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const index_js_1 = require("../../utils/index.js");
const HorizontalRule = (options) => (0, Node_js_1.Node)(Object.assign({ name: "horizontalrule", attrs: { type: { default: null } }, group: "block", parseDOM: [{ tag: "hr", getAttrs: (dom) => ({ type: dom.dataset.type }) }], toDOM(node) { return ["hr", { "data-type": node.attrs.type }]; },
    commands({ nodeType }) {
        return {
            horizontalrule: attrs => (state, dispatch) => {
                if (!(0, index_js_1.canInsert)(state, nodeType))
                    return false;
                dispatch(state.tr.replaceSelectionWith(nodeType.create(attrs)));
                return true;
            }
        };
    },
    inputRules({ nodeType }) {
        return [
            new prosemirror_inputrules_1.InputRule(/^(---|\*\*\*|___)\n$/, (state, match, start, end) => {
                const tr = state.tr;
                tr.replaceWith(start - 1, end, nodeType.create({ type: match[1] }));
                return tr;
            }),
            new prosemirror_inputrules_1.InputRule(/^(—\-|—)\n$/, (state, match, start, end) => {
                const tr = state.tr;
                tr.replaceWith(start - 1, end, nodeType.create({ type: "---" }));
                return tr;
            })
        ];
    } }, options));
exports.HorizontalRule = HorizontalRule;
