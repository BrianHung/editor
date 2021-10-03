"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.write(state.repeat("#", node.attrs.level) + " ");
    state.renderInline(node);
    state.closeBlock(node);
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return {
        block: "heading",
        getAttrs: tok => ({ level: +tok.tag.slice(1) })
    };
};
exports.fromMarkdown = fromMarkdown;
