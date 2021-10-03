"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.markdownToken = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.write("```" + node.attrs.lang + "\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
};
exports.toMarkdown = toMarkdown;
const markdownToken = () => {
    return "fence";
};
exports.markdownToken = markdownToken;
const fromMarkdown = () => {
    return {
        block: "code_block",
        getAttrs: tok => ({ language: tok.info }),
    };
};
exports.fromMarkdown = fromMarkdown;
