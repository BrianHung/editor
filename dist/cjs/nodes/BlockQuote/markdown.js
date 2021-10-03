"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.wrapBlock("> ", null, node, () => state.renderContent(node));
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return { block: "blockquote" };
};
exports.fromMarkdown = fromMarkdown;
