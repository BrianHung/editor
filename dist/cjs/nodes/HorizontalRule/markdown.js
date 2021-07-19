"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.write(node.attrs.markup || "---");
    state.closeBlock(node);
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return {
        node: "horizontal_rule"
    };
};
exports.fromMarkdown = fromMarkdown;
