export const toMarkdown = (state, node) => {
    state.write("```" + node.attrs.lang + "\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
};
export const markdownToken = () => {
    return "fence";
};
export const fromMarkdown = () => {
    return {
        block: "code_block",
        getAttrs: tok => ({ language: tok.info }),
    };
};
