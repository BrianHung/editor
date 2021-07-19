"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
class HorizontalRule extends Node_1.default {
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
            commands_1.nodeInputRule(/^(?:---|\*\*\*|___)$/, nodeType, (match) => {
                const [type] = match;
                return { type };
            }),
        ];
    }
}
exports.default = HorizontalRule;
