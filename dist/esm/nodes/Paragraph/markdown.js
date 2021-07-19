export const toMarkdown = (state, node) => {
    state.renderInline(node);
    state.closeBlock(node);
};
export const fromMarkdown = () => {
    return { block: "paragraph" };
};
