"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.write(node.attrs.checked ? "[x] " : "[ ] ");
    state.renderContent(node);
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return {
        block: "checkbox_item",
        getAttrs: (tok) => ({ checked: !!tok.attrGet("checked") }),
    };
};
exports.fromMarkdown = fromMarkdown;
