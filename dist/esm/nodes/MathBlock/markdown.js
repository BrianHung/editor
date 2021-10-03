export const toMarkdown = (state, node) => {
    state.write("$$\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("$$");
    state.closeBlock(node);
};
export const markdownToken = () => {
    return "fence";
};
export const fromMarkdown = () => {
    return {
        block: "math_block",
        getAttrs: tok => ({ language: tok.info }),
    };
};
