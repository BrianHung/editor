"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.renderInline(node);
    state.closeBlock(node);
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return { block: "paragraph" };
};
exports.fromMarkdown = fromMarkdown;
